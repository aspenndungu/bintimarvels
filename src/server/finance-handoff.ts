import { createHmac } from 'node:crypto';
import { request as httpsRequest } from 'node:https';
import { lookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { database } from './db';
import { isApprovedPublicHttpsUrl, isPrivateNetworkAddress } from '@/lib/network-security';

interface RetailHandoffRow {
  handoff_id: string;
  website_order_id: string;
  public_reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  county: string;
  delivery_source: string;
  delivery_address: string;
  delivery_landmark: string | null;
  destination_type: string;
  delivery_latitude: number | string;
  delivery_longitude: number | string;
  route_distance_meters: number;
  route_duration_seconds: number;
  route_travel_mode: string;
  delivery_tariff_version: string;
  subtotal_ksh: number;
  delivery_fee_ksh: number;
  total_ksh: number;
  marketing_consent: boolean;
  created_at: Date | string;
  paid_at: Date | string | null;
  order_status: string;
  event_status: string;
  provider: string;
  provider_confirmation_code: string | null;
  provider_payment_method: string | null;
  provider_masked_account: string | null;
  event_type: string;
  items: unknown;
}

interface SchoolSupportHandoffRow {
  handoff_id: string;
  id: string;
  public_reference: string;
  project_code: string;
  amount_ksh: number;
  supporter_name: string;
  supporter_phone: string;
  supporter_email: string | null;
  message: string | null;
  provider: string;
  provider_payment_method: string | null;
  provider_confirmation_code: string | null;
  provider_masked_account: string | null;
  created_at: Date | string;
  completed_at: Date | string | null;
  status: string;
  event_status: string;
  event_type: string;
}

export function financeSignature(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

async function assertPublicFinanceDestination(endpoint: URL) {
  const hostname = endpoint.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (hostname === 'localhost' || hostname.endsWith('.local') || isPrivateNetworkAddress(hostname)) {
    throw new Error('Finance webhook destination cannot use a private or reserved network address.');
  }
  if (isIP(hostname) || process.env.NODE_ENV === 'test') return [hostname];
  const addresses = await lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some((entry) => isPrivateNetworkAddress(entry.address))) {
    throw new Error('Finance webhook destination resolved to a private or reserved network address.');
  }
  return addresses.map((entry) => entry.address);
}

function financeConfig() {
  const rawUrl = process.env.FINANCE_WEBHOOK_URL;
  const secret = process.env.FINANCE_WEBHOOK_SECRET;
  const allowed = (process.env.FINANCE_WEBHOOK_ALLOWED_HOSTS ?? '')
    .split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
  if (!rawUrl || !secret || !allowed.length) return null;
  const endpoint = new URL(rawUrl);
  if (!isApprovedPublicHttpsUrl(rawUrl, allowed)) {
    throw new Error('Finance webhook destination is not approved.');
  }
  return { endpoint, secret };
}

async function postPinnedFinancePayload(endpoint: URL, resolvedAddress: string, payload: string, secret: string, idempotencyKey: string) {
  return await new Promise<{ record_id?: string }>((resolve, reject) => {
    const request = httpsRequest({
      hostname: resolvedAddress,
      port: endpoint.port ? Number(endpoint.port) : 443,
      path: `${endpoint.pathname}${endpoint.search}`,
      method: 'POST',
      servername: endpoint.hostname.replace(/^\[|\]$/g, ''),
      headers: {
        Host: endpoint.host,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'X-Binti-Signature': `sha256=${financeSignature(payload, secret)}`,
        'Idempotency-Key': idempotencyKey,
      },
      timeout: 15_000,
    }, (response) => {
      let body = '';
      response.setEncoding('utf8');
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => {
        if ((response.statusCode ?? 500) < 200 || (response.statusCode ?? 500) >= 300) {
          reject(new Error(`Finance receiver returned HTTP ${response.statusCode ?? 500}.`));
          return;
        }
        try { resolve(JSON.parse(body || '{}') as { record_id?: string }); }
        catch { resolve({}); }
      });
    });
    request.on('timeout', () => request.destroy(new Error('Finance receiver timed out.')));
    request.on('error', reject);
    request.end(payload);
  });
}

async function postFinancePayload(payloadObject: unknown, idempotencyKey: string) {
  const config = financeConfig();
  if (!config) return null;
  const payload = JSON.stringify(payloadObject);
  const resolvedAddresses = await assertPublicFinanceDestination(config.endpoint);
  if (process.env.NODE_ENV === 'test') {
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Binti-Signature': `sha256=${financeSignature(payload, config.secret)}`,
        'Idempotency-Key': idempotencyKey,
      },
      body: payload,
      cache: 'no-store',
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new Error(`Finance receiver returned HTTP ${response.status}.`);
    return await response.json().catch(() => ({})) as { record_id?: string };
  }
  return postPinnedFinancePayload(config.endpoint, resolvedAddresses[0], payload, config.secret, idempotencyKey);
}

export async function deliverFinanceHandoff(orderId: string) {
  if (!financeConfig()) return { delivered: false, reason: 'not_configured' as const };
  const sql = database();
  const [claim] = await sql<{ id: string; event_type: string }[]>`
    UPDATE website_handoffs SET status = 'in_flight', locked_until = now() + interval '2 minutes', attempts = attempts + 1, updated_at = now()
    WHERE id = (
      SELECT id FROM website_handoffs
      WHERE order_id = ${orderId} AND (status IN ('pending','retry') OR (status = 'in_flight' AND locked_until < now()))
      ORDER BY created_at ASC, event_type ASC FOR UPDATE SKIP LOCKED LIMIT 1
    )
    RETURNING id, event_type`;
  if (!claim) return { delivered: false, reason: 'already_claimed' as const };

  try {
    const rows = await sql<RetailHandoffRow[]>`
      SELECT h.id AS handoff_id, o.id AS website_order_id, o.public_reference, o.customer_name, o.customer_phone, o.customer_email,
        o.county, o.delivery_source, o.delivery_address, o.delivery_landmark, o.destination_type,
        o.delivery_latitude, o.delivery_longitude, o.route_distance_meters, o.route_duration_seconds,
        o.route_travel_mode, o.delivery_tariff_version, o.subtotal_ksh, o.delivery_fee_ksh, o.total_ksh,
        o.marketing_consent, o.created_at, o.paid_at, o.status AS order_status,
        h.provider, h.provider_confirmation_code, h.provider_payment_method, h.provider_masked_account,
        h.event_type, h.event_status,
        json_agg(json_build_object('product_id', i.product_id, 'product_name', i.product_name,
          'quantity', i.quantity, 'unit_price_ksh', i.unit_price_ksh, 'line_total_ksh', i.line_total_ksh)
          ORDER BY i.id) AS items
      FROM website_orders o
      JOIN website_order_items i ON i.order_id = o.id
      JOIN website_handoffs h ON h.order_id = o.id
      WHERE h.id = ${claim.id}
      GROUP BY o.id, h.id`;
    if (!rows[0]) throw new Error('Verified order not found for finance handoff.');
    const row = rows[0];
    const isPaid = row.event_type === 'website.order.paid';
    const handoffKey = `${row.event_type}:${orderId}`;
    const body = await postFinancePayload({
      event: row.event_type,
      version: 3,
      idempotency_key: handoffKey,
      trade_channel: 'ONLINE TRADE',
      source: 'website',
      sale_made: isPaid,
      create_dispatch: isPaid,
      requires_review: !isPaid,
      website_order_id: row.website_order_id,
      public_reference: row.public_reference,
      order_status: row.event_status,
      customer: { name: row.customer_name, phone: row.customer_phone, email: row.customer_email || null },
      delivery: {
        county: row.county, source: row.delivery_source, address: row.delivery_address,
        landmark: row.delivery_landmark || null, destination_type: row.destination_type,
        latitude: Number(row.delivery_latitude), longitude: Number(row.delivery_longitude),
        distance_meters: row.route_distance_meters, duration_seconds: row.route_duration_seconds,
        travel_mode: row.route_travel_mode, tariff_version: row.delivery_tariff_version,
      },
      items: row.items,
      subtotal_ksh: row.subtotal_ksh,
      delivery_fee_ksh: row.delivery_fee_ksh,
      total_ksh: row.total_ksh,
      payment: {
        provider: row.provider,
        payment_method: row.provider_payment_method || 'Pesapal',
        confirmation_code: row.provider_confirmation_code || null,
        masked_account: row.provider_masked_account || null,
        verified: true,
      },
      marketing_consent: row.marketing_consent,
      created_at: row.created_at,
      paid_at: row.paid_at,
    }, handoffKey);
    if (!body) throw new Error('Finance handoff is not configured.');
    await sql`UPDATE website_handoffs SET status = 'delivered', locked_until = NULL,
      external_record_id = ${body.record_id?.slice(0, 200) ?? null}, last_error = NULL, updated_at = now()
      WHERE id = ${claim.id} AND status = 'in_flight'`;
    return { delivered: true, recordId: body.record_id ?? null, eventType: row.event_type };
  } catch (error) {
    await sql`UPDATE website_handoffs SET status = 'retry', locked_until = NULL,
      last_error = ${(error instanceof Error ? error.message : 'Finance handoff failed').slice(0, 300)}, updated_at = now()
      WHERE id = ${claim.id} AND status = 'in_flight'`;
    throw error;
  }
}

export async function deliverSchoolSupportFinanceHandoff(supportId: string) {
  if (!financeConfig()) return { delivered: false, reason: 'not_configured' as const };
  const sql = database();
  const [claim] = await sql<{ id: string; event_type: string }[]>`
    UPDATE website_support_handoffs SET status = 'in_flight', locked_until = now() + interval '2 minutes', attempts = attempts + 1, updated_at = now()
    WHERE id = (
      SELECT id FROM website_support_handoffs
      WHERE support_id = ${supportId} AND (status IN ('pending','retry') OR (status = 'in_flight' AND locked_until < now()))
      ORDER BY created_at ASC, event_type ASC FOR UPDATE SKIP LOCKED LIMIT 1
    )
    RETURNING id, event_type`;
  if (!claim) return { delivered: false, reason: 'already_claimed' as const };

  try {
    const rows = await sql<SchoolSupportHandoffRow[]>`
      SELECT h.id AS handoff_id, s.id, s.public_reference, s.project_code, s.amount_ksh,
        s.supporter_name, s.supporter_phone, s.supporter_email, s.message, s.created_at, s.completed_at,
        s.status, h.event_type, h.event_status, h.provider, h.provider_confirmation_code,
        h.provider_payment_method, h.provider_masked_account
      FROM website_school_support s
      JOIN website_support_handoffs h ON h.support_id = s.id
      WHERE h.id = ${claim.id}`;
    if (!rows[0]) throw new Error('Verified school-support payment not found for finance handoff.');
    const row = rows[0];
    const handoffKey = `${row.event_type}:school-support:${row.id}`;
    const isCompleted = row.event_type === 'website.school_support.completed';
    const body = await postFinancePayload({
      event: row.event_type,
      version: 1,
      idempotency_key: handoffKey,
      trade_channel: 'CHARITY',
      source: 'website',
      sale_made: isCompleted,
      create_dispatch: false,
      requires_review: true,
      website_support_id: row.id,
      public_reference: row.public_reference,
      support_status: row.event_status,
      project_code: row.project_code,
      amount_ksh: row.amount_ksh,
      supporter: { name: row.supporter_name, phone: row.supporter_phone, email: row.supporter_email || null },
      message: row.message || null,
      payment: {
        provider: row.provider,
        payment_method: row.provider_payment_method || 'Pesapal',
        confirmation_code: row.provider_confirmation_code || null,
        masked_account: row.provider_masked_account || null,
        verified: true,
      },
      created_at: row.created_at,
      completed_at: row.completed_at,
    }, handoffKey);
    if (!body) throw new Error('Finance handoff is not configured.');
    await sql`UPDATE website_support_handoffs SET status = 'delivered', locked_until = NULL,
      external_record_id = ${body.record_id?.slice(0, 200) ?? null}, last_error = NULL, updated_at = now()
      WHERE id = ${claim.id} AND status = 'in_flight'`;
    return { delivered: true, recordId: body.record_id ?? null, eventType: row.event_type };
  } catch (error) {
    await sql`UPDATE website_support_handoffs SET status = 'retry', locked_until = NULL,
      last_error = ${(error instanceof Error ? error.message : 'Finance handoff failed').slice(0, 300)}, updated_at = now()
      WHERE id = ${claim.id} AND status = 'in_flight'`;
    throw error;
  }
}

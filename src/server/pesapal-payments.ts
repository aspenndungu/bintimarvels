import { createHash, randomUUID } from 'node:crypto';
import { database } from './db';
import { assertSchoolSupportApproved, IdempotencyConflictError, normalizeKenyanPhone, type SchoolSupportInput } from '@/lib/commerce';
import { opaqueReference, redactSecrets } from '@/lib/security';
import { PesapalClient, PesapalDefinitiveError, type PesapalStatus } from '@/lib/pesapal';

export class PesapalPaymentMismatchError extends Error {
  constructor(message: string) { super(message); this.name = 'PesapalPaymentMismatchError'; }
}

function providerEventHash(input: { trackingId: string; merchantReference: string; notificationType: string; status: PesapalStatus }) {
  return createHash('sha256').update(JSON.stringify({
    trackingId: input.trackingId,
    merchantReference: input.merchantReference,
    notificationType: input.notificationType,
    status: input.status.status,
    amount: input.status.amountKsh,
    currency: input.status.currency,
    confirmationCode: input.status.confirmationCode,
  })).digest('hex');
}

async function upsertProviderEvent(input: {
  eventHash: string;
  merchantReference: string;
  trackingId: string;
  notificationType: string;
  verifiedStatus?: string;
  payload: unknown;
  processed?: boolean;
  error?: string;
}) {
  const sql = database();
  await sql`INSERT INTO website_provider_events ${sql({
    event_hash: input.eventHash,
    provider: 'pesapal',
    merchant_reference: input.merchantReference,
    provider_tracking_id: input.trackingId,
    notification_type: input.notificationType,
    verified_status: input.verifiedStatus ?? null,
    sanitized_payload: sql.json(redactSecrets(input.payload) as never),
    processed_at: input.processed ? new Date() : null,
    last_error: input.error?.slice(0, 300) ?? null,
  })}
  ON CONFLICT (event_hash) DO UPDATE SET
    process_attempts = website_provider_events.process_attempts + 1,
    processed_at = COALESCE(website_provider_events.processed_at, excluded.processed_at),
    verified_status = COALESCE(excluded.verified_status, website_provider_events.verified_status),
    last_error = excluded.last_error`;
}

export async function processPesapalRetailNotification(input: {
  trackingId: string;
  merchantReference: string;
  notificationType: string;
  raw: unknown;
}, client: PesapalClient) {
  const status = await client.getTransactionStatus(input.trackingId);
  const eventHash = providerEventHash({ ...input, status });
  if (status.merchantReference !== input.merchantReference) {
    await upsertProviderEvent({ ...input, eventHash, payload: input.raw, verifiedStatus: status.status, error: 'Merchant reference mismatch' });
    throw new PesapalPaymentMismatchError('Pesapal merchant reference mismatch.');
  }
  const sql = database();
  const outcome = await sql.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtextextended(${input.trackingId}, 0))`;
    const rows = await tx<{
      order_id: string; order_status: string; expected_amount_ksh: number;
      provider_tracking_id: string | null; payment_status: string;
    }[]>`SELECT o.id AS order_id, o.status AS order_status, p.expected_amount_ksh,
      p.provider_tracking_id, p.status AS payment_status
      FROM website_orders o JOIN website_payments p ON p.order_id = o.id
      WHERE o.public_reference = ${input.merchantReference} FOR UPDATE`;
    const payment = rows[0];
    if (!payment) throw new PesapalPaymentMismatchError('Pesapal order was not found.');
    if (payment.provider_tracking_id && payment.provider_tracking_id !== input.trackingId) throw new PesapalPaymentMismatchError('Pesapal tracking ID mismatch.');
    await tx`UPDATE website_payments SET provider = 'pesapal', provider_tracking_id = COALESCE(provider_tracking_id, ${input.trackingId}), updated_at = now()
      WHERE order_id = ${payment.order_id}`;

    if (status.currency !== 'KES' || status.amountKsh !== payment.expected_amount_ksh) {
      await tx`UPDATE website_orders SET status = 'payment_review', updated_at = now() WHERE id = ${payment.order_id} AND status <> 'paid'`;
      await tx`UPDATE website_payments SET status = 'payment_review', result_description = 'Pesapal amount or currency mismatch', updated_at = now() WHERE order_id = ${payment.order_id}`;
      await tx`INSERT INTO website_handoffs ${tx({ id: randomUUID(), order_id: payment.order_id, website_order_id: payment.order_id, event_type: 'website.order.payment_review', event_status: 'payment_review', status: 'pending', provider: 'pesapal', provider_confirmation_code: status.confirmationCode, provider_payment_method: status.paymentMethod || null, provider_masked_account: status.maskedPaymentAccount || null })}
        ON CONFLICT (order_id, event_type) DO NOTHING`;
      return 'payment_review' as const;
    }

    const providerFields = {
      provider_payment_method: status.paymentMethod || null,
      provider_confirmation_code: status.confirmationCode,
      provider_masked_account: status.maskedPaymentAccount || null,
      result_description: status.description.slice(0, 300),
    };
    if (status.status === 'COMPLETED') {
      if (payment.order_status === 'paid') return 'duplicate' as const;
      const inventoryStillReserved = ['pending_payment', 'payment_redirect_ready', 'payment_request_unknown'].includes(payment.order_status);
      if (!inventoryStillReserved) {
        await tx`UPDATE website_orders SET status = 'payment_review', paid_at = COALESCE(paid_at, now()), updated_at = now() WHERE id = ${payment.order_id}`;
        await tx`UPDATE website_payments SET ${tx({ ...providerFields, status: 'payment_review' })}, updated_at = now() WHERE order_id = ${payment.order_id}`;
        await tx`UPDATE website_inventory_reservations SET released_at = COALESCE(released_at, now()), release_reason = COALESCE(release_reason, 'verified_payment_requires_stock_review') WHERE order_id = ${payment.order_id}`;
        await tx`INSERT INTO website_handoffs ${tx({ id: randomUUID(), order_id: payment.order_id, website_order_id: payment.order_id, event_type: 'website.order.payment_review', event_status: 'payment_review', status: 'pending', provider: 'pesapal', provider_confirmation_code: status.confirmationCode, provider_payment_method: status.paymentMethod || null, provider_masked_account: status.maskedPaymentAccount || null })}
          ON CONFLICT (order_id, event_type) DO NOTHING`;
        return 'payment_review' as const;
      }
      await tx`UPDATE website_orders SET status = 'paid', paid_at = COALESCE(paid_at, now()), updated_at = now() WHERE id = ${payment.order_id}`;
      await tx`UPDATE website_payments SET ${tx({ ...providerFields, status: 'paid' })}, updated_at = now() WHERE order_id = ${payment.order_id}`;
      await tx`UPDATE website_inventory_reservations SET released_at = COALESCE(released_at, now()), release_reason = COALESCE(release_reason, 'consumed_by_verified_payment') WHERE order_id = ${payment.order_id}`;
      await tx`INSERT INTO website_handoffs ${tx({ id: randomUUID(), order_id: payment.order_id, website_order_id: payment.order_id, event_type: 'website.order.paid', event_status: 'paid', status: 'pending', provider: 'pesapal', provider_confirmation_code: status.confirmationCode, provider_payment_method: status.paymentMethod || null, provider_masked_account: status.maskedPaymentAccount || null })}
        ON CONFLICT (order_id, event_type) DO NOTHING`;
      return 'paid' as const;
    }

    if (status.status === 'REVERSED') {
      await tx`UPDATE website_orders SET status = 'refund_or_reversal_review', updated_at = now() WHERE id = ${payment.order_id}`;
      await tx`UPDATE website_payments SET ${tx({ ...providerFields, status: 'refund_or_reversal_review' })}, updated_at = now() WHERE order_id = ${payment.order_id}`;
      await tx`INSERT INTO website_handoffs ${tx({ id: randomUUID(), order_id: payment.order_id, website_order_id: payment.order_id, event_type: 'website.order.reversed', event_status: 'refund_or_reversal_review', status: 'pending', provider: 'pesapal', provider_confirmation_code: status.confirmationCode, provider_payment_method: status.paymentMethod || null, provider_masked_account: status.maskedPaymentAccount || null })}
        ON CONFLICT (order_id, event_type) DO NOTHING`;
      return 'reversal_review' as const;
    }

    // Pesapal may report INVALID while a submitted request is still unpaid.
    // Keep the durable record pending until the reservation-expiry job decides.
    if (status.status === 'INVALID') return payment.order_status === 'paid' ? 'duplicate' as const : 'pending' as const;

    if (payment.order_status === 'paid') {
      await tx`UPDATE website_orders SET status = 'payment_review', updated_at = now() WHERE id = ${payment.order_id}`;
      await tx`UPDATE website_payments SET ${tx({ ...providerFields, status: 'payment_review' })}, updated_at = now() WHERE order_id = ${payment.order_id}`;
      await tx`INSERT INTO website_handoffs ${tx({ id: randomUUID(), order_id: payment.order_id, website_order_id: payment.order_id, event_type: 'website.order.payment_review', event_status: 'payment_review', status: 'pending', provider: 'pesapal', provider_confirmation_code: status.confirmationCode, provider_payment_method: status.paymentMethod || null, provider_masked_account: status.maskedPaymentAccount || null })}
        ON CONFLICT (order_id, event_type) DO NOTHING`;
      return 'payment_review' as const;
    }
    const reservations = await tx<{ product_id: string; quantity: number }[]>`
      SELECT product_id, quantity FROM website_inventory_reservations WHERE order_id = ${payment.order_id} AND released_at IS NULL FOR UPDATE`;
    for (const item of reservations) await tx`UPDATE website_inventory SET available_units = available_units + ${item.quantity}, updated_at = now() WHERE product_id = ${item.product_id}`;
    await tx`UPDATE website_inventory_reservations SET released_at = now(), release_reason = 'pesapal_not_completed' WHERE order_id = ${payment.order_id} AND released_at IS NULL`;
    await tx`UPDATE website_orders SET status = 'payment_failed', updated_at = now() WHERE id = ${payment.order_id}`;
    await tx`UPDATE website_payments SET ${tx({ ...providerFields, status: 'payment_failed' })}, updated_at = now() WHERE order_id = ${payment.order_id}`;
    return 'failed' as const;
  });
  await upsertProviderEvent({ ...input, eventHash, payload: input.raw, verifiedStatus: status.status, processed: true });
  return { outcome, status };
}

export async function createSchoolSupportPayment(input: SchoolSupportInput, client: PesapalClient) {
  assertSchoolSupportApproved();
  const sql = database();
  const phone = normalizeKenyanPhone(input.phone);
  const requestFingerprint = createHash('sha256').update(JSON.stringify({
    fullName: input.fullName,
    phone,
    email: input.email || '',
    amountKsh: input.amountKsh,
    message: input.message || '',
    consent: input.consent,
  })).digest('hex');
  const record = await sql.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtextextended(${input.idempotencyKey}, 0))`;
    const existing = await tx<{
      id: string; public_reference: string; status: string; amount_ksh: number;
      provider_tracking_id: string | null; provider_redirect_url: string | null; request_fingerprint: string | null;
    }[]>`SELECT id, public_reference, status, amount_ksh, provider_tracking_id, provider_redirect_url, request_fingerprint
      FROM website_school_support WHERE idempotency_key = ${input.idempotencyKey} LIMIT 1`;
    if (existing[0]) {
      if (!existing[0].request_fingerprint || existing[0].request_fingerprint !== requestFingerprint) throw new IdempotencyConflictError();
      return { ...existing[0], created: false };
    }
    const id = randomUUID();
    const publicReference = opaqueReference('BMS');
    await tx`INSERT INTO website_school_support ${tx({
      id,
      public_reference: publicReference,
      idempotency_key: input.idempotencyKey,
      request_fingerprint: requestFingerprint,
      status: 'pending_payment',
      supporter_name: input.fullName,
      supporter_phone: phone,
      supporter_email: input.email || null,
      amount_ksh: input.amountKsh,
      message: input.message || null,
      consent_copy_version: 'school-support-v1-2026-07',
    })}`;
    return { id, public_reference: publicReference, status: 'pending_payment', amount_ksh: input.amountKsh, provider_tracking_id: null, provider_redirect_url: null, created: true };
  });
  if (!record.created) return record;
  try {
    const payment = await client.submitOrder({
      merchantReference: record.public_reference,
      amountKsh: record.amount_ksh,
      description: 'Binti school pad support',
      customer: { fullName: input.fullName, phone, email: input.email || '', county: '' },
      address: '',
    });
    const updated = await sql<{
      status: string; provider_tracking_id: string | null; provider_redirect_url: string | null;
    }[]>`UPDATE website_school_support SET status = 'payment_redirect_ready', provider_tracking_id = ${payment.orderTrackingId},
      provider_redirect_url = ${payment.redirectUrl}, updated_at = now()
      WHERE id = ${record.id} AND status IN ('pending_payment','payment_request_unknown')
      RETURNING status, provider_tracking_id, provider_redirect_url`;
    if (updated[0]) return { ...record, ...updated[0] };
    const current = await sql<{
      status: string; provider_tracking_id: string | null; provider_redirect_url: string | null;
    }[]>`SELECT status, provider_tracking_id, provider_redirect_url FROM website_school_support WHERE id = ${record.id} LIMIT 1`;
    return { ...record, ...(current[0] ?? {}), created: true };
  } catch (error) {
    const definitive = error instanceof PesapalDefinitiveError;
    await sql`UPDATE website_school_support SET status = ${definitive ? 'failed' : 'payment_request_unknown'}, updated_at = now()
      WHERE id = ${record.id} AND status IN ('pending_payment','payment_request_unknown')`;
    throw error;
  }
}

export async function processPesapalSchoolSupportNotification(input: {
  trackingId: string;
  merchantReference: string;
  notificationType: string;
  raw: unknown;
}, client: PesapalClient) {
  const status = await client.getTransactionStatus(input.trackingId);
  const eventHash = providerEventHash({ ...input, status });
  if (status.merchantReference !== input.merchantReference) throw new PesapalPaymentMismatchError('Pesapal merchant reference mismatch.');
  const sql = database();
  const outcome = await sql.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtextextended(${input.trackingId}, 0))`;
    const rows = await tx<{ id: string; status: string; amount_ksh: number; provider_tracking_id: string | null }[]>`
      SELECT id, status, amount_ksh, provider_tracking_id FROM website_school_support
      WHERE public_reference = ${input.merchantReference} FOR UPDATE`;
    const support = rows[0];
    if (!support) throw new PesapalPaymentMismatchError('School support payment was not found.');
    if (support.provider_tracking_id && support.provider_tracking_id !== input.trackingId) throw new PesapalPaymentMismatchError('Pesapal tracking ID mismatch.');
    if (status.currency !== 'KES' || status.amountKsh !== support.amount_ksh) {
      await tx`UPDATE website_school_support SET status = 'payment_review', provider_tracking_id = COALESCE(provider_tracking_id, ${input.trackingId}), updated_at = now() WHERE id = ${support.id}`;
      await tx`INSERT INTO website_support_handoffs ${tx({ id: randomUUID(), support_id: support.id, event_type: 'website.school_support.payment_review', event_status: 'payment_review', status: 'pending', provider: 'pesapal', provider_confirmation_code: status.confirmationCode, provider_payment_method: status.paymentMethod || null, provider_masked_account: status.maskedPaymentAccount || null })}
        ON CONFLICT (support_id, event_type) DO NOTHING`;
      return 'payment_review' as const;
    }
    const fields = {
      provider_tracking_id: input.trackingId,
      provider_payment_method: status.paymentMethod || null,
      provider_confirmation_code: status.confirmationCode,
      provider_masked_account: status.maskedPaymentAccount || null,
    };
    if (status.status === 'COMPLETED') {
      if (support.status === 'completed') return 'duplicate' as const;
      await tx`UPDATE website_school_support SET ${tx({ ...fields, status: 'completed' })}, completed_at = COALESCE(completed_at, now()), updated_at = now() WHERE id = ${support.id}`;
      await tx`INSERT INTO website_support_handoffs ${tx({ id: randomUUID(), support_id: support.id, event_type: 'website.school_support.completed', event_status: 'completed', status: 'pending', provider: 'pesapal', provider_confirmation_code: status.confirmationCode, provider_payment_method: status.paymentMethod || null, provider_masked_account: status.maskedPaymentAccount || null })}
        ON CONFLICT (support_id, event_type) DO NOTHING`;
      return 'completed' as const;
    }
    if (status.status === 'INVALID') return support.status === 'completed' ? 'duplicate' as const : 'pending' as const;
    const nextStatus = status.status === 'REVERSED' ? 'reversed' : support.status === 'completed' ? 'payment_review' : 'failed';
    await tx`UPDATE website_school_support SET ${tx({ ...fields, status: nextStatus })}, updated_at = now() WHERE id = ${support.id}`;
    if (nextStatus === 'reversed' || nextStatus === 'payment_review') {
      const eventType = nextStatus === 'reversed' ? 'website.school_support.reversed' : 'website.school_support.payment_review';
      await tx`INSERT INTO website_support_handoffs ${tx({ id: randomUUID(), support_id: support.id, event_type: eventType, event_status: nextStatus, status: 'pending', provider: 'pesapal', provider_confirmation_code: status.confirmationCode, provider_payment_method: status.paymentMethod || null, provider_masked_account: status.maskedPaymentAccount || null })}
        ON CONFLICT (support_id, event_type) DO NOTHING`;
    }
    return nextStatus;
  });
  await upsertProviderEvent({ ...input, eventHash, payload: input.raw, verifiedStatus: status.status, processed: true });
  return { outcome, status };
}

export async function processPesapalNotification(input: {
  trackingId: string;
  merchantReference: string;
  notificationType: string;
  raw: unknown;
}, client: PesapalClient) {
  if (input.merchantReference.startsWith('BMS-')) return processPesapalSchoolSupportNotification(input, client);
  if (input.merchantReference.startsWith('BML-')) return processPesapalRetailNotification(input, client);
  throw new PesapalPaymentMismatchError('Unsupported Pesapal merchant reference.');
}

export async function reconcilePendingPesapalPayments(client: PesapalClient) {
  const sql = database();
  const rows = await sql<{ tracking_id: string; merchant_reference: string }[]>`
    SELECT p.provider_tracking_id AS tracking_id, o.public_reference AS merchant_reference
      FROM website_payments p JOIN website_orders o ON o.id = p.order_id
      WHERE p.provider = 'pesapal' AND p.provider_tracking_id IS NOT NULL
        AND o.status IN ('pending_payment','payment_redirect_ready','payment_request_unknown')
    UNION ALL
    SELECT provider_tracking_id AS tracking_id, public_reference AS merchant_reference
      FROM website_school_support
      WHERE provider_tracking_id IS NOT NULL AND status IN ('pending_payment','payment_redirect_ready','payment_request_unknown')
    ORDER BY merchant_reference LIMIT 30`;
  let checked = 0;
  let updated = 0;
  for (const row of rows) {
    try {
      const result = await processPesapalNotification({
        trackingId: row.tracking_id,
        merchantReference: row.merchant_reference,
        notificationType: 'IPNCHANGE',
        raw: { source: 'scheduled_reconciliation' },
      }, client);
      checked += 1;
      if (!['pending', 'duplicate'].includes(result.outcome)) updated += 1;
    } catch {
      // Leave the durable payment record pending for the next run or manual review.
    }
  }
  return { checked, updated };
}

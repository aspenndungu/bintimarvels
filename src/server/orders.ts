import { createHash, randomUUID } from 'node:crypto';
import { database } from './db';
import type { CheckoutInput } from '@/lib/commerce';
import { assertCommerceApproved, calculateServerTotal, IdempotencyConflictError, normalizeKenyanPhone } from '@/lib/commerce';
import { resolveDeliveryQuote } from './delivery-quote';
import { PesapalDefinitiveError, type PesapalClient, type PesapalOrderResponse } from '@/lib/pesapal';
import { opaqueReference } from '@/lib/security';

export interface PendingOrder {
  id: string;
  publicReference: string;
  status: string;
  subtotalKsh: number;
  deliveryFeeKsh: number;
  totalKsh: number;
  phone: string;
  created: boolean;
}

export async function createPendingOrder(input: CheckoutInput): Promise<PendingOrder> {
  assertCommerceApproved();
  const sql = database();
  const delivery = await resolveDeliveryQuote(input.delivery);
  if (delivery.manualQuote || delivery.feeKsh === null) throw new Error('This destination needs a manual delivery quote.');
  const totals = calculateServerTotal(input.items, delivery.feeKsh);
  const phone = normalizeKenyanPhone(input.customer.phone);
  const requestFingerprint = createHash('sha256').update(JSON.stringify({
    customer: {
      fullName: input.customer.fullName,
      phone,
      email: input.customer.email || '',
      county: input.customer.county,
    },
    delivery: {
      source: delivery.source,
      placeId: delivery.placeId,
      address: delivery.formattedAddress,
      landmark: delivery.landmark || '',
      destinationType: delivery.destinationType,
      latitude: delivery.latitude,
      longitude: delivery.longitude,
      distanceMeters: delivery.distanceMeters,
      tariffVersion: delivery.tariffVersion,
    },
    items: [...totals.lines]
      .sort((a, b) => a.productId.localeCompare(b.productId))
      .map((line) => ({ productId: line.productId, quantity: line.quantity, unitPriceKsh: line.unitPriceKsh })),
    totalKsh: totals.totalKsh,
    marketing: input.consent.marketing,
  })).digest('hex');
  return sql.begin(async (tx) => {
    await tx`SELECT pg_advisory_xact_lock(hashtextextended(${input.idempotencyKey}, 0))`;
    const existing = await tx<{
      id: string; public_reference: string; status: string; subtotal_ksh: number; delivery_fee_ksh: number;
      total_ksh: number; customer_phone: string; request_fingerprint: string | null;
    }[]>`
      SELECT id, public_reference, status, subtotal_ksh, delivery_fee_ksh, total_ksh, customer_phone, request_fingerprint
      FROM website_orders WHERE idempotency_key = ${input.idempotencyKey} LIMIT 1`;
    if (existing[0]) {
      if (existing[0].request_fingerprint && existing[0].request_fingerprint !== requestFingerprint) throw new IdempotencyConflictError();
      if (!existing[0].request_fingerprint && (existing[0].total_ksh !== totals.totalKsh || existing[0].customer_phone !== phone)) throw new IdempotencyConflictError();
      return {
        id: existing[0].id, publicReference: existing[0].public_reference, status: existing[0].status,
        subtotalKsh: existing[0].subtotal_ksh, deliveryFeeKsh: existing[0].delivery_fee_ksh,
        totalKsh: existing[0].total_ksh, phone: existing[0].customer_phone, created: false,
      };
    }

    const id = randomUUID();
    const publicReference = opaqueReference();
    await tx`INSERT INTO website_orders ${tx({
      id, public_reference: publicReference, idempotency_key: input.idempotencyKey, request_fingerprint: requestFingerprint, status: 'pending_payment',
      customer_name: input.customer.fullName, customer_phone: phone, customer_email: input.customer.email || null,
      county: input.customer.county, delivery_source: delivery.source, delivery_place_id: delivery.placeId,
      delivery_address: delivery.formattedAddress, delivery_landmark: delivery.landmark || null,
      destination_type: delivery.destinationType, delivery_latitude: delivery.latitude, delivery_longitude: delivery.longitude,
      route_distance_meters: delivery.distanceMeters, route_duration_seconds: delivery.durationSeconds,
      route_travel_mode: delivery.travelMode, delivery_tariff_version: delivery.tariffVersion,
      subtotal_ksh: totals.subtotalKsh, delivery_fee_ksh: totals.deliveryFeeKsh, total_ksh: totals.totalKsh,
      marketing_consent: input.consent.marketing, consent_copy_version: 'checkout-v3-pesapal-2026-07',
    })}`;

    for (const line of totals.lines) {
      const inventory = await tx<{ available_units: number }[]>`
        SELECT available_units FROM website_inventory WHERE product_id = ${line.productId} FOR UPDATE`;
      if (!inventory[0] || inventory[0].available_units < line.quantity) throw new Error(`${line.productName} is not currently available in that quantity.`);
      await tx`UPDATE website_inventory SET available_units = available_units - ${line.quantity}, updated_at = now() WHERE product_id = ${line.productId}`;
      await tx`INSERT INTO website_inventory_reservations ${tx({ order_id: id, product_id: line.productId, quantity: line.quantity, expires_at: new Date(Date.now() + 20 * 60_000) })}`;
      await tx`INSERT INTO website_order_items ${tx({ order_id: id, product_id: line.productId, product_name: line.productName, quantity: line.quantity, unit_price_ksh: line.unitPriceKsh, line_total_ksh: line.lineTotalKsh })}`;
    }
    await tx`INSERT INTO website_payments ${tx({ id: randomUUID(), order_id: id, expected_amount_ksh: totals.totalKsh, status: 'pending_payment', provider: 'pesapal' })}`;
    return { id, publicReference, status: 'pending_payment', subtotalKsh: totals.subtotalKsh, deliveryFeeKsh: totals.deliveryFeeKsh, totalKsh: totals.totalKsh, phone, created: true };
  });
}

export async function attachPesapalRequest(orderId: string, response: PesapalOrderResponse) {
  const sql = database();
  await sql.begin(async (tx) => {
    await tx`UPDATE website_orders SET status = 'payment_redirect_ready', updated_at = now()
      WHERE id = ${orderId} AND status IN ('pending_payment','payment_request_unknown')`;
    await tx`UPDATE website_payments SET status = 'payment_redirect_ready', provider = 'pesapal',
      provider_tracking_id = ${response.orderTrackingId}, provider_redirect_url = ${response.redirectUrl}, updated_at = now()
      WHERE order_id = ${orderId} AND status IN ('pending_payment','payment_request_unknown')`;
  });
}

export async function markPesapalRequestUnknown(orderId: string, description: string) {
  const sql = database();
  await sql.begin(async (tx) => {
    await tx`UPDATE website_orders SET status = 'payment_request_unknown', updated_at = now()
      WHERE id = ${orderId} AND status = 'pending_payment'`;
    await tx`UPDATE website_payments SET status = 'payment_request_unknown', result_description = ${description.slice(0, 300)}, updated_at = now()
      WHERE order_id = ${orderId} AND status = 'pending_payment'`;
  });
}

export async function releaseFailedOrder(orderId: string, status: 'payment_failed' | 'payment_cancelled' | 'payment_timed_out', description: string) {
  const sql = database();
  await sql.begin(async (tx) => {
    const reservations = await tx<{ product_id: string; quantity: number }[]>`SELECT product_id, quantity FROM website_inventory_reservations WHERE order_id = ${orderId} AND released_at IS NULL FOR UPDATE`;
    for (const item of reservations) await tx`UPDATE website_inventory SET available_units = available_units + ${item.quantity}, updated_at = now() WHERE product_id = ${item.product_id}`;
    await tx`UPDATE website_inventory_reservations SET released_at = now(), release_reason = ${status} WHERE order_id = ${orderId} AND released_at IS NULL`;
    await tx`UPDATE website_orders SET status = ${status}, updated_at = now() WHERE id = ${orderId} AND status NOT IN ('paid','payment_review','refund_or_reversal_review')`;
    await tx`UPDATE website_payments SET status = ${status}, result_description = ${description.slice(0, 300)}, updated_at = now() WHERE order_id = ${orderId} AND status NOT IN ('paid','payment_review','refund_or_reversal_review')`;
  });
}

export async function orderStatus(publicReference: string) {
  const rows = await database()< { id: string; status: string; public_reference: string; total_ksh: number; customer_phone: string }[]>`
    SELECT id, status, public_reference, total_ksh, customer_phone FROM website_orders WHERE public_reference = ${publicReference} LIMIT 1`;
  return rows[0] ?? null;
}

export async function releaseExpiredReservations() {
  const sql = database();
  return sql.begin(async (tx) => {
    const activeStatuses = ['pending_payment', 'payment_redirect_ready', 'payment_request_unknown'];
    const expired = await tx<{ order_id: string; product_id: string; quantity: number }[]>`
      SELECT r.order_id, r.product_id, r.quantity FROM website_inventory_reservations r
      JOIN website_orders o ON o.id = r.order_id
      WHERE r.released_at IS NULL AND r.expires_at < now() AND o.status IN ${tx(activeStatuses)} FOR UPDATE OF r`;
    for (const item of expired) await tx`UPDATE website_inventory SET available_units = available_units + ${item.quantity}, updated_at = now() WHERE product_id = ${item.product_id}`;
    const orderIds = [...new Set(expired.map((item) => item.order_id))];
    if (orderIds.length) {
      await tx`UPDATE website_inventory_reservations SET released_at = now(), release_reason = 'reservation_expired' WHERE order_id IN ${tx(orderIds)} AND released_at IS NULL`;
      await tx`UPDATE website_orders SET status = 'payment_timed_out', updated_at = now() WHERE id IN ${tx(orderIds)} AND status IN ${tx(activeStatuses)}`;
      await tx`UPDATE website_payments SET status = 'payment_timed_out', result_description = 'Inventory reservation expired before verified payment.', updated_at = now() WHERE order_id IN ${tx(orderIds)} AND status IN ${tx(activeStatuses)}`;
    }
    return orderIds.length;
  });
}

export async function startCheckout(input: CheckoutInput, pesapal: PesapalClient) {
  assertCommerceApproved();
  const order = await createPendingOrder(input);
  if (!order.created) {
    const rows = await database()< { provider_redirect_url: string | null; provider_tracking_id: string | null }[]>`
      SELECT provider_redirect_url, provider_tracking_id FROM website_payments WHERE order_id = ${order.id} LIMIT 1`;
    return { ...order, redirectUrl: rows[0]?.provider_redirect_url ?? null, orderTrackingId: rows[0]?.provider_tracking_id ?? null };
  }
  try {
    const payment = await pesapal.submitOrder({
      merchantReference: order.publicReference,
      amountKsh: order.totalKsh,
      description: 'Mrembo website order',
      customer: input.customer,
      address: input.delivery.formattedAddress,
    });
    await attachPesapalRequest(order.id, payment);
    const rows = await database()<{
      status: string; provider_redirect_url: string | null; provider_tracking_id: string | null;
    }[]>`SELECT o.status, p.provider_redirect_url, p.provider_tracking_id
      FROM website_orders o JOIN website_payments p ON p.order_id = o.id WHERE o.id = ${order.id} LIMIT 1`;
    const current = rows[0];
    return {
      ...order,
      status: current?.status ?? 'payment_request_unknown',
      redirectUrl: current?.provider_redirect_url ?? null,
      orderTrackingId: current?.provider_tracking_id ?? null,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Pesapal payment request status is unknown';
    if (error instanceof PesapalDefinitiveError) await releaseFailedOrder(order.id, 'payment_failed', message);
    else await markPesapalRequestUnknown(order.id, message);
    throw error;
  }
}

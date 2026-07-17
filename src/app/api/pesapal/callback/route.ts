import { NextResponse } from 'next/server';
import { parsePesapalNotification, PesapalClient, pesapalConfigFromEnv } from '@/lib/pesapal';
import { processPesapalNotification } from '@/server/pesapal-payments';
import { paymentStatusProof } from '@/server/request-security';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = {
    OrderTrackingId: url.searchParams.get('OrderTrackingId'),
    OrderMerchantReference: url.searchParams.get('OrderMerchantReference'),
    OrderNotificationType: url.searchParams.get('OrderNotificationType'),
  };
  let reference = '';
  let state = 'checking';
  try {
    const notification = parsePesapalNotification(raw);
    reference = notification.merchantReference;
    if (notification.notificationType !== 'CALLBACKURL') throw new Error('Invalid callback type.');
    const result = await processPesapalNotification({ ...notification, trackingId: notification.orderTrackingId, raw }, new PesapalClient(pesapalConfigFromEnv()));
    state = result.outcome;
  } catch {
    reference = String(raw.OrderMerchantReference ?? '').replace(/[^A-Za-z0-9._:-]/g, '').slice(0, 50);
  }
  const destination = new URL('/payment-status', url.origin);
  if (reference) destination.searchParams.set('reference', reference);
  destination.searchParams.set('state', state);
  if (reference) {
    try { destination.searchParams.set('proof', paymentStatusProof(reference, state)); } catch { /* fail closed to a checking page */ }
  }
  return NextResponse.redirect(destination, 303);
}

import { NextResponse } from 'next/server';
import { parsePesapalNotification, PesapalClient, pesapalConfigFromEnv } from '@/lib/pesapal';
import { safeEqual } from '@/lib/security';
import { processPesapalNotification } from '@/server/pesapal-payments';

export const runtime = 'nodejs';

export async function POST(request: Request, context: { params: Promise<{ token: string }> }) {
  const configuredToken = process.env.PESAPAL_IPN_TOKEN;
  const { token } = await context.params;
  if (!configuredToken || !safeEqual(token, configuredToken)) return NextResponse.json({ status: 404 }, { status: 404 });
  if (Number(request.headers.get('content-length') ?? 0) > 30_000) return NextResponse.json({ status: 413 }, { status: 413 });
  try {
    const raw: unknown = await request.json();
    const notification = parsePesapalNotification(raw);
    if (notification.notificationType !== 'IPNCHANGE') return NextResponse.json({ status: 400 }, { status: 400 });
    await processPesapalNotification({ ...notification, trackingId: notification.orderTrackingId, raw }, new PesapalClient(pesapalConfigFromEnv()));
    return NextResponse.json({
      orderNotificationType: notification.notificationType,
      orderTrackingId: notification.orderTrackingId,
      orderMerchantReference: notification.merchantReference,
      status: 200,
    });
  } catch {
    return NextResponse.json({ status: 503 }, { status: 503 });
  }
}

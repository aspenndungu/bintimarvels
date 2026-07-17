import { NextResponse } from 'next/server';
import { orderStatus } from '@/server/orders';
import { enforceRateLimit, RateLimitError, validateOrderStatusToken } from '@/server/request-security';

export const runtime = 'nodejs';

export async function GET(request: Request, context: { params: Promise<{ reference: string }> }) {
  try {
    await enforceRateLimit(request, 'order-status', 30, 15 * 60);
    const { reference } = await context.params;
    const token = new URL(request.url).searchParams.get('token') ?? '';
    const order = await orderStatus(reference);
    if (!order || !token || !validateOrderStatusToken(reference, order.customer_phone, token)) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    return NextResponse.json({ orderReference: order.public_reference, status: order.status, totalKsh: order.total_ksh });
  } catch (error) {
    if (error instanceof RateLimitError) return NextResponse.json({ error: error.message }, { status: 429 });
    return NextResponse.json({ error: 'Order status is temporarily unavailable.' }, { status: 503 });
  }
}

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { checkoutSchema, IdempotencyConflictError } from '@/lib/commerce';
import { isAllowedMutationOrigin } from '@/lib/security';
import { PesapalClient, PesapalDefinitiveError, pesapalConfigFromEnv } from '@/lib/pesapal';
import { startCheckout } from '@/server/orders';
import { enforceRateLimit, orderStatusToken, RateLimitError } from '@/server/request-security';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isAllowedMutationOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (Number(request.headers.get('content-length') ?? 0) > 50_000) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  try {
    await enforceRateLimit(request, 'checkout', 8, 15 * 60);
    const input = checkoutSchema.parse(await request.json());
    const order = await startCheckout(input, new PesapalClient(pesapalConfigFromEnv()));
    if (!order.redirectUrl) return NextResponse.json({
      error: 'This payment request is already being checked. Contact Binti before trying again.', retryWithNewKey: false,
    }, { status: 409 });
    return NextResponse.json({
      orderReference: order.publicReference,
      status: order.status,
      totalKsh: order.totalKsh,
      statusToken: orderStatusToken(order.publicReference, order.phone),
      redirectUrl: order.redirectUrl,
      message: order.created ? 'Continue to Pesapal to choose an available payment method.' : 'Continue your existing Pesapal payment.',
    }, { status: order.created ? 201 : 200 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: 'Check the order and delivery details.', fields: error.flatten().fieldErrors, retryWithNewKey: true }, { status: 400 });
    if (error instanceof RateLimitError) return NextResponse.json({ error: error.message, retryWithNewKey: false }, { status: 429 });
    const message = error instanceof Error ? error.message : '';
    if (error instanceof IdempotencyConflictError) return NextResponse.json({ error: message, retryWithNewKey: true }, { status: 409 });
    if (/not currently available|valid Kenyan|Unknown product|Invalid quantity|Delivery pricing is not available/.test(message)) return NextResponse.json({ error: message, retryWithNewKey: true }, { status: 400 });
    if (/not yet enabled|not configured|configuration is incomplete|approval is incomplete/.test(message)) return NextResponse.json({ error: 'Online Pesapal checkout is not yet available.', retryWithNewKey: true }, { status: 503 });
    if (error instanceof PesapalDefinitiveError) return NextResponse.json({ error: 'Pesapal rejected this payment request. No payment was taken.', retryWithNewKey: true }, { status: 502 });
    return NextResponse.json({ error: 'The Pesapal request status is uncertain. Do not submit a second payment; contact Binti for help.', retryWithNewKey: false }, { status: 502 });
  }
}

import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { IdempotencyConflictError, schoolSupportSchema } from '@/lib/commerce';
import { isAllowedMutationOrigin } from '@/lib/security';
import { PesapalClient, PesapalDefinitiveError, pesapalConfigFromEnv } from '@/lib/pesapal';
import { createSchoolSupportPayment } from '@/server/pesapal-payments';
import { enforceRateLimit, RateLimitError } from '@/server/request-security';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isAllowedMutationOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  if (Number(request.headers.get('content-length') ?? 0) > 30_000) return NextResponse.json({ error: 'Request is too large.' }, { status: 413 });
  try {
    await enforceRateLimit(request, 'school-support', 6, 15 * 60);
    const input = schoolSupportSchema.parse(await request.json());
    const support = await createSchoolSupportPayment(input, new PesapalClient(pesapalConfigFromEnv()));
    if (!support.provider_redirect_url) return NextResponse.json({
      error: 'This payment is already being checked. Please contact Binti before trying again.', retryWithNewKey: false,
    }, { status: 409 });
    return NextResponse.json({
      reference: support.public_reference,
      amountKsh: support.amount_ksh,
      redirectUrl: support.provider_redirect_url,
      message: support.created ? 'Continue to Pesapal to complete your school support.' : 'Continue your existing Pesapal payment.',
    }, { status: support.created ? 201 : 200 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: 'Check your details and contribution amount.', retryWithNewKey: true }, { status: 400 });
    if (error instanceof RateLimitError) return NextResponse.json({ error: error.message, retryWithNewKey: false }, { status: 429 });
    const message = error instanceof Error ? error.message : '';
    if (error instanceof IdempotencyConflictError) return NextResponse.json({ error: message, retryWithNewKey: true }, { status: 409 });
    if (/valid Kenyan|payment amount is invalid/i.test(message)) return NextResponse.json({ error: message, retryWithNewKey: true }, { status: 400 });
    if (/not yet enabled|configuration is incomplete|approval is incomplete/i.test(message)) return NextResponse.json({ error: 'Online school support through Pesapal is not active yet.', retryWithNewKey: true }, { status: 503 });
    if (error instanceof PesapalDefinitiveError) return NextResponse.json({ error: 'Pesapal rejected this payment request. No payment was taken.', retryWithNewKey: true }, { status: 502 });
    return NextResponse.json({ error: 'The Pesapal request status is uncertain. Do not submit a second payment; contact Binti for help.', retryWithNewKey: false }, { status: 502 });
  }
}

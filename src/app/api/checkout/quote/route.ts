import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { assertCatalogAvailable, assertCommerceApproved, calculateServerTotal, quoteSchema } from '@/lib/commerce';
import { pesapalConfigFromEnv } from '@/lib/pesapal';
import { isAllowedMutationOrigin } from '@/lib/security';
import { resolveDeliveryQuote } from '@/server/delivery-quote';
import { enforceMapsRateLimit, RateLimitError } from '@/server/request-security';

export const runtime = 'nodejs';

function onlinePaymentAvailable() {
  try {
    assertCommerceApproved();
    pesapalConfigFromEnv();
    return Boolean(process.env.DATABASE_URL && process.env.RATE_LIMIT_SECRET && process.env.ORDER_STATUS_SECRET);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  try {
    if (!isAllowedMutationOrigin(request)) return NextResponse.json({ error: 'Request origin was not accepted.' }, { status: 403 });
    await enforceMapsRateLimit(request, 'quote', 20, 60);
    assertCatalogAvailable();
    const input = quoteSchema.parse(await request.json());
    const delivery = await resolveDeliveryQuote(input.delivery);
    const subtotal = calculateServerTotal(input.items);
    const totals = delivery.feeKsh === null ? null : calculateServerTotal(input.items, delivery.feeKsh);
    return NextResponse.json({
      subtotalKsh: subtotal.subtotalKsh,
      deliveryFeeKsh: delivery.feeKsh,
      totalKsh: totals?.totalKsh ?? null,
      manualQuote: delivery.manualQuote,
      destinationAddress: delivery.formattedAddress,
      destinationType: delivery.destinationType,
      onlinePaymentAvailable: delivery.feeKsh !== null && onlinePaymentAvailable(),
    });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: 'Check the basket and delivery location.' }, { status: 400 });
    if (error instanceof RateLimitError) return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });
    if (error instanceof Error && /maps are not configured/i.test(error.message)) return NextResponse.json({ error: 'The delivery price is temporarily unavailable. Binti can confirm it on WhatsApp.' }, { status: 503 });
    return NextResponse.json({ error: 'A delivery price could not be prepared. Try another pin or ask Binti on WhatsApp.' }, { status: 502 });
  }
}

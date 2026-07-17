import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { isAllowedMutationOrigin } from '@/lib/security';
import { resolvePlace } from '@/server/google-maps';
import { enforceMapsRateLimit, RateLimitError } from '@/server/request-security';

const schema = z.object({ placeId: z.string().min(8).max(300), sessionToken: z.string().min(16).max(80).optional() });
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    if (!isAllowedMutationOrigin(request)) return NextResponse.json({ error: 'Request origin was not accepted.' }, { status: 403 });
    await enforceMapsRateLimit(request, 'place-details', 15, 60);
    const input = schema.parse(await request.json());
    return NextResponse.json({ place: await resolvePlace(input.placeId, input.sessionToken) });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: 'Select a suggested address.' }, { status: 400 });
    if (error instanceof RateLimitError) return NextResponse.json({ error: 'Too many location requests. Please wait.' }, { status: 429 });
    return NextResponse.json({ error: 'That address could not be resolved. Choose a pin on the map instead.' }, { status: 503 });
  }
}

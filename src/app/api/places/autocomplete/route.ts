import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { isAllowedMutationOrigin } from '@/lib/security';
import { autocompletePlaces } from '@/server/google-maps';
import { enforceMapsRateLimit, RateLimitError } from '@/server/request-security';

const schema = z.object({ input: z.string().trim().min(3).max(160), sessionToken: z.string().min(16).max(80) });
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    if (!isAllowedMutationOrigin(request)) return NextResponse.json({ error: 'Request origin was not accepted.' }, { status: 403 });
    await enforceMapsRateLimit(request, 'places-autocomplete', 30, 60);
    const input = schema.parse(await request.json());
    return NextResponse.json({ suggestions: await autocompletePlaces(input.input, input.sessionToken) });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: 'Type at least three characters.' }, { status: 400 });
    if (error instanceof RateLimitError) return NextResponse.json({ error: 'Too many location searches. Please wait.' }, { status: 429 });
    return NextResponse.json({ error: 'Address suggestions are unavailable. Choose a pin on the map instead.' }, { status: 503 });
  }
}

import { NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { randomUUID } from 'node:crypto';
import { isAllowedMutationOrigin } from '@/lib/security';
import { database } from '@/server/db';
import { enforceRateLimit, RateLimitError } from '@/server/request-security';

const schema = z.object({
  idempotencyKey: z.string().uuid(),
  enquiryType: z.enum(['order_support', 'binti_charity', 'binti_circles', 'stockist', 'media', 'general']),
  name: z.string().trim().min(2).max(100),
  organisation: z.string().trim().max(160).optional().or(z.literal('')),
  phone: z.string().trim().min(9).max(20),
  email: z.string().trim().email().max(160).optional().or(z.literal('')),
  county: z.string().trim().max(80).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(2000),
  followUpConsent: z.literal(true),
  website: z.string().max(0).optional(),
});

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isAllowedMutationOrigin(request)) return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  try {
    await enforceRateLimit(request, 'contact', 5, 30 * 60);
    const input = schema.parse(await request.json());
    const sql = database();
    const rows = await sql<{ id: string }[]>`INSERT INTO website_leads ${sql({
      id: randomUUID(), idempotency_key: input.idempotencyKey, enquiry_type: input.enquiryType,
      name: input.name, organisation: input.organisation || null, phone: input.phone,
      email: input.email || null, county: input.county || null, message: input.message,
      follow_up_consent: input.followUpConsent,
    })} ON CONFLICT (idempotency_key) DO UPDATE SET idempotency_key = EXCLUDED.idempotency_key RETURNING id`;
    return NextResponse.json({ leadReference: rows[0].id, message: 'Your enquiry has been securely received.' }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return NextResponse.json({ error: 'Please check the enquiry details.' }, { status: 400 });
    if (error instanceof RateLimitError) return NextResponse.json({ error: error.message }, { status: 429 });
    return NextResponse.json({ error: 'Your enquiry was not sent. Please use WhatsApp or try again.' }, { status: 503 });
  }
}

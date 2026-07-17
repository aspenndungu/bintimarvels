import { createHmac } from 'node:crypto';
import { database } from './db';
import { hashForRateLimit, safeEqual } from '@/lib/security';

export async function enforceRateLimit(request: Request, bucket: string, maxRequests: number, windowSeconds: number) {
  const secret = process.env.RATE_LIMIT_SECRET;
  if (!secret) throw new Error('RATE_LIMIT_SECRET is not configured.');
  const address = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  const keyHash = hashForRateLimit(`${bucket}:${address}`, secret);
  const sql = database();
  const rows = await sql<{ request_count: number }[]>`
    INSERT INTO website_rate_limits (key_hash, window_start, request_count)
    VALUES (${keyHash}, now(), 1)
    ON CONFLICT (key_hash) DO UPDATE SET
      window_start = CASE WHEN website_rate_limits.window_start < now() - (${windowSeconds} * interval '1 second') THEN now() ELSE website_rate_limits.window_start END,
      request_count = CASE WHEN website_rate_limits.window_start < now() - (${windowSeconds} * interval '1 second') THEN 1 ELSE website_rate_limits.request_count + 1 END
    RETURNING request_count`;
  if ((rows[0]?.request_count ?? maxRequests + 1) > maxRequests) throw new RateLimitError();
}

export async function enforceMapsRateLimit(request: Request, bucket: string, maxRequests: number, windowSeconds: number) {
  if (process.env.MAPS_TEST_MODE === 'true' && process.env.NODE_ENV !== 'production') return;
  await enforceRateLimit(request, bucket, maxRequests, windowSeconds);
}

export class RateLimitError extends Error {
  constructor() { super('Too many requests.'); }
}

export function orderStatusToken(reference: string, phone: string) {
  const secret = process.env.ORDER_STATUS_SECRET;
  if (!secret) throw new Error('ORDER_STATUS_SECRET is not configured.');
  return createHmac('sha256', secret).update(`${reference}:${phone}`).digest('base64url');
}

export function validateOrderStatusToken(reference: string, phone: string, token: string) {
  return safeEqual(token, orderStatusToken(reference, phone));
}

export function paymentStatusProof(reference: string, state: string) {
  const secret = process.env.ORDER_STATUS_SECRET;
  if (!secret) throw new Error('ORDER_STATUS_SECRET is not configured.');
  return createHmac('sha256', secret).update(`pesapal-result:${reference}:${state}`).digest('base64url');
}

export function validatePaymentStatusProof(reference: string, state: string, proof: string) {
  if (!reference || !state || !proof) return false;
  try {
    return safeEqual(proof, paymentStatusProof(reference, state));
  } catch {
    return false;
  }
}

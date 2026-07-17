import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export function opaqueReference(prefix = 'BML'): string {
  return `${prefix}-${randomBytes(9).toString('base64url').toUpperCase()}`;
}

export function hashForRateLimit(value: string, secret: string): string {
  return createHash('sha256').update(`${secret}:${value}`).digest('hex');
}

export function safeEqual(value: string, expected: string): boolean {
  const a = Buffer.from(value);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function maskPhone(phone: string): string {
  return phone.length < 7 ? '[masked]' : `${phone.slice(0, 5)}***${phone.slice(-3)}`;
}

export function redactSecrets(value: unknown): unknown {
  const secretKeys = /authorization|password|passkey|secret|token|pin/i;
  if (Array.isArray(value)) return value.map(redactSecrets);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, secretKeys.test(key) ? '[REDACTED]' : redactSecrets(item)]),
    );
  }
  return value;
}

export function isAllowedMutationOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return process.env.NODE_ENV === 'test';
  const allowed = (process.env.ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  try {
    const url = new URL(origin);
    return allowed.includes(url.origin);
  } catch {
    return false;
  }
}

import { afterEach, describe, expect, it } from 'vitest';
import { enforceMapsRateLimit, paymentStatusProof, validatePaymentStatusProof } from './request-security';

const previous = {
  mapsTestMode: process.env.MAPS_TEST_MODE,
  databaseUrl: process.env.DATABASE_URL,
  rateLimitSecret: process.env.RATE_LIMIT_SECRET,
  orderStatusSecret: process.env.ORDER_STATUS_SECRET,
};

function restore(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

afterEach(() => {
  restore('MAPS_TEST_MODE', previous.mapsTestMode);
  restore('DATABASE_URL', previous.databaseUrl);
  restore('RATE_LIMIT_SECRET', previous.rateLimitSecret);
  restore('ORDER_STATUS_SECRET', previous.orderStatusSecret);
});

describe('payment status proof', () => {
  it('accepts only the exact server-signed reference and state', () => {
    process.env.ORDER_STATUS_SECRET = 'test-order-status-secret-at-least-32-characters';
    const proof = paymentStatusProof('BML-ORDER-1', 'paid');
    expect(validatePaymentStatusProof('BML-ORDER-1', 'paid', proof)).toBe(true);
    expect(validatePaymentStatusProof('BML-FORGED', 'paid', proof)).toBe(false);
    expect(validatePaymentStatusProof('BML-ORDER-1', 'completed', proof)).toBe(false);
    expect(validatePaymentStatusProof('BML-ORDER-1', 'paid', 'forged')).toBe(false);
  });
});

describe('Maps rate-limit gate', () => {
  it('fails closed when live rate-limit protection is unavailable', async () => {
    delete process.env.MAPS_TEST_MODE;
    delete process.env.DATABASE_URL;
    delete process.env.RATE_LIMIT_SECRET;
    await expect(enforceMapsRateLimit(new Request('https://example.com'), 'maps-test', 2, 60)).rejects.toThrow('RATE_LIMIT_SECRET');
  });

  it('allows deterministic non-production Maps test mode without a database', async () => {
    process.env.MAPS_TEST_MODE = 'true';
    delete process.env.DATABASE_URL;
    delete process.env.RATE_LIMIT_SECRET;
    await expect(enforceMapsRateLimit(new Request('https://example.com'), 'maps-test', 2, 60)).resolves.toBeUndefined();
  });
});

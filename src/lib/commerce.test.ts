import { describe, expect, it, vi } from 'vitest';
import { assertSchoolSupportApproved, calculateServerTotal, checkoutSchema, deliveryFeeForDistance, deliveryLocationSchema, normalizeKenyanPhone, paymentRuntimeReady } from './commerce';

describe('normalizeKenyanPhone', () => {
  it.each([
    ['0712345678', '254712345678'], ['712345678', '254712345678'], ['+254 712 345 678', '254712345678'], ['0112345678', '254112345678'],
  ])('normalizes %s', (input, expected) => expect(normalizeKenyanPhone(input)).toBe(expected));
  it.each(['123', '254612345678', '071234567890'])('rejects %s', (input) => expect(() => normalizeKenyanPhone(input)).toThrow(/valid Kenyan/));
});

describe('server totals', () => {
  it('calculates products and delivery from trusted values', () => {
    expect(calculateServerTotal([{ productId: 'mrembo-6', quantity: 2 }], 250)).toMatchObject({ subtotalKsh: 1000, deliveryFeeKsh: 250, totalKsh: 1250 });
  });
  it('rejects unknown products and abusive quantities', () => {
    expect(() => calculateServerTotal([{ productId: 'fake', quantity: 1 }])).toThrow(/Unknown product/);
    expect(() => calculateServerTotal([{ productId: 'mrembo-6', quantity: 21 }])).toThrow(/Invalid quantity/);
  });
});

describe('distance delivery pricing', () => {
  it.each([
    [0, 150], [5_000, 150], [5_001, 250], [10_000, 250], [10_001, 400], [40_001, 900], [250_001, 2500], [500_001, 5000],
  ])('prices %i metres', (distance, expected) => expect(deliveryFeeForDistance(distance).feeKsh).toBe(expected));
  it('requires a manual quote after 1,000 km', () => expect(deliveryFeeForDistance(1_000_001)).toMatchObject({ feeKsh: null, manualQuote: true }));
});

describe('delivery and checkout validation', () => {
  const mapPin = { source: 'map_pin', formattedAddress: 'ABC Plaza main gate', landmark: 'ABC Plaza main gate', destinationType: 'doorstep', latitude: -1.29, longitude: 36.82 };
  it('allows only a customer address or agreed drop-off pin', () => {
    expect(deliveryLocationSchema.safeParse(mapPin).success).toBe(true);
    expect(deliveryLocationSchema.safeParse({ source: 'warehouse_pickup' }).success).toBe(false);
  });
  it('requires transactional consent and an idempotency key', () => {
    const result = checkoutSchema.safeParse({
      items: [{ productId: 'mrembo-6', quantity: 1 }],
      customer: { fullName: 'Test Customer', phone: '0712345678', county: 'Nairobi' },
      delivery: mapPin,
      consent: { transactional: false, marketing: false },
      idempotencyKey: crypto.randomUUID(),
    });
    expect(result.success).toBe(false);
  });
});

describe('payment runtime readiness', () => {
  it('requires a complete, safe finance and scheduler configuration', () => {
    const ready = {
      DATABASE_URL: 'postgres://test-only',
      RATE_LIMIT_SECRET: 'test-only-rate-limit-secret-32-characters',
      ORDER_STATUS_SECRET: 'test-only-order-status-secret-32-characters',
      FINANCE_WEBHOOK_URL: 'https://finance.example.com/intake',
      FINANCE_WEBHOOK_ALLOWED_HOSTS: 'finance.example.com',
      FINANCE_WEBHOOK_SECRET: 'test-only-finance-secret-32-characters',
      CRON_SECRET: 'test-only-cron-secret-at-least-32-characters',
    };
    for (const [key, value] of Object.entries(ready)) vi.stubEnv(key, value);
    expect(paymentRuntimeReady()).toBe(true);
    vi.stubEnv('FINANCE_WEBHOOK_ALLOWED_HOSTS', 'other.example.com');
    expect(paymentRuntimeReady()).toBe(false);
    vi.stubEnv('FINANCE_WEBHOOK_ALLOWED_HOSTS', 'finance.example.com');
    vi.stubEnv('FINANCE_WEBHOOK_URL', 'https://finance.example.com/intake?token=unsafe');
    expect(paymentRuntimeReady()).toBe(false);
    vi.unstubAllEnvs();
  });
});

describe('school-support payment gate', () => {
  it('requires both the feature and finance approval gates', () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('SCHOOL_SUPPORT_ENABLED', 'true');
    vi.stubEnv('SCHOOL_SUPPORT_FINANCE_APPROVED', 'false');
    expect(() => assertSchoolSupportApproved()).toThrow(/finance/i);
    vi.stubEnv('SCHOOL_SUPPORT_FINANCE_APPROVED', 'true');
    expect(() => assertSchoolSupportApproved()).not.toThrow();
    vi.unstubAllEnvs();
  });
});

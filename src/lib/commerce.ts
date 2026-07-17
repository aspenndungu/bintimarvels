import { z } from 'zod';
import { catalogById } from './catalog';
import { isApprovedPublicHttpsUrl } from './network-security';

export const cartItemSchema = z.object({
  productId: z.string().min(1).max(80),
  quantity: z.number().int().min(1).max(20),
});

const coordinateSchema = z.object({
  latitude: z.number().finite().min(-90).max(90),
  longitude: z.number().finite().min(-180).max(180),
});

const googlePlaceDeliverySchema = coordinateSchema.extend({
  source: z.literal('google_place'),
  placeId: z.string().min(8).max(300),
  sessionToken: z.string().min(16).max(80).optional(),
  formattedAddress: z.string().trim().min(5).max(300),
  landmark: z.string().trim().max(200).optional().or(z.literal('')),
  destinationType: z.enum(['doorstep', 'drop_off']),
});

const mapPinDeliverySchema = coordinateSchema.extend({
  source: z.literal('map_pin'),
  formattedAddress: z.string().trim().min(5).max(300),
  landmark: z.string().trim().min(3).max(200),
  destinationType: z.enum(['doorstep', 'drop_off']),
});

export const deliveryLocationSchema = z.discriminatedUnion('source', [googlePlaceDeliverySchema, mapPinDeliverySchema]);

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(12),
  customer: z.object({
    fullName: z.string().trim().min(2).max(100),
    phone: z.string().trim().min(9).max(20),
    email: z.string().trim().email().max(160).optional().or(z.literal('')),
    county: z.string().trim().min(2).max(80),
  }),
  delivery: deliveryLocationSchema,
  consent: z.object({ transactional: z.literal(true), marketing: z.boolean().default(false) }),
  idempotencyKey: z.string().uuid(),
});

export const quoteSchema = z.object({
  items: z.array(cartItemSchema).min(1).max(12),
  delivery: deliveryLocationSchema,
});

export const schoolSupportSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(9).max(20),
  email: z.string().trim().email().max(160).optional().or(z.literal('')),
  amountKsh: z.number().int().min(100).max(1_000_000),
  message: z.string().trim().max(500).optional().or(z.literal('')),
  idempotencyKey: z.string().uuid(),
  consent: z.literal(true),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type DeliveryLocation = z.infer<typeof deliveryLocationSchema>;
export type SchoolSupportInput = z.infer<typeof schoolSupportSchema>;

export const DELIVERY_BANDS = [
  { maxMeters: 5_000, feeKsh: 150, label: 'Up to 5 km' },
  { maxMeters: 10_000, feeKsh: 250, label: '5–10 km' },
  { maxMeters: 20_000, feeKsh: 400, label: '10–20 km' },
  { maxMeters: 40_000, feeKsh: 600, label: '20–40 km' },
  { maxMeters: 100_000, feeKsh: 900, label: '40–100 km' },
  { maxMeters: 250_000, feeKsh: 1_500, label: '100–250 km' },
  { maxMeters: 500_000, feeKsh: 2_500, label: '250–500 km' },
  { maxMeters: 1_000_000, feeKsh: 5_000, label: '500–1,000 km' },
] as const;

export function deliveryFeeForDistance(distanceMeters: number) {
  if (!Number.isInteger(distanceMeters) || distanceMeters < 0) throw new Error('Invalid delivery distance.');
  const band = DELIVERY_BANDS.find((item) => distanceMeters <= item.maxMeters);
  if (!band) return { feeKsh: null, bandLabel: 'Over 1,000 km', manualQuote: true } as const;
  return { feeKsh: band.feeKsh, bandLabel: band.label, manualQuote: false } as const;
}

export function assertCatalogAvailable() {
  if (process.env.CATALOG_VISIBLE === 'false') throw new Error('The product catalogue is not currently available.');
}

export class IdempotencyConflictError extends Error {
  constructor() {
    super('This idempotency key was already used for different payment details.');
    this.name = 'IdempotencyConflictError';
  }
}

export function paymentRuntimeReady() {
  const rawFinanceUrl = process.env.FINANCE_WEBHOOK_URL;
  const allowedFinanceHosts = (process.env.FINANCE_WEBHOOK_ALLOWED_HOSTS ?? '')
    .split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
  const retrySecret = process.env.CRON_SECRET || process.env.INTERNAL_JOB_SECRET || '';
  if (!process.env.DATABASE_URL
    || (process.env.RATE_LIMIT_SECRET?.length ?? 0) < 32
    || (process.env.ORDER_STATUS_SECRET?.length ?? 0) < 32
    || !rawFinanceUrl
    || !allowedFinanceHosts.length
    || (process.env.FINANCE_WEBHOOK_SECRET?.length ?? 0) < 32
    || retrySecret.length < 32) return false;
  return isApprovedPublicHttpsUrl(rawFinanceUrl, allowedFinanceHosts);
}

export function assertCommerceApproved() {
  if (process.env.COMMERCE_ENABLED !== 'true' || process.env.CATALOG_APPROVED !== 'true') throw new Error('Online payment is not yet enabled.');
  const financeReady = paymentRuntimeReady();
  if (process.env.NODE_ENV === 'production' && (process.env.PESAPAL_ENV !== 'production' || process.env.PRODUCTION_PAYMENT_GATE_APPROVED !== 'true' || process.env.DELIVERY_RATE_CARD_APPROVED !== 'true' || !financeReady)) {
    throw new Error('Production payment approval is incomplete.');
  }
}

export function assertSchoolSupportApproved() {
  if (process.env.SCHOOL_SUPPORT_ENABLED !== 'true' || process.env.SCHOOL_SUPPORT_FINANCE_APPROVED !== 'true') {
    throw new Error('Online school support and finance handling are not yet enabled.');
  }
  const financeReady = paymentRuntimeReady();
  if (process.env.NODE_ENV === 'production' && (process.env.PESAPAL_ENV !== 'production' || process.env.PRODUCTION_PAYMENT_GATE_APPROVED !== 'true' || !financeReady)) {
    throw new Error('Production payment approval is incomplete.');
  }
}

export function normalizeKenyanPhone(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (/^0[17]\d{8}$/.test(digits)) return `254${digits.slice(1)}`;
  if (/^[17]\d{8}$/.test(digits)) return `254${digits}`;
  if (/^254[17]\d{8}$/.test(digits)) return digits;
  throw new Error('Enter a valid Kenyan mobile number.');
}

export function calculateServerTotal(items: Array<{ productId: string; quantity: number }>, deliveryFeeKsh = 0) {
  let subtotalKsh = 0;
  const lines = items.map((item) => {
    const product = catalogById.get(item.productId);
    if (!product) throw new Error(`Unknown product: ${item.productId}`);
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) throw new Error('Invalid quantity.');
    const lineTotalKsh = product.priceKsh * item.quantity;
    subtotalKsh += lineTotalKsh;
    return { productId: product.id, productName: product.name, quantity: item.quantity, unitPriceKsh: product.priceKsh, lineTotalKsh };
  });
  if (!Number.isInteger(deliveryFeeKsh) || deliveryFeeKsh < 0) throw new Error('Invalid delivery fee.');
  return { subtotalKsh, deliveryFeeKsh, totalKsh: subtotalKsh + deliveryFeeKsh, lines };
}

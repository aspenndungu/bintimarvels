import { beforeEach, describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'node:crypto';

const url = process.env.TEST_DATABASE_URL;
if (url) process.env.DATABASE_URL = url;
process.env.COMMERCE_ENABLED = 'true';
process.env.CATALOG_APPROVED = 'true';
process.env.MAPS_TEST_MODE = 'true';
process.env.DELIVERY_RATE_CARD_APPROVED = 'true';

import { database } from './db';
import { releaseFailedOrder, startCheckout } from './orders';
import { PesapalDefinitiveError } from '@/lib/pesapal';
import { deliverFinanceHandoff, deliverSchoolSupportFinanceHandoff } from './finance-handoff';
import { createSchoolSupportPayment, processPesapalRetailNotification, processPesapalSchoolSupportNotification } from './pesapal-payments';

const suite = url ? describe : describe.skip;
const input = () => ({
  items: [{ productId: 'mrembo-6', quantity: 2 }],
  customer: { fullName: 'Integration Customer', phone: '0712345678', email: '', county: 'Nairobi' },
  delivery: { source: 'map_pin' as const, formattedAddress: 'Test estate main gate', landmark: 'Test estate main gate', destinationType: 'doorstep' as const, latitude: -1.2921, longitude: 36.7849 },
  consent: { transactional: true as const, marketing: false },
  idempotencyKey: randomUUID(),
});
const accepted = (tracking = randomUUID()) => ({
  submitOrder: vi.fn().mockImplementation(({ merchantReference }) => Promise.resolve({
    merchantReference, orderTrackingId: tracking, redirectUrl: `https://cybqa.pesapal.com/payment/${tracking}`,
  })),
}) as never;
const providerStatus = (merchantReference: string, amountKsh: number, status: 'COMPLETED' | 'REVERSED' | 'FAILED') => ({
  getTransactionStatus: vi.fn().mockResolvedValue({
    status, statusCode: status === 'COMPLETED' ? 1 : status === 'REVERSED' ? 2 : 3,
    amountKsh, currency: 'KES', merchantReference,
    paymentMethod: 'M-PESA', confirmationCode: `CONF-${randomUUID()}`,
    description: status, maskedPaymentAccount: '2547***678',
  }),
}) as never;
const completed = (merchantReference: string, amountKsh: number) => providerStatus(merchantReference, amountKsh, 'COMPLETED');

suite('PostgreSQL Pesapal order ledger', () => {
  beforeEach(async () => {
    const sql = database();
    await sql`TRUNCATE website_provider_events, website_support_handoffs, website_school_support, website_handoffs, website_payments, website_inventory_reservations, website_order_items, website_orders, website_leads, website_rate_limits RESTART IDENTITY CASCADE`;
    await sql`INSERT INTO website_inventory (product_id, available_units) VALUES ('mrembo-6', 10) ON CONFLICT (product_id) DO UPDATE SET available_units = 10`;
    delete process.env.FINANCE_WEBHOOK_URL; delete process.env.FINANCE_WEBHOOK_SECRET; delete process.env.FINANCE_WEBHOOK_ALLOWED_HOSTS;
    vi.restoreAllMocks();
  });

  it('recalculates delivery and deduplicates concurrent checkout submissions', async () => {
    const checkout = input(); const pesapal = accepted();
    const [first, second] = await Promise.all([startCheckout(checkout, pesapal), startCheckout(checkout, pesapal)]);
    expect(first.totalKsh).toBe(first.subtotalKsh + 250);
    expect(first.deliveryFeeKsh).toBe(250);
    expect(new Set([first.id, second.id]).size).toBe(1);
    expect((pesapal as { submitOrder: ReturnType<typeof vi.fn> }).submitOrder).toHaveBeenCalledTimes(1);
    const [inventory] = await database()<{ available_units: number }[]>`SELECT available_units FROM website_inventory WHERE product_id = 'mrembo-6'`;
    expect(inventory.available_units).toBe(8);
  });

  it('rejects reuse of a retail idempotency key with different payment details', async () => {
    const checkout = input();
    const pesapal = accepted();
    await startCheckout(checkout, pesapal);
    await expect(startCheckout({
      ...checkout,
      customer: { ...checkout.customer, fullName: 'Different Customer' },
    }, pesapal)).rejects.toThrow(/idempotency key/i);
    expect((pesapal as { submitOrder: ReturnType<typeof vi.fn> }).submitOrder).toHaveBeenCalledTimes(1);
    const [inventory] = await database()<{ available_units: number }[]>`SELECT available_units FROM website_inventory WHERE product_id = 'mrembo-6'`;
    expect(inventory.available_units).toBe(8);
  });

  it('does not let submit-order persistence downgrade a callback-completed retail payment', async () => {
    const trackingId = randomUUID();
    const pesapal = {
      submitOrder: vi.fn().mockImplementation(async ({ merchantReference, amountKsh }) => {
        await processPesapalRetailNotification({
          trackingId, merchantReference, notificationType: 'IPNCHANGE', raw: { race: true },
        }, completed(merchantReference, amountKsh));
        return { merchantReference, orderTrackingId: trackingId, redirectUrl: `https://cybqa.pesapal.com/payment/${trackingId}` };
      }),
    } as never;
    const order = await startCheckout(input(), pesapal);
    const [payment] = await database()<{ status: string }[]>`SELECT status FROM website_payments WHERE order_id = ${order.id}`;
    expect(order.status).toBe('paid');
    expect(payment.status).toBe('paid');
  });

  it('keeps stock reserved after an ambiguous Pesapal request error', async () => {
    await expect(startCheckout(input(), { submitOrder: vi.fn().mockRejectedValue(new Error('network timeout')) } as never)).rejects.toThrow(/timeout/);
    const [inventory] = await database()<{ available_units: number }[]>`SELECT available_units FROM website_inventory WHERE product_id = 'mrembo-6'`;
    const [order] = await database()<{ status: string }[]>`SELECT status FROM website_orders LIMIT 1`;
    expect(inventory.available_units).toBe(8);
    expect(order.status).toBe('payment_request_unknown');
  });

  it('releases inventory only after a definitive Pesapal rejection', async () => {
    await expect(startCheckout(input(), { submitOrder: vi.fn().mockRejectedValue(new PesapalDefinitiveError('rejected')) } as never)).rejects.toThrow(/rejected/);
    const [inventory] = await database()<{ available_units: number }[]>`SELECT available_units FROM website_inventory WHERE product_id = 'mrembo-6'`;
    expect(inventory.available_units).toBe(10);
  });

  it('routes a verified late completion to review without reallocating stock', async () => {
    const order = await startCheckout(input(), accepted());
    await releaseFailedOrder(order.id, 'payment_timed_out', 'expired');
    const result = await processPesapalRetailNotification({
      trackingId: order.orderTrackingId!, merchantReference: order.publicReference,
      notificationType: 'IPNCHANGE', raw: { redacted: true },
    }, completed(order.publicReference, order.totalKsh));
    expect(result.outcome).toBe('payment_review');
    const [inventory] = await database()<{ available_units: number }[]>`SELECT available_units FROM website_inventory WHERE product_id = 'mrembo-6'`;
    const [handoff] = await database()<{ event_type: string }[]>`SELECT event_type FROM website_handoffs WHERE order_id = ${order.id}`;
    expect(inventory.available_units).toBe(10);
    expect(handoff.event_type).toBe('website.order.payment_review');
  });

  it('atomically claims a finance handoff after verified payment', async () => {
    const order = await startCheckout(input(), accepted());
    await processPesapalRetailNotification({
      trackingId: order.orderTrackingId!, merchantReference: order.publicReference,
      notificationType: 'IPNCHANGE', raw: { redacted: true },
    }, completed(order.publicReference, order.totalKsh));
    process.env.FINANCE_WEBHOOK_URL = 'https://finance.example.test/intake';
    process.env.FINANCE_WEBHOOK_ALLOWED_HOSTS = 'finance.example.test';
    process.env.FINANCE_WEBHOOK_SECRET = 'test-only-finance-handoff-secret-32';
    const fetcher = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ record_id: 'one' }), { status: 200, headers: { 'content-type': 'application/json' } }));
    const results = await Promise.all([deliverFinanceHandoff(order.id), deliverFinanceHandoff(order.id)]);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(results.filter((result) => result.delivered)).toHaveLength(1);
  });

  it('delivers a verified retail reversal as a separate non-sale finance event', async () => {
    const order = await startCheckout(input(), accepted());
    const notification = {
      trackingId: order.orderTrackingId!, merchantReference: order.publicReference,
      notificationType: 'IPNCHANGE', raw: { redacted: true },
    };
    await processPesapalRetailNotification(notification, completed(order.publicReference, order.totalKsh));
    expect((await processPesapalRetailNotification(notification, providerStatus(order.publicReference, order.totalKsh, 'REVERSED'))).outcome).toBe('reversal_review');
    process.env.FINANCE_WEBHOOK_URL = 'https://finance.example.test/intake';
    process.env.FINANCE_WEBHOOK_ALLOWED_HOSTS = 'finance.example.test';
    process.env.FINANCE_WEBHOOK_SECRET = 'test-only-finance-handoff-secret-32';
    const fetcher = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ record_id: 'reversal-one' }), { status: 200 }));
    await expect(deliverFinanceHandoff(order.id)).resolves.toMatchObject({ delivered: true });
    const payload = JSON.parse(String(fetcher.mock.calls[0][1]?.body));
    expect(payload).toMatchObject({ event: 'website.order.reversed', sale_made: false, create_dispatch: false, requires_review: true });
    const headers = fetcher.mock.calls[0][1]?.headers as Record<string, string>;
    expect(headers['Idempotency-Key']).toBe(`website.order.reversed:${order.id}`);
  });

  it('records a verified school-support payment once and hands it to finance once', async () => {
    process.env.SCHOOL_SUPPORT_ENABLED = 'true';
    process.env.SCHOOL_SUPPORT_FINANCE_APPROVED = 'true';
    const support = await createSchoolSupportPayment({
      fullName: 'School Supporter', phone: '0712345678', email: 'supporter@example.test',
      amountKsh: 1000, message: 'For an approved school project', idempotencyKey: randomUUID(), consent: true,
    }, accepted());
    const notification = {
      trackingId: support.provider_tracking_id!, merchantReference: support.public_reference,
      notificationType: 'IPNCHANGE', raw: { redacted: true },
    };
    const provider = completed(support.public_reference, 1000);
    expect((await processPesapalSchoolSupportNotification(notification, provider)).outcome).toBe('completed');
    expect((await processPesapalSchoolSupportNotification(notification, provider)).outcome).toBe('duplicate');
    const [row] = await database()<{ status: string }[]>`SELECT status FROM website_school_support WHERE id = ${support.id}`;
    expect(row.status).toBe('completed');

    process.env.FINANCE_WEBHOOK_URL = 'https://finance.example.test/intake';
    process.env.FINANCE_WEBHOOK_ALLOWED_HOSTS = 'finance.example.test';
    process.env.FINANCE_WEBHOOK_SECRET = 'test-only-finance-handoff-secret-32';
    const fetcher = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ record_id: 'school-one' }), { status: 200 }));
    const results = await Promise.all([
      deliverSchoolSupportFinanceHandoff(support.id),
      deliverSchoolSupportFinanceHandoff(support.id),
    ]);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(results.filter((result) => result.delivered)).toHaveLength(1);
    const payload = JSON.parse(String(fetcher.mock.calls[0][1]?.body));
    expect(payload).toMatchObject({ event: 'website.school_support.completed', trade_channel: 'CHARITY', amount_ksh: 1000, create_dispatch: false });
  });

  it('rejects reuse of a school-support idempotency key with different details', async () => {
    process.env.SCHOOL_SUPPORT_ENABLED = 'true';
    process.env.SCHOOL_SUPPORT_FINANCE_APPROVED = 'true';
    const request = {
      fullName: 'School Supporter', phone: '0712345678', email: '', amountKsh: 1000,
      message: '', idempotencyKey: randomUUID(), consent: true as const,
    };
    const pesapal = accepted();
    await createSchoolSupportPayment(request, pesapal);
    await expect(createSchoolSupportPayment({ ...request, amountKsh: 2500 }, pesapal)).rejects.toThrow(/idempotency key/i);
    expect((pesapal as { submitOrder: ReturnType<typeof vi.fn> }).submitOrder).toHaveBeenCalledTimes(1);
  });

  it('does not let submit-order persistence downgrade a callback-completed school payment', async () => {
    process.env.SCHOOL_SUPPORT_ENABLED = 'true';
    process.env.SCHOOL_SUPPORT_FINANCE_APPROVED = 'true';
    const trackingId = randomUUID();
    const pesapal = {
      submitOrder: vi.fn().mockImplementation(async ({ merchantReference, amountKsh }) => {
        await processPesapalSchoolSupportNotification({
          trackingId, merchantReference, notificationType: 'IPNCHANGE', raw: { race: true },
        }, completed(merchantReference, amountKsh));
        return { merchantReference, orderTrackingId: trackingId, redirectUrl: `https://cybqa.pesapal.com/payment/${trackingId}` };
      }),
    } as never;
    const support = await createSchoolSupportPayment({
      fullName: 'School Supporter', phone: '0712345678', email: '', amountKsh: 1000,
      message: '', idempotencyKey: randomUUID(), consent: true,
    }, pesapal);
    const [row] = await database()<{ status: string }[]>`SELECT status FROM website_school_support WHERE id = ${support.id}`;
    expect(support.status).toBe('completed');
    expect(row.status).toBe('completed');
  });

  it('routes a school-support amount mismatch to review and a finance exception handoff', async () => {
    process.env.SCHOOL_SUPPORT_ENABLED = 'true';
    process.env.SCHOOL_SUPPORT_FINANCE_APPROVED = 'true';
    const support = await createSchoolSupportPayment({
      fullName: 'School Supporter', phone: '0712345678', email: '', amountKsh: 1000,
      message: '', idempotencyKey: randomUUID(), consent: true,
    }, accepted());
    const result = await processPesapalSchoolSupportNotification({
      trackingId: support.provider_tracking_id!, merchantReference: support.public_reference,
      notificationType: 'IPNCHANGE', raw: { redacted: true },
    }, completed(support.public_reference, 999));
    expect(result.outcome).toBe('payment_review');
    const [row] = await database()<{ status: string }[]>`SELECT status FROM website_school_support WHERE id = ${support.id}`;
    const handoffs = await database()<{ support_id: string; event_type: string }[]>`SELECT support_id, event_type FROM website_support_handoffs WHERE support_id = ${support.id}`;
    expect(row.status).toBe('payment_review');
    expect(handoffs).toHaveLength(1);
    expect(handoffs[0].event_type).toBe('website.school_support.payment_review');
  });
});

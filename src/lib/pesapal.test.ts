import { describe, expect, it, vi } from 'vitest';
import { PesapalClient, parsePesapalNotification, pesapalConfigFromEnv } from './pesapal';

const config = {
  baseUrl: 'https://cybqa.pesapal.com/pesapalv3' as const,
  consumerKey: 'key',
  consumerSecret: 'secret',
  notificationId: '11111111-1111-4111-8111-111111111111',
  callbackUrl: 'https://example.test/api/pesapal/callback',
  cancellationUrl: 'https://example.test/payment-status?cancelled=1',
};

describe('Pesapal notification parsing', () => {
  it('accepts the documented callback/IPN field names only', () => {
    expect(parsePesapalNotification({
      OrderTrackingId: 'b945e4af-80a5-4ec1-8706-e03f8332fb04',
      OrderMerchantReference: 'BINTI-123',
      OrderNotificationType: 'IPNCHANGE',
    })).toEqual({
      orderTrackingId: 'b945e4af-80a5-4ec1-8706-e03f8332fb04',
      merchantReference: 'BINTI-123',
      notificationType: 'IPNCHANGE',
    });
  });

  it('rejects a forged paid flag without provider identifiers', () => {
    expect(() => parsePesapalNotification({ paid: true })).toThrow();
  });
});

describe('Pesapal client', () => {
  it('authenticates, submits a server-owned KES amount and returns an allowlisted redirect', async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ token: 'test-access-token-long-enough', status: '200' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        order_tracking_id: 'b945e4af-80a5-4ec1-8706-e03f8332fb04',
        merchant_reference: 'BINTI-123',
        redirect_url: 'https://cybqa.pesapal.com/pesapaliframe/PesapalIframe3/Index/?OrderTrackingId=x',
        status: '200',
        error: null,
      }), { status: 200 }));
    const client = new PesapalClient(config, fetcher);
    const result = await client.submitOrder({
      merchantReference: 'BINTI-123',
      amountKsh: 750,
      description: 'Mrembo website order',
      customer: { fullName: 'Review Customer', phone: '254712345678', email: '', county: 'Nairobi' },
      address: 'ABC Plaza main gate',
    });
    expect(result.redirectUrl).toContain('cybqa.pesapal.com/');
    const body = JSON.parse(fetcher.mock.calls[1][1].body);
    expect(body).toMatchObject({ id: 'BINTI-123', currency: 'KES', amount: 750, notification_id: config.notificationId });
    expect(JSON.stringify(body)).not.toContain(config.consumerSecret);
  });

  it('rejects a redirect URL outside Pesapal', async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ token: 'test-access-token-long-enough', status: '200' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        order_tracking_id: 'b945e4af-80a5-4ec1-8706-e03f8332fb04',
        merchant_reference: 'BINTI-123',
        redirect_url: 'https://evil.example/steal', status: '200', error: null,
      }), { status: 200 }));
    await expect(new PesapalClient(config, fetcher).submitOrder({
      merchantReference: 'BINTI-123', amountKsh: 750, description: 'Mrembo order',
      customer: { fullName: 'Review Customer', phone: '254712345678', email: '', county: 'Nairobi' }, address: 'Nairobi',
    })).rejects.toThrow(/redirect/i);
  });

  it('verifies status fields supplied by Pesapal', async () => {
    const fetcher = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ token: 'test-access-token-long-enough', status: '200' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        payment_method: 'Mpesa', amount: 750, confirmation_code: 'ABC123',
        payment_status_description: 'COMPLETED', status_code: 1,
        merchant_reference: 'BINTI-123', currency: 'KES', status: '200', error: null,
      }), { status: 200 }));
    await expect(new PesapalClient(config, fetcher).getTransactionStatus('b945e4af-80a5-4ec1-8706-e03f8332fb04')).resolves.toMatchObject({
      status: 'COMPLETED', amountKsh: 750, merchantReference: 'BINTI-123', currency: 'KES',
    });
  });
});

describe('Pesapal environment gate', () => {
  it('rejects production checkout with sandbox configuration', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('PESAPAL_ENV', 'sandbox');
    vi.stubEnv('PESAPAL_CONSUMER_KEY', 'key');
    vi.stubEnv('PESAPAL_CONSUMER_SECRET', 'secret');
    vi.stubEnv('PESAPAL_NOTIFICATION_ID', config.notificationId);
    vi.stubEnv('PESAPAL_CALLBACK_URL', config.callbackUrl);
    vi.stubEnv('PESAPAL_CANCELLATION_URL', config.cancellationUrl);
    expect(() => pesapalConfigFromEnv()).toThrow(/production/i);
    vi.unstubAllEnvs();
  });

  it('requires the secret IPN path token before any payment can start', () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('PESAPAL_ENV', 'sandbox');
    vi.stubEnv('PESAPAL_CONSUMER_KEY', 'key');
    vi.stubEnv('PESAPAL_CONSUMER_SECRET', 'secret');
    vi.stubEnv('PESAPAL_NOTIFICATION_ID', config.notificationId);
    vi.stubEnv('PESAPAL_CALLBACK_URL', 'https://example.test/api/pesapal/callback');
    vi.stubEnv('PESAPAL_CANCELLATION_URL', 'https://example.test/payment-status');
    vi.stubEnv('PESAPAL_IPN_TOKEN', '');
    expect(() => pesapalConfigFromEnv()).toThrow(/IPN protection/i);
    vi.stubEnv('PESAPAL_IPN_TOKEN', 'test-ipn-token-at-least-32-characters');
    expect(pesapalConfigFromEnv().baseUrl).toBe('https://cybqa.pesapal.com/pesapalv3');
    vi.unstubAllEnvs();
  });
});

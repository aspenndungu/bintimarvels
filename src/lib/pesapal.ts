import { z } from 'zod';

const notificationSchema = z.object({
  OrderTrackingId: z.string().uuid(),
  OrderMerchantReference: z.string().trim().min(1).max(50).regex(/^[A-Za-z0-9._:-]+$/),
  OrderNotificationType: z.enum(['CALLBACKURL', 'IPNCHANGE']),
});

const tokenResponseSchema = z.object({
  token: z.string().min(20),
  expiryDate: z.string().optional(),
  status: z.union([z.string(), z.number()]).transform(String),
  error: z.unknown().nullable().optional(),
  message: z.string().optional(),
});

const submitResponseSchema = z.object({
  order_tracking_id: z.string().uuid(),
  merchant_reference: z.string(),
  redirect_url: z.string().url(),
  status: z.union([z.string(), z.number()]).transform(String),
  error: z.unknown().nullable().optional(),
  message: z.string().optional(),
});

const statusResponseSchema = z.object({
  payment_method: z.string().optional().default(''),
  amount: z.coerce.number().finite().nonnegative(),
  confirmation_code: z.string().optional().nullable(),
  payment_status_description: z.enum(['INVALID', 'FAILED', 'COMPLETED', 'REVERSED']),
  description: z.string().optional().default(''),
  payment_account: z.string().optional().default(''),
  status_code: z.coerce.number().int().min(0).max(3),
  merchant_reference: z.string().trim().min(1).max(50),
  currency: z.string().length(3),
  status: z.union([z.string(), z.number()]).transform(String),
  error: z.unknown().nullable().optional(),
});

export interface PesapalConfig {
  baseUrl: 'https://cybqa.pesapal.com/pesapalv3' | 'https://pay.pesapal.com/v3';
  consumerKey: string;
  consumerSecret: string;
  notificationId: string;
  callbackUrl: string;
  cancellationUrl: string;
}

export interface PesapalOrderInput {
  merchantReference: string;
  amountKsh: number;
  description: string;
  customer: { fullName: string; phone: string; email?: string; county?: string };
  address?: string;
}

export interface PesapalOrderResponse {
  orderTrackingId: string;
  merchantReference: string;
  redirectUrl: string;
}

export interface PesapalStatus {
  status: 'INVALID' | 'FAILED' | 'COMPLETED' | 'REVERSED';
  statusCode: number;
  amountKsh: number;
  currency: string;
  merchantReference: string;
  paymentMethod: string;
  confirmationCode: string | null;
  description: string;
  maskedPaymentAccount: string;
}

export class PesapalDefinitiveError extends Error {
  constructor(message: string) { super(message); this.name = 'PesapalDefinitiveError'; }
}

export function parsePesapalNotification(input: unknown) {
  const parsed = notificationSchema.parse(input);
  return {
    orderTrackingId: parsed.OrderTrackingId,
    merchantReference: parsed.OrderMerchantReference,
    notificationType: parsed.OrderNotificationType,
  } as const;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? 'Customer', lastName: parts.slice(1).join(' ') };
}

function assertMerchantReference(value: string) {
  if (!/^[A-Za-z0-9._:-]{1,50}$/.test(value)) throw new PesapalDefinitiveError('The payment reference is invalid.');
}

function assertPesapalRedirect(value: string, baseUrl: string) {
  const redirect = new URL(value);
  const expected = new URL(baseUrl);
  const allowedHosts = expected.hostname === 'pay.pesapal.com'
    ? new Set(['pay.pesapal.com'])
    : new Set(['cybqa.pesapal.com']);
  if (redirect.protocol !== 'https:' || !allowedHosts.has(redirect.hostname)) throw new Error('Pesapal returned an unsafe redirect URL.');
  return redirect.toString();
}

export class PesapalClient {
  private cachedToken: { value: string; expiresAt: number } | null = null;

  constructor(
    private readonly config: PesapalConfig,
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  private async token() {
    if (this.cachedToken && this.cachedToken.expiresAt > Date.now() + 30_000) return this.cachedToken.value;
    const response = await this.fetcher(`${this.config.baseUrl}/api/Auth/RequestToken`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ consumer_key: this.config.consumerKey, consumer_secret: this.config.consumerSecret }),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
    const raw: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) throw new PesapalDefinitiveError('Pesapal authorization was rejected.');
      throw new Error('Pesapal authorization status is uncertain.');
    }
    const parsed = tokenResponseSchema.parse(raw);
    if (parsed.status !== '200' || parsed.error) throw new PesapalDefinitiveError(parsed.message || 'Pesapal authorization failed.');
    this.cachedToken = { value: parsed.token, expiresAt: Date.now() + 4 * 60_000 };
    return parsed.token;
  }

  async submitOrder(input: PesapalOrderInput): Promise<PesapalOrderResponse> {
    assertMerchantReference(input.merchantReference);
    if (!Number.isInteger(input.amountKsh) || input.amountKsh < 10) throw new PesapalDefinitiveError('The payment amount is invalid.');
    const accessToken = await this.token();
    const { firstName, lastName } = splitName(input.customer.fullName);
    const response = await this.fetcher(`${this.config.baseUrl}/api/Transactions/SubmitOrderRequest`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: input.merchantReference,
        currency: 'KES',
        amount: input.amountKsh,
        description: input.description.slice(0, 100),
        callback_url: this.config.callbackUrl,
        cancellation_url: this.config.cancellationUrl,
        redirect_mode: 'TOP_WINDOW',
        notification_id: this.config.notificationId,
        branch: 'Binti Marvels Online',
        billing_address: {
          phone_number: input.customer.phone,
          email_address: input.customer.email || '',
          country_code: 'KE',
          first_name: firstName,
          last_name: lastName,
          line_1: input.address || '',
          city: input.customer.county || '',
        },
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    });
    const raw: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      if (response.status >= 400 && response.status < 500) throw new PesapalDefinitiveError('Pesapal rejected the payment request.');
      throw new Error('Pesapal payment request status is uncertain.');
    }
    const parsed = submitResponseSchema.parse(raw);
    if (parsed.status !== '200' || parsed.error) throw new PesapalDefinitiveError(parsed.message || 'Pesapal could not create the payment request.');
    if (parsed.merchant_reference !== input.merchantReference) throw new Error('Pesapal returned a mismatched merchant reference.');
    return {
      orderTrackingId: parsed.order_tracking_id,
      merchantReference: parsed.merchant_reference,
      redirectUrl: assertPesapalRedirect(parsed.redirect_url, this.config.baseUrl),
    };
  }

  async getTransactionStatus(orderTrackingId: string): Promise<PesapalStatus> {
    if (!z.string().uuid().safeParse(orderTrackingId).success) throw new PesapalDefinitiveError('The Pesapal tracking ID is invalid.');
    const accessToken = await this.token();
    const response = await this.fetcher(`${this.config.baseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${encodeURIComponent(orderTrackingId)}`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json', 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(12_000),
    });
    const raw: unknown = await response.json().catch(() => null);
    if (!response.ok) throw new Error('Pesapal transaction verification failed.');
    const parsed = statusResponseSchema.parse(raw);
    if (parsed.status !== '200' || parsed.error) throw new Error('Pesapal transaction verification was incomplete.');
    return {
      status: parsed.payment_status_description,
      statusCode: parsed.status_code,
      amountKsh: parsed.amount,
      currency: parsed.currency.toUpperCase(),
      merchantReference: parsed.merchant_reference,
      paymentMethod: parsed.payment_method,
      confirmationCode: parsed.confirmation_code ?? null,
      description: parsed.description,
      maskedPaymentAccount: parsed.payment_account,
    };
  }

  async registerIpn(url: string) {
    const ipnUrl = new URL(url);
    if (ipnUrl.protocol !== 'https:') throw new PesapalDefinitiveError('Pesapal IPN URL must use HTTPS.');
    const accessToken = await this.token();
    const response = await this.fetcher(`${this.config.baseUrl}/api/URLSetup/RegisterIPN`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: ipnUrl.toString(), ipn_notification_type: 'POST' }),
      cache: 'no-store',
      signal: AbortSignal.timeout(12_000),
    });
    const raw = await response.json() as { ipn_id?: string; status?: string | number; error?: unknown };
    if (!response.ok || String(raw.status ?? '') !== '200' || raw.error || !raw.ipn_id) throw new Error('Pesapal IPN registration failed.');
    return { ipnId: raw.ipn_id };
  }
}

export function pesapalConfigFromEnv(): PesapalConfig {
  const environment = process.env.PESAPAL_ENV;
  if (process.env.NODE_ENV === 'production' && environment !== 'production') throw new Error('Production payment requires Pesapal production configuration.');
  const baseUrl = environment === 'production'
    ? 'https://pay.pesapal.com/v3'
    : environment === 'sandbox'
      ? 'https://cybqa.pesapal.com/pesapalv3'
      : null;
  const values = {
    baseUrl,
    consumerKey: process.env.PESAPAL_CONSUMER_KEY,
    consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
    notificationId: process.env.PESAPAL_NOTIFICATION_ID,
    callbackUrl: process.env.PESAPAL_CALLBACK_URL,
    cancellationUrl: process.env.PESAPAL_CANCELLATION_URL,
  };
  if (!values.baseUrl || !values.consumerKey || !values.consumerSecret || !values.notificationId || !values.callbackUrl || !values.cancellationUrl) {
    throw new Error('Pesapal server configuration is incomplete.');
  }
  if (!process.env.PESAPAL_IPN_TOKEN || process.env.PESAPAL_IPN_TOKEN.length < 32) {
    throw new Error('Pesapal IPN protection is incomplete.');
  }
  if (!z.string().uuid().safeParse(values.notificationId).success) throw new Error('Pesapal notification ID is invalid.');
  const callback = new URL(values.callbackUrl);
  const cancellation = new URL(values.cancellationUrl);
  for (const url of [callback, cancellation]) {
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Pesapal callback and cancellation URLs must use clean HTTPS URLs.');
    if (process.env.NODE_ENV === 'production' && ['localhost', '127.0.0.1', '::1'].includes(url.hostname)) throw new Error('Production Pesapal URLs cannot use a loopback host.');
  }
  if (callback.origin !== cancellation.origin || callback.pathname !== '/api/pesapal/callback' || cancellation.pathname !== '/payment-status') {
    throw new Error('Pesapal callback and cancellation URL paths are invalid.');
  }
  return values as PesapalConfig;
}

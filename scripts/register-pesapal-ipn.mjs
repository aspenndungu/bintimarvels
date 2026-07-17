#!/usr/bin/env node

const required = ['PESAPAL_CONSUMER_KEY', 'PESAPAL_CONSUMER_SECRET', 'PESAPAL_IPN_URL'];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error(`Missing required variables: ${missing.join(', ')}`);
  process.exit(1);
}
const environment = process.env.PESAPAL_ENV === 'production' ? 'production' : 'sandbox';
const baseUrl = environment === 'production' ? 'https://pay.pesapal.com/v3' : 'https://cybqa.pesapal.com/pesapalv3';
const ipnUrl = new URL(process.env.PESAPAL_IPN_URL);
if (ipnUrl.protocol !== 'https:' || !ipnUrl.pathname.startsWith('/api/pesapal/ipn/')) {
  console.error('PESAPAL_IPN_URL must be an HTTPS URL using /api/pesapal/ipn/<secret-token>.');
  process.exit(1);
}

async function request(path, init) {
  const response = await fetch(`${baseUrl}${path}`, { ...init, signal: AbortSignal.timeout(15000) });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body) throw new Error(`Pesapal ${path} failed with HTTP ${response.status}.`);
  return body;
}

const auth = await request('/api/Auth/RequestToken', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
  body: JSON.stringify({ consumer_key: process.env.PESAPAL_CONSUMER_KEY, consumer_secret: process.env.PESAPAL_CONSUMER_SECRET }),
});
if (!auth.token) throw new Error('Pesapal did not return an access token.');
const registration = await request('/api/URLSetup/RegisterIPN', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${auth.token}` },
  body: JSON.stringify({ url: ipnUrl.toString(), ipn_notification_type: 'POST' }),
});
if (!registration.ipn_id) throw new Error('Pesapal did not return an IPN notification ID.');
console.log(`Pesapal ${environment} IPN registered successfully.`);
console.log(`PESAPAL_NOTIFICATION_ID=${registration.ipn_id}`);
console.log('Copy that notification ID into the matching Vercel environment. The secret URL and credentials were not printed.');

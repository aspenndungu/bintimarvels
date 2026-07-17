# Binti Marvels / Mrembo website

Next.js 16 website for Binti Marvels. The public identity is Binti Marvels; Mrembo is the current period-care product. Binti Charity leads with approved school pad support, while Binti Circles remains the community arm.

## Current safety state

The code is production-built but payment is intentionally fail-closed until the deployment is configured:

- `COMMERCE_ENABLED=false` by default.
- `SCHOOL_SUPPORT_ENABLED=false` by default.
- The public catalogue and price values still require final stock/price approval before live commerce.
- Inventory starts empty until approved quantities are loaded.
- Pesapal, PostgreSQL, Maps and finance-webhook credentials are never committed.
- The charity page can display the school-support form while its Pesapal submission button stays disabled.

## Local verification

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright install chromium
npm run test:e2e
```

## Main routes

- `/` — Binti-first homepage
- `/our-story` — current leadership: Lorna Joyce and Barnabas “Banns” Njiru
- `/shop` — Mrembo regular product plus clearly labelled range-format availability
- `/binti-charity` — school-led impact and school-support payment form
- `/binti-charity#donate` — donate-to-schools entry point
- `/binti-circles`
- `/contact`
- `/checkout`
- `/payment-status` — safe Pesapal return state

Legacy `/about`, `/impact` and `/stockists` redirect to the new journeys.

## Pesapal API 3.0 architecture

1. Browser submits product IDs/quantities and delivery details, or a school-support contribution.
2. Server validates the request and recalculates all payable values. Retail checkout also reserves approved inventory in PostgreSQL.
3. Server authenticates to Pesapal API 3.0 and submits one idempotent merchant reference.
4. Browser receives only an allowlisted Pesapal HTTPS redirect and enters payment details on Pesapal.
5. Pesapal sends an IPN to the secret path and returns the browser through the public callback.
6. The server does not trust callback query parameters as proof of payment. It calls Pesapal `GetTransactionStatus` and verifies merchant reference, exact KES amount, currency, provider tracking ID and status.
7. Only a verified `COMPLETED` status can mark an active order paid. A late completion after inventory release becomes `payment_review`, never automatic fulfilment.
8. A verified school-support completion creates one durable finance handoff for internal review.
9. Provider events are replay-safe and stored without credentials or full card/PIN information.

Database migrations, in order:

- `migrations/001_website_commerce.sql`
- `migrations/002_map_delivery_upgrade.sql`
- `migrations/003_pesapal_and_school_support.sql`

## Pesapal setup

Use only server-side Vercel environment variables documented in `.env.example`; never use `NEXT_PUBLIC_` for payment values.

1. Obtain the Pesapal API 3.0 consumer key and consumer secret for the correct environment.
2. Set a random `PESAPAL_IPN_TOKEN` and construct `PESAPAL_IPN_URL` as `https://<site>/api/pesapal/ipn/<same-token>`.
3. Set `PESAPAL_CALLBACK_URL=https://<site>/api/pesapal/callback`.
4. Set `PESAPAL_CANCELLATION_URL=https://<site>/payment-status?cancelled=1`.
5. With `PESAPAL_ENV=sandbox`, register the IPN:

   ```bash
   npm run pesapal:register-ipn
   ```

6. Copy only the returned UUID into `PESAPAL_NOTIFICATION_ID` for that same environment.
7. Apply all database migrations and load approved inventory.
8. Test product payment, school-support payment, cancellation, replayed IPN, wrong amount/currency, failed payment and a deliberately late callback.
9. Re-register the production IPN with the production URL and production Pesapal credentials. Sandbox notification IDs are not interchangeable with production IDs.
10. Complete one low-value production payment and reconcile it against Pesapal and Binti finance records before enabling the gates.

Required activation gates:

- Retail: `COMMERCE_ENABLED=true`, `CATALOG_APPROVED=true`, `PRODUCTION_PAYMENT_GATE_APPROVED=true`, `PESAPAL_ENV=production`.
- School support: `SCHOOL_SUPPORT_ENABLED=true`, `SCHOOL_SUPPORT_FINANCE_APPROVED=true`, `PRODUCTION_PAYMENT_GATE_APPROVED=true`, `PESAPAL_ENV=production`.

Production code refuses a sandbox Pesapal configuration. Missing or malformed settings return an honest unavailable state; no simulated payment success is possible.

## Remaining owner approvals before live money

Lorna/Binti must approve or provide:

- final Mrembo catalogue, pack formats, prices, stock and delivery tariff;
- the Pesapal production merchant credentials and registered IPN notification ID;
- approved PostgreSQL/Vercel database and applied migrations;
- internal accounting treatment for school-support payments;
- n8n finance intake URL/secret and team alert destination;
- explicit model/guardian consent and continued public-use approval before replacing the deployed anonymised school-outreach derivative with identifiable photography;
- one end-to-end production payment and reconciliation sign-off.

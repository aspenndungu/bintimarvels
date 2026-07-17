# Production readiness — Binti Marvels website

Assessment date: 17 July 2026

## Verdict

**READY FOR THE REQUESTED MAIN-BRANCH TEST DEPLOYMENT WITH LIVE MONEY DISABLED.**

**NOT READY TO ACCEPT LIVE PESAPAL PAYMENTS.** Retail and school-support payments remain fail-closed until Binti’s merchant, finance, database, inventory and reconciliation approvals are configured.

## Current public decisions

- Binti Marvels is the primary identity; Mrembo is its current period-care product.
- Schools lead the Binti Charity story.
- The charity page contains a school-support contribution form and Pesapal CTA, but submission stays disabled until all payment and finance gates pass.
- Current leadership shows only Lorna Joyce and Barnabas “Banns” Njiru.
- Regular pads are the currently photographed format. Ultra Long pads and panty liners are shown as “Ask availability,” not purchasable stock.
- School-support payments are not represented as tax-deductible.

## Verified controls

- Server-authoritative catalogue, delivery fee and totals.
- Separate retail, catalogue, production-payment, school-support and school-finance activation gates.
- PostgreSQL inventory reservation and idempotent order ledger.
- Pesapal API 3.0 redirect allowlisting and clean HTTPS callback/cancellation URLs.
- Protected IPN path plus server-side transaction-status verification.
- Exact provider tracking ID, merchant reference, KES currency and amount matching.
- Replay-safe provider events and conservative late-payment review.
- Signed, idempotent finance handoffs with an HTTPS host allowlist and atomic claims.
- Separate durable school-support payment and finance records.
- Existing finance and Dispatch remain the staff operational system.
- School-image source and continued-use boundary recorded in the image-source register.
- Responsive desktop/mobile visual QA of the Binti wordmark, school images, leadership portraits and product-format cards.

## Automated verification

- TypeScript: passed.
- ESLint: passed.
- Unit tests: 40 passed.
- PostgreSQL 16 integration tests: 12 passed after applying migrations 001, 002 and 003 to a disposable database; migration 003 was reapplied successfully and preserved a seeded legacy M-Pesa provider/receipt mapping.
- Next.js production build: passed.
- Playwright: 17 desktop/mobile journeys passed; one intentional desktop skip for the mobile-menu-only test.
- Final changed-file secret scan: no credential-like values found.

## Live-payment blockers

1. Pesapal production merchant credentials and a registered production IPN notification ID.
2. A strong private IPN token and matching registered HTTPS URL.
3. Production PostgreSQL ownership, all migrations, backup and restore policy.
4. Approved inventory, product prices and delivery tariff.
5. Finance receiver URL, exact host allowlist, HMAC secret and accepted-response contract.
6. Explicit school-support accounting approval.
7. Approved alert channel, recipients and exception owner.
8. Returns, refunds, reversals and privacy-retention approval.
9. If an identifiable school photograph is ever substituted for the deployed anonymised derivative, confirm and record the school/guardian media-consent basis first.
10. One low-value end-to-end Pesapal transaction reconciled without duplicate finance or inventory effects.

## Safe test-deployment rule

Keep these values false in the current Vercel test deployment:

- `COMMERCE_ENABLED=false`
- `CATALOG_APPROVED=false`
- `PRODUCTION_PAYMENT_GATE_APPROVED=false`
- `SCHOOL_SUPPORT_ENABLED=false`
- `SCHOOL_SUPPORT_FINANCE_APPROVED=false`

Live payment may be enabled only after the matching production configuration and reconciliation evidence exist.

# Binti/Mrembo website review record

Date: 15 July 2026
Branch: `feat/direct-mpesa-site-rebuild`

## Pass 1 — full site, copy and evidence

Reviewed the customer routes on desktop and mobile, including Home, Shop, Our Story, Binti Charity, Binti Circles, Contact, Delivery, Checkout and policy pages.

Repairs included:

- Removed customer-facing private-company/NGO/internal-audit framing.
- Replaced warehouse/pickup and browser-calculation language with destination delivery.
- Corrected founder/product and Menstrual Health Day crops.
- Removed payment details from the historical event artwork.
- Prevented the floating WhatsApp control from covering checkout, contact and policy content.
- Corrected unsupported leadership wording.

## Pass 2 — responsive composition and commerce truthfulness

Reviewed complete desktop/mobile contact sheets plus full Shop and quoted Checkout captures.

Repairs included:

- Added explicit map-pin confirmation and required landmark guidance.
- Removed road distance, duration, rate bands and tariff details from customer screens and quote responses.
- Simplified Delivery to destination → delivery price → confirm and pay.
- Rejected a generated product scene because it altered visible pack details.
- Rejected a generated-background/product composite because the opaque pack photo made the layering look artificial.
- Kept the exact first-party Mrembo product photograph as the public product hero.
- Hid the floating WhatsApp control on the Delivery pricing journey.

## Pass 3 — final production-build workflow review

Final automated route matrix:

- 12 public routes × desktop, 390 px mobile and 320 px narrow mobile = 36 checks.
- Broken images: 0.
- Horizontal overflow: 0.
- Browser console errors: 0.
- Page exceptions: 0.
- Same-origin HTTP errors: 0.
- Prohibited public compliance/pickup copy: 0.
- Customer-visible road-distance/tariff copy: 0.

Final commerce browser suite:

- Playwright: 13 passed, 1 intentional project-specific skip.
- Address suggestion and selection: passed.
- Exact map pin and landmark: passed.
- Delivery price and total: passed.
- Mobile menu/focus behavior: passed.
- Binti Charity redirects and content: passed.

Final deterministic checks:

- ESLint: passed.
- TypeScript: passed.
- Unit/API tests: 40 passed.
- Production build: passed.
- PostgreSQL legacy upgrade: passed; one historical zone-based order was preserved.
- PostgreSQL integration tests: 8 passed.
- Secret/payment-number scans: no matches.

## Independent adversarial review and remediation

The independent review identified three release-blocking risks. Each was repaired and retested:

- live Google Places and Routes endpoints now fail closed without the PostgreSQL rate-limit backend and rate-limit secret;
- unapproved planning rates are no longer returned as customer delivery prices;
- a gated M-Pesa customer form now calls the existing secure checkout endpoint when all payment controls are enabled and preserves its idempotency key after an uncertain request.

The temporary human-review deployment keeps online payment and unapproved numeric delivery rates disabled.

## Human-review boundaries

The review URL is temporary and does not replace production. Commerce and live M-Pesa remain disabled. The human review should focus on brand voice, imagery, mobile comfort, navigation and the delivery journey. Production launch still needs an approved exact fulfilment origin, approved delivery prices, production Maps controls and approved Daraja/Finance receiver configuration.

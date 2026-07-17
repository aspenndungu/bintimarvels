# Binti Charity, Story and Map Delivery Upgrade Implementation Plan

> **For Hermes:** Execute this plan task-by-task, then run the three visual/copy/function review rounds defined at the end.

**Goal:** Turn the current preview into a customer-ready Mrembo storefront with an evidence-backed Binti story, a complete Binti Charity archive, real leadership/project imagery and secure map-powered delivery pricing.

**Architecture:** Keep the current Next.js App Router storefront and premium visual system. Move reusable public facts into a typed content module, build a small set of reusable editorial components and make `/binti-charity` canonical. Keep the Google key and warehouse origin server-side: same-origin endpoints proxy Places, Place Details, reverse geocoding and Routes; a keyless Leaflet map provides pin selection in the browser. Distance, fee and order totals remain server-authoritative.

**Tech stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Zod, PostgreSQL, Vitest, Playwright, Google Places/Geocoding/Routes APIs, Leaflet with OpenStreetMap tiles.

**Evidence inputs:**

- `docs/research/2026-07-14-binti-mrembo-public-evidence.md`
- `docs/research/2026-07-15-current-site-audit.md`
- Business Daily’s 11 March 2026 Binti-to-Mrembo profile
- first-party Binti/Mrembo/Lorna posts and legacy Binti WordPress media
- independently corroborated Purple Dot and Langata event posts

---

## Public claims boundary

Allowed in this pass:

- Mrembo is made in Kenya through local contract manufacturing.
- Mrembo is the current product from Binti Marvels; Binti is the origin/company/mission and Mrembo carries the product story forward.
- Each Mrembo pack shown contains 8 regular pads and the package states unscented, cotton-feel, soft and comfortable.
- Dated, source-linked event/partner claims in the source register.
- Selected shops/minimarts in Nairobi, Embu, Nakuru and Kajiado, with stock confirmed on WhatsApp.

Not allowed:

- public donation checkout, donation receipts or bank/Till/Paybill/account details;
- Binti described as an NGO;
- undated “trusted by” or ongoing-endorsement language for a one-time project;
- cumulative impact totals until a dated claims register exists;
- medical, absorbency, certification, rash/leak prevention or environmental claims not supported by approved product records;
- implying Binti owns the contract-manufacturing factory or a dedicated production line;
- identifiable minors or vulnerable participants used as decorative trust imagery without release evidence;
- public dummy rider phone numbers.

---

### Task 1: Curate and optimise approved public media

**Objective:** Produce a small, truthful and performant visual library from company-owned/public first-party sources.

**Files:**

- Create: `public/story/lorna-joyce.jpg`
- Create: `public/story/beth-karagu.jpg`
- Create: `public/story/barnabas-njiru.jpg`
- Create: `public/story/binti-founders-legacy.jpg`
- Create: `public/story/made-in-kenya.jpg`
- Create: `public/story/founder-delivery.jpg`
- Create: `public/impact/dairyland-mizizi.jpg`
- Create: `public/impact/menstrual-health-day-2026.jpg`
- Create: `public/impact/charity-golf-team.jpg`
- Create: `public/impact/charity-golf-course.jpg`
- Create: `public/impact/charity-golf-branding.jpg`
- Create: `public/press/how-is-business-youtube.jpg`
- Create: `docs/image-source-register.md`

**Steps:**

1. Copy only the strongest original-resolution leadership images and first-party current Mrembo thumbnails selected in the visual audit.
2. Use Sharp to remove metadata, convert large photographs to WebP/JPEG, preserve natural faces, and create responsive crops without AI alteration.
3. Use a carefully cropped Menstrual Hygiene Day event poster instead of identifiable prison-participant photography. The crop must remove the historical contribution/payment instructions and any payment number visible at the bottom of the source poster.
4. Do not publish the undated Machakos legacy project or school/minor galleries in this pass. Keep the files only in the internal source review until dates and image permissions are confirmed.
5. Select `Binti-4-scaled.jpg`, `Binti-24-scaled.jpg`, `Binti-35-scaled.jpg` and one panoramic tee image from the golf originals; remove duplicates.
6. Record source URL, original filename, context, date and rights note in `docs/image-source-register.md`.
7. Verify every output with `vision_analyze` and image metadata; reject stretched, blurry or misleading crops.

**Expected verification:** every image has a documented source, sensible crop, no embedded bank/payment details, no unsupported text and no unapproved minors.

### Task 2: Centralise evidence-backed site content

**Objective:** Keep copy, partner records, leadership, press and social links consistent across pages.

**Files:**

- Create: `src/content/site-content.ts`
- Create: `src/content/site-content.test.ts`

**Steps:**

1. Write tests asserting that every partner/project has a date/context/source URL, every team member has a role and image, and prohibited payment/donation strings are absent.
2. Add typed constants for:
   - Binti-to-Mrembo timeline;
   - Mrembo package-backed features;
   - leadership;
   - Binti Charity projects;
   - 2024 golf supporters tied only to that event;
   - press/video links;
   - Binti and Mrembo social channels;
   - current distribution regions.
3. Keep copy short, human and customer-facing; no internal evidence commentary in rendered fields.
4. Run `npm run test -- src/content/site-content.test.ts` and expect a pass.

### Task 3: Build reusable editorial components

**Objective:** Add richer sections without copying large class strings and layouts between pages.

**Files:**

- Create: `src/components/PageHero.tsx`
- Create: `src/components/SectionHeading.tsx`
- Create: `src/components/ProofStrip.tsx`
- Create: `src/components/StoryCard.tsx`
- Create: `src/components/PressGrid.tsx`
- Create: `src/components/VideoStory.tsx`
- Create: `src/components/SocialLinks.tsx`
- Modify: `src/app/globals.css`

**Steps:**

1. Implement semantic, responsive components with heading-level props and no hidden hard-coded copy.
2. Make `PageHero` support editorial split, image-overlay and simple legal variants.
3. Make `VideoStory` click-to-play using `youtube-nocookie.com`; load no YouTube iframe before consentful interaction.
4. Add restrained paper texture, image framing, section rhythm and mobile safe-area spacing.
5. Respect reduced motion; no autoplay video, carousel or scroll hijacking.
6. Verify components with the production build and Playwright screenshots rather than snapshot-testing Tailwind strings.

### Task 4: Rebuild the home page around product, place and proof

**Objective:** Make a first-time visitor understand Mrembo, Made in Kenya, Binti and the buying path within one screen and one scroll.

**Files:**

- Rewrite: `src/components/HomePage.tsx`
- Modify: `src/components/StoryTimeline.tsx`

**Section order:**

1. Hero: “Made here. Made for her.”; `Shop Mrembo` and `Meet Binti` actions.
2. Proof strip: Made in Kenya; 8 unscented regular pads per pack; Binti delivery; WhatsApp support.
3. Binti → Mrembo: one clear paragraph and dated timeline.
4. Product bundles with package-backed feature row.
5. Founder/local-production story with real imagery.
6. Binti Charity current proof: Dairyland/Mizizi and 2026 Menstrual Health Day.
7. Dated 2024 event-supporter strip, labelled as one specific event.
8. Press/video story.
9. Binti Circles and Binti Charity entry cards.
10. Final shop/WhatsApp CTA.

**Steps:**

1. Remove all prototype/approval/records/Daraja language.
2. Keep claims within the public boundary.
3. Keep mobile text blocks under roughly 80 words and provide a CTA after each major intent shift.
4. Update Playwright home assertions.

### Task 5: Make the shop customer-ready

**Objective:** Replace internal catalogue commentary with a persuasive, truthful Mrembo buying page.

**Files:**

- Rewrite: `src/app/shop/page.tsx`
- Modify: `src/components/ProductGrid.tsx`
- Modify: `src/lib/catalog.ts`

**Steps:**

1. Remove “catalogue preview”, evidence notes and “individual pack image shown” from body copy.
2. Keep each bundle label explicit: pack count, total pads, full bundle price.
3. Use one truthful pack image with a clean visual quantity token rather than generated bundle collages.
4. Add package-backed feature row: 8 regular pads per pack, unscented, cotton-feel, soft and comfortable.
5. Add `Estimate my delivery` and `Find a nearby stockist` paths; stockist confirmation remains on WhatsApp.
6. Keep Direct M-Pesa “coming soon” as one concise notice, not a technical explanation.
7. Update product and e2e tests.

### Task 6: Replace Partnerships with canonical Binti Charity

**Objective:** Publish a compelling, evidence-backed charity/project archive without turning Binti into a donation platform.

**Files:**

- Create: `src/app/binti-charity/page.tsx`
- Rewrite: `src/app/partnerships/page.tsx` as a permanent redirect
- Modify: `src/components/Header.tsx`
- Modify: `src/components/MobileNav.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/HomePage.tsx`
- Modify: `src/components/ContactForm.tsx`
- Modify: `src/app/sitemap.ts` if present; otherwise create it

**Section order:**

1. Real-image hero and “Binti Charity” identity.
2. Short explanation: organisations and individuals can fund Mrembo product supply; Binti coordinates product and delivery. No process diagram.
3. Current 2026 evidence cards: Dairyland/Mizizi; Menstrual Health Day at Langata Women’s Prison.
4. Historical project timeline: Purple Dot; Medics for Kenya; Rhino Charge/Dada Mwenzangu; other dated verified entries. Hold the undated Machakos legacy archive until its date and image-use scope are confirmed.
5. 2024 Binti Charity Golf feature with curated adult/event gallery and dated supporter list.
6. Linked source/press cards.
7. CTA: `Start a Binti Charity conversation`.
8. Small legal clarification that Binti is a private company and website enquiries lead to commercial product-supply quotations; no public donation collection.

**Steps:**

1. Write e2e assertions for the canonical page and `/partnerships` redirect.
2. Ensure every name is tied to its dated project, not presented as an evergreen endorsement.
3. Scan rendered copy for `account number`, `Paybill`, `Till`, `donate now` and `donation receipt`.
4. Verify project imagery against the source register.

### Task 7: Expand the Binti-to-Mrembo story and leadership

**Objective:** Tell the full company transition and show all publicly documented leaders.

**Files:**

- Rewrite: `src/app/our-story/page.tsx`

**Section order:**

1. Hero: “Binti built the mission. Mrembo is the next chapter.”
2. 2020–2026 timeline: aviation exit, company formation, Binti launch, 2025 pause, 2026 locally produced Mrembo.
3. “What changed / what stayed” comparison.
4. Local contract-manufacturing section—clear that Binti does not claim a company-owned factory.
5. Leadership grid: Lorna Joyce, Beth Karagu and Barnabas Njiru; title uncertainty resolved conservatively.
6. 2026 founder interview poster and privacy-enhanced player.
7. Earned-media grid.
8. Shop/Charity CTAs.

**Steps:**

1. Caption all old Binti product imagery as archival.
2. Do not include investment amounts, personal stress/health or private financial details from press unless essential; they are not needed to sell Mrembo.
3. Add metadata and structured article/organization links where accurate.
4. Verify desktop and mobile portrait crops.

### Task 8: Strengthen Binti Circles and Contact

**Objective:** Remove generic emptiness and give each page a distinct, credible action.

**Files:**

- Rewrite: `src/app/binti-circles/page.tsx`
- Rewrite: `src/app/contact/page.tsx`
- Modify: `src/components/ContactForm.tsx`

**Steps:**

1. Describe Circles only through evidenced activities: conversation, community activations and menstrual-health learning; do not promise unsupported programmes.
2. Explain the distinction: Binti Circles is connection/community; Binti Charity is funded product supply and project delivery.
3. Add current social links and one recent event card.
4. Add intent cards on Contact: order/stockist, Binti Charity, wholesale/retail, media and Binti Circles.
5. Keep WhatsApp primary and email secondary; do not promise a response time.
6. Replace every remaining Partnerships label with Binti Charity.

### Task 9: Add the server-side Google Maps adapter

**Objective:** Support address suggestions, place resolution, map-pin reverse geocoding and route distance without exposing the key.

**Files:**

- Create: `src/server/google-maps.ts`
- Create: `src/server/google-maps.test.ts`
- Modify: `.env.example`

**Environment variables:**

- `GOOGLE_MAPS_API_KEY`
- `WAREHOUSE_LAT`
- `WAREHOUSE_LNG`
- `GOOGLE_MAPS_PROJECT` (documentation only)

**Steps:**

1. Write failing tests with mocked `fetch` for Google Autocomplete, Google Place Details, Google Routes success, timeout, malformed responses and overlong input.
2. Implement server-only config validation; never export key/origin through a client module or API response.
3. Use Places Autocomplete (New) with `includedRegionCodes: ['ke']`, a client session token and strict field masks.
4. Resolve selected place IDs server-side.
5. Keep Google address-search mode separate from map-pin mode: do not plot Google Places coordinates on a non-Google map.
6. Compute `TWO_WHEELER` route distance with `TRAFFIC_UNAWARE`; fall back to `DRIVE` only when the first mode is unsupported, not on arbitrary errors.
7. Add timeouts, no redirects, redacted errors and a small in-memory TTL cache keyed by rounded destination coordinates.
8. Add a deterministic test adapter that is available only under `NODE_ENV=test`; CI and e2e must never require or call the live Google API.
9. Document that Google calls are billable against the configured project quota; debounce suggestions and route only on explicit selection/quote.
10. Resolve environment variables lazily inside server requests so keyless CI builds and static page rendering still work.
11. Run the focused tests.

### Task 10: Add protected location endpoints

**Objective:** Expose the minimum map operations needed by the browser.

**Files:**

- Create: `src/app/api/places/autocomplete/route.ts`
- Create: `src/app/api/places/details/route.ts`
- Create: `src/app/api/places/routes.test.ts`

**Steps:**

1. Write failing route tests for accepted origin, rejected origin, invalid body, rate limit, API unavailable and sanitized success.
2. Use POST, Zod validation, same-origin checks and existing DB-backed rate limits where a database is configured.
3. Google endpoints return only place ID, display text, formatted address and destination coordinates. Never return raw provider payloads or the warehouse origin.
4. Do not include personal place-query strings in application logs.
5. Run focused route tests.

### Task 11: Replace zone pricing with distance pricing

**Objective:** Remove pickup and calculate a transparent provisional delivery estimate from route distance.

**Files:**

- Rewrite relevant schemas/functions in: `src/lib/commerce.ts`
- Modify: `src/lib/commerce.test.ts`

**Provisional configurable distance bands:**

- 0–5 km: KSh 150
- over 5–10 km: KSh 250
- over 10–20 km: KSh 400
- over 20–40 km: KSh 600
- over 40–100 km: KSh 900
- over 100–250 km: KSh 1,500
- over 250–500 km: KSh 2,500
- over 500–1,000 km: KSh 5,000
- over 1,000 km or no route: manual Binti delivery quote; no pickup option

**Steps:**

1. Write boundary tests at every metre before/after each band and tests for invalid distance.
2. Add `deliveryLocationSchema` with place ID (optional for pin), formatted address, lat/lng and destination type (`doorstep` or `drop_off`).
3. Make quote schema require a resolved destination rather than a zone.
4. Return `feeKsh`, `distanceMeters`, `bandLabel` and `manualQuote`.
5. Keep fee bands in one readonly constant so Binti can replace them with the final rider/courier rate card.
6. Remove free-delivery thresholds and warehouse pickup.
7. Run focused commerce tests.

### Task 12: Build the accessible map/location picker

**Objective:** Let a customer search, select and adjust a delivery destination on mobile or desktop.

**Files:**

- Add dependencies: `leaflet`, `@types/leaflet`
- Create: `src/components/DeliveryLocationPicker.tsx`
- Modify: `src/app/layout.tsx` to import Leaflet CSS
- Modify: `next.config.ts` for narrowly scoped OpenStreetMap tile and privacy-enhanced YouTube CSP sources

**Steps:**

1. Add debounced autocomplete after three characters with an explicit loading state and keyboard-operable listbox.
2. Present two explicit methods: `Search an address` (Google Places, no embedded non-Google map) and `Choose on map` (Leaflet/OpenStreetMap only).
3. In address-search mode, generate and reuse a Google Places session token until a place is selected; show the resolved address and an external `Open in Google Maps` link.
4. In map mode, start from a public Nairobi overview or the browser's location only after explicit permission; let the customer click or drag a marker on Leaflet/OpenStreetMap and require a separate building/landmark text field. Exact pin coordinates, not reverse-geocoded provider text, are authoritative.
5. Never place Google-derived coordinates or formatted Places content on the OpenStreetMap canvas. Include provider attribution and expose no key or private warehouse origin.
6. Add destination type choice: doorstep or drop-off point.
7. Add graceful fallback: if map services fail, retain a manual address field and move the customer to WhatsApp without inventing a fee.
8. Clear stale distance quotes whenever the destination changes.
9. Verify keyboard navigation, touch target sizes, reduced motion and narrow-screen map height.
10. Confirm the CSP permits only the required OSM tile image host and `youtube-nocookie.com` frame host; do not broaden `connect-src`, `img-src` or `frame-src` unnecessarily.

### Task 13: Rebuild Checkout and Delivery around the map quote

**Objective:** Produce a customer-ready total with Binti delivery only.

**Files:**

- Rewrite: `src/app/checkout/page.tsx`
- Rewrite: `src/app/delivery/page.tsx`
- Modify: `src/app/api/checkout/quote/route.ts`
- Modify: `src/app/api/checkout/create/route.ts`

**Steps:**

1. Write failing e2e/API tests for autocomplete selection, map confirmation, distance quote, fee addition, address change invalidation, manual fallback and empty basket.
2. Quote endpoint resolves the place/pin and route server-side; ignore client-supplied distance or fee.
3. Show subtotal, route distance, delivery estimate and total in plain customer language.
4. Add a shareable destination link and place ID/coordinates to the WhatsApp message without exposing warehouse coordinates.
5. Keep Direct M-Pesa “coming soon” in one concise block; remove selected-Till/Daraja/architecture explanations.
6. Empty-basket state shows Mrembo recommendations and a shop CTA without a screen of blank space.
7. Delivery page explains Binti doorstep/drop-off delivery, how the map estimate works and what happens when a long-distance route needs manual confirmation.
8. No warehouse pickup appears anywhere.

### Task 14: Persist a dispatch-ready destination

**Objective:** Ensure a paid future order can enter finance and Dispatch with the exact customer-selected destination.

**Files:**

- Modify: `migrations/001_website_commerce.sql` (feature branch has not been deployed)
- Modify: `src/server/orders.ts`
- Modify: `src/server/orders.integration.test.ts`
- Modify: `src/server/finance-handoff.ts`
- Modify: `docs/finance-handoff-contract.md`

**Schema additions:**

- `delivery_place_id text`
- `delivery_latitude numeric(9,6)`
- `delivery_longitude numeric(9,6)`
- `delivery_distance_m integer`
- `delivery_duration_s integer`
- `delivery_destination_type text CHECK (...)`
- `delivery_band text`

Replace the zone check with `binti_delivery`; preserve the public formatted address and customer county where available.

**Steps:**

1. Write integration tests proving client-supplied fee/distance cannot override the server route result.
2. Recompute route and fee during order creation; do not trust the earlier preview quote.
3. Persist resolved destination and server route facts atomically with the order.
4. Add destination fields to the signed finance/Dispatch payload.
5. Set `delivery_mode: 'BINTI DELIVERY'`; do not assign a rider in the website.
6. Keep rider assignment downstream in Dispatch; document five configurable real rider slots, not fake numbers.
7. Run fresh PostgreSQL migration/integration tests.

### Task 15: Rewrite customer-facing policy and metadata pages

**Objective:** Remove draft/technical copy and align policies with location-aware delivery.

**Files:**

- Rewrite: `src/app/privacy/page.tsx`
- Rewrite: `src/app/terms/page.tsx`
- Rewrite: `src/app/returns/page.tsx`
- Rewrite: `src/app/consent/page.tsx`
- Rewrite: `src/app/data-request/page.tsx`
- Modify: `src/app/layout.tsx`
- Create or modify: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Steps:**

1. Remove every “pre-launch draft” label.
2. Add effective date and location-data/map-provider disclosure without inventing fixed retention periods.
3. Explain order confirmation, Binti delivery, M-Pesa verification, hygiene return limits, contact and rights in customer language.
4. Fix the malformed phone link.
5. Remove stale structured address if its current legal/operating status is not confirmed; keep only approved organization basics.
6. Add canonical metadata for `/binti-charity`; keep `/partnerships` redirected and out of sitemap.
7. Add source-appropriate Open Graph images.

### Task 16: Navigation, mobile and accessibility polish

**Objective:** Make all journeys easy to find and prevent mobile overlays from covering controls.

**Files:**

- Modify: `src/components/Header.tsx`
- Modify: `src/components/MobileNav.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/components/WhatsAppFAB.tsx`
- Modify: `src/app/globals.css`

**Steps:**

1. Rename Partnerships to Binti Charity everywhere.
2. Add social links to the footer and surface Made in Kenya without overcrowding primary navigation.
3. Hide or reposition the floating WhatsApp action while a form/map suggestion list/dialog is active; respect safe-area insets.
4. Keep a single visible H1 per page, logical heading order, descriptive image alternatives and 44px touch targets.
5. Test menu/dialog focus trap, Escape close, opener restoration and background inertness.
6. Check 320px, 390px, 768px, 1024px and 1440px widths for horizontal overflow.

### Task 17: Deterministic verification before visual reviews

**Objective:** Catch functional regressions before spending time on visual polish.

**Commands:**

1. `npm run lint`
2. `npm run typecheck`
3. `npm run test`
4. fresh PostgreSQL 16 container → apply migration → run all integration tests
5. `npm run build`
6. `npm run test:e2e`
7. `npm audit --omit=dev --audit-level=moderate`
8. `git diff --check`
9. repository secret scan for tokens/keys/account credentials
10. rendered-copy scan for internal phrases, donation payment instructions, pickup and stale Partnerships labels

**Expected:** all commands pass; Google key absent from client bundles and repository; database-dependent tests pass against a disposable PostgreSQL container.

### Task 18: Three review-and-repair rounds

**Objective:** Meet the owner’s requirement for three complete reviews after execution.

#### Review round 1 — story, claims and conversion

1. Capture full-page desktop and iPhone screenshots of every public route.
2. Directly inspect each screenshot and image with `vision_analyze`.
3. Read rendered text route by route.
4. Check Binti/Mrembo clarity, Made in Kenya prominence, partner dating, CTA strength and absence of internal copy.
5. Repair every finding; rerun affected tests and recapture screenshots.

#### Review round 2 — responsive UI, accessibility and map journey

1. Exercise navigation, basket, autocomplete keyboard/touch use, map click/drag, quote invalidation, long-distance manual quote and WhatsApp continuation.
2. Inspect 320px/390px/768px/1440px screenshots for empty space, awkward crops, orphans, overlay collisions and excessive page length.
3. Run accessibility checks for heading order, labels, contrast, focus and reduced motion.
4. Repair findings; rerun affected tests and recapture screenshots.

#### Review round 3 — adversarial customer/operations launch review

1. New customer: understand product, bundle, delivery fee, Binti/Mrembo and payment state without insider knowledge.
2. Binti legacy customer: understand the transition and find the historical story.
3. CSR/charity visitor: see dated proof and contact Binti without being asked to donate publicly.
4. Operations: receive exact location, distance, destination type and dispatch-ready link without fake rider assignment.
5. Security/privacy: no secret, bank details, dummy number, client-authoritative fee or vulnerable-person misuse.
6. Repair every finding and run the full verification suite one final time.

### Task 19: Clean, commit, push and refresh the review URL

**Objective:** Deliver a verified branch and current public preview without touching production.

**Steps:**

1. Remove transient screenshots, raw duplicate downloads and temporary API artifacts; retain only curated public media and evidence/source registers.
2. Run `git status`, inspect the full diff, and apply KISS/DRY cleanup.
3. Confirm no real key, exact private warehouse coordinates, customer address, phone, bank account or token is tracked.
4. Commit on `feat/direct-mpesa-site-rebuild`; do not merge `main`.
5. Push the branch and verify GitHub Actions.
6. Start the built preview with the Google key and warehouse origin injected from secure server files/environment.
7. Allowlist the new tunnel origin and verify public map/quote requests.
8. Provide route links and a clear statement that M-Pesa remains disabled and the tunnel is temporary.

---

## Plan review pass 1 — evidence, safety and platform terms

Review method: adversarial claims/compliance pass against the source register, private-company rule, vulnerable-person image boundary, credential rules and map-provider constraints.

Findings resolved before implementation:

1. **Removed the undated Machakos legacy project from public scope.** It remains internal until date/context and image permissions are confirmed.
2. **Blocked payment instructions embedded in event artwork.** The 2026 Menstrual Hygiene Day poster may only be used after a verified crop removes its historical contribution/payment number and payment instructions.
3. **Separated Google Places from the non-Google map.** Google address-search mode will not plot Places content on OpenStreetMap. Map-pin mode uses Leaflet/OpenStreetMap with a customer-supplied building/landmark and exact pin coordinates; Google remains the server-side route-distance authority.
4. **Kept vulnerable participants out of the default visual set.** The plan uses an event poster rather than identifiable incarcerated participants and excludes school/minor galleries.
5. **Kept partner claims dated and project-specific.** No “trusted by” blanket endorsement or unverified ongoing relationship.
6. **Kept Binti Charity commercial and private-company-safe.** No bank details, public donations, donation receipts or NGO positioning.
7. **Kept rider assignment out of the website.** Exact destination data flows to Dispatch; no dummy phone number is public.

Result: pass after the amendments above.

## Plan review pass 2 — architecture, UX and operability

Review method: route-by-route implementation-readiness pass covering CI without credentials, mobile interaction, provider failure, CSP, server authority, Dispatch handoff and unnecessary complexity.

Findings resolved before implementation:

1. **Removed Nominatim and the reverse-geocoding endpoint.** A map pin already gives the exact destination needed for routing; a required customer landmark is clearer and more reliable than adding another production dependency.
2. **Added credential-free testing.** Google adapters will be mocked and a test-only deterministic provider will drive Playwright; CI will not call billable APIs or need a secret.
3. **Made environment access lazy.** Static pages and builds remain functional when map credentials are absent; only map requests return a customer-safe fallback.
4. **Added CSP work explicitly.** OpenStreetMap tiles and the privacy-enhanced YouTube player receive narrow allowlists instead of a broad policy exception.
5. **Prevented warehouse-origin disclosure.** The map begins at a public Nairobi overview or the user’s explicitly permitted browser location; the private dispatch origin is server-only.
6. **Kept quote authority on the server.** Client distance/fee values are ignored; order creation recomputes the route before persistence.
7. **Kept failure usable.** Missing maps, denied geolocation, unavailable routes and over-1,000 km destinations continue through a manual Binti delivery quote—never pickup and never an invented fee.
8. **Made mobile review concrete.** The plan includes keyboard listbox behaviour, 44px targets, quote invalidation, safe-area spacing and five required breakpoints.
9. **Avoided operational duplication.** Website stores a dispatch-ready destination but assigns no rider; existing Dispatch remains the assignment system.

Result: pass. The plan is implementation-ready.

## Completion criteria

- Binti Charity replaces Partnerships everywhere and has dated, linked project proof.
- The Binti-to-Mrembo transition, current leadership and Made in Kenya story are clear.
- Public copy contains no internal implementation commentary.
- Every principal page has real imagery, sufficient narrative and a clear next action without filler.
- Delivery is Binti-handled only; no warehouse pickup.
- Customer can search a Kenyan address, choose/adjust a pin, receive a server-computed route distance and delivery estimate, and continue on WhatsApp.
- Google key and warehouse origin remain server-side.
- Future order/finance/Dispatch payload contains exact destination facts; rider assignment stays in Dispatch.
- No fake rider numbers, bank details, donation checkout, unverified impact totals or unsupported product claims.
- Three documented visual/copy/function reviews are completed with repairs.
- Local verification and remote CI pass before the updated preview is shared.

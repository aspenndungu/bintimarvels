# Map delivery operations

## Public journey

- A customer may select a Google address suggestion or choose an exact pin on OpenStreetMap.
- Google Places content is not plotted onto the OpenStreetMap canvas. The two selection modes remain separate.
- The browser sends a place ID or destination coordinates. It never sends an authoritative distance or fee.
- The server resolves Google place IDs, calculates a Google Routes road distance from the private fulfilment origin, selects the configured distance band and returns an estimate.
- Binti delivers to the selected customer address or agreed drop-off point. Warehouse collection is not offered.

## Server-only configuration

- `GOOGLE_MAPS_API_KEY`
- `WAREHOUSE_LAT`
- `WAREHOUSE_LNG`
- `DELIVERY_RATE_CARD_APPROVED`

Never place the key or exact fulfilment coordinates in a `NEXT_PUBLIC_*` variable, customer response, source map, browser log or analytics event. Restrict the production key by the controls available for the hosting platform and enable only Places API (New) and Routes API.

Google Places and Routes requests are billable and quota-controlled. Every live Maps endpoint requires the PostgreSQL rate-limit backend and `RATE_LIMIT_SECRET`; requests fail closed when either is unavailable. Only non-production `MAPS_TEST_MODE` bypasses the billable provider for deterministic tests. The UI waits 450 ms after at least three characters, returns no more than five suggestions, uses an autocomplete session token and requests only the fields needed. A route request happens only after the customer explicitly checks delivery.

OpenStreetMap tiles are used with visible attribution and no bulk downloading. Reassess the public tile service before high-volume production traffic.

## Pricing status

`src/lib/commerce.ts` contains versioned planning bands from 0–1,000 km. No approved historical rider-rate matrix was found in the finance or dispatch records. Keep `DELIVERY_RATE_CARD_APPROVED=false` until Lorna approves the production values. While false, the API suppresses the numeric delivery fee and checkout sends the customer to Binti for confirmation before payment.

Production automated payment additionally fails closed unless the delivery rate card is approved. Destinations over 1,000 km or without a usable route require a manual quote.

## Dispatch evidence

A paid-order handoff includes:

- destination source and Google place ID when applicable;
- formatted address and landmark;
- doorstep/drop-off type;
- destination coordinates;
- Google road distance and duration;
- route travel mode;
- tariff version and delivery fee;
- a destination map link.

Rider assignment remains inside the existing Dispatch workflow. The website does not expose rider phone numbers or maintain a second rider dashboard.

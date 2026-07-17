# Website → Finance/Dispatch handoff contract

The existing finance dashboard remains the only staff operational interface. The website ledger exists for payment integrity, idempotency and retry; it does not become a second dispatch dashboard.

## Transport and trust

- HTTPS `POST` to `FINANCE_WEBHOOK_URL`.
- The destination host must appear exactly in `FINANCE_WEBHOOK_ALLOWED_HOSTS`; redirects and credential-bearing URLs are rejected.
- `Content-Type: application/json`.
- `Idempotency-Key`: event-specific key (`<event>:<website_order_id>` or `<event>:school-support:<support_id>`)
- `X-Binti-Signature: sha256=<HMAC-SHA256(raw body, FINANCE_WEBHOOK_SECRET)>`.
- The receiver verifies the raw-body signature before parsing and upserts by the idempotency key.

## Retail order event — version 3

A verified retail payment sends `website.order.paid`. The payload includes:

- `trade_channel: ONLINE TRADE`, `source: website`, `sale_made: true`;
- immutable website order ID and opaque public reference;
- customer contact and approved delivery evidence;
- server-owned items, subtotal, delivery fee and total;
- verified Pesapal provider, payment method, confirmation code and masked account;
- consent, creation and paid timestamps.

`create_dispatch` is true only when the order is ordinarily dispatchable and its status is `paid`. A late, conflicting or otherwise exceptional completion uses `website.order.payment_review`, `create_dispatch: false` and `requires_review: true`.

## School-support event — version 1

A verified school-support payment sends `website.school_support.completed` with:

- `trade_channel: CHARITY`, `source: website`, `sale_made: true`;
- `create_dispatch: false` and `requires_review: true`;
- immutable support ID, opaque public reference and `school_pad_support` project code;
- amount, supporter contact and optional message;
- verified Pesapal provider fields;
- creation and completion timestamps.

Finance records the money-in and the team allocates product/delivery to an approved school project through the existing charity workflow. The website does not create an automatic beneficiary dispatch.

## Receiver requirements

1. Verify the HMAC and reject an invalid schema.
2. Upsert retail records by website order ID and school-support records by support ID.
3. Preserve Pesapal confirmation, amount and completion time for reconciliation.
4. Create or update one canonical Dispatch record only when `create_dispatch` is true.
5. Keep customer phone, address and coordinates out of broad logs and non-operational alerts.
6. Respond `2xx` only after the durable upsert succeeds. Optional response: `{ "record_id": "..." }`.
7. Retry alerts independently; an alert may not undo or duplicate a finance record.

The website queues failed handoffs. `/api/internal/retry-handoffs` reconciles known Pesapal transactions, releases expired unpaid inventory reservations and retries retail and school-support finance handoffs under `CRON_SECRET` or `INTERNAL_JOB_SECRET`.

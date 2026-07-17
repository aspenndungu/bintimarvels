-- Replace the unlaunched direct-M-Pesa adapter with Pesapal API 3.0 while preserving
-- existing order, inventory and finance-handoff records.
ALTER TABLE website_orders DROP CONSTRAINT IF EXISTS website_orders_status_check;
ALTER TABLE website_orders ADD CONSTRAINT website_orders_status_check CHECK (status IN (
  'pending_payment','payment_redirect_ready','payment_request_unknown','paid','late_payment_review',
  'payment_failed','payment_cancelled','payment_timed_out','payment_review','refund_or_reversal_review',
  'stk_requested','stk_request_unknown'
));

ALTER TABLE website_payments ADD COLUMN IF NOT EXISTS provider text;
UPDATE website_payments SET provider = 'mpesa'
  WHERE checkout_request_id IS NOT NULL OR merchant_request_id IS NOT NULL OR mpesa_receipt IS NOT NULL;
UPDATE website_payments SET provider = 'pesapal' WHERE provider IS NULL;
ALTER TABLE website_payments ALTER COLUMN provider SET DEFAULT 'pesapal';
ALTER TABLE website_payments ALTER COLUMN provider SET NOT NULL;
ALTER TABLE website_payments ADD COLUMN IF NOT EXISTS provider_tracking_id text UNIQUE;
ALTER TABLE website_payments ADD COLUMN IF NOT EXISTS provider_redirect_url text;
ALTER TABLE website_payments ADD COLUMN IF NOT EXISTS provider_payment_method text;
ALTER TABLE website_payments ADD COLUMN IF NOT EXISTS provider_confirmation_code text UNIQUE;
UPDATE website_payments SET provider_confirmation_code = mpesa_receipt
  WHERE provider = 'mpesa' AND provider_confirmation_code IS NULL AND mpesa_receipt IS NOT NULL;
ALTER TABLE website_payments ADD COLUMN IF NOT EXISTS provider_masked_account text;
ALTER TABLE website_orders ADD COLUMN IF NOT EXISTS request_fingerprint text;

CREATE TABLE IF NOT EXISTS website_school_support (
  id uuid PRIMARY KEY,
  public_reference text UNIQUE NOT NULL,
  idempotency_key uuid UNIQUE NOT NULL,
  request_fingerprint text,
  status text NOT NULL CHECK (status IN (
    'pending_payment','payment_redirect_ready','payment_request_unknown','completed','failed','reversed','payment_review'
  )),
  supporter_name text NOT NULL,
  supporter_phone text NOT NULL,
  supporter_email text,
  amount_ksh integer NOT NULL CHECK (amount_ksh >= 100),
  message text,
  project_code text NOT NULL DEFAULT 'school_pad_support',
  provider text NOT NULL DEFAULT 'pesapal',
  provider_tracking_id text UNIQUE,
  provider_redirect_url text,
  provider_payment_method text,
  provider_confirmation_code text UNIQUE,
  provider_masked_account text,
  consent_copy_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE website_school_support ADD COLUMN IF NOT EXISTS request_fingerprint text;

CREATE TABLE IF NOT EXISTS website_support_handoffs (
  support_id uuid PRIMARY KEY REFERENCES website_school_support(id) ON DELETE CASCADE,
  event_type text NOT NULL DEFAULT 'website.school_support.completed',
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  external_record_id text,
  last_error text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE website_support_handoffs ADD COLUMN IF NOT EXISTS locked_until timestamptz;

CREATE TABLE IF NOT EXISTS website_provider_events (
  event_hash text PRIMARY KEY,
  provider text NOT NULL,
  merchant_reference text NOT NULL,
  provider_tracking_id text NOT NULL,
  notification_type text NOT NULL,
  verified_status text,
  sanitized_payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  process_attempts integer NOT NULL DEFAULT 1,
  last_error text
);

CREATE INDEX IF NOT EXISTS idx_website_school_support_status_created ON website_school_support(status, created_at);
CREATE INDEX IF NOT EXISTS idx_website_support_handoffs_status ON website_support_handoffs(status, locked_until, updated_at);
CREATE INDEX IF NOT EXISTS idx_website_provider_events_pending ON website_provider_events(processed_at, received_at);

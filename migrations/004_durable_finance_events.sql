-- Preserve every payment lifecycle event as an independent durable finance handoff.
-- This migration is additive and safe for databases that already applied migrations 001-003.

ALTER TABLE website_handoffs ADD COLUMN IF NOT EXISTS id uuid;
ALTER TABLE website_handoffs ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE website_handoffs ADD COLUMN IF NOT EXISTS event_status text;
ALTER TABLE website_handoffs ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'pesapal';
ALTER TABLE website_handoffs ADD COLUMN IF NOT EXISTS provider_confirmation_code text;
ALTER TABLE website_handoffs ADD COLUMN IF NOT EXISTS provider_payment_method text;
ALTER TABLE website_handoffs ADD COLUMN IF NOT EXISTS provider_masked_account text;

UPDATE website_handoffs
SET id = md5(order_id::text || ':' || event_type)::uuid
WHERE id IS NULL;

UPDATE website_handoffs h
SET event_status = CASE
      WHEN h.event_type = 'website.order.paid' THEN 'paid'
      WHEN h.event_type = 'website.order.reversed' THEN 'refund_or_reversal_review'
      ELSE 'payment_review'
    END,
    provider = COALESCE(p.provider, 'pesapal'),
    provider_confirmation_code = COALESCE(h.provider_confirmation_code, p.provider_confirmation_code),
    provider_payment_method = COALESCE(h.provider_payment_method, p.provider_payment_method),
    provider_masked_account = COALESCE(h.provider_masked_account, p.provider_masked_account)
FROM website_payments p
WHERE p.order_id = h.order_id AND h.event_status IS NULL;

UPDATE website_handoffs
SET event_status = CASE
      WHEN event_type = 'website.order.paid' THEN 'paid'
      WHEN event_type = 'website.order.reversed' THEN 'refund_or_reversal_review'
      ELSE 'payment_review'
    END
WHERE event_status IS NULL;

ALTER TABLE website_handoffs ALTER COLUMN id SET NOT NULL;
ALTER TABLE website_handoffs ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE website_handoffs DROP CONSTRAINT IF EXISTS website_handoffs_pkey;
ALTER TABLE website_handoffs ADD CONSTRAINT website_handoffs_pkey PRIMARY KEY (id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'website_handoffs_order_event_key'
      AND conrelid = 'website_handoffs'::regclass
  ) THEN
    ALTER TABLE website_handoffs
      ADD CONSTRAINT website_handoffs_order_event_key UNIQUE (order_id, event_type);
  END IF;
END $$;

ALTER TABLE website_support_handoffs ADD COLUMN IF NOT EXISTS id uuid;
ALTER TABLE website_support_handoffs ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE website_support_handoffs ADD COLUMN IF NOT EXISTS event_status text;
ALTER TABLE website_support_handoffs ADD COLUMN IF NOT EXISTS provider text NOT NULL DEFAULT 'pesapal';
ALTER TABLE website_support_handoffs ADD COLUMN IF NOT EXISTS provider_confirmation_code text;
ALTER TABLE website_support_handoffs ADD COLUMN IF NOT EXISTS provider_payment_method text;
ALTER TABLE website_support_handoffs ADD COLUMN IF NOT EXISTS provider_masked_account text;

UPDATE website_support_handoffs
SET id = md5(support_id::text || ':' || event_type)::uuid
WHERE id IS NULL;

UPDATE website_support_handoffs h
SET event_status = CASE
      WHEN h.event_type = 'website.school_support.completed' THEN 'completed'
      WHEN h.event_type = 'website.school_support.reversed' THEN 'reversed'
      ELSE 'payment_review'
    END,
    provider = COALESCE(s.provider, 'pesapal'),
    provider_confirmation_code = COALESCE(h.provider_confirmation_code, s.provider_confirmation_code),
    provider_payment_method = COALESCE(h.provider_payment_method, s.provider_payment_method),
    provider_masked_account = COALESCE(h.provider_masked_account, s.provider_masked_account)
FROM website_school_support s
WHERE s.id = h.support_id AND h.event_status IS NULL;

UPDATE website_support_handoffs
SET event_status = CASE
      WHEN event_type = 'website.school_support.completed' THEN 'completed'
      WHEN event_type = 'website.school_support.reversed' THEN 'reversed'
      ELSE 'payment_review'
    END
WHERE event_status IS NULL;

ALTER TABLE website_support_handoffs ALTER COLUMN id SET NOT NULL;
ALTER TABLE website_support_handoffs ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE website_support_handoffs DROP CONSTRAINT IF EXISTS website_support_handoffs_pkey;
ALTER TABLE website_support_handoffs ADD CONSTRAINT website_support_handoffs_pkey PRIMARY KEY (id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'website_support_handoffs_support_event_key'
      AND conrelid = 'website_support_handoffs'::regclass
  ) THEN
    ALTER TABLE website_support_handoffs
      ADD CONSTRAINT website_support_handoffs_support_event_key UNIQUE (support_id, event_type);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_website_handoffs_queue
  ON website_handoffs(status, locked_until, created_at);
CREATE INDEX IF NOT EXISTS idx_website_support_handoffs_queue
  ON website_support_handoffs(status, locked_until, created_at);

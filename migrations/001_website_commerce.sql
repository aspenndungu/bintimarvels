-- Transaction-safe website payment ledger. Apply only to an approved PostgreSQL database.
CREATE TABLE IF NOT EXISTS website_orders (
  id uuid PRIMARY KEY,
  public_reference text UNIQUE NOT NULL,
  idempotency_key uuid UNIQUE NOT NULL,
  status text NOT NULL CHECK (status IN ('pending_payment','stk_requested','stk_request_unknown','paid','late_payment_review','payment_failed','payment_cancelled','payment_timed_out','payment_review','refund_or_reversal_review')),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  county text NOT NULL,
  delivery_source text NOT NULL CHECK (delivery_source IN ('google_place','map_pin')),
  delivery_place_id text,
  delivery_address text NOT NULL,
  delivery_landmark text,
  destination_type text NOT NULL CHECK (destination_type IN ('doorstep','drop_off')),
  delivery_latitude numeric(9,6) NOT NULL CHECK (delivery_latitude BETWEEN -90 AND 90),
  delivery_longitude numeric(9,6) NOT NULL CHECK (delivery_longitude BETWEEN -180 AND 180),
  route_distance_meters integer NOT NULL CHECK (route_distance_meters >= 0),
  route_duration_seconds integer NOT NULL CHECK (route_duration_seconds >= 0),
  route_travel_mode text NOT NULL CHECK (route_travel_mode IN ('TWO_WHEELER','DRIVE')),
  delivery_tariff_version text NOT NULL,
  subtotal_ksh integer NOT NULL CHECK (subtotal_ksh > 0),
  delivery_fee_ksh integer NOT NULL CHECK (delivery_fee_ksh >= 0),
  total_ksh integer NOT NULL CHECK (total_ksh = subtotal_ksh + delivery_fee_ksh),
  marketing_consent boolean NOT NULL DEFAULT false,
  consent_copy_version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz
);

CREATE TABLE IF NOT EXISTS website_order_items (
  id bigserial PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES website_orders(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0 AND quantity <= 20),
  unit_price_ksh integer NOT NULL CHECK (unit_price_ksh > 0),
  line_total_ksh integer NOT NULL CHECK (line_total_ksh = unit_price_ksh * quantity)
);

CREATE TABLE IF NOT EXISTS website_inventory (
  product_id text PRIMARY KEY,
  available_units integer NOT NULL DEFAULT 0 CHECK (available_units >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS website_inventory_reservations (
  order_id uuid NOT NULL REFERENCES website_orders(id) ON DELETE CASCADE,
  product_id text NOT NULL REFERENCES website_inventory(product_id),
  quantity integer NOT NULL CHECK (quantity > 0),
  expires_at timestamptz NOT NULL,
  released_at timestamptz,
  release_reason text,
  PRIMARY KEY (order_id, product_id)
);

CREATE TABLE IF NOT EXISTS website_payments (
  id uuid PRIMARY KEY,
  order_id uuid UNIQUE NOT NULL REFERENCES website_orders(id) ON DELETE CASCADE,
  merchant_request_id text UNIQUE,
  checkout_request_id text UNIQUE,
  mpesa_receipt text UNIQUE,
  expected_amount_ksh integer NOT NULL,
  status text NOT NULL,
  result_code integer,
  result_description text,
  recovery_source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS website_payment_events (
  event_hash text PRIMARY KEY,
  checkout_request_id text,
  merchant_request_id text,
  event_type text NOT NULL,
  sanitized_payload jsonb NOT NULL,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  process_attempts integer NOT NULL DEFAULT 0,
  last_error text
);

CREATE TABLE IF NOT EXISTS website_unmatched_callbacks (
  event_hash text PRIMARY KEY,
  checkout_request_id text NOT NULL,
  merchant_request_id text NOT NULL,
  sanitized_payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'review',
  received_at timestamptz NOT NULL DEFAULT now(),
  resolved_order_id uuid REFERENCES website_orders(id),
  resolved_at timestamptz
);

CREATE TABLE IF NOT EXISTS website_handoffs (
  order_id uuid PRIMARY KEY REFERENCES website_orders(id) ON DELETE CASCADE,
  website_order_id uuid NOT NULL,
  event_type text NOT NULL DEFAULT 'website.order.paid',
  status text NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  locked_until timestamptz,
  external_record_id text,
  last_error text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS website_leads (
  id uuid PRIMARY KEY,
  idempotency_key uuid UNIQUE NOT NULL,
  enquiry_type text NOT NULL,
  name text NOT NULL,
  organisation text,
  phone text NOT NULL,
  email text,
  county text,
  message text NOT NULL,
  follow_up_consent boolean NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS website_rate_limits (
  key_hash text PRIMARY KEY,
  window_start timestamptz NOT NULL,
  request_count integer NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_website_orders_status_created ON website_orders(status, created_at);
CREATE INDEX IF NOT EXISTS idx_website_payment_events_pending ON website_payment_events(processed_at, received_at);
CREATE INDEX IF NOT EXISTS idx_website_handoffs_status ON website_handoffs(status, locked_until, updated_at);

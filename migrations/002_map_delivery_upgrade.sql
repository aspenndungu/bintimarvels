-- Add map-based delivery evidence without invalidating historical zone-based orders.
-- Safe for databases that already ran 001 before the delivery rebuild.
BEGIN;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'website_orders' AND column_name = 'delivery_zone'
  ) THEN
    ALTER TABLE website_orders ALTER COLUMN delivery_zone DROP NOT NULL;
  END IF;
END $$;

ALTER TABLE website_orders
  ADD COLUMN IF NOT EXISTS delivery_source text,
  ADD COLUMN IF NOT EXISTS delivery_place_id text,
  ADD COLUMN IF NOT EXISTS delivery_landmark text,
  ADD COLUMN IF NOT EXISTS destination_type text,
  ADD COLUMN IF NOT EXISTS delivery_latitude numeric(9,6),
  ADD COLUMN IF NOT EXISTS delivery_longitude numeric(9,6),
  ADD COLUMN IF NOT EXISTS route_distance_meters integer,
  ADD COLUMN IF NOT EXISTS route_duration_seconds integer,
  ADD COLUMN IF NOT EXISTS route_travel_mode text,
  ADD COLUMN IF NOT EXISTS delivery_tariff_version text;

-- NOT VALID preserves historical rows while enforcing complete delivery evidence
-- for every new or updated order written after this migration.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'website_orders_delivery_source_v2_check') THEN
    ALTER TABLE website_orders ADD CONSTRAINT website_orders_delivery_source_v2_check
      CHECK (delivery_source IS NOT NULL AND delivery_source IN ('google_place','map_pin')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'website_orders_destination_type_v2_check') THEN
    ALTER TABLE website_orders ADD CONSTRAINT website_orders_destination_type_v2_check
      CHECK (destination_type IS NOT NULL AND destination_type IN ('doorstep','drop_off')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'website_orders_delivery_latitude_v2_check') THEN
    ALTER TABLE website_orders ADD CONSTRAINT website_orders_delivery_latitude_v2_check
      CHECK (delivery_latitude IS NOT NULL AND delivery_latitude BETWEEN -90 AND 90) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'website_orders_delivery_longitude_v2_check') THEN
    ALTER TABLE website_orders ADD CONSTRAINT website_orders_delivery_longitude_v2_check
      CHECK (delivery_longitude IS NOT NULL AND delivery_longitude BETWEEN -180 AND 180) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'website_orders_route_distance_v2_check') THEN
    ALTER TABLE website_orders ADD CONSTRAINT website_orders_route_distance_v2_check
      CHECK (route_distance_meters IS NOT NULL AND route_distance_meters >= 0) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'website_orders_route_duration_v2_check') THEN
    ALTER TABLE website_orders ADD CONSTRAINT website_orders_route_duration_v2_check
      CHECK (route_duration_seconds IS NOT NULL AND route_duration_seconds >= 0) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'website_orders_route_travel_mode_v2_check') THEN
    ALTER TABLE website_orders ADD CONSTRAINT website_orders_route_travel_mode_v2_check
      CHECK (route_travel_mode IS NOT NULL AND route_travel_mode IN ('TWO_WHEELER','DRIVE')) NOT VALID;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'website_orders_delivery_tariff_version_v2_check') THEN
    ALTER TABLE website_orders ADD CONSTRAINT website_orders_delivery_tariff_version_v2_check
      CHECK (delivery_tariff_version IS NOT NULL AND length(delivery_tariff_version) BETWEEN 1 AND 100) NOT VALID;
  END IF;
END $$;

COMMIT;

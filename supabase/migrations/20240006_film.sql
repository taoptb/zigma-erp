CREATE TABLE film_rolls (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id              UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  brand                TEXT,
  specification        TEXT,
  width_cm             NUMERIC(6,2) NOT NULL,
  total_length_m       NUMERIC(8,2) NOT NULL,
  remaining_length_m   NUMERIC(8,2) NOT NULL,
  color_hex            TEXT NOT NULL DEFAULT '#3b82f6',
  min_length_alert_m   NUMERIC(6,2) NOT NULL DEFAULT 5.0,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at           TIMESTAMPTZ
);

CREATE INDEX film_rolls_shop ON film_rolls(shop_id) WHERE deleted_at IS NULL;
CREATE TRIGGER film_rolls_updated_at
  BEFORE UPDATE ON film_rolls FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE film_templates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id    UUID REFERENCES shops(id) ON DELETE CASCADE,
  car_type   TEXT NOT NULL,
  position   TEXT NOT NULL,
  length_m   NUMERIC(6,2) NOT NULL,
  margin_m   NUMERIC(6,2) NOT NULL DEFAULT 0.15,
  UNIQUE(shop_id, car_type, position)
);

CREATE TABLE film_cuts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id           UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  film_roll_id      UUID NOT NULL REFERENCES film_rolls(id) ON DELETE CASCADE,
  job_id            UUID REFERENCES jobs(id) ON DELETE SET NULL,
  car_type          TEXT NOT NULL,
  positions         TEXT[] NOT NULL,
  length_used_m     NUMERIC(8,2) NOT NULL,
  remaining_after_m NUMERIC(8,2) NOT NULL,
  cut_by            UUID REFERENCES profiles(id),
  cut_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes             TEXT
);

CREATE INDEX film_cuts_roll ON film_cuts(film_roll_id, cut_at DESC);
CREATE INDEX film_cuts_shop ON film_cuts(shop_id, cut_at DESC);

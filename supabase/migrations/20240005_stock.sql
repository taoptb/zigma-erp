CREATE TABLE stock_items (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id        UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  product_code   TEXT NOT NULL,
  name           TEXT NOT NULL,
  name_en        TEXT,
  category       stock_category NOT NULL DEFAULT 'glass',
  vehicle_make   TEXT,
  vehicle_model  TEXT,
  position       glass_position,
  quantity       INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  min_quantity   INTEGER NOT NULL DEFAULT 2,
  cost_price     NUMERIC(12,2) NOT NULL DEFAULT 0,
  selling_price  NUMERIC(12,2) NOT NULL DEFAULT 0,
  supplier_name  TEXT,
  location_note  TEXT,
  status         stock_status GENERATED ALWAYS AS (
    CASE
      WHEN quantity = 0             THEN 'out_of_stock'::stock_status
      WHEN quantity <= 1            THEN 'near_out'::stock_status
      WHEN quantity <= min_quantity THEN 'low'::stock_status
      ELSE 'adequate'::stock_status
    END
  ) STORED,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at     TIMESTAMPTZ
);

CREATE UNIQUE INDEX stock_items_shop_code ON stock_items(shop_id, product_code) WHERE deleted_at IS NULL;
CREATE INDEX stock_items_status ON stock_items(shop_id, status);
CREATE TRIGGER stock_items_updated_at
  BEFORE UPDATE ON stock_items FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE stock_movements (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id         UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  stock_item_id   UUID NOT NULL REFERENCES stock_items(id) ON DELETE CASCADE,
  job_id          UUID REFERENCES jobs(id) ON DELETE SET NULL,
  movement_type   TEXT NOT NULL CHECK (movement_type IN ('in', 'out', 'adjustment')),
  quantity_delta  INTEGER NOT NULL,
  quantity_after  INTEGER NOT NULL,
  unit_cost       NUMERIC(12,2),
  supplier_name   TEXT,
  reference       TEXT,
  created_by      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX stock_movements_item ON stock_movements(stock_item_id, created_at DESC);

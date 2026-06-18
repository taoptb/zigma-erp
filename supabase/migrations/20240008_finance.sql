CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id         UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  invoice_number  TEXT NOT NULL,
  job_id          UUID REFERENCES jobs(id) ON DELETE SET NULL,
  claim_id        UUID REFERENCES insurance_claims(id) ON DELETE SET NULL,
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  billed_to_name  TEXT,
  billed_to_phone TEXT,
  license_plate   TEXT,
  subtotal        NUMERIC(12,2) NOT NULL DEFAULT 0,
  vat_rate        NUMERIC(5,4) NOT NULL DEFAULT 0.07,
  vat_amount      NUMERIC(12,2) GENERATED ALWAYS AS (subtotal * vat_rate) STORED,
  total           NUMERIC(12,2) GENERATED ALWAYS AS (subtotal + subtotal * vat_rate) STORED,
  status          invoice_status NOT NULL DEFAULT 'draft',
  paid_at         TIMESTAMPTZ,
  paid_amount     NUMERIC(12,2),
  payment_method  TEXT,
  notes           TEXT,
  issued_by       UUID REFERENCES profiles(id),
  issued_at       TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX invoices_shop_number ON invoices(shop_id, invoice_number) WHERE deleted_at IS NULL;
CREATE INDEX invoices_shop_status ON invoices(shop_id, status);
CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE invoice_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id       UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  invoice_id    UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  stock_item_id UUID REFERENCES stock_items(id) ON DELETE SET NULL,
  description   TEXT NOT NULL,
  quantity      NUMERIC(10,3) NOT NULL DEFAULT 1,
  unit_price    NUMERIC(12,2) NOT NULL,
  line_total    NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  sort_order    SMALLINT NOT NULL DEFAULT 0
);

CREATE INDEX invoice_items_invoice ON invoice_items(invoice_id);

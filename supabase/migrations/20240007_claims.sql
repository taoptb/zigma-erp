CREATE TABLE insurance_claims (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id           UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  job_id            UUID REFERENCES jobs(id) ON DELETE SET NULL,
  claim_number      TEXT NOT NULL,
  insurance_company TEXT NOT NULL,
  policy_number     TEXT,
  license_plate     TEXT NOT NULL,
  job_type          job_type NOT NULL,
  claim_amount      NUMERIC(12,2),
  approved_amount   NUMERIC(12,2),
  status            claim_status NOT NULL DEFAULT 'waiting_docs',
  notes             TEXT,
  submitted_at      TIMESTAMPTZ,
  approved_at       TIMESTAMPTZ,
  paid_at           TIMESTAMPTZ,
  created_by        UUID REFERENCES profiles(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at        TIMESTAMPTZ
);

CREATE INDEX claims_shop_status ON insurance_claims(shop_id, status);
CREATE TRIGGER claims_updated_at
  BEFORE UPDATE ON insurance_claims FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE claim_documents (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id       UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  claim_id      UUID NOT NULL REFERENCES insurance_claims(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  is_submitted  BOOLEAN NOT NULL DEFAULT FALSE,
  file_url      TEXT,
  submitted_at  TIMESTAMPTZ,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX claim_docs_claim ON claim_documents(claim_id);

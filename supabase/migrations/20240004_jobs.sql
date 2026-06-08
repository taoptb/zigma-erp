CREATE TABLE customers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id      UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  phone        TEXT,
  email        TEXT,
  notes        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at   TIMESTAMPTZ
);

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE vehicles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id       UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  customer_id   UUID REFERENCES customers(id) ON DELETE SET NULL,
  license_plate TEXT NOT NULL,
  make          TEXT NOT NULL,
  model         TEXT NOT NULL,
  year          SMALLINT,
  color         TEXT,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX vehicles_shop_plate ON vehicles(shop_id, license_plate);
CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE jobs (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_id            UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  job_number         TEXT NOT NULL,
  vehicle_id         UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  customer_id        UUID REFERENCES customers(id) ON DELETE SET NULL,
  technician_id      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  job_type           job_type NOT NULL DEFAULT 'other',
  status             job_status NOT NULL DEFAULT 'pending',
  price              NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes              TEXT,
  scheduled_date     DATE,
  received_at        TIMESTAMPTZ,
  completed_at       TIMESTAMPTZ,
  delivered_at       TIMESTAMPTZ,
  odometer_in        INTEGER,
  progress           SMALLINT NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  insurance_company  TEXT,
  is_insurance_claim BOOLEAN NOT NULL DEFAULT FALSE,
  created_by         UUID REFERENCES profiles(id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at         TIMESTAMPTZ
);

CREATE UNIQUE INDEX jobs_shop_number ON jobs(shop_id, job_number) WHERE deleted_at IS NULL;
CREATE INDEX jobs_shop_status ON jobs(shop_id, status);
CREATE INDEX jobs_scheduled ON jobs(shop_id, scheduled_date);
CREATE INDEX jobs_technician ON jobs(shop_id, technician_id);
CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE job_status_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id      UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  shop_id     UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  from_status job_status,
  to_status   job_status NOT NULL,
  changed_by  UUID REFERENCES profiles(id),
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE job_damage_checklist (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id      UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  shop_id     UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  item        TEXT NOT NULL,
  is_damaged  BOOLEAN NOT NULL DEFAULT FALSE,
  notes       TEXT,
  photo_urls  TEXT[] NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

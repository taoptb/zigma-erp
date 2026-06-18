CREATE TABLE technician_capacity (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id       UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  work_date     DATE NOT NULL DEFAULT CURRENT_DATE,
  max_jobs      SMALLINT NOT NULL DEFAULT 8,
  is_available  BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(shop_id, technician_id, work_date)
);

CREATE TABLE job_assignments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id       UUID NOT NULL REFERENCES shops(id) ON DELETE CASCADE,
  job_id        UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by   UUID REFERENCES profiles(id),
  due_date      DATE,
  is_primary    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX job_assignments_job ON job_assignments(job_id);
CREATE INDEX job_assignments_tech ON job_assignments(shop_id, technician_id, due_date);

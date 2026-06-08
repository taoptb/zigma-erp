-- Helper: get current user's shop_id
CREATE OR REPLACE FUNCTION auth_shop_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT shop_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Helper: get current user's role
CREATE OR REPLACE FUNCTION auth_role()
RETURNS user_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

-- Enable RLS on all tables
ALTER TABLE shops                ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_invitations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_status_history   ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_damage_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE film_rolls           ENABLE ROW LEVEL SECURITY;
ALTER TABLE film_templates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE film_cuts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims     ENABLE ROW LEVEL SECURITY;
ALTER TABLE claim_documents      ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices             ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_capacity  ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_assignments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs    ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_rules   ENABLE ROW LEVEL SECURITY;

-- SHOPS
CREATE POLICY shops_select ON shops FOR SELECT TO authenticated
  USING (id = auth_shop_id());
CREATE POLICY shops_update ON shops FOR UPDATE TO authenticated
  USING (id = auth_shop_id() AND auth_role() IN ('owner', 'manager'));

-- PROFILES
CREATE POLICY profiles_select ON profiles FOR SELECT TO authenticated
  USING (shop_id = auth_shop_id() OR id = auth.uid());
CREATE POLICY profiles_update_own ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid());
CREATE POLICY profiles_update_admin ON profiles FOR UPDATE TO authenticated
  USING (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager'));

-- SHOP INVITATIONS
CREATE POLICY invitations_select ON shop_invitations FOR SELECT TO authenticated
  USING (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager'));
CREATE POLICY invitations_insert ON shop_invitations FOR INSERT TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager'));
CREATE POLICY invitations_delete ON shop_invitations FOR DELETE TO authenticated
  USING (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager'));

-- JOBS
CREATE POLICY jobs_select ON jobs FOR SELECT TO authenticated
  USING (shop_id = auth_shop_id());
CREATE POLICY jobs_insert ON jobs FOR INSERT TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() != 'accountant');
CREATE POLICY jobs_update ON jobs FOR UPDATE TO authenticated
  USING (
    shop_id = auth_shop_id() AND (
      auth_role() IN ('owner', 'manager') OR
      (auth_role() = 'technician' AND technician_id = auth.uid())
    )
  );
CREATE POLICY jobs_delete ON jobs FOR DELETE TO authenticated
  USING (shop_id = auth_shop_id() AND auth_role() = 'owner');

-- CUSTOMERS
CREATE POLICY customers_select ON customers FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY customers_write ON customers FOR ALL TO authenticated WITH CHECK (shop_id = auth_shop_id() AND auth_role() != 'accountant');

-- VEHICLES
CREATE POLICY vehicles_select ON vehicles FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY vehicles_write ON vehicles FOR ALL TO authenticated WITH CHECK (shop_id = auth_shop_id() AND auth_role() != 'accountant');

-- JOB STATUS HISTORY
CREATE POLICY jsh_select ON job_status_history FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY jsh_insert ON job_status_history FOR INSERT TO authenticated WITH CHECK (shop_id = auth_shop_id());

-- JOB DAMAGE CHECKLIST
CREATE POLICY jdc_select ON job_damage_checklist FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY jdc_write ON job_damage_checklist FOR ALL TO authenticated WITH CHECK (shop_id = auth_shop_id() AND auth_role() != 'accountant');

-- STOCK ITEMS
CREATE POLICY stock_items_select ON stock_items FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY stock_items_write ON stock_items FOR ALL TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager'));

-- STOCK MOVEMENTS
CREATE POLICY stock_movements_select ON stock_movements FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY stock_movements_insert ON stock_movements FOR INSERT TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() != 'accountant');

-- FILM ROLLS
CREATE POLICY film_rolls_select ON film_rolls FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY film_rolls_write ON film_rolls FOR ALL TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager'));

-- FILM TEMPLATES (NULL shop_id = global defaults visible to all)
CREATE POLICY film_templates_select ON film_templates FOR SELECT TO authenticated
  USING (shop_id = auth_shop_id() OR shop_id IS NULL);
CREATE POLICY film_templates_write ON film_templates FOR ALL TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager'));

-- FILM CUTS
CREATE POLICY film_cuts_select ON film_cuts FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY film_cuts_insert ON film_cuts FOR INSERT TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() != 'accountant');

-- INSURANCE CLAIMS
CREATE POLICY claims_select ON insurance_claims FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY claims_write ON insurance_claims FOR ALL TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager', 'accountant'));

-- CLAIM DOCUMENTS
CREATE POLICY claim_docs_select ON claim_documents FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY claim_docs_write ON claim_documents FOR ALL TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager', 'accountant'));

-- INVOICES
CREATE POLICY invoices_select ON invoices FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY invoices_write ON invoices FOR ALL TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager', 'accountant'));

-- INVOICE ITEMS
CREATE POLICY invoice_items_select ON invoice_items FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY invoice_items_write ON invoice_items FOR ALL TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager', 'accountant'));

-- TECHNICIAN CAPACITY
CREATE POLICY tech_cap_select ON technician_capacity FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY tech_cap_write ON technician_capacity FOR ALL TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager'));

-- JOB ASSIGNMENTS
CREATE POLICY job_assign_select ON job_assignments FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY job_assign_write ON job_assignments FOR ALL TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager'));

-- NOTIFICATION LOGS
CREATE POLICY notif_logs_select ON notification_logs FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY notif_logs_insert ON notification_logs FOR INSERT TO authenticated
  WITH CHECK (shop_id = auth_shop_id());

-- NOTIFICATION RULES
CREATE POLICY notif_rules_select ON notification_rules FOR SELECT TO authenticated USING (shop_id = auth_shop_id());
CREATE POLICY notif_rules_write ON notification_rules FOR ALL TO authenticated
  WITH CHECK (shop_id = auth_shop_id() AND auth_role() IN ('owner', 'manager'));

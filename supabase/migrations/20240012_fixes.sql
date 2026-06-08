-- =============================================================================
-- Patch migration: critical and important fixes identified in code quality review
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Fix #1: handle_new_user — check pending invitation before assigning 'owner'
-- Prevents privilege escalation where invited technicians/managers became owners.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_invitation public.shop_invitations%ROWTYPE;
BEGIN
  SELECT * INTO v_invitation
  FROM public.shop_invitations
  WHERE email = NEW.email
    AND accepted_at IS NULL
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1;

  IF v_invitation.id IS NOT NULL THEN
    INSERT INTO public.profiles (id, display_name, role, shop_id)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
      v_invitation.role,
      v_invitation.shop_id
    );
    UPDATE public.shop_invitations
    SET accepted_at = NOW()
    WHERE id = v_invitation.id;
  ELSE
    INSERT INTO public.profiles (id, display_name, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
      'owner'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Fix #2: Invitation SELECT policy — allow invited users to read their own
--         invitation by email match (auth_shop_id() is NULL for new users).
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS invitations_accept ON shop_invitations;
CREATE POLICY invitations_accept ON shop_invitations FOR SELECT TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Fix #3: Shops INSERT policy — allow authenticated users to create a shop
--         (required for owner registration flow).
-- ---------------------------------------------------------------------------
CREATE POLICY shops_insert ON shops FOR INSERT TO authenticated
  WITH CHECK (TRUE);

-- ---------------------------------------------------------------------------
-- Fix #4: Unique index on insurance_claims.claim_number per shop
--         (mirrors the unique indexes already present on jobs and invoices).
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX claims_shop_number ON insurance_claims(shop_id, claim_number)
  WHERE deleted_at IS NULL;

-- ---------------------------------------------------------------------------
-- Fix #5: profiles_update_own — add WITH CHECK to prevent self-role escalation.
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS profiles_update_own ON profiles;
CREATE POLICY profiles_update_own ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND (role = auth_role() OR auth_role() IN ('owner', 'manager'))
  );

-- ---------------------------------------------------------------------------
-- Fix #6: CHECK constraints to prevent negative inventory values.
-- ---------------------------------------------------------------------------
ALTER TABLE film_rolls ADD CONSTRAINT film_rolls_remaining_nonneg
  CHECK (remaining_length_m >= 0);

ALTER TABLE stock_movements ADD CONSTRAINT stock_movements_after_nonneg
  CHECK (quantity_after >= 0);

-- ---------------------------------------------------------------------------
-- Fix #7: Missing index on customers(shop_id) for query performance.
-- ---------------------------------------------------------------------------
CREATE INDEX customers_shop ON customers(shop_id);

-- Allow the trigger-created profile to be updated immediately after signup
-- (shops_insert already exists in 20240012_fixes.sql)
CREATE POLICY profiles_insert ON profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

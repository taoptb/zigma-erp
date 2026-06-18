-- Allow authenticated users to create their first shop during registration
CREATE POLICY shops_insert ON shops FOR INSERT TO authenticated
  WITH CHECK (TRUE);

-- Allow the trigger-created profile to be read immediately after signup
-- (covers the window between trigger insert and profile update)
CREATE POLICY profiles_insert ON profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

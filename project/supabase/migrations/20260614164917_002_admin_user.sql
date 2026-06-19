-- Create a table to store the admin user (first registered user)
CREATE TABLE admin_user (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_user ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read admin_user (to check if current user is admin)
CREATE POLICY "admin_user_select" ON admin_user FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "admin_user_select_anon" ON admin_user FOR SELECT
  TO anon USING (true);

-- Allow only the first user to be inserted (no more inserts after one exists)
CREATE POLICY "admin_user_insert" ON admin_user FOR INSERT
  TO authenticated WITH CHECK (NOT EXISTS (SELECT 1 FROM admin_user));

-- Function to check if a user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM admin_user WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for pets - only admin can update/delete
DROP POLICY IF EXISTS "pets_update" ON pets;
DROP POLICY IF EXISTS "pets_delete" ON pets;

CREATE POLICY "pets_update" ON pets FOR UPDATE
  TO authenticated USING (is_admin(auth.uid())) WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "pets_delete" ON pets FOR DELETE
  TO authenticated USING (is_admin(auth.uid()));

-- Insert current first user as admin if exists
-- This will be handled by the application or we can check if any users exist
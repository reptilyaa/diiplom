-- Create user profiles table to store additional user info like name
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "user_profiles_select" ON user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "user_profiles_insert" ON user_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "user_profiles_update" ON user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Create index for faster lookups
CREATE INDEX idx_user_profiles_id ON user_profiles(id);
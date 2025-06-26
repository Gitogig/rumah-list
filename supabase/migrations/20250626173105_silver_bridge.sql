/*
  # Fix RLS policies for users table

  1. Security Changes
    - Drop existing problematic policies that cause infinite recursion
    - Create new policies that use auth.uid() directly without table lookups
    - Add INSERT policy for user registration
    - Simplify admin policies to avoid recursion

  2. Policy Changes
    - Users can read their own data using auth.uid() = id
    - Users can update their own data using auth.uid() = id  
    - Users can insert their own profile during registration
    - Service role can perform all operations (for admin functions)
*/

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new policies without recursion
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow service role to perform all operations (for admin functions)
CREATE POLICY "Service role can manage all users"
  ON users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create a separate policy for admin users that doesn't cause recursion
-- This uses a function to check admin status without querying the users table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email = 'admin@rumah.my'
  );
$$;

CREATE POLICY "Admin can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin can update all users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin can delete users"
  ON users
  FOR DELETE
  TO authenticated
  USING (is_admin());
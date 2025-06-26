/*
  # Fix Users Table INSERT Policy

  1. Security Updates
    - Drop existing INSERT policy that may be using incorrect function
    - Create new INSERT policy using correct auth.uid() function
    - Ensure authenticated users can create their own profile

  2. Changes
    - Replace uid() with auth.uid() in INSERT policy
    - Maintain existing security constraints
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create a new INSERT policy with correct auth function
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
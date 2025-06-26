-- Add status column to users table for suspension functionality
ALTER TABLE users ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending'));

-- Update existing users to have active status if verified, pending if not
UPDATE users SET status = CASE 
  WHEN verified = true THEN 'active'
  ELSE 'pending'
END WHERE status IS NULL;

-- Create index for better performance on status queries
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Update RLS policies to consider status
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- New policies that consider suspension status
CREATE POLICY "Active users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id AND (status = 'active' OR role = 'admin'));

CREATE POLICY "Active users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id AND (status = 'active' OR role = 'admin'))
  WITH CHECK (auth.uid() = id AND (status = 'active' OR role = 'admin'));
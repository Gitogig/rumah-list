/*
  # Setup admin user with proper credentials

  1. Updates
    - Set admin@rumah.my to have admin role
    - Ensure the user is verified and active
    - Update password in auth.users table if needed

  2. Security
    - Verify admin user exists and has proper permissions
*/

-- Update the user profile in users table
UPDATE users 
SET 
  role = 'admin',
  verified = true,
  status = 'active',
  name = 'Admin User',
  updated_at = now()
WHERE email = 'admin@rumah.my';

-- Insert admin user if it doesn't exist in users table
INSERT INTO users (id, email, name, role, verified, status, created_at, updated_at)
SELECT 
  auth_users.id,
  'admin@rumah.my',
  'Admin User',
  'admin',
  true,
  'active',
  now(),
  now()
FROM auth.users auth_users
WHERE auth_users.email = 'admin@rumah.my'
  AND NOT EXISTS (
    SELECT 1 FROM users WHERE email = 'admin@rumah.my'
  );

-- Verify the admin user setup
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE email = 'admin@rumah.my' 
    AND role = 'admin' 
    AND status = 'active'
  ) THEN
    RAISE NOTICE 'Admin user admin@rumah.my is properly configured';
  ELSE
    RAISE WARNING 'Admin user admin@rumah.my setup may have failed';
  END IF;
END $$;
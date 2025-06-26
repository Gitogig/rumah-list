/*
  # Promote admin@rumah.my user to admin role

  1. Updates
    - Find user with email admin@rumah.my
    - Set their role to 'admin'
    - Set verified to true
    - Set status to 'active'

  2. Notes
    - This migration will only affect the user with admin@rumah.my email
    - If the user doesn't exist, the update will have no effect
*/

-- Update the user with admin@rumah.my email to have admin role
UPDATE users 
SET 
  role = 'admin',
  verified = true,
  status = 'active',
  updated_at = now()
WHERE email = 'admin@rumah.my';

-- Verify the update was successful
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM users WHERE email = 'admin@rumah.my' AND role = 'admin') THEN
    RAISE NOTICE 'Successfully promoted admin@rumah.my to admin role';
  ELSE
    RAISE NOTICE 'User admin@rumah.my not found or update failed';
  END IF;
END $$;
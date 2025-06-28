/*
  # Add rejected status to properties

  1. Changes
    - Update the status check constraint to include 'rejected' status
    - This allows properties to be marked as rejected by admin

  2. Security
    - No changes to RLS policies needed
    - Existing policies will handle rejected status appropriately
*/

-- Update the status check constraint to include 'rejected'
ALTER TABLE properties 
DROP CONSTRAINT IF EXISTS properties_status_check;

ALTER TABLE properties 
ADD CONSTRAINT properties_status_check 
CHECK (status IN ('draft', 'pending', 'active', 'sold', 'rented', 'suspended', 'rejected'));
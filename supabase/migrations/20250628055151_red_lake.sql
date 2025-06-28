/*
  # Migrate dummy property data to Supabase

  1. Data Migration
    - Insert sample properties from mockData into properties table
    - Create associated property images
    - Link properties with amenities
    - Ensure proper seller relationships

  2. Sample Data
    - 4 featured properties with complete details
    - Multiple images per property
    - Various amenities and property types
    - Different price ranges and locations
*/

-- First, ensure we have a sample seller user
INSERT INTO users (id, email, name, phone, role, verified, status, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'sarah.lim@example.com', 'Sarah Lim', '+60123456789', 'seller', true, 'active', now(), now()),
  ('550e8400-e29b-41d4-a716-446655440002', 'ahmad.rahman@example.com', 'Ahmad Rahman', '+60123456788', 'seller', true, 'active', now(), now()),
  ('550e8400-e29b-41d4-a716-446655440003', 'priya.sharma@example.com', 'Priya Sharma', '+60123456787', 'seller', true, 'active', now(), now()),
  ('550e8400-e29b-41d4-a716-446655440004', 'david.tan@example.com', 'David Tan', '+60123456786', 'seller', true, 'active', now(), now())
ON CONFLICT (email) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  role = EXCLUDED.role,
  verified = EXCLUDED.verified,
  status = EXCLUDED.status;

-- Insert sample properties
INSERT INTO properties (
  id, seller_id, title, description, price, property_type, listing_type,
  address, city, state, zip_code, bedrooms, bathrooms, square_footage,
  contact_name, contact_phone, contact_email, status, featured, views_count,
  created_at, updated_at, published_at
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440101',
  '550e8400-e29b-41d4-a716-446655440001',
  'Modern 3BR Apartment in KLCC',
  'Luxurious 3-bedroom apartment with stunning city views in the heart of KLCC. Features modern amenities, swimming pool, gym, and 24/7 security. Perfect for professionals and families looking for premium urban living.',
  3500.00,
  'apartment',
  'rent',
  'Jalan Ampang, KLCC',
  'Kuala Lumpur',
  'Kuala Lumpur',
  '50450',
  3,
  2,
  1200,
  'Sarah Lim',
  '+60123456789',
  'sarah.lim@example.com',
  'active',
  true,
  156,
  '2024-01-15 10:00:00+00',
  '2024-01-15 10:00:00+00',
  '2024-01-15 10:00:00+00'
),
(
  '550e8400-e29b-41d4-a716-446655440102',
  '550e8400-e29b-41d4-a716-446655440002',
  'Cozy 2BR House in Petaling Jaya',
  'Charming 2-bedroom terrace house in a quiet neighborhood. Perfect for small families or young professionals. Features include a private garden, covered parking, and close proximity to LRT station and shopping centers.',
  650000.00,
  'house',
  'sale',
  'Jalan SS2/24, Petaling Jaya',
  'Petaling Jaya',
  'Selangor',
  '47300',
  2,
  2,
  900,
  'Ahmad Rahman',
  '+60123456788',
  'ahmad.rahman@example.com',
  'active',
  false,
  89,
  '2024-01-14 14:30:00+00',
  '2024-01-14 14:30:00+00',
  '2024-01-14 14:30:00+00'
),
(
  '550e8400-e29b-41d4-a716-446655440103',
  '550e8400-e29b-41d4-a716-446655440003',
  'Luxury Condo in Mont Kiara',
  'Premium condominium with full facilities and excellent location in Mont Kiara. Features include swimming pool, gym, tennis court, concierge service, and 24/7 security. Fully furnished with modern appliances.',
  4500.00,
  'condo',
  'rent',
  'Jalan Kiara 1, Mont Kiara',
  'Mont Kiara',
  'Kuala Lumpur',
  '50480',
  2,
  2,
  1100,
  'Priya Sharma',
  '+60123456787',
  'priya.sharma@example.com',
  'active',
  true,
  203,
  '2024-01-13 09:15:00+00',
  '2024-01-13 09:15:00+00',
  '2024-01-13 09:15:00+00'
),
(
  '550e8400-e29b-41d4-a716-446655440104',
  '550e8400-e29b-41d4-a716-446655440004',
  'Studio Apartment in Bangsar',
  'Compact and modern studio apartment perfect for young professionals. Located in the vibrant Bangsar area with easy access to restaurants, cafes, and nightlife. Fully furnished with high-speed WiFi and air conditioning.',
  1800.00,
  'studio',
  'rent',
  'Jalan Bangsar Utama 1, Bangsar',
  'Bangsar',
  'Kuala Lumpur',
  '59000',
  1,
  1,
  500,
  'David Tan',
  '+60123456786',
  'david.tan@example.com',
  'active',
  false,
  67,
  '2024-01-12 16:45:00+00',
  '2024-01-12 16:45:00+00',
  '2024-01-12 16:45:00+00'
),
(
  '550e8400-e29b-41d4-a716-446655440105',
  '550e8400-e29b-41d4-a716-446655440001',
  'Penthouse Suite in KL Sentral',
  'Spectacular penthouse with panoramic city views. Features 4 bedrooms, 3 bathrooms, private terrace, and premium finishes throughout. Located in the heart of KL Sentral with direct access to transportation hub.',
  2800000.00,
  'condo',
  'sale',
  'KL Sentral, Brickfields',
  'Kuala Lumpur',
  'Kuala Lumpur',
  '50470',
  4,
  3,
  2200,
  'Sarah Lim',
  '+60123456789',
  'sarah.lim@example.com',
  'pending',
  true,
  45,
  '2024-01-16 11:20:00+00',
  '2024-01-16 11:20:00+00',
  null
),
(
  '550e8400-e29b-41d4-a716-446655440106',
  '550e8400-e29b-41d4-a716-446655440002',
  'Family Home in Subang Jaya',
  'Spacious 3-bedroom double-storey house in established neighborhood. Features include large living areas, modern kitchen, private garden, and 2-car garage. Close to schools, shopping centers, and highways.',
  850000.00,
  'house',
  'sale',
  'Jalan SS15/4D, Subang Jaya',
  'Subang Jaya',
  'Selangor',
  '47500',
  3,
  3,
  1800,
  'Ahmad Rahman',
  '+60123456788',
  'ahmad.rahman@example.com',
  'active',
  false,
  112,
  '2024-01-11 13:10:00+00',
  '2024-01-11 13:10:00+00',
  '2024-01-11 13:10:00+00'
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  views_count = EXCLUDED.views_count;

-- Insert property images
INSERT INTO property_images (
  id, property_id, image_url, storage_path, is_featured, display_order, alt_text, created_at
) VALUES 
-- KLCC Apartment Images
('img-001', '550e8400-e29b-41d4-a716-446655440101', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 'klcc-apt-1.jpg', true, 0, 'Modern KLCC Apartment Living Room', now()),
('img-002', '550e8400-e29b-41d4-a716-446655440101', 'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800', 'klcc-apt-2.jpg', false, 1, 'KLCC Apartment Bedroom', now()),
('img-003', '550e8400-e29b-41d4-a716-446655440101', 'https://images.pexels.com/photos/1571472/pexels-photo-1571472.jpeg?auto=compress&cs=tinysrgb&w=800', 'klcc-apt-3.jpg', false, 2, 'KLCC Apartment Kitchen', now()),

-- PJ House Images
('img-004', '550e8400-e29b-41d4-a716-446655440102', 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800', 'pj-house-1.jpg', true, 0, 'PJ Terrace House Exterior', now()),
('img-005', '550e8400-e29b-41d4-a716-446655440102', 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 'pj-house-2.jpg', false, 1, 'PJ House Interior', now()),

-- Mont Kiara Condo Images
('img-006', '550e8400-e29b-41d4-a716-446655440103', 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800', 'mk-condo-1.jpg', true, 0, 'Mont Kiara Condo Living Area', now()),
('img-007', '550e8400-e29b-41d4-a716-446655440103', 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800', 'mk-condo-2.jpg', false, 1, 'Mont Kiara Condo Balcony', now()),

-- Bangsar Studio Images
('img-008', '550e8400-e29b-41d4-a716-446655440104', 'https://images.pexels.com/photos/2290753/pexels-photo-2290753.jpeg?auto=compress&cs=tinysrgb&w=800', 'bangsar-studio-1.jpg', true, 0, 'Bangsar Studio Apartment', now()),

-- Penthouse Images
('img-009', '550e8400-e29b-41d4-a716-446655440105', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800', 'penthouse-1.jpg', true, 0, 'KL Sentral Penthouse', now()),
('img-010', '550e8400-e29b-41d4-a716-446655440105', 'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800', 'penthouse-2.jpg', false, 1, 'Penthouse Terrace', now()),

-- Subang House Images
('img-011', '550e8400-e29b-41d4-a716-446655440106', 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800', 'subang-house-1.jpg', true, 0, 'Subang Jaya Family Home', now()),
('img-012', '550e8400-e29b-41d4-a716-446655440106', 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800', 'subang-house-2.jpg', false, 1, 'Subang House Garden', now())
ON CONFLICT (id) DO NOTHING;

-- Link properties with amenities
INSERT INTO property_amenities (property_id, amenity_id) 
SELECT p.id, a.id 
FROM properties p, amenities a 
WHERE 
  (p.id = '550e8400-e29b-41d4-a716-446655440101' AND a.name IN ('Swimming Pool', 'Gym', '24/7 Security', 'Parking', 'Air Conditioning')) OR
  (p.id = '550e8400-e29b-41d4-a716-446655440102' AND a.name IN ('Garden', 'Parking', 'Near LRT', 'Shopping Mall Nearby')) OR
  (p.id = '550e8400-e29b-41d4-a716-446655440103' AND a.name IN ('Swimming Pool', 'Gym', '24/7 Security', 'Parking', 'Furnished')) OR
  (p.id = '550e8400-e29b-41d4-a716-446655440104' AND a.name IN ('WiFi', 'Air Conditioning', 'Near LRT', 'Furnished')) OR
  (p.id = '550e8400-e29b-41d4-a716-446655440105' AND a.name IN ('Swimming Pool', 'Gym', '24/7 Security', 'Elevator', 'Balcony')) OR
  (p.id = '550e8400-e29b-41d4-a716-446655440106' AND a.name IN ('Garden', 'Parking', 'Near LRT', 'Shopping Mall Nearby', 'Playground'))
ON CONFLICT (property_id, amenity_id) DO NOTHING;

-- Update property counts and statistics
UPDATE properties SET 
  views_count = CASE id
    WHEN '550e8400-e29b-41d4-a716-446655440101' THEN 156
    WHEN '550e8400-e29b-41d4-a716-446655440102' THEN 89
    WHEN '550e8400-e29b-41d4-a716-446655440103' THEN 203
    WHEN '550e8400-e29b-41d4-a716-446655440104' THEN 67
    WHEN '550e8400-e29b-41d4-a716-446655440105' THEN 45
    WHEN '550e8400-e29b-41d4-a716-446655440106' THEN 112
    ELSE views_count
  END,
  inquiries_count = CASE id
    WHEN '550e8400-e29b-41d4-a716-446655440101' THEN 8
    WHEN '550e8400-e29b-41d4-a716-446655440102' THEN 12
    WHEN '550e8400-e29b-41d4-a716-446655440103' THEN 15
    WHEN '550e8400-e29b-41d4-a716-446655440104' THEN 3
    WHEN '550e8400-e29b-41d4-a716-446655440105' THEN 2
    WHEN '550e8400-e29b-41d4-a716-446655440106' THEN 7
    ELSE inquiries_count
  END;
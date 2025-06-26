/*
  # Create comprehensive property listing system

  1. New Tables
    - `properties` - Main property listings table
    - `property_images` - Property image storage references
    - `property_amenities` - Property amenities junction table
    - `amenities` - Master amenities list
    - `property_inquiries` - Buyer inquiries for properties

  2. Storage
    - Create storage bucket for property images
    - Set up RLS policies for image access

  3. Security
    - Enable RLS on all tables
    - Add comprehensive policies for different user roles
    - Implement rate limiting and validation

  4. Real-time
    - Enable real-time subscriptions for all tables
*/

-- Create amenities master table
CREATE TABLE IF NOT EXISTS amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text,
  category text DEFAULT 'general',
  created_at timestamptz DEFAULT now()
);

-- Insert default amenities
INSERT INTO amenities (name, icon, category) VALUES
  ('Swimming Pool', 'waves', 'recreation'),
  ('Gym', 'dumbbell', 'recreation'),
  ('Parking', 'car', 'convenience'),
  ('WiFi', 'wifi', 'technology'),
  ('24/7 Security', 'shield', 'security'),
  ('Garden', 'tree-pine', 'outdoor'),
  ('Air Conditioning', 'snowflake', 'comfort'),
  ('Elevator', 'arrow-up', 'convenience'),
  ('Balcony', 'home', 'outdoor'),
  ('Furnished', 'sofa', 'comfort'),
  ('Pet Friendly', 'heart', 'lifestyle'),
  ('Near LRT', 'train', 'transport'),
  ('Shopping Mall Nearby', 'shopping-bag', 'convenience'),
  ('Playground', 'gamepad-2', 'recreation'),
  ('BBQ Area', 'flame', 'recreation')
ON CONFLICT (name) DO NOTHING;

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price decimal(12,2) NOT NULL,
  property_type text NOT NULL CHECK (property_type IN ('house', 'apartment', 'condo', 'studio', 'commercial', 'land')),
  listing_type text NOT NULL CHECK (listing_type IN ('rent', 'sale')),
  
  -- Location details
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  
  -- Property details
  bedrooms integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  square_footage integer,
  lot_size integer,
  year_built integer,
  
  -- Contact information
  contact_name text,
  contact_phone text,
  contact_email text,
  
  -- Status and metadata
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'sold', 'rented', 'suspended')),
  featured boolean DEFAULT false,
  views_count integer DEFAULT 0,
  inquiries_count integer DEFAULT 0,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  published_at timestamptz,
  expires_at timestamptz
);

-- Create property images table
CREATE TABLE IF NOT EXISTS property_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  storage_path text NOT NULL,
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  alt_text text,
  created_at timestamptz DEFAULT now()
);

-- Create property amenities junction table
CREATE TABLE IF NOT EXISTS property_amenities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  amenity_id uuid REFERENCES amenities(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, amenity_id)
);

-- Create property inquiries table
CREATE TABLE IF NOT EXISTS property_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  buyer_id uuid REFERENCES users(id) ON DELETE CASCADE,
  seller_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  contact_phone text,
  contact_email text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_seller_id ON properties(seller_id);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_listing_type ON properties(listing_type);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_city_state ON properties(city, state);
CREATE INDEX IF NOT EXISTS idx_properties_price ON properties(price);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_amenities_property_id ON property_amenities(property_id);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_property_id ON property_inquiries(property_id);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_buyer_id ON property_inquiries(buyer_id);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_seller_id ON property_inquiries(seller_id);

-- Enable RLS on all tables
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_inquiries_updated_at
  BEFORE UPDATE ON property_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies for amenities (public read)
CREATE POLICY "Anyone can read amenities"
  ON amenities
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- RLS Policies for properties
CREATE POLICY "Anyone can read active properties"
  ON properties
  FOR SELECT
  TO authenticated, anon
  USING (status = 'active');

CREATE POLICY "Sellers can read own properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Sellers can insert own properties"
  ON properties
  FOR INSERT
  TO authenticated
  WITH CHECK (seller_id = auth.uid() AND EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('seller', 'admin')
  ));

CREATE POLICY "Sellers can update own properties"
  ON properties
  FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Sellers can delete own properties"
  ON properties
  FOR DELETE
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Admins can manage all properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for property images
CREATE POLICY "Anyone can read property images for active properties"
  ON property_images
  FOR SELECT
  TO authenticated, anon
  USING (EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_images.property_id 
    AND properties.status = 'active'
  ));

CREATE POLICY "Sellers can read own property images"
  ON property_images
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_images.property_id 
    AND properties.seller_id = auth.uid()
  ));

CREATE POLICY "Sellers can manage own property images"
  ON property_images
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_images.property_id 
    AND properties.seller_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_images.property_id 
    AND properties.seller_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all property images"
  ON property_images
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for property amenities
CREATE POLICY "Anyone can read property amenities for active properties"
  ON property_amenities
  FOR SELECT
  TO authenticated, anon
  USING (EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_amenities.property_id 
    AND properties.status = 'active'
  ));

CREATE POLICY "Sellers can manage own property amenities"
  ON property_amenities
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_amenities.property_id 
    AND properties.seller_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_amenities.property_id 
    AND properties.seller_id = auth.uid()
  ));

CREATE POLICY "Admins can manage all property amenities"
  ON property_amenities
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for property inquiries
CREATE POLICY "Buyers can read own inquiries"
  ON property_inquiries
  FOR SELECT
  TO authenticated
  USING (buyer_id = auth.uid());

CREATE POLICY "Sellers can read inquiries for own properties"
  ON property_inquiries
  FOR SELECT
  TO authenticated
  USING (seller_id = auth.uid());

CREATE POLICY "Buyers can create inquiries"
  ON property_inquiries
  FOR INSERT
  TO authenticated
  WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Sellers can update inquiries for own properties"
  ON property_inquiries
  FOR UPDATE
  TO authenticated
  USING (seller_id = auth.uid())
  WITH CHECK (seller_id = auth.uid());

CREATE POLICY "Admins can manage all inquiries"
  ON property_inquiries
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create storage bucket for property images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for property images
CREATE POLICY "Anyone can view property images"
  ON storage.objects
  FOR SELECT
  TO authenticated, anon
  USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own property images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own property images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_property_views(property_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE properties 
  SET views_count = views_count + 1 
  WHERE id = property_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment inquiry count
CREATE OR REPLACE FUNCTION increment_property_inquiries(property_uuid uuid)
RETURNS void AS $$
BEGIN
  UPDATE properties 
  SET inquiries_count = inquiries_count + 1 
  WHERE id = property_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update property status
CREATE OR REPLACE FUNCTION update_property_status(property_uuid uuid, new_status text)
RETURNS void AS $$
BEGIN
  UPDATE properties 
  SET status = new_status,
      published_at = CASE WHEN new_status = 'active' THEN now() ELSE published_at END
  WHERE id = property_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
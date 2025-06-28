/*
  # Create Appearances Management System

  1. New Tables
    - `site_settings` - Global site configuration
    - `hero_content` - Hero section content
    - `contact_info` - Business contact information
    - `legal_pages` - Terms, Privacy, etc.
    - `faq_categories` - FAQ categories
    - `faq_items` - FAQ questions and answers
    - `social_links` - Social media links

  2. Storage
    - Create storage bucket for site assets (logos, banners)
    - Set up RLS policies for asset access

  3. Security
    - Enable RLS on all tables
    - Admin-only access for modifications
    - Public read access for published content
*/

-- Create site_settings table for global configuration
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES users(id)
);

-- Create hero_content table
CREATE TABLE IF NOT EXISTS hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  main_heading text NOT NULL CHECK (length(main_heading) <= 60),
  subheading text NOT NULL CHECK (length(subheading) <= 120),
  cta_button_text text NOT NULL,
  banner_image_url text,
  banner_storage_path text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES users(id)
);

-- Create contact_info table
CREATE TABLE IF NOT EXISTS contact_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  address_line1 text NOT NULL,
  address_line2 text,
  address_line3 text,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text,
  country text DEFAULT 'Malaysia',
  primary_phone text NOT NULL,
  secondary_phone text,
  primary_email text NOT NULL,
  secondary_email text,
  business_hours jsonb, -- Store as JSON for flexibility
  google_maps_embed text,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES users(id)
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  url text NOT NULL,
  icon_name text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES users(id)
);

-- Create legal_pages table
CREATE TABLE IF NOT EXISTS legal_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text NOT NULL CHECK (page_type IN ('terms', 'privacy', 'about', 'contact')),
  title text NOT NULL,
  content text NOT NULL,
  version integer DEFAULT 1,
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES users(id),
  UNIQUE(page_type, version)
);

-- Create faq_categories table
CREATE TABLE IF NOT EXISTS faq_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES users(id)
);

-- Create faq_items table
CREATE TABLE IF NOT EXISTS faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES faq_categories(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_site_settings_published ON site_settings(is_published);
CREATE INDEX IF NOT EXISTS idx_hero_content_published ON hero_content(is_published);
CREATE INDEX IF NOT EXISTS idx_contact_info_published ON contact_info(is_published);
CREATE INDEX IF NOT EXISTS idx_legal_pages_type ON legal_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_legal_pages_published ON legal_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_faq_categories_order ON faq_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_faq_items_category ON faq_items(category_id);
CREATE INDEX IF NOT EXISTS idx_faq_items_order ON faq_items(display_order);
CREATE INDEX IF NOT EXISTS idx_social_links_order ON social_links(display_order);

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;

-- Add updated_at triggers
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_content_updated_at
  BEFORE UPDATE ON hero_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON social_links
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_pages_updated_at
  BEFORE UPDATE ON legal_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_categories_updated_at
  BEFORE UPDATE ON faq_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faq_items_updated_at
  BEFORE UPDATE ON faq_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies - Public read for published content, admin-only write
CREATE POLICY "Anyone can read published site settings"
  ON site_settings
  FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admins can manage all site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone can read published hero content"
  ON hero_content
  FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admins can manage hero content"
  ON hero_content
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone can read published contact info"
  ON contact_info
  FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admins can manage contact info"
  ON contact_info
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone can read active social links"
  ON social_links
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

CREATE POLICY "Admins can manage social links"
  ON social_links
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone can read published legal pages"
  ON legal_pages
  FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admins can manage legal pages"
  ON legal_pages
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone can read visible FAQ categories"
  ON faq_categories
  FOR SELECT
  TO authenticated, anon
  USING (is_visible = true);

CREATE POLICY "Admins can manage FAQ categories"
  ON faq_categories
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Anyone can read visible FAQ items"
  ON faq_items
  FOR SELECT
  TO authenticated, anon
  USING (is_visible = true AND EXISTS (
    SELECT 1 FROM faq_categories 
    WHERE faq_categories.id = faq_items.category_id 
    AND faq_categories.is_visible = true
  ));

CREATE POLICY "Admins can manage FAQ items"
  ON faq_items
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Create storage bucket for site assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for site assets
CREATE POLICY "Anyone can view site assets"
  ON storage.objects
  FOR SELECT
  TO authenticated, anon
  USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload site assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'site-assets' AND is_admin());

CREATE POLICY "Admins can update site assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'site-assets' AND is_admin());

CREATE POLICY "Admins can delete site assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'site-assets' AND is_admin());

-- Insert default data
INSERT INTO site_settings (setting_key, setting_value, is_published, updated_by) VALUES
('logo_url', '""', true, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('logo_storage_path', '""', true, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('site_name', '"RumahList.my"', true, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('theme_color', '"amber"', true, (SELECT id FROM users WHERE role = 'admin' LIMIT 1))
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO hero_content (main_heading, subheading, cta_button_text, is_published, updated_by) VALUES
('Find Your Dream Home in Malaysia', 'Discover the perfect property for rent or purchase', 'Start Searching', true, (SELECT id FROM users WHERE role = 'admin' LIMIT 1))
ON CONFLICT DO NOTHING;

INSERT INTO contact_info (
  business_name, address_line1, city, state, postal_code, 
  primary_phone, primary_email, business_hours, is_published, updated_by
) VALUES (
  'RumahList.my', 
  'Level 10, Menara ABC, Jalan Ampang', 
  'Kuala Lumpur', 
  'Kuala Lumpur', 
  '50450',
  '+60 3-1234 5678',
  'info@rumahlist.my',
  '{"monday": "9:00 AM - 6:00 PM", "tuesday": "9:00 AM - 6:00 PM", "wednesday": "9:00 AM - 6:00 PM", "thursday": "9:00 AM - 6:00 PM", "friday": "9:00 AM - 6:00 PM", "saturday": "9:00 AM - 2:00 PM", "sunday": "Closed"}',
  true,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
)
ON CONFLICT DO NOTHING;

INSERT INTO faq_categories (name, description, display_order, updated_by) VALUES
('Getting Started', 'Basic questions about using RumahList.my', 0, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('For Buyers & Renters', 'Questions for property seekers', 1, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('For Sellers', 'Questions for property owners', 2, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Payments & Security', 'Payment and security related questions', 3, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Technical Support', 'Technical help and troubleshooting', 4, (SELECT id FROM users WHERE role = 'admin' LIMIT 1))
ON CONFLICT (name) DO NOTHING;

INSERT INTO social_links (platform, url, icon_name, display_order, updated_by) VALUES
('Facebook', 'https://facebook.com/rumahlist', 'facebook', 0, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Twitter', 'https://twitter.com/rumahlist', 'twitter', 1, (SELECT id FROM users WHERE role = 'admin' LIMIT 1)),
('Instagram', 'https://instagram.com/rumahlist', 'instagram', 2, (SELECT id FROM users WHERE role = 'admin' LIMIT 1))
ON CONFLICT DO NOTHING;
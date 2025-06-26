export interface Property {
  id: string;
  seller_id: string;
  title: string;
  description?: string;
  price: number;
  property_type: 'house' | 'apartment' | 'condo' | 'studio' | 'commercial' | 'land';
  listing_type: 'rent' | 'sale';
  
  // Location
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  
  // Property details
  bedrooms: number;
  bathrooms: number;
  square_footage?: number;
  lot_size?: number;
  year_built?: number;
  
  // Contact
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  
  // Status
  status: 'draft' | 'pending' | 'active' | 'sold' | 'rented' | 'suspended';
  featured: boolean;
  views_count: number;
  inquiries_count: number;
  
  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
  expires_at?: string;
  
  // Related data
  images?: PropertyImage[];
  amenities?: Amenity[];
  seller?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    verified: boolean;
  };
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  storage_path: string;
  is_featured: boolean;
  display_order: number;
  alt_text?: string;
  created_at: string;
}

export interface Amenity {
  id: string;
  name: string;
  icon?: string;
  category: string;
  created_at: string;
}

export interface PropertyAmenity {
  id: string;
  property_id: string;
  amenity_id: string;
  created_at: string;
  amenity?: Amenity;
}

export interface PropertyInquiry {
  id: string;
  property_id: string;
  buyer_id: string;
  seller_id: string;
  message: string;
  contact_phone?: string;
  contact_email?: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  created_at: string;
  updated_at: string;
  
  // Related data
  property?: Property;
  buyer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  property_type: string;
  listing_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  lot_size: number;
  year_built: number;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  amenity_ids: string[];
  featured_image?: File;
  additional_images: File[];
}

export interface PropertyFilters {
  search?: string;
  property_type?: string;
  listing_type?: string;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  city?: string;
  state?: string;
  amenities?: string[];
  status?: string;
}
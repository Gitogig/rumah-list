export interface Property {
  id: string;
  title: string;
  price: number;
  type: 'rent' | 'sale';
  propertyType: 'house' | 'apartment' | 'condo' | 'studio';
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: string;
  state: string;
  images: string[];
  description: string;
  amenities: string[];
  seller: Seller;
  featured: boolean;
  status: 'active' | 'pending' | 'sold' | 'rented';
  createdAt: string;
  updatedAt: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  verified: boolean;
  rating: number;
  totalListings: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  phone?: string;
  verified: boolean;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
}

export interface AdminStats {
  totalListings: number;
  totalUsers: number;
  totalSellers: number;
  monthlyRevenue: number;
  pendingApprovals: number;
  activeTransactions: number;
}

export interface Transaction {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  type: 'rent' | 'purchase';
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface SearchFilters {
  location: string;
  propertyType: string;
  priceMin: number;
  priceMax: number;
  bedrooms: number;
  type: 'rent' | 'sale' | 'all';
}
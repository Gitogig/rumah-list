import { Property, User, AdminStats, Transaction } from '../types';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern 3BR Apartment in KLCC',
    price: 3500,
    type: 'rent',
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    location: 'KLCC',
    state: 'Kuala Lumpur',
    images: [
      'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1571472/pexels-photo-1571472.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Luxurious 3-bedroom apartment with stunning city views in the heart of KLCC. Features modern amenities, swimming pool, gym, and 24/7 security.',
    amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Parking', 'Air Conditioning'],
    seller: {
      id: 's1',
      name: 'Sarah Lim',
      email: 'sarah@example.com',
      phone: '+60123456789',
      verified: true,
      rating: 4.8,
      totalListings: 12
    },
    featured: true,
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Cozy 2BR House in Petaling Jaya',
    price: 650000,
    type: 'sale',
    propertyType: 'house',
    bedrooms: 2,
    bathrooms: 2,
    area: 900,
    location: 'Petaling Jaya',
    state: 'Selangor',
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Charming 2-bedroom terrace house in a quiet neighborhood. Perfect for small families or young professionals.',
    amenities: ['Garden', 'Parking', 'Near LRT', 'Shopping Mall Nearby'],
    seller: {
      id: 's2',
      name: 'Ahmad Rahman',
      email: 'ahmad@example.com',
      phone: '+60123456788',
      verified: true,
      rating: 4.5,
      totalListings: 8
    },
    featured: false,
    status: 'active',
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z'
  },
  {
    id: '3',
    title: 'Luxury Condo in Mont Kiara',
    price: 4500,
    type: 'rent',
    propertyType: 'condo',
    bedrooms: 2,
    bathrooms: 2,
    area: 1100,
    location: 'Mont Kiara',
    state: 'Kuala Lumpur',
    images: [
      'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Premium condominium with full facilities and excellent location in Mont Kiara.',
    amenities: ['Swimming Pool', 'Gym', 'Tennis Court', 'Concierge', 'Parking'],
    seller: {
      id: 's3',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+60123456787',
      verified: true,
      rating: 4.9,
      totalListings: 15
    },
    featured: true,
    status: 'active',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: 'Studio Apartment in Bangsar',
    price: 1800,
    type: 'rent',
    propertyType: 'studio',
    bedrooms: 1,
    bathrooms: 1,
    area: 500,
    location: 'Bangsar',
    state: 'Kuala Lumpur',
    images: [
      'https://images.pexels.com/photos/2290753/pexels-photo-2290753.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    description: 'Compact and modern studio apartment perfect for young professionals.',
    amenities: ['WiFi', 'Air Conditioning', 'Near LRT', 'Furnished'],
    seller: {
      id: 's4',
      name: 'David Tan',
      email: 'david@example.com',
      phone: '+60123456786',
      verified: true,
      rating: 4.3,
      totalListings: 6
    },
    featured: false,
    status: 'active',
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmad Rahman',
    email: 'ahmad@example.com',
    role: 'buyer',
    verified: true,
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Lim',
    email: 'sarah@example.com',
    role: 'seller',
    verified: true,
    createdAt: '2024-01-02T11:00:00Z'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@rumahlist.my',
    role: 'admin',
    verified: true,
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const mockAdminStats: AdminStats = {
  totalListings: 156,
  totalUsers: 1234,
  totalSellers: 89,
  monthlyRevenue: 125000,
  pendingApprovals: 12,
  activeTransactions: 45
};

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    propertyId: '1',
    buyerId: '1',
    sellerId: 's1',
    amount: 3500,
    type: 'rent',
    status: 'completed',
    createdAt: '2024-01-15T12:00:00Z'
  },
  {
    id: 't2',
    propertyId: '2',
    buyerId: '2',
    sellerId: 's2',
    amount: 650000,
    type: 'purchase',
    status: 'pending',
    createdAt: '2024-01-14T15:30:00Z'
  }
];

export const malaysianStates = [
  'Kuala Lumpur',
  'Selangor',
  'Johor',
  'Penang',
  'Perak',
  'Kedah',
  'Kelantan',
  'Terengganu',
  'Pahang',
  'Negeri Sembilan',
  'Melaka',
  'Sabah',
  'Sarawak',
  'Perlis',
  'Putrajaya',
  'Labuan'
];

export const propertyTypes = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condominium' },
  { value: 'studio', label: 'Studio' }
];
export const MALAYSIAN_STATES = [
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
] as const;

export const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condominium' },
  { value: 'studio', label: 'Studio' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'land', label: 'Land' }
] as const;

export const LISTING_TYPES = [
  { value: 'rent', label: 'For Rent' },
  { value: 'sale', label: 'For Sale' }
] as const;

export const PROPERTY_STATUS = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'sold', label: 'Sold', color: 'blue' },
  { value: 'rented', label: 'Rented', color: 'purple' },
  { value: 'suspended', label: 'Suspended', color: 'red' },
  { value: 'rejected', label: 'Rejected', color: 'red' }
] as const;

export const USER_ROLES = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'admin', label: 'Admin' }
] as const;

export const PAGINATION_SIZES = [10, 25, 50, 100] as const;

export const IMAGE_UPLOAD_LIMITS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
} as const;
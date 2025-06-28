import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import SearchBar from '../components/search/SearchBar';
import PropertyCard from '../components/property/PropertyCard';
import { PropertyService } from '../lib/propertyService';
import { Property } from '../types/property';
import { SearchFilters } from '../types';

const PropertiesPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isGridView, setIsGridView] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    // Apply initial filters from URL params
    const initialFilters: SearchFilters = {
      location: searchParams.get('location') || '',
      propertyType: searchParams.get('propertyType') || '',
      type: (searchParams.get('type') as 'rent' | 'sale' | 'all') || 'all',
      bedrooms: parseInt(searchParams.get('bedrooms') || '0'),
      priceMin: parseInt(searchParams.get('priceMin') || '0'),
      priceMax: parseInt(searchParams.get('priceMax') || '0'),
    };
    
    handleSearch(initialFilters);
  }, [properties, searchParams]);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      const data = await PropertyService.getProperties({ status: 'active' });
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    let filtered = properties;

    // Apply filters
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.state.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.city.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.propertyType) {
      filtered = filtered.filter(p => p.property_type === filters.propertyType);
    }

    if (filters.type !== 'all') {
      filtered = filtered.filter(p => p.listing_type === filters.type);
    }

    if (filters.bedrooms > 0) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedrooms);
    }

    if (filters.priceMin > 0) {
      filtered = filtered.filter(p => p.price >= filters.priceMin);
    }

    if (filters.priceMax > 0) {
      filtered = filtered.filter(p => p.price <= filters.priceMax);
    }

    // Apply sorting
    filtered = applySorting(filtered, sortBy);
    
    setFilteredProperties(filtered);
  };

  const applySorting = (properties: Property[], sortType: string) => {
    switch (sortType) {
      case 'price-low':
        return [...properties].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...properties].sort((a, b) => b.price - a.price);
      case 'newest':
        return [...properties].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return [...properties].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      default:
        return properties;
    }
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setFilteredProperties(applySorting(filteredProperties, newSortBy));
  };

  // Convert Property to the format expected by PropertyCard
  const convertPropertyForCard = (property: Property) => ({
    id: property.id,
    title: property.title,
    price: property.price,
    type: property.listing_type as 'rent' | 'sale',
    propertyType: property.property_type as 'house' | 'apartment' | 'condo' | 'studio',
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.square_footage || 0,
    location: property.city,
    state: property.state,
    images: property.images?.map(img => img.image_url) || [],
    description: property.description || '',
    amenities: property.amenities?.map(pa => pa.amenity?.name).filter(Boolean) || [],
    seller: {
      id: property.seller?.id || '',
      name: property.seller?.name || '',
      email: property.seller?.email || '',
      phone: property.seller?.phone || '',
      verified: property.seller?.verified || false,
      rating: 4.8, // Default rating
      totalListings: 12 // Default count
    },
    featured: property.featured,
    status: property.status as 'active' | 'pending' | 'sold' | 'rented',
    createdAt: property.created_at,
    updatedAt: property.updated_at
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Properties for Rent & Sale</h1>
              <p className="text-gray-600 mt-2">
                {isLoading ? 'Loading...' : `${filteredProperties.length} properties found`}
              </p>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-2 rounded-md transition-colors ${
                    isGridView ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-2 rounded-md transition-colors ${
                    !isGridView ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`w-full lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Search Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <SearchBar onSearch={handleSearch} />
            </div>
          </aside>

          {/* Properties Grid/List */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600">Try adjusting your search filters to see more results.</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                isGridView 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={convertPropertyForCard(property)} />
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {filteredProperties.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg">1</button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    2
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    3
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPage;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, TrendingUp, Shield, Users, Star, ArrowRight, Home as HomeIcon, MapPin } from 'lucide-react';
import SearchBar from '../components/search/SearchBar';
import PropertyCard from '../components/property/PropertyCard';
import { PropertyService } from '../lib/propertyService';
import { Property } from '../types/property';
import { SearchFilters } from '../types';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setIsLoading(true);
      
      // Get all active properties
      const allProperties = await PropertyService.getProperties({ status: 'active' });
      
      // Get featured properties
      const featured = allProperties.filter(p => p.featured).slice(0, 3);
      setFeaturedProperties(featured);
      
      // Get recent properties
      const recent = allProperties
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 6);
      setRecentProperties(recent);
      
      // Set total count
      setTotalProperties(allProperties.length);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    // Navigate to properties page with filters
    const searchParams = new URLSearchParams();
    if (filters.location) searchParams.set('location', filters.location);
    if (filters.propertyType) searchParams.set('propertyType', filters.propertyType);
    if (filters.type !== 'all') searchParams.set('type', filters.type);
    if (filters.bedrooms > 0) searchParams.set('bedrooms', filters.bedrooms.toString());
    if (filters.priceMin > 0) searchParams.set('priceMin', filters.priceMin.toString());
    if (filters.priceMax > 0) searchParams.set('priceMax', filters.priceMax.toString());
    
    window.location.href = `/properties?${searchParams.toString()}`;
  };

  const stats = [
    { icon: HomeIcon, value: `${totalProperties.toLocaleString()}+`, label: 'Properties Listed' },
    { icon: Users, value: '50,000+', label: 'Happy Customers' },
    { icon: Shield, value: '100%', label: 'Verified Sellers' },
    { icon: TrendingUp, value: '95%', label: 'Success Rate' }
  ];

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Malaysian Home"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            
            {/* Quick Stats */}
            <div className="mb-8">
              <p className="text-lg text-amber-400 font-semibold">
                We have <span className="text-2xl font-bold text-white">{totalProperties.toLocaleString()}</span> properties for you!
              </p>
            </div>
            
            <Link
              to="/properties"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-xl"
            >
              <Search className="h-5 w-5" />
              <span>{t('hero.cta')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Property</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Use our advanced search to find properties that match your exact requirements
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} className="max-w-5xl mx-auto" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Properties</h2>
              <p className="text-gray-600">Handpicked premium properties just for you</p>
            </div>
            <Link
              to="/properties?featured=true"
              className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={convertPropertyForCard(property)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Properties</h2>
              <p className="text-gray-600">Fresh listings from verified sellers</p>
            </div>
            <Link
              to="/properties"
              className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentProperties.map((property) => (
                <PropertyCard key={property.id} property={convertPropertyForCard(property)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to List Your Property?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of verified sellers and reach millions of potential buyers and renters
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-amber-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Become a Seller
            </Link>
            <Link
              to="/properties"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-amber-600 transition-all duration-200"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Malaysian Locations */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Locations in Malaysia</h2>
            <p className="text-gray-600">Discover properties in Malaysia's most sought-after areas</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              'Kuala Lumpur', 'Selangor', 'Johor', 'Penang',
              'Perak', 'Kedah', 'Melaka', 'Sabah'
            ].map((location) => (
              <Link
                key={location}
                to={`/properties?location=${location}`}
                className="group bg-gray-50 hover:bg-amber-50 p-4 rounded-lg text-center transition-all duration-200 hover:shadow-md"
              >
                <MapPin className="h-8 w-8 text-gray-400 group-hover:text-amber-600 mx-auto mb-2 transition-colors" />
                <span className="text-sm font-medium text-gray-700 group-hover:text-amber-600 transition-colors">
                  {location}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
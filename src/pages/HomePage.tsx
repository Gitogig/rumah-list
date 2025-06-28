import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, TrendingUp, Shield, Users, Star, ArrowRight, Home as HomeIcon, MapPin } from 'lucide-react';
import SearchBar from '../components/search/SearchBar';
import PropertyCard from '../components/property/PropertyCard';
import { PropertyService } from '../lib/propertyService';
import { Property } from '../types/property';
import { SearchFilters } from '../types';
import { useAppearance } from '../contexts/AppearanceContext';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { heroContent, isLoading: appearanceLoading } = useAppearance();
  const { theme } = useTheme();
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

  // Use dynamic content from admin or fallback to defaults
  const heroTitle = heroContent?.main_heading || t('hero.title');
  const heroSubtitle = heroContent?.subheading || t('hero.subtitle');
  const heroCtaText = heroContent?.cta_button_text || t('hero.cta');
  const heroBannerImage = heroContent?.banner_image_url || 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1920';

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
      <section className={`relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'} text-white`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        
        {/* Hero Image */}
        <div className="absolute inset-0">
          <img
            src={heroBannerImage}
            alt="Malaysian Home"
            className="w-full h-full object-cover opacity-30"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl" data-aos="fade-up">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {heroTitle}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {heroSubtitle}
            </motion.p>
            
            {/* Quick Stats */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-lg text-amber-400 font-semibold">
                We have <span className="text-2xl font-bold text-white">{totalProperties.toLocaleString()}</span> properties for you!
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                to="/properties"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-xl ripple"
              >
                <Search className="h-5 w-5 icon-bounce" />
                <span>{heroCtaText}</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className={`py-12 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8" data-aos="fade-up">
            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Find Your Perfect Property</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Use our advanced search to find properties that match your exact requirements
            </p>
          </div>
          
          <div data-aos="fade-up" data-aos-delay="150">
            <SearchBar onSearch={handleSearch} className="max-w-5xl mx-auto" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center"
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg hover-lift`}>
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-white icon-bounce" />
                  </div>
                  <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>{stat.value}</div>
                  <div className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8" data-aos="fade-up">
            <div>
              <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Featured Properties</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Handpicked premium properties just for you</p>
            </div>
            <Link
              to="/properties?featured=true"
              className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-amber-500 hover:text-amber-400' : 'text-amber-600 hover:text-amber-700'} font-semibold transition-colors mt-4 md:mt-0 group`}
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl h-96 animate-pulse`}></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredProperties.map((property, index) => (
                <div 
                  key={property.id}
                  data-aos="fade-up" 
                  data-aos-delay={index * 100}
                >
                  <PropertyCard property={convertPropertyForCard(property)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Properties */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8" data-aos="fade-up">
            <div>
              <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Latest Properties</h2>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Fresh listings from verified sellers</p>
            </div>
            <Link
              to="/properties"
              className={`flex items-center space-x-2 ${theme === 'dark' ? 'text-amber-500 hover:text-amber-400' : 'text-amber-600 hover:text-amber-700'} font-semibold transition-colors mt-4 md:mt-0 group`}
            >
              <span>View All</span>
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl h-96 animate-pulse`}></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {recentProperties.map((property, index) => (
                <div 
                  key={property.id}
                  data-aos="fade-up" 
                  data-aos-delay={index * 100}
                >
                  <PropertyCard property={convertPropertyForCard(property)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to List Your Property?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of verified sellers and reach millions of potential buyers and renters
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-amber-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg ripple"
            >
              Become a Seller
            </Link>
            <Link
              to="/properties"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-amber-600 transition-all duration-200 ripple"
            >
              Explore Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Malaysian Locations */}
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Popular Locations in Malaysia</h2>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Discover properties in Malaysia's most sought-after areas</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              'Kuala Lumpur', 'Selangor', 'Johor', 'Penang',
              'Perak', 'Kedah', 'Melaka', 'Sabah'
            ].map((location, index) => (
              <Link
                key={location}
                to={`/properties?location=${location}`}
                className={`group ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-amber-50'} p-4 rounded-lg text-center transition-all duration-200 hover:shadow-md hover-lift`}
                data-aos="fade-up" 
                data-aos-delay={index * 50}
              >
                <MapPin className={`h-8 w-8 ${theme === 'dark' ? 'text-gray-400 group-hover:text-amber-500' : 'text-gray-400 group-hover:text-amber-600'} mx-auto mb-2 transition-colors`} />
                <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200 group-hover:text-amber-500' : 'text-gray-700 group-hover:text-amber-600'} transition-colors`}>
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
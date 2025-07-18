import React, { useState, memo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Bed, Bath, Square, MapPin, Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property } from '../../types';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard: React.FC<PropertyCardProps> = memo(({ property }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === 'dark';

  // Reset image loaded state when property changes
  useEffect(() => {
    setImageLoaded(false);
    setCurrentImageIndex(0);
  }, [property.id]);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const formatPrice = (price: number, type: 'rent' | 'sale') => {
    if (type === 'rent') {
      return `RM ${price.toLocaleString()}${t('common.month')}`;
    }
    return `RM ${price.toLocaleString()}`;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <motion.div 
      className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group overflow-hidden h-full`}
      onMouseEnter={() => {
        // Only update state if needed to prevent unnecessary re-renders
        if (!isHovered) setIsHovered(true);
      }}
      onMouseLeave={() => {
        // Only update state if needed to prevent unnecessary re-renders
        if (isHovered) setIsHovered(false);
      }}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/property/${property.id}`} className="block h-full">
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-200 hover-zoom">
          {property.images && property.images.length > 0 ? (
            <>
              {!imageLoaded && (
                <div className={`absolute inset-0 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse flex items-center justify-center`}>
                  <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'} text-sm`}>Loading...</span>
                </div>
              )}
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0' 
                }`}
                onLoad={handleImageLoad}
                loading="lazy"
                decoding="async" 
                fetchpriority={currentImageIndex === 0 ? "high" : "auto"}
                width="400"
                height="300"
              />
            </>
          ) : (
            <div className={`w-full h-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} flex items-center justify-center`}>
              <span className={`${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No Image</span>
            </div>
          )}
          
          {/* Image Navigation */}
          {property.images && property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              {/* Image Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Property Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              property.type === 'rent' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {property.type === 'rent' ? t('common.rent') : t('common.sale')}
            </span>
          </div>

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute top-3 right-3">
              <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                <Star className="h-3 w-3" />
                <span>Featured</span>
              </span>
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
            style={{ display: property.featured ? 'none' : 'block' }}
            aria-label={isLiked ? "Unlike property" : "Like property"}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'} transition-colors`} />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {formatPrice(property.price, property.type)}
            </span>
          </div>

          {/* Title */}
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white group-hover:text-amber-400' : 'text-gray-900 group-hover:text-amber-600'} mb-2 line-clamp-2 transition-colors`}>
            {property.title}
          </h3>

          {/* Location */}
          <div className={`flex items-center ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{property.location}, {property.state}</span>
          </div>

          {/* Property Details */}
          <div className={`flex items-center justify-between ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bedrooms}</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.bathrooms}</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.area} {t('common.sqft')}</span>
              </div>
            </div>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full flex items-center justify-center`}>
                <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {property.seller.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{property.seller.name}</p>
                {property.seller.verified && (
                  <div className="flex items-center">
                    <Star className="h-3 w-3 text-amber-500 mr-1" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Verified</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-500 mr-1" />
                <span className="text-sm font-medium">{property.seller.rating}</span>
              </div>
              <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{property.seller.totalListings} listings</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

PropertyCard.displayName = 'PropertyCard';

export default PropertyCard;
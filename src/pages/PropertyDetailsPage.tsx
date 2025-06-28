import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Bed, Bath, Square, MapPin, Star, Heart, Share2, 
  Phone, Mail, MessageCircle, ChevronLeft, ChevronRight,
  Wifi, Car, Shield, Dumbbell, Waves, TreePine, CheckCircle, ExternalLink, Clock
} from 'lucide-react';
import { PropertyService } from '../lib/propertyService';
import { Property } from '../types/property';

const PropertyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  useEffect(() => {
    if (id) {
      loadProperty(id);
    }
  }, [id]);

  const loadProperty = async (propertyId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const foundProperty = await PropertyService.getPropertyById(propertyId);
      
      if (!foundProperty) {
        setError('Property not found');
        return;
      }
      
      setProperty(foundProperty);
      
      // Increment view count
      await PropertyService.incrementViewCount(propertyId);
    } catch (error) {
      console.error('Error loading property:', error);
      setError('Failed to load property details');
    } finally {
      setIsLoading(false);
    }
  };

  const nextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === property.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images!.length - 1 : prev - 1
      );
    }
  };

  const formatPrice = (price: number, type: 'rent' | 'sale') => {
    if (type === 'rent') {
      return `RM ${price.toLocaleString()}${t('common.month')}`;
    }
    return `RM ${price.toLocaleString()}`;
  };

  const getAmenityIcon = (amenity: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Swimming Pool': <Waves className="h-5 w-5" />,
      'Gym': <Dumbbell className="h-5 w-5" />,
      'Parking': <Car className="h-5 w-5" />,
      'WiFi': <Wifi className="h-5 w-5" />,
      '24/7 Security': <Shield className="h-5 w-5" />,
      'Garden': <TreePine className="h-5 w-5" />,
    };
    return icons[amenity] || <CheckCircle className="h-5 w-5" />;
  };

  // Format phone number for calling (remove spaces, dashes, and ensure proper format)
  const formatPhoneForCalling = (phone: string): string => {
    if (!phone) return '';
    
    // Remove all non-digit characters except +
    let cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // If it starts with +60, keep it as is
    if (cleanPhone.startsWith('+60')) {
      return cleanPhone;
    }
    
    // If it starts with 60, add +
    if (cleanPhone.startsWith('60')) {
      return '+' + cleanPhone;
    }
    
    // If it starts with 0, replace with +60
    if (cleanPhone.startsWith('0')) {
      return '+6' + cleanPhone;
    }
    
    // If it's just the number without country code, add +60
    if (cleanPhone.length >= 9 && cleanPhone.length <= 11) {
      return '+60' + cleanPhone;
    }
    
    return cleanPhone;
  };

  // Format phone number for WhatsApp (remove spaces, dashes, and ensure proper format)
  const formatPhoneForWhatsApp = (phone: string): string => {
    if (!phone) return '';
    
    // Remove all non-digit characters except +
    let cleanPhone = phone.replace(/[^\d+]/g, '');
    
    // If it starts with +60, keep it as is
    if (cleanPhone.startsWith('+60')) {
      return cleanPhone;
    }
    
    // If it starts with 60, add +
    if (cleanPhone.startsWith('60')) {
      return '+' + cleanPhone;
    }
    
    // If it starts with 0, replace with +60
    if (cleanPhone.startsWith('0')) {
      return '+6' + cleanPhone;
    }
    
    // If it's just the number without country code, add +60
    if (cleanPhone.length >= 9 && cleanPhone.length <= 11) {
      return '+60' + cleanPhone;
    }
    
    return cleanPhone;
  };

  // Smart call handler - Phone dialer on Android, WhatsApp on PC
  const handleCallNow = () => {
    const phoneNumber = property?.contact_phone || property?.seller?.phone;
    if (!phoneNumber) {
      alert('Phone number not available for this property');
      return;
    }

    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase();
    const isAndroid = /android/i.test(userAgent);
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    if (isAndroid || isMobile) {
      // On Android/Mobile: Open phone dialer
      const formattedPhone = formatPhoneForCalling(phoneNumber);
      console.log('Opening phone dialer for mobile:', formattedPhone);
      window.location.href = `tel:${formattedPhone}`;
    } else {
      // On PC: Open WhatsApp
      const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
      const message = encodeURIComponent(
        `Hi! I'm interested in your property: ${property?.title}. Could you please provide more details?`
      );
      
      const whatsappUrl = `https://wa.me/${formattedPhone.replace('+', '')}?text=${message}`;
      console.log('Opening WhatsApp for PC:', whatsappUrl);
      window.open(whatsappUrl, '_blank');
    }
  };

  // Handle WhatsApp redirect
  const handleWhatsAppClick = () => {
    const phoneNumber = property?.contact_phone || property?.seller?.phone;
    if (!phoneNumber) {
      alert('WhatsApp number not available for this property');
      return;
    }

    const formattedPhone = formatPhoneForWhatsApp(phoneNumber);
    const message = encodeURIComponent(
      `Hi! I'm interested in your property: ${property?.title}. Could you please provide more details?`
    );
    
    const whatsappUrl = `https://wa.me/${formattedPhone.replace('+', '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  // Handle email - redirect to Gmail or Outlook with seller's email and simple message
  const handleEmailClick = () => {
    const email = property?.contact_email || property?.seller?.email;
    if (!email) {
      alert('Email not available for this property');
      return;
    }
    
    const subject = encodeURIComponent(`Interested in Property: ${property?.title}`);
    const body = encodeURIComponent(`Hi,

I am interested in this property.

Property Details:
- ${property?.title}
- Location: ${property?.address}, ${property?.city}
- Price: ${formatPrice(property?.price || 0, property?.listing_type || 'sale')}

Please contact me for more information.

Thank you!`);
    
    // Try to detect user's preferred email client and redirect accordingly
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    if (isMobile) {
      // For mobile devices, try Gmail app first, then fallback to default mail client
      const gmailUrl = `googlegmail://co?to=${email}&subject=${subject}&body=${body}`;
      const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
      
      // Try Gmail app first
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = gmailUrl;
      document.body.appendChild(iframe);
      
      // Fallback to default mail client after a short delay
      setTimeout(() => {
        window.location.href = mailtoUrl;
        document.body.removeChild(iframe);
      }, 500);
    } else {
      // For desktop, try to open Gmail in browser first, then fallback to default mail client
      const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&subject=${subject}&body=${body}`;
      const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
      
      // Try to open Gmail in a new tab
      const gmailWindow = window.open(gmailWebUrl, '_blank');
      
      // If popup was blocked or Gmail didn't open, fallback to mailto
      setTimeout(() => {
        if (!gmailWindow || gmailWindow.closed) {
          window.location.href = mailtoUrl;
        }
      }, 1000);
    }
  };

  const handlePayment = () => {
    setShowPaymentModal(true);
    // Here you would integrate with Stripe
    alert('Stripe payment integration would be implemented here');
  };

  // Handle Rent Now click - show coming soon overlay
  const handleRentNow = () => {
    setShowComingSoon(true);
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowComingSoon(false);
    }, 3000);
  };

  // Generate Google Maps URL
  const getGoogleMapsUrl = () => {
    if (!property) return '';
    
    const address = `${property.address}, ${property.city}, ${property.state}, Malaysia`;
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(address)}`;
  };

  // Generate Google Maps search URL for fallback
  const getGoogleMapsSearchUrl = () => {
    if (!property) return '';
    
    const address = `${property.address}, ${property.city}, ${property.state}, Malaysia`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Property not found'}
          </h2>
          <Link to="/properties" className="text-amber-600 hover:text-amber-700">
            Browse all properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images || [];
  const amenities = property.amenities?.map(pa => pa.amenity?.name).filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]?.image_url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xl">No Image Available</span>
          </div>
        )}
        
        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Overlay Badges */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            property.listing_type === 'rent' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {property.listing_type === 'rent' ? t('common.rent') : t('common.sale')}
          </span>
        </div>

        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
          >
            <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
          <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
            <Share2 className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span>{property.address}, {property.city}, {property.state}</span>
                  </div>
                </div>
                {property.featured && (
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>

              <div className="text-4xl font-bold text-gray-900 mb-6">
                {formatPrice(property.price, property.listing_type)}
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-3 gap-6 py-6 border-t border-b border-gray-200">
                <div className="text-center">
                  <Bed className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bedrooms}</div>
                  <div className="text-gray-600 text-sm">Bedrooms</div>
                </div>
                <div className="text-center">
                  <Bath className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.bathrooms}</div>
                  <div className="text-gray-600 text-sm">Bathrooms</div>
                </div>
                <div className="text-center">
                  <Square className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{property.square_footage || 'N/A'}</div>
                  <div className="text-gray-600 text-sm">sq ft</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{property.description || 'No description available.'}</p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-amber-600">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="text-gray-700 font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">
                    {property.seller?.name?.charAt(0) || property.contact_name?.charAt(0) || 'S'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {property.seller?.name || property.contact_name || 'Property Owner'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                    {property.seller?.verified && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Professional Seller</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button 
                  onClick={handleCallNow}
                  className="w-full flex items-center justify-center space-x-2 bg-amber-600 text-white py-3 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Now</span>
                </button>
                
                <button 
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center justify-center space-x-2 border border-green-500 text-green-600 py-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </button>
                
                <button 
                  onClick={handleEmailClick}
                  className="w-full flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
              </div>

              {/* Rent Now Button with Coming Soon Overlay */}
              <div className="relative">
                <button
                  onClick={handleRentNow}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                >
                  {property.listing_type === 'rent' ? t('common.rentNow') : t('common.buyNow')}
                </button>

                {/* Coming Soon Overlay */}
                {showComingSoon && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center transition-all duration-300 ease-in-out animate-in fade-in zoom-in-95">
                    <div className="text-center">
                      {/* Clock Icon with Pulse Animation */}
                      <div className="relative mb-4">
                        <Clock className="h-16 w-16 text-white mx-auto animate-pulse" />
                        <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>
                      </div>
                      
                      {/* Coming Soon Text */}
                      <h3 className="text-white text-xl font-bold tracking-wide mb-2">
                        Coming Soon
                      </h3>
                      <p className="text-white/80 text-sm font-medium">
                        Feature in development
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Compact Location Map - Universal Design for All Devices */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className={`bg-white rounded-xl shadow-2xl overflow-hidden border-2 border-gray-200 transition-all duration-300 ${
          isMapExpanded 
            ? 'w-80 h-64 lg:w-96 lg:h-80' 
            : 'w-16 h-16'
        }`}>
          {/* Compact Header - Always Collapsible */}
          <div className={`${
            isMapExpanded 
              ? 'p-4 border-b border-gray-200 bg-gradient-to-r from-amber-500 to-orange-600' 
              : 'p-3 bg-gradient-to-r from-amber-500 to-orange-600 h-full flex items-center justify-center cursor-pointer hover:from-amber-600 hover:to-orange-700'
          } transition-all duration-300`}
          onClick={!isMapExpanded ? () => setIsMapExpanded(true) : undefined}>
            
            {isMapExpanded ? (
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </h3>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => window.open(getGoogleMapsSearchUrl(), '_blank')}
                    className="flex items-center space-x-1 text-white hover:text-amber-100 text-sm font-medium bg-white/20 px-3 py-1 rounded-full transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Open</span>
                  </button>
                  
                  <button
                    onClick={() => setIsMapExpanded(false)}
                    className="text-white hover:text-amber-100 text-sm font-medium bg-white/20 px-3 py-1 rounded-full transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <MapPin className="h-6 w-6 text-white" />
            )}
            
            {/* Location text - only show when expanded */}
            {isMapExpanded && (
              <p className="text-sm text-amber-100 mt-1">
                {property.city}, {property.state}
              </p>
            )}
          </div>
          
          {/* Map Content - only show when expanded */}
          {isMapExpanded && (
            <div className="relative h-48 lg:h-64">
              {/* Enhanced Map Placeholder with Street View Style */}
              <div className="h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
                {/* Map Grid Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-6 h-full w-full">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <div key={i} className="border border-gray-300"></div>
                    ))}
                  </div>
                </div>
                
                {/* Roads */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/3 left-0 right-0 h-3 bg-gray-300 opacity-60"></div>
                  <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-gray-300 opacity-60"></div>
                  <div className="absolute bottom-1/4 left-1/4 right-1/4 h-2 bg-gray-400 opacity-40"></div>
                </div>
                
                {/* Buildings */}
                <div className="absolute top-6 left-8 w-8 h-12 bg-gray-400 opacity-50 rounded-sm"></div>
                <div className="absolute top-4 right-12 w-6 h-16 bg-gray-500 opacity-50 rounded-sm"></div>
                <div className="absolute bottom-8 left-1/4 w-10 h-8 bg-gray-400 opacity-50 rounded-sm"></div>
                <div className="absolute bottom-6 right-1/3 w-7 h-14 bg-gray-500 opacity-50 rounded-sm"></div>
                
                {/* Property Location Pin */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
                  </div>
                </div>
                
                {/* Zoom Controls */}
                <div className="absolute top-2 right-2 flex flex-col space-y-1">
                  <button className="w-6 h-6 bg-white shadow-md rounded flex items-center justify-center text-gray-600 hover:bg-gray-50 text-xs">
                    +
                  </button>
                  <button className="w-6 h-6 bg-white shadow-md rounded flex items-center justify-center text-gray-600 hover:bg-gray-50 text-xs">
                    −
                  </button>
                </div>
              </div>
              
              {/* Map Overlay with Action */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors cursor-pointer flex items-center justify-center group"
                   onClick={() => window.open(getGoogleMapsSearchUrl(), '_blank')}>
                <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-2 text-gray-800">
                    <ExternalLink className="h-4 w-4" />
                    <span className="text-sm font-medium">View on Google Maps</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Complete Payment</h3>
            <p className="text-gray-600 mb-6">
              Stripe payment integration would be implemented here for secure transactions.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700">
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;
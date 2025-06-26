import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { PropertyService } from '../../lib/propertyService';
import { PropertyFormData, Amenity } from '../../types/property';
import { Upload, X, MapPin, Home, DollarSign, Bed, Bath, Square, Phone, Mail, User, Save, Eye, Send } from 'lucide-react';

interface PropertyFormProps {
  onSuccess?: (property: any) => void;
  onCancel?: () => void;
  initialData?: Partial<PropertyFormData>;
  mode?: 'create' | 'edit';
}

const PropertyForm: React.FC<PropertyFormProps> = ({ 
  onSuccess, 
  onCancel, 
  initialData,
  mode = 'create' 
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    property_type: 'apartment',
    listing_type: 'rent',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    bedrooms: 1,
    bathrooms: 1,
    square_footage: 0,
    lot_size: 0,
    year_built: new Date().getFullYear(),
    contact_name: user?.name || '',
    contact_phone: user?.phone || '',
    contact_email: user?.email || '',
    amenity_ids: [],
    additional_images: [],
    ...initialData
  });
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(null);
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'saving' | 'publishing' | 'success' | 'error'>('idle');

  useEffect(() => {
    loadAmenities();
  }, []);

  const loadAmenities = async () => {
    try {
      const amenitiesData = await PropertyService.getAmenities();
      setAmenities(amenitiesData);
    } catch (error) {
      console.error('Error loading amenities:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.contact_name.trim()) newErrors.contact_name = 'Contact name is required';
    if (!formData.contact_phone.trim()) newErrors.contact_phone = 'Contact phone is required';
    if (!formData.contact_email.trim()) newErrors.contact_email = 'Contact email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      amenity_ids: prev.amenity_ids.includes(amenityId)
        ? prev.amenity_ids.filter(id => id !== amenityId)
        : [...prev.amenity_ids, amenityId]
    }));
  };

  const handleFeaturedImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, featured_image: file }));
      const reader = new FileReader();
      reader.onload = () => setFeaturedImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, additional_images: files }));
    
    // Create previews
    const previews: string[] = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push(reader.result as string);
        if (previews.length === files.length) {
          setAdditionalImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAdditionalImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_images: prev.additional_images.filter((_, i) => i !== index)
    }));
    setAdditionalImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDraft = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setSubmitStatus('saving');
    
    try {
      const property = await PropertyService.createProperty(formData, user.id);
      setSubmitStatus('success');
      
      // Show success message briefly
      setTimeout(() => {
        onSuccess?.(property);
      }, 1000);
    } catch (error: any) {
      console.error('Error saving draft:', error);
      setSubmitStatus('error');
      alert('Error saving draft: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user) return;

    setIsLoading(true);
    setSubmitStatus('publishing');
    
    try {
      // Create property with pending status directly
      const propertyDataWithStatus = {
        ...formData,
        status: 'pending' as const
      };
      
      // Create the property
      const property = await PropertyService.createProperty(propertyDataWithStatus, user.id);
      
      // If creation was successful, update status to pending for review
      if (property.id) {
        await PropertyService.updatePropertyStatus(property.id, 'pending');
      }
      
      setSubmitStatus('success');
      
      // Show success message briefly before calling onSuccess
      setTimeout(() => {
        onSuccess?.(property);
      }, 1500);
      
    } catch (error: any) {
      console.error('Error publishing property:', error);
      setSubmitStatus('error');
      
      // Show user-friendly error message
      const errorMessage = error.message || 'Failed to publish property. Please try again.';
      alert('Error publishing property: ' + errorMessage);
      
      // Reset status after showing error
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedAmenities = amenities.reduce((acc, amenity) => {
    if (!acc[amenity.category]) acc[amenity.category] = [];
    acc[amenity.category].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  // Show success state
  if (submitStatus === 'success') {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Published Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your property has been submitted for review and will be published once approved by our team.
          </p>
          <div className="animate-pulse text-amber-600">
            Redirecting you back to your properties...
          </div>
        </div>
      </div>
    );
  }

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Preview Header */}
        <div className="bg-amber-50 border-b border-amber-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-amber-800">Property Preview</h2>
            <button
              onClick={() => setPreviewMode(false)}
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Back to Edit
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-6">
          {featuredImagePreview && (
            <img
              src={featuredImagePreview}
              alt="Featured"
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-2xl font-bold text-amber-600 mb-2">
                RM {formData.price.toLocaleString()}{formData.listing_type === 'rent' ? '/month' : ''}
              </p>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{formData.address}, {formData.city}, {formData.state}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Bed className="h-6 w-6 text-amber-600 mx-auto mb-1" />
                <div className="font-semibold">{formData.bedrooms}</div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>
              <div className="text-center">
                <Bath className="h-6 w-6 text-amber-600 mx-auto mb-1" />
                <div className="font-semibold">{formData.bathrooms}</div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center">
                <Square className="h-6 w-6 text-amber-600 mx-auto mb-1" />
                <div className="font-semibold">{formData.square_footage}</div>
                <div className="text-sm text-gray-600">sq ft</div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{formData.description}</p>
          </div>
          
          {formData.amenity_ids.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {amenities
                  .filter(amenity => formData.amenity_ids.includes(amenity.id))
                  .map(amenity => (
                    <div key={amenity.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm">{amenity.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {mode === 'create' ? 'List New Property' : 'Edit Property'}
        </h2>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Status Indicator */}
      {submitStatus !== 'idle' && (
        <div className={`p-4 rounded-lg border ${
          submitStatus === 'saving' || submitStatus === 'publishing' 
            ? 'bg-blue-50 border-blue-200 text-blue-800'
            : submitStatus === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-green-50 border-green-200 text-green-800'
        }`}>
          <div className="flex items-center space-x-2">
            {(submitStatus === 'saving' || submitStatus === 'publishing') && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            )}
            <span className="font-medium">
              {submitStatus === 'saving' && 'Saving draft...'}
              {submitStatus === 'publishing' && 'Publishing property...'}
              {submitStatus === 'error' && 'Error occurred. Please try again.'}
              {submitStatus === 'success' && 'Property published successfully!'}
            </span>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Home className="h-5 w-5 mr-2 text-amber-600" />
          Basic Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Modern 3BR Apartment in KLCC"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isLoading}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe your property in detail..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type *
            </label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="condo">Condominium</option>
              <option value="studio">Studio</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Listing Type *
            </label>
            <select
              name="listing_type"
              value={formData.listing_type}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="rent">For Rent</option>
              <option value="sale">For Sale</option>
            </select>
          </div>
        </div>
      </div>

      {/* Price and Details */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-amber-600" />
          Price & Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (RM) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bedrooms
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
              disabled={isLoading}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bathrooms
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
              disabled={isLoading}
              min="0"
              step="0.5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Square Footage
            </label>
            <input
              type="number"
              name="square_footage"
              value={formData.square_footage}
              onChange={handleInputChange}
              disabled={isLoading}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lot Size (sq ft)
            </label>
            <input
              type="number"
              name="lot_size"
              value={formData.lot_size}
              onChange={handleInputChange}
              disabled={isLoading}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year Built
            </label>
            <input
              type="number"
              name="year_built"
              value={formData.year_built}
              onChange={handleInputChange}
              disabled={isLoading}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-amber-600" />
          Location
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Street address"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="City"
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select State</option>
              <option value="Kuala Lumpur">Kuala Lumpur</option>
              <option value="Selangor">Selangor</option>
              <option value="Johor">Johor</option>
              <option value="Penang">Penang</option>
              <option value="Perak">Perak</option>
              <option value="Kedah">Kedah</option>
              <option value="Kelantan">Kelantan</option>
              <option value="Terengganu">Terengganu</option>
              <option value="Pahang">Pahang</option>
              <option value="Negeri Sembilan">Negeri Sembilan</option>
              <option value="Melaka">Melaka</option>
              <option value="Sabah">Sabah</option>
              <option value="Sarawak">Sarawak</option>
              <option value="Perlis">Perlis</option>
              <option value="Putrajaya">Putrajaya</option>
              <option value="Labuan">Labuan</option>
            </select>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50"
              placeholder="12345"
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Upload className="h-5 w-5 mr-2 text-amber-600" />
          Images
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {featuredImagePreview ? (
                <div className="relative">
                  <img
                    src={featuredImagePreview}
                    alt="Featured preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFeaturedImagePreview(null);
                      setFormData(prev => ({ ...prev, featured_image: undefined }));
                    }}
                    disabled={isLoading}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload featured image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageChange}
                    disabled={isLoading}
                    className="mt-2 disabled:opacity-50"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Upload additional images</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
                disabled={isLoading}
                className="mt-2 disabled:opacity-50"
              />
            </div>
            
            {additionalImagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {additionalImagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalImage(index)}
                      disabled={isLoading}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 disabled:opacity-50"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Amenities</h3>
        
        {Object.entries(groupedAmenities).map(([category, categoryAmenities]) => (
          <div key={category}>
            <h4 className="text-md font-medium text-gray-700 mb-3 capitalize">{category}</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categoryAmenities.map(amenity => (
                <label
                  key={amenity.id}
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    formData.amenity_ids.includes(amenity.id)
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.amenity_ids.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                    disabled={isLoading}
                    className="text-amber-600 focus:ring-amber-500 disabled:opacity-50"
                  />
                  <span className="text-sm">{amenity.name}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <User className="h-5 w-5 mr-2 text-amber-600" />
          Contact Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              name="contact_name"
              value={formData.contact_name}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 ${
                errors.contact_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Your name"
            />
            {errors.contact_name && <p className="text-red-500 text-sm mt-1">{errors.contact_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone *
            </label>
            <input
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 ${
                errors.contact_phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="+60 12-345 6789"
            />
            {errors.contact_phone && <p className="text-red-500 text-sm mt-1">{errors.contact_phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email *
            </label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleInputChange}
              disabled={isLoading}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 ${
                errors.contact_email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="your.email@example.com"
            />
            {errors.contact_email && <p className="text-red-500 text-sm mt-1">{errors.contact_email}</p>}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          * Required fields
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isLoading}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{submitStatus === 'saving' ? 'Saving...' : 'Save Draft'}</span>
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center space-x-2 bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>
              {submitStatus === 'publishing' ? 'Publishing...' : 'Publish Listing'}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default PropertyForm;
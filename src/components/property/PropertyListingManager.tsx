import React, { useState, useEffect } from 'react';
import { PropertyService } from '../../lib/propertyService';
import { Property } from '../../types/property';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, Eye, MoreVertical, Filter, Search, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import PropertyForm from './PropertyForm';

const PropertyListingManager: React.FC = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      loadProperties();
      
      // Set up real-time subscription for seller's properties
      const subscription = PropertyService.subscribeToProperties((payload) => {
        console.log('Real-time property update for seller:', payload);
        
        // Only refresh if the change affects this seller's properties
        if (payload.new?.seller_id === user.id || payload.old?.seller_id === user.id) {
          loadProperties();
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, statusFilter]);

  const loadProperties = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const data = await PropertyService.getPropertiesBySeller(user.id);
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(property => property.status === statusFilter);
    }

    setFilteredProperties(filtered);
  };

  const handleCreateProperty = () => {
    setEditingProperty(null);
    setShowForm(true);
  };

  const handleEditProperty = (property: Property) => {
    console.log('Editing property:', property.title);
    setEditingProperty(property);
    setShowForm(true);
  };

  const handleDeleteProperty = async (property: Property) => {
    if (!confirm(`Are you sure you want to delete "${property.title}"?`)) return;

    try {
      await PropertyService.deleteProperty(property.id);
      await loadProperties();
      console.log('Property deleted successfully');
    } catch (error) {
      console.error('Error deleting property:', error);
      alert('Error deleting property');
    }
  };

  const handleFormSuccess = async (updatedProperty?: Property) => {
    console.log('Property form success, refreshing list...');
    setShowForm(false);
    setEditingProperty(null);
    await loadProperties();
    
    if (updatedProperty) {
      console.log('Property updated successfully:', updatedProperty.title);
    }
  };

  const handleStatusChange = async (property: Property, newStatus: string) => {
    try {
      console.log(`Changing property ${property.title} status to: ${newStatus}`);
      await PropertyService.updatePropertyStatus(property.id, newStatus);
      await loadProperties();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating property status');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      sold: 'bg-blue-100 text-blue-800',
      rented: 'bg-purple-100 text-purple-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const icons = {
      draft: <Edit className="h-3 w-3 mr-1" />,
      pending: <Clock className="h-3 w-3 mr-1" />,
      active: <CheckCircle className="h-3 w-3 mr-1" />,
      sold: <CheckCircle className="h-3 w-3 mr-1" />,
      rented: <CheckCircle className="h-3 w-3 mr-1" />,
      suspended: <XCircle className="h-3 w-3 mr-1" />,
      rejected: <XCircle className="h-3 w-3 mr-1" />
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Save your progress and continue editing later';
      case 'pending':
        return 'Under review by admin - you will be notified once approved';
      case 'active':
        return 'Live and visible to potential buyers/renters';
      case 'rejected':
        return 'Not approved - please review feedback and resubmit';
      case 'suspended':
        return 'Temporarily hidden - contact support for assistance';
      default:
        return '';
    }
  };

  if (showForm) {
    return (
      <PropertyForm
        mode={editingProperty ? 'edit' : 'create'}
        propertyId={editingProperty?.id}
        initialData={editingProperty ? {
          title: editingProperty.title,
          description: editingProperty.description || '',
          price: editingProperty.price,
          property_type: editingProperty.property_type,
          listing_type: editingProperty.listing_type,
          address: editingProperty.address,
          city: editingProperty.city,
          state: editingProperty.state,
          zip_code: editingProperty.zip_code || '',
          bedrooms: editingProperty.bedrooms,
          bathrooms: editingProperty.bathrooms,
          square_footage: editingProperty.square_footage || 0,
          lot_size: editingProperty.lot_size || 0,
          year_built: editingProperty.year_built || new Date().getFullYear(),
          contact_name: editingProperty.contact_name || '',
          contact_phone: editingProperty.contact_phone || '',
          contact_email: editingProperty.contact_email || '',
          amenity_ids: editingProperty.amenities?.map(pa => pa.amenity_id).filter(Boolean) || [],
          additional_images: []
        } : undefined}
        onSuccess={handleFormSuccess}
        onCancel={() => {
          setShowForm(false);
          setEditingProperty(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Properties</h2>
          <p className="text-gray-600 mt-1">Manage your property listings with real-time updates</p>
        </div>
        <button
          onClick={handleCreateProperty}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { status: 'all', label: 'Total', count: properties.length, color: 'bg-blue-100 text-blue-800' },
          { status: 'draft', label: 'Draft', count: properties.filter(p => p.status === 'draft').length, color: 'bg-gray-100 text-gray-800' },
          { status: 'pending', label: 'Pending', count: properties.filter(p => p.status === 'pending').length, color: 'bg-yellow-100 text-yellow-800' },
          { status: 'active', label: 'Active', count: properties.filter(p => p.status === 'active').length, color: 'bg-green-100 text-green-800' },
          { status: 'rejected', label: 'Rejected', count: properties.filter(p => p.status === 'rejected').length, color: 'bg-red-100 text-red-800' }
        ].map((item) => (
          <button
            key={item.status}
            onClick={() => setStatusFilter(item.status)}
            className={`p-4 rounded-lg border-2 transition-all ${
              statusFilter === item.status ? 'border-amber-500 bg-amber-50' : 'border-gray-200 bg-white hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{item.count}</div>
              <div className="text-sm text-gray-600">{item.label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending Review</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="rejected">Rejected</option>
            <option value="suspended">Suspended</option>
          </select>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Total: {filteredProperties.length}</span>
            <span>•</span>
            <span>Active: {properties.filter(p => p.status === 'active').length}</span>
            <span>•</span>
            <span>Pending: {properties.filter(p => p.status === 'pending').length}</span>
          </div>
        </div>
      </div>

      {/* Properties List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search filters' 
              : 'Start by creating your first property listing'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={handleCreateProperty}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Create First Listing
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images.find(img => img.is_featured)?.image_url || property.images[0].image_url}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
                
                <div className="absolute top-3 left-3">
                  {getStatusBadge(property.status)}
                </div>
                
                <div className="absolute top-3 right-3">
                  <div className="relative">
                    <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{property.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{property.address}, {property.city}</p>
                
                <div className="text-2xl font-bold text-amber-600 mb-4">
                  RM {property.price.toLocaleString()}{property.listing_type === 'rent' ? '/month' : ''}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-4">
                    <span>{property.bedrooms} bed</span>
                    <span>{property.bathrooms} bath</span>
                    {property.square_footage && <span>{property.square_footage} sqft</span>}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{property.views_count} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>{property.inquiries_count} inquiries</span>
                  </div>
                </div>

                {/* Status Message */}
                {property.status !== 'active' && (
                  <div className={`p-3 rounded-lg mb-4 text-sm ${
                    property.status === 'rejected' ? 'bg-red-50 text-red-700' :
                    property.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                    'bg-gray-50 text-gray-700'
                  }`}>
                    <div className="flex items-center space-x-2">
                      {property.status === 'rejected' && <AlertCircle className="h-4 w-4" />}
                      {property.status === 'pending' && <Clock className="h-4 w-4" />}
                      <span className="font-medium">{getStatusMessage(property.status)}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditProperty(property)}
                    className="flex-1 bg-amber-600 text-white py-2 px-3 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  
                  <button
                    onClick={() => window.open(`/property/${property.id}`, '_blank')}
                    className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteProperty(property)}
                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Status Actions */}
                {property.status === 'draft' && (
                  <button
                    onClick={() => handleStatusChange(property, 'pending')}
                    className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Submit for Review
                  </button>
                )}

                {property.status === 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(property, 'pending')}
                    className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Resubmit for Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyListingManager;
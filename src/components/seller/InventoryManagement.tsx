import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';

const InventoryManagement: React.FC = () => {
  const [properties] = useState([
    {
      id: '1',
      title: 'Modern KLCC Apartment',
      location: 'KLCC, Kuala Lumpur',
      price: 3500,
      type: 'rent',
      status: 'active',
      views: 156,
      inquiries: 8,
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'PJ Terrace House',
      location: 'Petaling Jaya, Selangor',
      price: 650000,
      type: 'sale',
      status: 'pending',
      views: 89,
      inquiries: 12,
      image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Mont Kiara Condo',
      location: 'Mont Kiara, Kuala Lumpur',
      price: 4500,
      type: 'rent',
      status: 'active',
      views: 203,
      inquiries: 15,
      image: 'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      sold: 'bg-gray-100 text-gray-800',
      rented: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Property Inventory</h2>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative">
              <img
                src={property.image}
                alt={property.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 left-3">
                {getStatusBadge(property.status)}
              </div>
              <div className="absolute top-3 right-3">
                <button className="bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                  <MoreVertical className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{property.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{property.location}</p>
              
              <div className="text-2xl font-bold text-gray-900 mb-4">
                RM {property.price.toLocaleString()}{property.type === 'rent' ? '/month' : ''}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{property.views} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>{property.inquiries} inquiries</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-1">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Property Placeholder */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center border-2 border-dashed border-gray-300">
        <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Add Your First Property</h3>
        <p className="text-gray-600 mb-4">Start listing your properties to reach potential buyers and renters</p>
        <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Create Listing
        </button>
      </div>
    </div>
  );
};

export default InventoryManagement;
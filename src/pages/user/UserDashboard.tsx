import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, MessageCircle, Star, Calendar, TrendingUp } from 'lucide-react';
import DashboardBanner from '../../components/notifications/DashboardBanner';
import ConfirmationModal from '../../components/notifications/ConfirmationModal';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const savedProperties = [
    { id: '1', title: 'Modern KLCC Apartment', price: 3500, type: 'rent', image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { id: '2', title: 'PJ Terrace House', price: 650000, type: 'sale', image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  const recentViews = [
    { id: '3', title: 'Mont Kiara Condo', price: 4500, type: 'rent', viewedAt: '2024-01-15' },
    { id: '4', title: 'Bangsar Studio', price: 1800, type: 'rent', viewedAt: '2024-01-14' },
  ];

  const handleSwitchToSeller = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSwitch = () => {
    setShowConfirmation(false);
    navigate('/seller-dashboard');
  };

  const handleCancelSwitch = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Show banner only for sellers */}
          {user?.role === 'seller' && (
            <DashboardBanner 
              currentView="buyer" 
              onSwitchDashboard={handleSwitchToSeller}
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">Manage your property search and saved listings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{savedProperties.length}</div>
                  <div className="text-sm text-gray-600">Saved Properties</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{recentViews.length}</div>
                  <div className="text-sm text-gray-600">Recently Viewed</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">3</div>
                  <div className="text-sm text-gray-600">Active Inquiries</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="bg-amber-100 p-3 rounded-lg">
                  <Star className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600">Your Rating</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Saved Properties */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Properties</h3>
              <div className="space-y-4">
                {savedProperties.map((property) => (
                  <div key={property.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{property.title}</h4>
                      <p className="text-sm text-gray-600">
                        RM {property.price.toLocaleString()}{property.type === 'rent' ? '/month' : ''}
                      </p>
                    </div>
                    <button className="text-red-600 hover:text-red-700">
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Views */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recently Viewed</h3>
              <div className="space-y-4">
                {recentViews.map((property) => (
                  <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{property.title}</h4>
                      <p className="text-sm text-gray-600">
                        RM {property.price.toLocaleString()}{property.type === 'rent' ? '/month' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{property.viewedAt}</div>
                      <button className="text-amber-600 hover:text-amber-700 text-sm">
                        View Again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                <TrendingUp className="h-8 w-8 text-amber-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Market Trends</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Calendar className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Schedule Viewing</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Contact Support</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Star className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Leave Review</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirmSwitch}
        onCancel={handleCancelSwitch}
        title="Switch to Seller Dashboard"
        message="Are you sure you want to switch to the Seller Dashboard? Any unsaved changes will be lost."
        confirmText="Continue"
        cancelText="Cancel"
      />
    </>
  );
};

export default UserDashboard;
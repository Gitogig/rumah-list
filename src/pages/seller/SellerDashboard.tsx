import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardBanner from '../../components/notifications/DashboardBanner';
import ConfirmationModal from '../../components/notifications/ConfirmationModal';
import PropertyListingManager from '../../components/property/PropertyListingManager';
import SellerAnalytics from '../../components/seller/SellerAnalytics';
import { BarChart3, Building, MessageCircle, Settings, TrendingUp, Users } from 'lucide-react';

const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSwitchToBuyer = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSwitch = () => {
    setShowConfirmation(false);
    navigate('/dashboard'); // Navigate to buyer dashboard
  };

  const handleCancelSwitch = () => {
    setShowConfirmation(false);
  };

  const tabs = [
    { id: 'properties', label: 'My Properties', icon: Building },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'inquiries', label: 'Inquiries', icon: MessageCircle },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'properties':
        return <PropertyListingManager />;
      case 'analytics':
        return <SellerAnalytics />;
      case 'inquiries':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <MessageCircle className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Inquiry Management</h3>
            <p className="text-gray-600">Manage and respond to buyer inquiries efficiently</p>
          </div>
        );
      case 'leads':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Users className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Lead Management</h3>
            <p className="text-gray-600">Track and nurture potential buyers</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Settings className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Seller Settings</h3>
            <p className="text-gray-600">Configure your seller preferences and account settings</p>
          </div>
        );
      default:
        return <PropertyListingManager />;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Banner for switching to buyer dashboard - only show for sellers */}
          {user?.role === 'seller' && (
            <DashboardBanner 
              currentView="seller" 
              onSwitchDashboard={handleSwitchToBuyer}
            />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}! Manage your properties and track your sales performance.</p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-lg mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mb-8">
            {renderTabContent()}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirmSwitch}
        onCancel={handleCancelSwitch}
        title="Switch to Buyer Dashboard"
        message="Are you sure you want to switch to the Buyer Dashboard? Any unsaved changes will be lost."
        confirmText="Continue"
        cancelText="Cancel"
      />
    </>
  );
};

export default SellerDashboard;
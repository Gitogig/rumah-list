import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardToggle from '../../components/seller/DashboardToggle';
import SellerAnalytics from '../../components/seller/SellerAnalytics';
import InventoryManagement from '../../components/seller/InventoryManagement';
import DashboardBanner from '../../components/notifications/DashboardBanner';
import ConfirmationModal from '../../components/notifications/ConfirmationModal';
import { BarChart3, Building, MessageCircle, Settings, TrendingUp, Users } from 'lucide-react';

const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSwitchToBuyer = () => {
    setShowConfirmation(true);
  };

  const handleConfirmSwitch = () => {
    setShowConfirmation(false);
    navigate('/dashboard');
  };

  const handleCancelSwitch = () => {
    setShowConfirmation(false);
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: Building },
    { id: 'inquiries', label: 'Inquiries', icon: MessageCircle },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <SellerAnalytics />;
      case 'inventory':
        return <InventoryManagement />;
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
        return <SellerAnalytics />;
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

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                <Building className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Add Property</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">View Analytics</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Check Messages</span>
              </button>
              <button className="flex flex-col items-center p-4 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                <Users className="h-8 w-8 text-amber-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">Manage Leads</span>
              </button>
            </div>
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
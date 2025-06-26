import React from 'react';
import { ShoppingBag, Home, ArrowRight } from 'lucide-react';

interface DashboardBannerProps {
  currentView: 'buyer' | 'seller';
  onSwitchDashboard: () => void;
}

const DashboardBanner: React.FC<DashboardBannerProps> = ({ currentView, onSwitchDashboard }) => {
  const isBuyerView = currentView === 'buyer';
  
  return (
    <div className={`rounded-xl p-4 mb-6 border-2 border-dashed ${
      isBuyerView 
        ? 'bg-purple-50 border-purple-200' 
        : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            isBuyerView ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            {isBuyerView ? (
              <ShoppingBag className="h-5 w-5 text-purple-600" />
            ) : (
              <Home className="h-5 w-5 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className={`font-semibold ${
              isBuyerView ? 'text-purple-900' : 'text-blue-900'
            }`}>
              {isBuyerView ? 'Seller Dashboard Available' : 'Buyer Dashboard Available'}
            </h3>
            <p className={`text-sm ${
              isBuyerView ? 'text-purple-700' : 'text-blue-700'
            }`}>
              {isBuyerView 
                ? 'Switch to manage your property listings and sales analytics'
                : 'Switch to browse properties and manage your searches'
              }
            </p>
          </div>
        </div>
        
        <button
          onClick={onSwitchDashboard}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            isBuyerView
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <span>{isBuyerView ? 'Seller Dashboard' : 'Buyer Dashboard'}</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default DashboardBanner;
import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, ShoppingBag, Home } from 'lucide-react';
import ConfirmationModal from '../notifications/ConfirmationModal';

interface DashboardToggleProps {
  isSellerView: boolean;
  onToggle: (isSellerView: boolean) => void;
}

const DashboardToggle: React.FC<DashboardToggleProps> = ({ isSellerView, onToggle }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(false);

  const handleToggleClick = () => {
    // Show confirmation dialog when switching from seller to buyer view
    if (isSellerView) {
      setShowConfirmation(true);
      setPendingToggle(true);
    } else {
      // Show confirmation dialog when switching from buyer to seller view
      setShowConfirmation(true);
      setPendingToggle(false);
    }
  };

  const handleConfirm = () => {
    onToggle(!isSellerView);
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${!isSellerView ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Home className={`h-5 w-5 ${!isSellerView ? 'text-blue-600' : 'text-gray-500'}`} />
            </div>
            <span className={`font-medium ${!isSellerView ? 'text-blue-600' : 'text-gray-500'}`}>
              Buyer Dashboard
            </span>
          </div>

          <button
            onClick={handleToggleClick}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {isSellerView ? (
              <ToggleRight className="h-8 w-8 text-purple-600" />
            ) : (
              <ToggleLeft className="h-8 w-8 text-gray-400" />
            )}
          </button>

          <div className="flex items-center space-x-3">
            <span className={`font-medium ${isSellerView ? 'text-purple-600' : 'text-gray-500'}`}>
              Seller Dashboard
            </span>
            <div className={`p-2 rounded-lg ${isSellerView ? 'bg-purple-100' : 'bg-gray-100'}`}>
              <ShoppingBag className={`h-5 w-5 ${isSellerView ? 'text-purple-600' : 'text-gray-500'}`} />
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600">
            {isSellerView 
              ? 'Manage your properties and sales analytics' 
              : 'Browse and manage your property searches'
            }
          </p>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmation}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="Switch Dashboard"
        message={`Are you sure you want to switch to the ${pendingToggle ? 'Buyer' : 'Seller'} Dashboard? Any unsaved changes will be lost.`}
        confirmText="Continue"
        cancelText="Cancel"
      />
    </>
  );
};

export default DashboardToggle;
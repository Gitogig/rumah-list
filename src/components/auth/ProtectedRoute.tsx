import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import SuspensionModal from '../notifications/SuspensionModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [] }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [showSuspensionModal, setShowSuspensionModal] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user account is suspended (except for admins)
  if (user.status === 'suspended' && user.role !== 'admin') {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-3xl">⚠️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Terminated</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              Your account has been terminated for violating our terms of service. 
              Please contact customer service if you wish to appeal this decision.
            </p>
            <button
              onClick={() => setShowSuspensionModal(true)}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
            >
              Contact Support
            </button>
          </div>
        </div>
        
        <SuspensionModal 
          isOpen={showSuspensionModal} 
          onClose={() => setShowSuspensionModal(false)} 
        />
      </>
    );
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // Redirect based on user role
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'seller':
        return <Navigate to="/seller-dashboard" replace />;
      case 'buyer':
      default:
        return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
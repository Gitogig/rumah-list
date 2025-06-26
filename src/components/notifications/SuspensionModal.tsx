import React from 'react';
import { AlertTriangle, Phone, Mail } from 'lucide-react';

interface SuspensionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuspensionModal: React.FC<SuspensionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleContactSupport = () => {
    window.location.href = '/contact';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl">
        {/* Warning Icon */}
        <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Account Terminated
        </h2>

        {/* Message */}
        <p className="text-gray-700 leading-relaxed mb-8 text-center">
          Your account has been terminated for violating our terms of service. 
          Please contact customer service if you wish to appeal this decision.
        </p>

        {/* Contact Options */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleContactSupport}
            className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Mail className="h-5 w-5" />
            <span>Contact Support</span>
          </button>
          
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Phone className="h-4 w-4" />
              <span>+60 3-1234 5678</span>
            </div>
            <div className="flex items-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>support@rumahlist.my</span>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-sm underline"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SuspensionModal;
import React from 'react';
import { LoadingSpinner } from '../ui';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'lg'
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;
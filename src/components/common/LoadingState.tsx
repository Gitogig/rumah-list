import React from 'react';
import { LoadingSpinner } from '../ui';
import { useTheme } from '../../contexts/ThemeContext';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'lg'
}) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex flex-col items-center justify-center py-12 min-h-[50vh] dark-transition">
      <LoadingSpinner size={size} className="mb-4" />
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default LoadingState;
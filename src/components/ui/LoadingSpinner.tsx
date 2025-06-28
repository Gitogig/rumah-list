import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-16 w-16',
    xl: 'h-32 w-32'
  };

  const colors = {
    primary: 'border-amber-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  const classes = `
    animate-spin rounded-full border-b-2
    ${sizes[size]}
    ${colors[color]}
    ${className}
  `.trim();

  return <div className={classes} />;
};

export default LoadingSpinner;
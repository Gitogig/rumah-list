import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  withRipple?: boolean;
  withAnimation?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  withRipple = true,
  withAnimation = true,
  className = '',
  disabled,
  ...props
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark-transition';
  
  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 focus:ring-amber-500',
    secondary: isDark 
      ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-500' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
    outline: isDark
      ? 'border border-gray-600 text-gray-300 hover:bg-gray-800 focus:ring-gray-500'
      : 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
    ghost: isDark
      ? 'text-gray-300 hover:bg-gray-800 focus:ring-gray-500'
      : 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const classes = `
    ${baseClasses}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${withRipple ? 'ripple' : ''}
    ${className}
  `.trim();

  const ButtonComponent = withAnimation ? motion.button : 'button';
  const animationProps = withAnimation ? {
    whileHover: { scale: disabled ? 1 : 1.05 },
    whileTap: { scale: disabled ? 1 : 0.98 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <ButtonComponent
      className={classes}
      disabled={disabled || loading}
      {...animationProps}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      )}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className="h-4 w-4 mr-2 icon-bounce" />
      )}
      {children}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="h-4 w-4 ml-2 icon-bounce" />
      )}
    </ButtonComponent>
  );
};

export default Button;
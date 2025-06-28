import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  withAnimation?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'lg',
  hover = false,
  withAnimation = false,
  onClick
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: isDark ? 'shadow-sm shadow-gray-900' : 'shadow-sm',
    md: isDark ? 'shadow-md shadow-gray-900' : 'shadow-md',
    lg: isDark ? 'shadow-lg shadow-gray-900' : 'shadow-lg',
    xl: isDark ? 'shadow-xl shadow-gray-900' : 'shadow-xl'
  };

  const classes = `
    bg-white dark:bg-gray-800 rounded-xl
    ${shadowClasses[shadow]}
    ${paddingClasses[padding]}
    ${hover ? 'hover-lift' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    dark-transition
    ${className}
  `.trim();

  const CardComponent = withAnimation ? motion.div : 'div';
  const animationProps = withAnimation ? {
    whileHover: hover ? { y: -5, boxShadow: isDark ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : {},
    transition: { duration: 0.3 }
  } : {};

  return (
    <CardComponent 
      className={classes} 
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </CardComponent>
  );
};

export default Card;
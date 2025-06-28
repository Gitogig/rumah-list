import React from 'react';
import { motion } from 'framer-motion';

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
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const classes = `
    bg-white rounded-xl
    ${shadowClasses[shadow]}
    ${paddingClasses[padding]}
    ${hover ? 'hover-lift' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  const CardComponent = withAnimation ? motion.div : 'div';
  const animationProps = withAnimation ? {
    whileHover: hover ? { y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' } : {},
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
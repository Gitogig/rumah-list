import React, { useEffect } from 'react';
import { lazy, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

// Lazy load components
const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));

// Import only what we need from framer-motion
const { motion, AnimatePresence } = React.lazy(() => 
  import('framer-motion').then(module => ({
    motion: module.motion,
    AnimatePresence: module.AnimatePresence
  }))
);

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideFooter = false }) => {
  const location = useLocation();
  const { theme } = useTheme();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -10
    }
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.3
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Suspense fallback={<div className="h-16 bg-white dark:bg-gray-800 shadow-sm"></div>}>
        <Header />
      </Suspense>
      <AnimatePresence mode="wait">
        <motion.main 
          key={location.pathname}
          className="flex-grow"
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      {!hideFooter && (
        <Suspense fallback={<div className="h-64 bg-gray-900"></div>}><Footer /></Suspense>
      )}
    </div>
  );
};

export default Layout;
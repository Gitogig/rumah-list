import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, User, Menu, X, Globe, Moon, Sun, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Track scroll position for sticky header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleLanguage = (lang: string) => {
    changeLanguage(lang);
    setIsLangMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'seller':
        return '/seller-dashboard';
      case 'buyer':
      default:
        return '/dashboard';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    
    switch (user.role) {
      case 'admin':
        return 'Admin Dashboard';
      case 'seller':
        return 'Seller Hub';
      case 'buyer':
      default:
        return 'Dashboard';
    }
  };

  // Animation variants for mobile menu
  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const isDark = theme === 'dark';

  return (
    <header className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-md' : 'shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-scale">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg">
              <Home className="h-6 w-6 text-white icon-bounce" />
            </div>
            <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>RumahList.my</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${isDark ? 'text-gray-200 hover:text-amber-400' : 'text-gray-700 hover:text-amber-600'} transition-colors relative ${
                location.pathname === '/' ? (isDark ? 'text-amber-400 font-medium' : 'text-amber-600 font-medium') : ''
              }`}
            >
              {t('nav.home')}
              {location.pathname === '/' && (
                <motion.div 
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isDark ? 'bg-amber-400' : 'bg-amber-500'}`}
                  layoutId="navIndicator"
                />
              )}
            </Link>
            <Link 
              to="/properties" 
              className={`${isDark ? 'text-gray-200 hover:text-amber-400' : 'text-gray-700 hover:text-amber-600'} transition-colors relative ${
                location.pathname === '/properties' ? (isDark ? 'text-amber-400 font-medium' : 'text-amber-600 font-medium') : ''
              }`}
            >
              {t('nav.properties')}
              {location.pathname === '/properties' && (
                <motion.div 
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isDark ? 'bg-amber-400' : 'bg-amber-500'}`}
                  layoutId="navIndicator"
                />
              )}
            </Link>
            <Link 
              to="/properties?type=rent" 
              className={`${isDark ? 'text-gray-200 hover:text-amber-400' : 'text-gray-700 hover:text-amber-600'} transition-colors relative ${
                location.pathname === '/properties' && location.search.includes('type=rent') ? (isDark ? 'text-amber-400 font-medium' : 'text-amber-600 font-medium') : ''
              }`}
            >
              {t('nav.rent')}
              {location.pathname === '/properties' && location.search.includes('type=rent') && (
                <motion.div 
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isDark ? 'bg-amber-400' : 'bg-amber-500'}`}
                  layoutId="navIndicator"
                />
              )}
            </Link>
            <Link 
              to="/properties?type=sale" 
              className={`${isDark ? 'text-gray-200 hover:text-amber-400' : 'text-gray-700 hover:text-amber-600'} transition-colors relative ${
                location.pathname === '/properties' && location.search.includes('type=sale') ? (isDark ? 'text-amber-400 font-medium' : 'text-amber-600 font-medium') : ''
              }`}
            >
              {t('nav.buy')}
              {location.pathname === '/properties' && location.search.includes('type=sale') && (
                <motion.div 
                  className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isDark ? 'bg-amber-400' : 'bg-amber-500'}`}
                  layoutId="navIndicator"
                />
              )}
            </Link>
            
            {user && (
              <Link 
                to={getDashboardLink()} 
                className={`flex items-center space-x-2 ${isDark ? 'text-gray-200 hover:text-amber-400' : 'text-gray-700 hover:text-amber-600'} transition-colors relative ${
                  location.pathname.includes('/dashboard') || location.pathname.includes('/admin') ? (isDark ? 'text-amber-400 font-medium' : 'text-amber-600 font-medium') : ''
                }`}
              >
                <span>{getDashboardLabel()}</span>
                {user.role === 'seller' && (
                  <div className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                    Dual Access
                  </div>
                )}
                {(location.pathname.includes('/dashboard') || location.pathname.includes('/admin')) && (
                  <motion.div 
                    className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isDark ? 'bg-amber-400' : 'bg-amber-500'}`}
                    layoutId="navIndicator"
                  />
                )}
              </Link>
            )}
          </nav>

          {/* Right side - Language, Theme, Auth */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center p-2 rounded-full ${
                isDark ? 'bg-gray-700 text-amber-400' : 'bg-gray-100 text-amber-600'
              } hover:opacity-80 transition-colors`}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`flex items-center space-x-1 ${
                  isDark ? 'text-gray-200 hover:text-amber-400' : 'text-gray-700 hover:text-amber-600'
                } transition-colors`}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm uppercase">{currentLanguage}</span>
              </button>
              
              {isLangMenuOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 mt-2 w-32 ${
                    isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'
                  } rounded-md shadow-lg border py-1 z-50`}
                >
                  <button
                    onClick={() => toggleLanguage('en')}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      currentLanguage === 'en' 
                        ? isDark ? 'bg-gray-600 text-amber-400' : 'bg-amber-50 text-amber-600' 
                        : isDark ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => toggleLanguage('ms')}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      currentLanguage === 'ms' 
                        ? isDark ? 'bg-gray-600 text-amber-400' : 'bg-amber-50 text-amber-600' 
                        : isDark ? 'text-gray-200 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Bahasa Malaysia
                  </button>
                </motion.div>
              )}
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{user.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-amber-100 text-amber-600' 
                      : user.role === 'seller'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors ripple"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className={`${isDark ? 'text-gray-200 hover:text-amber-400' : 'text-gray-700 hover:text-amber-600'} transition-colors`}>
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors hover-scale ripple"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-amber-600 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className={`h-6 w-6 icon-bounce ${isDark ? 'text-white' : ''}`} />
              ) : (
                <Menu className={`h-6 w-6 icon-bounce ${isDark ? 'text-white' : ''}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div 
          className="md:hidden overflow-hidden"
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
          variants={menuVariants}
        >
          <div className={`flex flex-col space-y-4 py-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <Link
              to="/"
              className={`${
                isDark 
                  ? location.pathname === '/' ? 'text-amber-400 font-medium' : 'text-gray-200 hover:text-amber-400' 
                  : location.pathname === '/' ? 'text-amber-600 font-medium' : 'text-gray-700 hover:text-amber-600'
              } transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/properties"
              className={`${
                isDark 
                  ? location.pathname === '/properties' && !location.search ? 'text-amber-400 font-medium' : 'text-gray-200 hover:text-amber-400' 
                  : location.pathname === '/properties' && !location.search ? 'text-amber-600 font-medium' : 'text-gray-700 hover:text-amber-600'
              } transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.properties')}
            </Link>
            <Link
              to="/properties?type=rent"
              className={`${
                isDark 
                  ? location.pathname === '/properties' && location.search.includes('type=rent') ? 'text-amber-400 font-medium' : 'text-gray-200 hover:text-amber-400' 
                  : location.pathname === '/properties' && location.search.includes('type=rent') ? 'text-amber-600 font-medium' : 'text-gray-700 hover:text-amber-600'
              } transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.rent')}
            </Link>
            <Link
              to="/properties?type=sale"
              className={`${
                isDark 
                  ? location.pathname === '/properties' && location.search.includes('type=sale') ? 'text-amber-400 font-medium' : 'text-gray-200 hover:text-amber-400' 
                  : location.pathname === '/properties' && location.search.includes('type=sale') ? 'text-amber-600 font-medium' : 'text-gray-700 hover:text-amber-600'
              } transition-colors`}
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.buy')}
            </Link>

            {user && (
              <Link
                to={getDashboardLink()}
                className={`${
                  isDark 
                    ? location.pathname.includes('/dashboard') || location.pathname.includes('/admin') ? 'text-amber-400 font-medium' : 'text-gray-200 hover:text-amber-400' 
                    : location.pathname.includes('/dashboard') || location.pathname.includes('/admin') ? 'text-amber-600 font-medium' : 'text-gray-700 hover:text-amber-600'
                } transition-colors`}
                onClick={() => setIsMenuOpen(false)}
              >
                {getDashboardLabel()}
              </Link>
            )}

            {user ? (
              <>
                <div className={`flex items-center space-x-2 py-2 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <User className={`h-5 w-5 ${isDark ? 'text-gray-300' : 'text-gray-500'}`} />
                  <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{user.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    user.role === 'admin' 
                      ? 'bg-amber-100 text-amber-600' 
                      : user.role === 'seller'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors ripple"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('nav.logout')}</span>
                </button>
              </>
            ) : (
              <div className={`flex flex-col space-y-3 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <Link
                  to="/login"
                  className={`${isDark ? 'text-gray-200 hover:text-amber-400' : 'text-gray-700 hover:text-amber-600'} transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-center ripple"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, User, LogOut, Menu, X, Globe, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const Header: React.FC = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { currentLanguage, changeLanguage } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const navigate = useNavigate();

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

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">RumahList.my</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-amber-600 transition-colors">
              {t('nav.home')}
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-amber-600 transition-colors">
              {t('nav.properties')}
            </Link>
            <Link to="/properties?type=rent" className="text-gray-700 hover:text-amber-600 transition-colors">
              {t('nav.rent')}
            </Link>
            <Link to="/properties?type=sale" className="text-gray-700 hover:text-amber-600 transition-colors">
              {t('nav.buy')}
            </Link>
            
            {user && (
              <Link 
                to={getDashboardLink()} 
                className="flex items-center space-x-2 text-gray-700 hover:text-amber-600 transition-colors"
              >
                <span>{getDashboardLabel()}</span>
                {user.role === 'seller' && (
                  <div className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs font-medium">
                    Dual Access
                  </div>
                )}
              </Link>
            )}
          </nav>

          {/* Right side - Language, Auth */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-amber-600 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm uppercase">{currentLanguage}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={() => toggleLanguage('en')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentLanguage === 'en' ? 'bg-amber-50 text-amber-600' : 'text-gray-700'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => toggleLanguage('ms')}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${currentLanguage === 'ms' ? 'bg-amber-50 text-amber-600' : 'text-gray-700'}`}
                  >
                    Bahasa Malaysia
                  </button>
                </div>
              )}
            </div>

            {/* Auth Section */}
            {user ? (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{user.name}</span>
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
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-amber-600 transition-colors">
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-amber-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/properties"
                className="text-gray-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.properties')}
              </Link>
              <Link
                to="/properties?type=rent"
                className="text-gray-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.rent')}
              </Link>
              <Link
                to="/properties?type=sale"
                className="text-gray-700 hover:text-amber-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.buy')}
              </Link>

              {user && (
                <Link
                  to={getDashboardLink()}
                  className="text-gray-700 hover:text-amber-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {getDashboardLabel()}
                </Link>
              )}

              {user ? (
                <>
                  <div className="flex items-center space-x-2 py-2 border-t border-gray-200">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-700">{user.name}</span>
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
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>{t('nav.logout')}</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-amber-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Mail, Phone, MapPin } from 'lucide-react';
import { useAppearance } from '../../contexts/AppearanceContext';
import { useTheme } from '../../contexts/ThemeContext';

// Import social icons only when needed
const SocialIcons = React.lazy(() => import('./SocialIcons'));

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { contactInfo, socialLinks } = useAppearance();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Use dynamic contact info with memoized fallbacks
  const businessName = contactInfo?.business_name || 'RumahList.my';
  const primaryPhone = contactInfo?.primary_phone || '+60 3-1234 5678';
  const primaryEmail = contactInfo?.primary_email || 'info@rumahlist.my';

  return (
    <footer className="bg-gray-900 text-white">
      {/* Batik Pattern Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          {/* Simplified background pattern for better performance */}
          <div className="w-full h-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">{businessName}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Malaysia's premier real estate platform connecting buyers, sellers, and renters with their perfect property match.
              </p>
              <React.Suspense fallback={<div className="h-5 w-20 bg-gray-700 rounded animate-pulse"></div>}>
                <SocialIcons socialLinks={socialLinks} />
              </React.Suspense>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/properties" className="text-gray-300 hover:text-amber-500 transition-colors text-sm">
                  {t('nav.properties')}
                </Link>
                <Link to="/properties?type=rent" className="text-gray-300 hover:text-amber-500 transition-colors text-sm">
                  {t('nav.rent')}
                </Link>
                <Link to="/properties?type=sale" className="text-gray-300 hover:text-amber-500 transition-colors text-sm">
                  {t('nav.buy')}
                </Link>
                <Link to="/about" className="text-gray-300 hover:text-amber-500 transition-colors text-sm">
                  {t('footer.about')}
                </Link>
              </div>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal</h3>
              <div className="flex flex-col space-y-2">
                <Link to="/terms" className="text-gray-300 hover:text-amber-500 transition-colors text-sm">
                  {t('footer.terms')}
                </Link>
                <Link to="/privacy" className="text-gray-300 hover:text-amber-500 transition-colors text-sm">
                  {t('footer.privacy')}
                </Link>
                <Link to="/faq" className="text-gray-300 hover:text-amber-500 transition-colors text-sm">
                  {t('footer.faq')}
                </Link>
                <Link to="/contact" className="text-gray-300 hover:text-amber-500 transition-colors text-sm">
                  {t('footer.contact')}
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{primaryEmail}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{primaryPhone}</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">
                    Level 10, Menara ABC<br />
                    Jalan Ampang, 50450<br />
                    Kuala Lumpur, Malaysia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 {businessName}. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm mt-2 md:mt-0">
                Powered by Malaysian innovation
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useAppearance } from '../../contexts/AppearanceContext';
import { useTheme } from '../../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { contactInfo, socialLinks } = useAppearance();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Use dynamic contact info or fallback to defaults
  const businessName = contactInfo?.business_name || 'RumahList.my';
  const primaryPhone = contactInfo?.primary_phone || '+60 3-1234 5678';
  const primaryEmail = contactInfo?.primary_email || 'info@rumahlist.my';

  return (
    <footer className="bg-gray-900 text-white">
      {/* Batik Pattern Background */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <pattern id="batik" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.3"/>
              <path d="M5,5 Q10,0 15,5 Q10,10 5,5" fill="currentColor" opacity="0.2"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#batik)"/>
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">{businessName}</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Malaysia's premier real estate platform connecting buyers, sellers, and renters with their perfect property match.
              </p>
              <div className="flex space-x-4">
                {socialLinks.length > 0 ? (
                  socialLinks.map((link) => (
                    <a 
                      key={link.id}
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-amber-500 transition-colors transform hover:scale-110"
                      aria-label={`Visit our ${link.platform} page`}
                    >
                      {link.platform.toLowerCase() === 'facebook' && <Facebook className="h-5 w-5" />}
                      {link.platform.toLowerCase() === 'twitter' && <Twitter className="h-5 w-5" />}
                      {link.platform.toLowerCase() === 'instagram' && <Instagram className="h-5 w-5" />}
                    </a>
                  ))
                ) : (
                  <>
                    <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors transform hover:scale-110" aria-label="Facebook">
                      <Facebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors transform hover:scale-110" aria-label="Twitter">
                      <Twitter className="h-5 w-5" />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors transform hover:scale-110" aria-label="Instagram">
                      <Instagram className="h-5 w-5" />
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/properties" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                    {t('nav.properties')}
                  </Link>
                </li>
                <li>
                  <Link to="/properties?type=rent" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                    {t('nav.rent')}
                  </Link>
                </li>
                <li>
                  <Link to="/properties?type=sale" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                    {t('nav.buy')}
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                    {t('footer.about')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                    {t('footer.terms')}
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                    {t('footer.privacy')}
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                    {t('footer.faq')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                    {t('footer.contact')}
                  </Link>
                </li>
              </ul>
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
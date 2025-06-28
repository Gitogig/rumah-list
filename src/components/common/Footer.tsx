import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useAppearance } from '../../contexts/AppearanceContext';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { contactInfo, socialLinks } = useAppearance();
  const { theme } = useTheme();

  // Use dynamic contact info or fallback to defaults
  const businessName = contactInfo?.business_name || 'RumahList.my';
  const primaryPhone = contactInfo?.primary_phone || '+60 3-1234 5678';
  const primaryEmail = contactInfo?.primary_email || 'info@rumahlist.my';
  const address = contactInfo ? 
    `${contactInfo.address_line1}${contactInfo.address_line2 ? ', ' + contactInfo.address_line2 : ''}, ${contactInfo.city}, ${contactInfo.state}` :
    'Level 10, Menara ABC, Jalan Ampang, 50450, Kuala Lumpur, Malaysia';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const isDark = theme === 'dark';

  return (
    <footer className="bg-gray-900 text-white dark-transition">
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
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Company Info */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">{businessName}</span>
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
            </motion.div>

            {/* Quick Links */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <div className="space-y-2">
                <Link to="/properties" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                  {t('nav.properties')}
                </Link>
                <Link to="/properties?type=rent" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                  {t('nav.rent')}
                </Link>
                <Link to="/properties?type=sale" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                  {t('nav.buy')}
                </Link>
                <Link to="/about" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                  {t('footer.about')}
                </Link>
              </div>
            </motion.div>

            {/* Legal */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h3 className="text-lg font-semibold">Legal</h3>
              <div className="space-y-2">
                <Link to="/terms" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                  {t('footer.terms')}
                </Link>
                <Link to="/privacy" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                  {t('footer.privacy')}
                </Link>
                <Link to="/faq" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                  {t('footer.faq')}
                </Link>
                <Link to="/contact" className="block text-gray-300 hover:text-amber-500 transition-colors text-sm hover:translate-x-1 inline-block">
                  {t('footer.contact')}
                </Link>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div className="space-y-4" variants={itemVariants}>
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
                    {address}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div 
            className="border-t border-gray-800 mt-12 pt-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 {businessName}. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm mt-2 md:mt-0">
                Powered by Malaysian innovation
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
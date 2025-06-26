import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.properties': 'Properties',
      'nav.rent': 'Rent',
      'nav.buy': 'Buy',
      'nav.sell': 'Sell',
      'nav.about': 'About',
      'nav.contact': 'Contact',
      'nav.login': 'Login',
      'nav.register': 'Register',
      'nav.dashboard': 'Dashboard',
      'nav.logout': 'Logout',
      
      // Search
      'search.placeholder': 'Search by location, property type...',
      'search.location': 'Location',
      'search.propertyType': 'Property Type',
      'search.priceRange': 'Price Range',
      'search.bedrooms': 'Bedrooms',
      'search.advanced': 'Advanced Search',
      
      // Property Types
      'property.house': 'House',
      'property.apartment': 'Apartment',
      'property.condo': 'Condominium',
      'property.studio': 'Studio',
      
      // Common
      'common.rent': 'Rent',
      'common.sale': 'For Sale',
      'common.month': '/month',
      'common.bedrooms': 'Bedrooms',
      'common.bathrooms': 'Bathrooms',
      'common.sqft': 'sq ft',
      'common.viewDetails': 'View Details',
      'common.contactSeller': 'Contact Seller',
      'common.rentNow': 'Rent Now',
      'common.buyNow': 'Buy Now',
      
      // Hero Section
      'hero.title': 'Find Your Dream Home in Malaysia',
      'hero.subtitle': 'Discover the perfect property for rent or purchase',
      'hero.cta': 'Start Searching',
      
      // Footer
      'footer.about': 'About RumahList.my',
      'footer.contact': 'Contact Us',
      'footer.terms': 'Terms of Service',
      'footer.privacy': 'Privacy Policy',
      'footer.faq': 'FAQ',
    }
  },
  ms: {
    translation: {
      // Navigation
      'nav.home': 'Utama',
      'nav.properties': 'Hartanah',
      'nav.rent': 'Sewa',
      'nav.buy': 'Beli',
      'nav.sell': 'Jual',
      'nav.about': 'Tentang',
      'nav.contact': 'Hubungi',
      'nav.login': 'Log Masuk',
      'nav.register': 'Daftar',
      'nav.dashboard': 'Papan Pemuka',
      'nav.logout': 'Log Keluar',
      
      // Search
      'search.placeholder': 'Cari mengikut lokasi, jenis hartanah...',
      'search.location': 'Lokasi',
      'search.propertyType': 'Jenis Hartanah',
      'search.priceRange': 'Julat Harga',
      'search.bedrooms': 'Bilik Tidur',
      'search.advanced': 'Carian Lanjutan',
      
      // Property Types
      'property.house': 'Rumah',
      'property.apartment': 'Pangsapuri',
      'property.condo': 'Kondominium',
      'property.studio': 'Studio',
      
      // Common
      'common.rent': 'Sewa',
      'common.sale': 'Untuk Dijual',
      'common.month': '/bulan',
      'common.bedrooms': 'Bilik Tidur',
      'common.bathrooms': 'Bilik Air',
      'common.sqft': 'kaki persegi',
      'common.viewDetails': 'Lihat Butiran',
      'common.contactSeller': 'Hubungi Penjual',
      'common.rentNow': 'Sewa Sekarang',
      'common.buyNow': 'Beli Sekarang',
      
      // Hero Section
      'hero.title': 'Cari Rumah Impian Anda di Malaysia',
      'hero.subtitle': 'Temui hartanah yang sempurna untuk disewa atau dibeli',
      'hero.cta': 'Mula Cari',
      
      // Footer
      'footer.about': 'Tentang RumahList.my',
      'footer.contact': 'Hubungi Kami',
      'footer.terms': 'Terma Perkhidmatan',
      'footer.privacy': 'Dasar Privasi',
      'footer.faq': 'Soalan Lazim',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setCurrentLanguage(savedLang);
    i18n.changeLanguage(savedLang);
  }, []);

  const changeLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default i18n;
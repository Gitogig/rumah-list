import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Home, DollarSign, Bed, SlidersHorizontal } from 'lucide-react';
import { SearchFilters } from '../../types';
import { malaysianStates, propertyTypes } from '../../data/mockData';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    propertyType: '',
    priceMin: 0,
    priceMax: 0,
    bedrooms: 0,
    type: 'all'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const isDark = theme === 'dark';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 dark-transition ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              {t('search.location')}
            </label>
            <select
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark-transition"
            >
              <option value="">All Locations</option>
              {malaysianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Home className="inline h-4 w-4 mr-1" />
              {t('search.propertyType')}
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => updateFilter('propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark-transition"
            >
              <option value="">All Types</option>
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Rent/Buy */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => updateFilter('type', e.target.value as 'rent' | 'sale' | 'all')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark-transition"
            >
              <option value="all">All</option>
              <option value="rent">Rent</option>
              <option value="sale">Buy</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Bed className="inline h-4 w-4 mr-1" />
              {t('search.bedrooms')}
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => updateFilter('bedrooms', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark-transition"
            >
              <option value={0}>Any</option>
              <option value={1}>1+</option>
              <option value={2}>2+</option>
              <option value={3}>3+</option>
              <option value={4}>4+</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2 hover-scale ripple"
            >
              <Search className="h-4 w-4 icon-bounce" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-end mb-2">
          <button 
            type="button" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-amber-600 dark:text-amber-500 text-sm flex items-center space-x-1 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>{showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}</span>
          </button>
        </div>

        {/* Price Range - Advanced Filter */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: showAdvanced ? 'auto' : 0,
            opacity: showAdvanced ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Min Price (RM)
            </label>
            <input
              type="number"
              value={filters.priceMin || ''}
              onChange={(e) => updateFilter('priceMin', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark-transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Price (RM)
            </label>
            <input
              type="number"
              value={filters.priceMax || ''}
              onChange={(e) => updateFilter('priceMax', parseInt(e.target.value) || 0)}
              placeholder="No limit"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark-transition"
            />
          </div>
        </motion.div>
      </form>
    </div>
  );
};

export default SearchBar;
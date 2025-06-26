import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, MapPin, Home, DollarSign, Bed } from 'lucide-react';
import { SearchFilters } from '../../types';
import { malaysianStates, propertyTypes } from '../../data/mockData';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    propertyType: '',
    priceMin: 0,
    priceMax: 0,
    bedrooms: 0,
    type: 'all'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          {/* Location */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              {t('search.location')}
            </label>
            <select
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Locations</option>
              {malaysianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Property Type */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="inline h-4 w-4 mr-1" />
              {t('search.propertyType')}
            </label>
            <select
              value={filters.propertyType}
              onChange={(e) => updateFilter('propertyType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Rent/Buy */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline h-4 w-4 mr-1" />
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => updateFilter('type', e.target.value as 'rent' | 'sale' | 'all')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="rent">Rent</option>
              <option value="sale">Buy</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bed className="inline h-4 w-4 mr-1" />
              {t('search.bedrooms')}
            </label>
            <select
              value={filters.bedrooms}
              onChange={(e) => updateFilter('bedrooms', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price (RM)
            </label>
            <input
              type="number"
              value={filters.priceMin || ''}
              onChange={(e) => updateFilter('priceMin', parseInt(e.target.value) || 0)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price (RM)
            </label>
            <input
              type="number"
              value={filters.priceMax || ''}
              onChange={(e) => updateFilter('priceMax', parseInt(e.target.value) || 0)}
              placeholder="No limit"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
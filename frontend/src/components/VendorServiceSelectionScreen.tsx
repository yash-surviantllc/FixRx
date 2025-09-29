import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, ChevronUp, X, Wrench, Zap, Wind, Hammer, DollarSign, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VendorServiceSelectionScreenProps {
  onBack: () => void;
  onContinue: (selectedServices: string[]) => void;
}

interface Service {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  priceRange: '$' | '$$' | '$$$';
  highDemand?: boolean;
  seasonalInfo?: string;
}

const primaryServices: Service[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    category: 'Home Maintenance',
    icon: <Wrench size={24} />,
    color: '#007AFF',
    priceRange: '$$',
    highDemand: true
  },
  {
    id: 'electrical',
    name: 'Electrical',
    category: 'Installation',
    icon: <Zap size={24} />,
    color: '#FF9500',
    priceRange: '$$$',
    highDemand: true
  },
  {
    id: 'hvac',
    name: 'HVAC',
    category: 'Installation',
    icon: <Wind size={24} />,
    color: '#34C759',
    priceRange: '$$$',
    seasonalInfo: 'Peak season: Nov-Mar'
  },
  {
    id: 'carpentry',
    name: 'Carpentry',
    category: 'Remodeling',
    icon: <Hammer size={24} />,
    color: '#8E4EC6',
    priceRange: '$$'
  }
];

const allServices: Service[] = [
  ...primaryServices,
  {
    id: 'handyman',
    name: 'Handyman Services',
    category: 'Home Maintenance',
    icon: <Wrench size={20} />,
    color: '#6B7280',
    priceRange: '$',
    highDemand: true
  },
  {
    id: 'painting',
    name: 'Painting',
    category: 'Remodeling',
    icon: <div className="w-5 h-5 rounded-full bg-current" />,
    color: '#FF3B30',
    priceRange: '$'
  },
  {
    id: 'roofing',
    name: 'Roofing',
    category: 'Repairs',
    icon: <div className="w-5 h-5 bg-current transform rotate-45" />,
    color: '#8E4EC6',
    priceRange: '$$$'
  },
  {
    id: 'flooring',
    name: 'Flooring',
    category: 'Installation',
    icon: <div className="w-5 h-1 bg-current" />,
    color: '#AF52DE',
    priceRange: '$$'
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    category: 'Home Maintenance',
    icon: <div className="w-5 h-5 rounded bg-current" />,
    color: '#34C759',
    priceRange: '$',
    seasonalInfo: 'Peak season: Mar-Oct'
  },
  {
    id: 'cleaning',
    name: 'House Cleaning',
    category: 'Home Maintenance',
    icon: <div className="w-5 h-5 rounded-full bg-current" />,
    color: '#007AFF',
    priceRange: '$',
    highDemand: true
  },
  {
    id: 'appliance',
    name: 'Appliance Repair',
    category: 'Repairs',
    icon: <div className="w-5 h-4 bg-current rounded" />,
    color: '#FF9500',
    priceRange: '$$'
  },
  {
    id: 'locksmith',
    name: 'Locksmith',
    category: 'Emergency',
    icon: <div className="w-3 h-5 border-2 border-current rounded-t" />,
    color: '#FF3B30',
    priceRange: '$$'
  }
];

const serviceCategories = [
  'Home Maintenance',
  'Repairs', 
  'Installation',
  'Remodeling',
  'Emergency'
];

const popularSearches = ['Handyman', 'Remodeling', 'Repair'];

export function VendorServiceSelectionScreen({ onBack, onContinue }: VendorServiceSelectionScreenProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllServices, setShowAllServices] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredServices = allServices.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(id => id !== serviceId));
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setShowSearchResults(value.length > 0);
  };

  const handlePopularSearchClick = (searchTerm: string) => {
    setSearchQuery(searchTerm);
    setShowSearchResults(true);
  };

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      onContinue(selectedServices);
    }
  };

  const getServiceById = (id: string) => allServices.find(s => s.id === id);

  const renderPriceRange = (range: '$' | '$$' | '$$$') => {
    return (
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: 3 }, (_, i) => (
          <DollarSign 
            key={i} 
            size={12} 
            color={i < range.length ? '#34C759' : '#E5E7EB'} 
          />
        ))}
      </div>
    );
  };

  const renderServiceCard = (service: Service, isSelected: boolean, size: 'large' | 'small' = 'large') => {
    const cardClass = size === 'large' 
      ? 'w-full h-30 p-4' 
      : 'w-full h-20 p-3';
    
    return (
      <motion.button
        key={service.id}
        onClick={() => handleServiceToggle(service.id)}
        className={`${cardClass} rounded-xl border-2 transition-all duration-200 relative flex flex-col items-center justify-center ${
          isSelected 
            ? 'border-current shadow-lg transform scale-[1.02]' 
            : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
        }`}
        style={{
          borderColor: isSelected ? service.color : undefined,
          backgroundColor: 'white'
        }}
        whileHover={{ scale: isSelected ? 1.02 : 1.01 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Selection Checkbox */}
        <div className="absolute top-3 right-3">
          <div 
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              isSelected ? 'border-current' : 'border-gray-300'
            }`}
            style={{
              backgroundColor: isSelected ? service.color : 'transparent',
              borderColor: isSelected ? service.color : undefined
            }}
          >
            {isSelected && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path 
                  d="M2 6L5 9L10 3" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Service Icon */}
        <div 
          className={`${size === 'large' ? 'mb-2' : 'mb-1'} flex items-center justify-center`}
          style={{ color: service.color }}
        >
          {service.icon}
        </div>

        {/* Service Name */}
        <h3 
          className={`${size === 'large' ? 'text-[16px]' : 'text-[14px]'} font-medium text-center ${size === 'large' ? 'mb-2' : 'mb-1'}`}
          style={{ 
            color: '#1D1D1F',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
          }}
        >
          {service.name}
        </h3>

        {size === 'large' && (
          <div className="flex flex-col items-center justify-center space-y-1">
            {/* Price Range */}
            <div className="flex items-center justify-center">
              {renderPriceRange(service.priceRange)}
            </div>

            {/* High Demand Badge */}
            {service.highDemand && (
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp size={12} color="#34C759" />
                <span 
                  className="text-[10px] font-medium"
                  style={{ 
                    color: '#34C759',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  High demand
                </span>
              </div>
            )}

            {/* Seasonal Info */}
            {service.seasonalInfo && (
              <p 
                className="text-[10px] text-center"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {service.seasonalInfo}
              </p>
            )}
          </div>
        )}
      </motion.button>
    );
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <div className="relative pt-5 pb-6 bg-white border-b border-gray-100">
        <div className="px-5">
          <div className="flex items-center mb-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 mr-3"
            >
              <ArrowLeft size={24} color="#1D1D1F" />
            </motion.button>
            
            <div className="flex-1">
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-4">
                <span 
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Step 2 of 3
                </span>
                <span 
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  67%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '33.33%' }}
                  animate={{ width: '66.67%' }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: '#007AFF' }}
                />
              </div>
            </div>
          </div>

          {/* Title and Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 
              className="text-[28px] font-bold mb-2"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              What services do you offer?
            </h1>
            <p 
              className="text-[16px]"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Select all services you provide
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-5 pb-32">
        {/* Selected Services Counter */}
        {selectedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 mb-4"
          >
            <p 
              className="text-[16px] font-medium"
              style={{ 
                color: '#007AFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
            </p>
          </motion.div>
        )}

        {/* Selected Services Chips */}
        {selectedServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {selectedServices.map(serviceId => {
              const service = getServiceById(serviceId);
              if (!service) return null;
              
              return (
                <div
                  key={serviceId}
                  className="flex items-center space-x-2 px-3 py-2 rounded-full"
                  style={{ backgroundColor: '#007AFF' }}
                >
                  <span 
                    className="text-[14px] font-medium text-white"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                  >
                    {service.name}
                  </span>
                  <button
                    onClick={() => handleRemoveService(serviceId)}
                    className="p-0.5 rounded-full hover:bg-white/20 transition-colors duration-200"
                  >
                    <X size={14} color="white" />
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Primary Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <div className="grid grid-cols-2 gap-3 mb-6">
            {primaryServices.map(service => {
              const isSelected = selectedServices.includes(service.id);
              return renderServiceCard(service, isSelected);
            })}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 relative"
        >
          <div className="relative">
            <Search 
              size={20} 
              color="#6B7280" 
              className="absolute left-4 top-1/2 transform -translate-y-1/2" 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300"
              style={{
                backgroundColor: 'white',
                fontSize: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                color: '#1D1D1F'
              }}
              placeholder="Search for more services..."
            />
          </div>

          {/* Popular Searches */}
          {!showSearchResults && !showAllServices && (
            <div className="mt-3 flex flex-wrap gap-2">
              <span 
                className="text-[12px] mr-2"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Popular:
              </span>
              {popularSearches.map(term => (
                <button
                  key={term}
                  onClick={() => handlePopularSearchClick(term)}
                  className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
                >
                  <span 
                    className="text-[12px]"
                    style={{ 
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    {term}
                  </span>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Search Results */}
        <AnimatePresence>
          {showSearchResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="space-y-2">
                {filteredServices.map(service => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <div key={service.id} className="grid grid-cols-1">
                      {renderServiceCard(service, isSelected, 'small')}
                    </div>
                  );
                })}
              </div>
              {filteredServices.length === 0 && (
                <p 
                  className="text-center py-8 text-[16px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  No services found for "{searchQuery}"
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* View All Services */}
        {!showSearchResults && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-6"
          >
            <button
              onClick={() => setShowAllServices(!showAllServices)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            >
              <span 
                className="text-[16px] font-medium"
                style={{ 
                  color: '#007AFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                View all services
              </span>
              {showAllServices ? (
                <ChevronUp size={20} color="#007AFF" />
              ) : (
                <ChevronDown size={20} color="#007AFF" />
              )}
            </button>

            {/* Expandable Service List */}
            <AnimatePresence>
              {showAllServices && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-6"
                >
                  {serviceCategories.map(category => (
                    <div key={category}>
                      <h3 
                        className="text-[16px] font-medium mb-3"
                        style={{ 
                          color: '#374151',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {category}
                      </h3>
                      <div className="space-y-2">
                        {allServices
                          .filter(service => service.category === category)
                          .map(service => {
                            const isSelected = selectedServices.includes(service.id);
                            return (
                              <button
                                key={service.id}
                                onClick={() => handleServiceToggle(service.id)}
                                className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200"
                              >
                                <div className="flex items-center space-x-3">
                                  <div style={{ color: service.color }}>
                                    {service.icon}
                                  </div>
                                  <span 
                                    className="text-[16px]"
                                    style={{ 
                                      color: '#1D1D1F',
                                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                                    }}
                                  >
                                    {service.name}
                                  </span>
                                </div>
                                <div 
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                                    isSelected ? 'border-current' : 'border-gray-300'
                                  }`}
                                  style={{
                                    backgroundColor: isSelected ? service.color : 'transparent',
                                    borderColor: isSelected ? service.color : undefined
                                  }}
                                >
                                  {isSelected && (
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path 
                                        d="M2 6L5 9L10 3" 
                                        stroke="white" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Fixed Action Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <motion.button
          onClick={handleContinue}
          disabled={selectedServices.length === 0}
          className={`w-full h-14 rounded-xl transition-all duration-200 flex items-center justify-center ${
            selectedServices.length > 0
              ? 'hover:opacity-90 active:scale-[0.98]' 
              : 'opacity-50 cursor-not-allowed'
          }`}
          style={{
            background: selectedServices.length > 0
              ? 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)' 
              : '#E5E7EB',
            boxShadow: selectedServices.length > 0
              ? '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)' 
              : 'none'
          }}
          whileTap={selectedServices.length > 0 ? { scale: 0.98 } : {}}
        >
          <span 
            className="text-white text-[16px] font-medium"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
          >
            {selectedServices.length > 0 
              ? `Continue with ${selectedServices.length} service${selectedServices.length !== 1 ? 's' : ''}`
              : 'Select at least 1 service'
            }
          </span>
        </motion.button>
      </div>
    </div>
  );
}
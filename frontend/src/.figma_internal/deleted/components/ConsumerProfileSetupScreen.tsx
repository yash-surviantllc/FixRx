import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Check, ChevronDown, Search } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';
interface ConsumerProfileSetupScreenProps {
  onBack: () => void;
  onContinue: (profileData: ConsumerProfileData) => void;
}

interface ConsumerProfileData {
  fullName: string;
  phoneNumber: string;
  metroArea: string;
}

const metroAreas = [
  'Atlanta, GA',
  'Austin, TX',
  'Baltimore, MD',
  'Boston, MA',
  'Charlotte, NC',
  'Chicago, IL',
  'Dallas, TX',
  'Denver, CO',
  'Detroit, MI',
  'Houston, TX',
  'Las Vegas, NV',
  'Los Angeles, CA',
  'Miami, FL',
  'Nashville, TN',
  'New York, NY',
  'Orlando, FL',
  'Philadelphia, PA',
  'Phoenix, AZ',
  'Portland, OR',
  'San Antonio, TX',
  'San Diego, CA',
  'San Francisco, CA',
  'Seattle, WA',
  'Tampa, FL',
  'Washington, DC'
];

export function ConsumerProfileSetupScreen({ onBack, onContinue }: ConsumerProfileSetupScreenProps) {
  const [formData, setFormData] = useState<ConsumerProfileData>({
    fullName: '',
    phoneNumber: '',
    metroArea: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [metroSearchQuery, setMetroSearchQuery] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [typingBuffer, setTypingBuffer] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Phone number formatting
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'phoneNumber':
        const numbers = value.replace(/\D/g, '');
        if (!numbers) return 'Phone number is required';
        if (numbers.length !== 10) return 'Phone number must be 10 digits';
        return '';
      case 'metroArea':
        if (!value) return 'Metro area is required';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;
    
    if (field === 'phoneNumber') {
      processedValue = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Validate field
    const error = validateField(field, field === 'phoneNumber' ? value.replace(/\D/g, '') : value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleMetroAreaSelect = (area: string) => {
    setFormData(prev => ({ ...prev, metroArea: area }));
    setErrors(prev => ({ ...prev, metroArea: '' }));
    setIsDropdownOpen(false);
    setMetroSearchQuery('');
    setHighlightedIndex(-1);
    setTypingBuffer('');
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeout(null);
    }
  };

  const filteredMetroAreas = metroAreas.filter(area =>
    area.toLowerCase().includes(metroSearchQuery.toLowerCase())
  );

  // Function to find first metro area starting with given letters
  const findMetroAreaByPrefix = (prefix: string) => {
    const lowerPrefix = prefix.toLowerCase();
    return filteredMetroAreas.findIndex(area => 
      area.toLowerCase().startsWith(lowerPrefix)
    );
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isDropdownOpen) return;

    // Handle letter typing for quick navigation
    if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
      e.preventDefault();
      
      // Clear existing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Add letter to buffer
      const newBuffer = typingBuffer + e.key.toLowerCase();
      setTypingBuffer(newBuffer);

      // Find matching metro area
      const matchIndex = findMetroAreaByPrefix(newBuffer);
      if (matchIndex !== -1) {
        setHighlightedIndex(matchIndex);
        // Scroll to the highlighted item
        setTimeout(() => {
          const optionElement = optionsRef.current[matchIndex];
          if (optionElement) {
            optionElement.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest'
            });
          }
        }, 0);
      }

      // Clear buffer after 1 second of no typing
      const timeout = setTimeout(() => {
        setTypingBuffer('');
      }, 1000);
      setTypingTimeout(timeout);
    }
    
    // Handle arrow keys
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = highlightedIndex < filteredMetroAreas.length - 1 ? highlightedIndex + 1 : 0;
      setHighlightedIndex(nextIndex);
      setTimeout(() => {
        const optionElement = optionsRef.current[nextIndex];
        if (optionElement) {
          optionElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }, 0);
    }
    
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : filteredMetroAreas.length - 1;
      setHighlightedIndex(prevIndex);
      setTimeout(() => {
        const optionElement = optionsRef.current[prevIndex];
        if (optionElement) {
          optionElement.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          });
        }
      }, 0);
    }
    
    // Handle Enter to select
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredMetroAreas.length) {
        handleMetroAreaSelect(filteredMetroAreas[highlightedIndex]);
      }
    }
    
    // Handle Escape to close
    else if (e.key === 'Escape') {
      e.preventDefault();
      setIsDropdownOpen(false);
      setMetroSearchQuery('');
      setHighlightedIndex(-1);
      setTypingBuffer('');
    }
  };

  // Check form validity
  useEffect(() => {
    const hasRequiredFields = formData.fullName.trim() && 
                             formData.phoneNumber && 
                             formData.metroArea;
    const hasNoErrors = Object.values(errors).every(error => !error);
    setIsFormValid(hasRequiredFields && hasNoErrors);
  }, [formData, errors]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  // Handle clicking outside dropdown and keyboard events
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setMetroSearchQuery('');
        setHighlightedIndex(-1);
        setTypingBuffer('');
        if (typingTimeout) {
          clearTimeout(typingTimeout);
          setTypingTimeout(null);
        }
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isDropdownOpen, highlightedIndex, typingBuffer, typingTimeout, filteredMetroAreas]);

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onContinue(formData);
    }, 1500);
  };

  const getInputStyle = (field: string) => {
    const hasError = errors[field];
    const isFocused = focusedField === field;
    const hasValue = formData[field as keyof ConsumerProfileData];

    return {
      backgroundColor: '#FFFFFF',
      border: `1px solid ${hasError ? '#DC2626' : isFocused ? '#007AFF' : '#E5E7EB'}`,
      boxShadow: hasError 
        ? '0 0 0 3px rgba(220, 38, 38, 0.1)'
        : isFocused 
        ? '0 0 0 3px rgba(0, 122, 255, 0.1)'
        : 'none',
      color: '#1D1D1F',
      fontSize: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
    };
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white">
      {/* Header */}
      <div className="relative z-10 pt-5">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onBack}
          className="ml-5 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <ArrowLeft size={24} color="#1D1D1F" />
        </motion.button>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 mx-5"
        >
          <div className="flex items-center space-x-3 mb-2">
            <span 
              className="text-[14px] font-medium"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Step 1 of 2
            </span>
          </div>
          <div className="w-full h-1 bg-gray-200 rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '40%' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1 rounded-full"
              style={{ backgroundColor: '#007AFF' }}
            />
          </div>
        </motion.div>

        {/* Title and Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 mx-5"
        >
          <h1 
            className="text-[28px] font-bold mb-2"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Set up your profile
          </h1>
          <p 
            className="text-[16px]"
            style={{ 
              color: '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Help contractors understand your needs
          </p>
        </motion.div>
      </div>

      {/* Form Content */}
      <div className="relative z-10 px-5 mt-8">
        <div className="w-full max-w-sm mx-auto">
          
          {/* Personal Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <h3 
              className="text-[18px] font-medium mb-6"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Personal Details
            </h3>

            {/* Full Name Field */}
            <div className="mb-4">
              <label 
                className="block text-[14px] font-medium mb-2"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter your full name"
                  className="w-full h-14 px-4 pr-12 rounded-xl transition-all duration-200"
                  style={getInputStyle('fullName')}
                />
                {formData.fullName && !errors.fullName && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check size={12} color="white" />
                    </div>
                  </motion.div>
                )}
              </div>
              {errors.fullName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12px] mt-1"
                  style={{ color: '#DC2626' }}
                >
                  {errors.fullName}
                </motion.p>
              )}
            </div>

            {/* Phone Number Field */}
            <div className="mb-4">
              <label 
                className="block text-[14px] font-medium mb-2"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Phone Number *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  onFocus={() => setFocusedField('phoneNumber')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="(555) 123-4567"
                  inputMode="tel"
                  className="w-full h-14 px-4 pr-12 rounded-xl transition-all duration-200"
                  style={getInputStyle('phoneNumber')}
                />
                {formData.phoneNumber && !errors.phoneNumber && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check size={12} color="white" />
                    </div>
                  </motion.div>
                )}
              </div>
              {errors.phoneNumber && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12px] mt-1"
                  style={{ color: '#DC2626' }}
                >
                  {errors.phoneNumber}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Location Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <h3 
              className="text-[18px] font-medium mb-6"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Location
            </h3>

            {/* Metro Area Field */}
            <div className="mb-4">
              <label 
                className="block text-[14px] font-medium mb-2"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Metro Area *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setHighlightedIndex(-1);
                    setTypingBuffer('');
                  }}
                  onFocus={() => setFocusedField('metroArea')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full h-14 px-4 pr-12 rounded-xl transition-all duration-200 text-left flex items-center"
                  style={getInputStyle('metroArea')}
                >
                  <span style={{ color: formData.metroArea ? '#1D1D1F' : '#9CA3AF' }}>
                    {formData.metroArea || 'Select your metropolitan area'}
                  </span>
                  <ChevronDown 
                    size={20} 
                    color="#6B7280" 
                    className={`absolute right-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-hidden"
                  >
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search size={16} color="#6B7280" className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          value={metroSearchQuery}
                          onChange={(e) => {
                            setMetroSearchQuery(e.target.value);
                            setHighlightedIndex(-1);
                            setTypingBuffer('');
                          }}
                          placeholder="Search metro areas..."
                          className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-lg text-[14px]"
                          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                        />
                      </div>
                    </div>

                    {/* Options */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredMetroAreas.map((area, index) => (
                        <div
                          key={area}
                          ref={(el) => (optionsRef.current[index] = el)}
                          onClick={() => handleMetroAreaSelect(area)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          className={`w-full px-4 py-3 text-left cursor-pointer transition-colors duration-150 text-[14px] select-none ${
                            highlightedIndex === index 
                              ? 'bg-blue-100 text-blue-900' 
                              : 'hover:bg-blue-50 active:bg-blue-100'
                          }`}
                          style={{ 
                            color: highlightedIndex === index ? '#1E40AF' : '#1D1D1F',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                            backgroundColor: highlightedIndex === index ? '#DBEAFE' : undefined
                          }}
                        >
                          {area}
                        </div>
                      ))}
                      {filteredMetroAreas.length === 0 && (
                        <div className="px-4 py-3 text-[14px]" style={{ color: '#6B7280' }}>
                          No metro areas found
                        </div>
                      )}
                      
                      {/* Typing indicator */}
                      {typingBuffer && (
                        <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
                          <span className="text-[12px] text-blue-600 font-medium">
                            Typing: "{typingBuffer.toUpperCase()}"
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {formData.metroArea && !errors.metroArea && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-10 top-1/2 transform -translate-y-1/2"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check size={12} color="white" />
                    </div>
                  </motion.div>
                )}
              </div>
              {errors.metroArea && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[12px] mt-1"
                  style={{ color: '#DC2626' }}
                >
                  {errors.metroArea}
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-10"
          >
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className={`w-full h-14 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 ${
                !isFormValid || isLoading ? 'cursor-not-allowed' : 'hover:opacity-90'
              }`}
              style={{
                backgroundColor: (!isFormValid || isLoading) ? '#9CA3AF' : '#007AFF',
                boxShadow: (!isFormValid || isLoading) 
                  ? 'none' 
                  : '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
              }}
            >
              <span 
                className="text-white text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                {isLoading ? 'Setting up...' : 'Continue'}
              </span>
            </button>
          </motion.div>
        </div>
      </div>


    </div>
  );
}
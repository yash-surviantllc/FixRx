import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';

interface VendorProfileSetupScreenProps {
  onBack: () => void;
  onContinue: (profileData: any) => void;
  userEmail?: string;
}

interface VendorProfile {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  businessName: string;
  licenseNumber: string;
  metroArea: string;
  serviceRadius: number;
  useCurrentLocation: boolean;
  yearsExperience: number;
  hasInsurance: boolean;
  isBonded: boolean;
}

const metroAreas = [
  'Atlanta, GA',
  'Austin, TX',
  'Boston, MA',
  'Charlotte, NC', 
  'Chicago, IL',
  'Dallas, TX',
  'Denver, CO',
  'Houston, TX',
  'Los Angeles, CA',
  'Miami, FL',
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

export function VendorProfileSetupScreen({ onBack, onContinue, userEmail }: VendorProfileSetupScreenProps) {
  const [profile, setProfile] = useState<VendorProfile>({
    firstName: '',
    lastName: '',
    phone: '',
    email: userEmail || '',
    businessName: '',
    licenseNumber: '',
    metroArea: '',
    serviceRadius: 15,
    useCurrentLocation: false,
    yearsExperience: 5,
    hasInsurance: false,
    isBonded: false
  });

  const [isEmailDisabled, setIsEmailDisabled] = useState(!!userEmail);
  const [metroSearchQuery, setMetroSearchQuery] = useState('');
  const [showMetroDropdown, setShowMetroDropdown] = useState(false);

  const filteredMetroAreas = metroAreas.filter(area =>
    area.toLowerCase().includes(metroSearchQuery.toLowerCase())
  );

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    
    // Limit to 10 digits maximum
    const limited = cleaned.slice(0, 10);
    
    // Format based on length
    if (limited.length >= 6) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    } else if (limited.length >= 3) {
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    } else if (limited.length > 0) {
      return `(${limited}`;
    }
    return '';
  };

  const isValidPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setProfile(prev => ({ ...prev, phone: formatted }));
  };

  const isFormValid = () => {
    return (
      profile.firstName.trim() &&
      profile.lastName.trim() &&
      isValidPhoneNumber(profile.phone) &&
      profile.email.trim() &&
      profile.metroArea.trim()
    );
  };

  const handleContinue = () => {
    if (isFormValid()) {
      onContinue(profile);
    }
  };

  const handleSaveAndContinueLater = () => {
    console.log('Saving profile for later completion');
    // Would typically save to local storage or backend
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
                  Step 1 of 3
                </span>
                <span 
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  33%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '33.33%' }}
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
              Tell us about your business
            </h1>
            <p 
              className="text-[16px]"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              This helps customers find and trust you
            </p>
          </motion.div>
        </div>
      </div>

      <div className="px-5 pb-32">
        {/* Personal Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <h2 
            className="text-[18px] font-medium mb-6"
            style={{ 
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Personal Details
          </h2>

          {/* First Name & Last Name */}
          <div className="flex space-x-3 mb-4">
            <div className="flex-1">
              <label 
                className="block text-[14px] font-medium mb-2"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                First Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                value={profile.firstName}
                onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full h-14 px-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  fontSize: '16px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  color: '#1D1D1F'
                }}
                placeholder="John"
              />
            </div>
            
            <div className="flex-1">
              <label 
                className="block text-[14px] font-medium mb-2"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Last Name <span style={{ color: '#DC2626' }}>*</span>
              </label>
              <input
                type="text"
                value={profile.lastName}
                onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full h-14 px-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  fontSize: '16px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  color: '#1D1D1F'
                }}
                placeholder="Smith"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label 
              className="block text-[14px] font-medium mb-2"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Phone Number <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className={`w-full h-14 px-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                profile.phone && !isValidPhoneNumber(profile.phone)
                  ? 'border-red-300 focus:ring-red-500/20' 
                  : 'border-gray-200 focus:ring-blue-500/20'
              }`}
              style={{
                backgroundColor: 'white',
                borderColor: profile.phone && !isValidPhoneNumber(profile.phone) ? '#FCA5A5' : '#E5E7EB',
                fontSize: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                color: '#1D1D1F'
              }}
              placeholder="(555) 123-4567"
            />
            {profile.phone && !isValidPhoneNumber(profile.phone) && (
              <p 
                className="mt-2 text-[12px]"
                style={{ 
                  color: '#DC2626',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Please enter a valid 10-digit phone number
              </p>
            )}
            <p 
              className="mt-1 text-[12px]"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              We'll use this to verify your identity and for important updates
            </p>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label 
              className="block text-[14px] font-medium mb-2"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Email Address <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                disabled={isEmailDisabled}
                className="w-full h-14 px-4 pr-12 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                style={{
                  backgroundColor: isEmailDisabled ? '#F9FAFB' : 'white',
                  border: '1px solid #E5E7EB',
                  fontSize: '16px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  color: isEmailDisabled ? '#6B7280' : '#1D1D1F'
                }}
                placeholder="john@example.com"
              />
              {isEmailDisabled && (
                <button
                  onClick={() => setIsEmailDisabled(false)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <Edit3 size={16} color="#6B7280" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Business Information Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h2 
            className="text-[18px] font-medium mb-6"
            style={{ 
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Business Information
          </h2>

          {/* Business Name */}
          <div className="mb-4">
            <label 
              className="block text-[14px] font-medium mb-2"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Business or Trading Name
            </label>
            <input
              type="text"
              value={profile.businessName}
              onChange={(e) => setProfile(prev => ({ ...prev, businessName: e.target.value }))}
              className="w-full h-14 px-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              style={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                fontSize: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                color: '#1D1D1F'
              }}
              placeholder="e.g., Rodriguez Plumbing Services"
            />
            <p 
              className="mt-2 text-[14px]"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Leave blank if you work under your personal name
            </p>
          </div>

          {/* License Number */}
          <div className="mb-4">
            <label 
              className="block text-[14px] font-medium mb-2"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Professional License
            </label>
            <input
              type="text"
              value={profile.licenseNumber}
              onChange={(e) => setProfile(prev => ({ ...prev, licenseNumber: e.target.value }))}
              className="w-full h-14 px-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              style={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                fontSize: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                color: '#1D1D1F'
              }}
              placeholder="License number"
            />
            <p 
              className="mt-2 text-[14px]"
              style={{ 
                color: '#007AFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Licensed contractors receive 3x more contacts
            </p>
          </div>
        </motion.div>

        {/* Service Area Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <h2 
            className="text-[18px] font-medium mb-6"
            style={{ 
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Service Area
          </h2>

          {/* Metropolitan Area */}
          <div className="mb-4 relative">
            <label 
              className="block text-[14px] font-medium mb-2"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Metropolitan Area <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              type="text"
              value={metroSearchQuery}
              onChange={(e) => {
                setMetroSearchQuery(e.target.value);
                setShowMetroDropdown(true);
              }}
              onFocus={() => setShowMetroDropdown(true)}
              className="w-full h-14 px-4 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              style={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                fontSize: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                color: '#1D1D1F'
              }}
              placeholder="Select your metro area"
            />
            
            {showMetroDropdown && filteredMetroAreas.length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto z-10"
              >
                {filteredMetroAreas.map((area) => (
                  <button
                    key={area}
                    onClick={() => {
                      setProfile(prev => ({ ...prev, metroArea: area }));
                      setMetroSearchQuery(area);
                      setShowMetroDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
                    style={{
                      fontSize: '16px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                      color: '#1D1D1F'
                    }}
                  >
                    {area}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service Radius */}
          <div className="mb-4">
            <label 
              className="block text-[14px] font-medium mb-2"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Service Radius: {profile.serviceRadius} miles
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={profile.serviceRadius}
              onChange={(e) => setProfile(prev => ({ ...prev, serviceRadius: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #007AFF 0%, #007AFF ${((profile.serviceRadius - 5) / 45) * 100}%, #E5E7EB ${((profile.serviceRadius - 5) / 45) * 100}%, #E5E7EB 100%)`
              }}
            />
            <div className="flex justify-between text-[12px] mt-1" style={{ color: '#6B7280' }}>
              <span>5 miles</span>
              <span>50 miles</span>
            </div>
          </div>

          {/* Use Current Location Toggle */}
          <div className="flex items-center space-x-3 mb-4">
            <button
              onClick={() => setProfile(prev => ({ ...prev, useCurrentLocation: !prev.useCurrentLocation }))}
              className={`w-12 h-6 rounded-full transition-colors duration-200 flex items-center ${
                profile.useCurrentLocation ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  profile.useCurrentLocation ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
            <MapPin size={16} color="#6B7280" />
            <span 
              className="text-[16px]"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Use current location
            </span>
          </div>
        </motion.div>

        {/* Professional Credentials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <h2 
            className="text-[18px] font-medium mb-6"
            style={{ 
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Professional Credentials
          </h2>

          {/* Years of Experience */}
          <div className="mb-6">
            <label 
              className="block text-[14px] font-medium mb-2"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Years of Experience: {profile.yearsExperience}+ years
            </label>
            <input
              type="range"
              min="1"
              max="40"
              value={profile.yearsExperience}
              onChange={(e) => setProfile(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #007AFF 0%, #007AFF ${((profile.yearsExperience - 1) / 39) * 100}%, #E5E7EB ${((profile.yearsExperience - 1) / 39) * 100}%, #E5E7EB 100%)`
              }}
            />
          </div>

          {/* Insurance Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
            <div>
              <span 
                className="text-[16px] font-medium block"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                I carry liability insurance
              </span>
            </div>
            <button
              onClick={() => setProfile(prev => ({ ...prev, hasInsurance: !prev.hasInsurance }))}
              className={`w-12 h-6 rounded-full transition-colors duration-200 flex items-center ${
                profile.hasInsurance ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  profile.hasInsurance ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Bonding Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
            <div>
              <span 
                className="text-[16px] font-medium block"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                I am bonded
              </span>
            </div>
            <button
              onClick={() => setProfile(prev => ({ ...prev, isBonded: !prev.isBonded }))}
              className={`w-12 h-6 rounded-full transition-colors duration-200 flex items-center ${
                profile.isBonded ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  profile.isBonded ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <div className="space-y-3">
          {/* Primary Continue Button */}
          <motion.button
            onClick={handleContinue}
            disabled={!isFormValid()}
            className={`w-full h-14 rounded-xl transition-all duration-200 flex items-center justify-center ${
              isFormValid() 
                ? 'hover:opacity-90 active:scale-[0.98]' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{
              background: isFormValid() 
                ? 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)' 
                : '#E5E7EB',
              boxShadow: isFormValid() 
                ? '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)' 
                : 'none'
            }}
            whileTap={isFormValid() ? { scale: 0.98 } : {}}
          >
            <span 
              className="text-white text-[16px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Continue
            </span>
          </motion.button>

          {/* Secondary Save Button */}
          <motion.button
            onClick={handleSaveAndContinueLater}
            className="w-full h-12 rounded-xl border-2 border-blue-500 bg-transparent hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center"
            whileTap={{ scale: 0.98 }}
          >
            <span 
              className="text-[16px] font-medium"
              style={{ 
                color: '#007AFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' 
              }}
            >
              Save & Continue Later
            </span>
          </motion.button>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showMetroDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowMetroDropdown(false)}
        />
      )}
    </div>
  );
}
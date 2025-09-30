import React from 'react';
import { useState } from 'react';
import { Home, Hammer } from 'lucide-react';
import { motion } from 'motion/react';
import { MobileContainer } from './MobileContainer';

interface UserTypeSelectionScreenProps {
  onUserTypeSelected: (userType: 'consumer' | 'vendor') => void;
}

export function UserTypeSelectionScreen({ onUserTypeSelected }: UserTypeSelectionScreenProps) {
  const [selectedType, setSelectedType] = useState<'consumer' | 'vendor' | null>(null);
  const [pressedCard, setPressedCard] = useState<string | null>(null);

  const handleCardPress = (type: 'consumer' | 'vendor') => {
    setPressedCard(type);
    setTimeout(() => setPressedCard(null), 150);
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      onUserTypeSelected(selectedType);
    }
  };

  const getCardStyle = (type: 'consumer' | 'vendor') => {
    const isSelected = selectedType === type;
    const isPressed = pressedCard === type;
    
    const baseStyle = {
      backgroundColor: '#FFFFFF',
      borderRadius: '16px',
      border: isSelected 
        ? `2px solid ${type === 'consumer' ? '#007AFF' : '#F97316'}` 
        : '2px solid #E5E7EB',
      boxShadow: isPressed
        ? 'inset 0 2px 8px rgba(0, 0, 0, 0.1)'
        : isSelected
        ? `0 8px 24px ${type === 'consumer' ? 'rgba(0, 122, 255, 0.15)' : 'rgba(249, 115, 22, 0.15)'}, 0 4px 16px rgba(0, 0, 0, 0.08)`
        : '0 4px 16px rgba(0, 0, 0, 0.06)',
      transform: isPressed ? 'scale(0.98)' : 'scale(1)',
      transition: 'all 0.15s ease-out'
    };

    if (!isSelected && type === 'consumer') {
      baseStyle.backgroundColor = '#F0F8FF';
    } else if (!isSelected && type === 'vendor') {
      baseStyle.backgroundColor = '#FFF7ED';
    }

    return baseStyle;
  };

  return (
    <MobileContainer className="bg-white">
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center pt-16 px-5">
        
        {/* Progress Indicator (Optional) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <div className="w-6 h-2 rounded-full bg-gray-300"></div>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[28px] font-bold text-center mb-4"
          style={{ 
            color: '#1D1D1F',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
          }}
        >
          How will you use FixRx?
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[16px] text-center mb-12"
          style={{ 
            color: '#6B7280',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
          }}
        >
          Choose the option that best describes you
        </motion.p>

        {/* Cards Container */}
        <div className="w-full max-w-sm space-y-5 mb-10">
          
          {/* Consumer Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full h-40 relative"
          >
            <button
              onClick={() => handleCardPress('consumer')}
              onMouseDown={() => setPressedCard('consumer')}
              onMouseUp={() => setPressedCard(null)}
              onMouseLeave={() => setPressedCard(null)}
              className="w-full h-full p-6 flex flex-col items-center justify-center text-center"
              style={getCardStyle('consumer')}
            >
              {/* House Icon */}
              <div className="mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(0, 122, 255, 0.1)' }}
                >
                  <Home size={24} color="#007AFF" strokeWidth={2} />
                </div>
              </div>

              {/* Title */}
              <h3 
                className="text-[20px] font-bold mb-2"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                I need services
              </h3>

              {/* Description */}
              <p 
                className="text-[16px] leading-tight"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Find trusted contractors through friends
              </p>

              {/* Selection Indicator */}
              {selectedType === 'consumer' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center"
                >
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4.5L4.5 8L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              )}
            </button>
          </motion.div>

          {/* Vendor Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full h-40 relative"
          >
            <button
              onClick={() => handleCardPress('vendor')}
              onMouseDown={() => setPressedCard('vendor')}
              onMouseUp={() => setPressedCard(null)}
              onMouseLeave={() => setPressedCard(null)}
              className="w-full h-full p-6 flex flex-col items-center justify-center text-center"
              style={getCardStyle('vendor')}
            >
              {/* Tools Icon */}
              <div className="mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)' }}
                >
                  <Hammer size={24} color="#F97316" strokeWidth={2} />
                </div>
              </div>

              {/* Title */}
              <h3 
                className="text-[20px] font-bold mb-2"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                I provide services
              </h3>

              {/* Description */}
              <p 
                className="text-[16px] leading-tight"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Connect with homeowners who need help
              </p>

              {/* Selection Indicator */}
              {selectedType === 'vendor' && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center"
                >
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path d="M1 4.5L4.5 8L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              )}
            </button>
          </motion.div>
        </div>

        {/* Continue Button */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm"
          >
            <button
              onClick={handleContinue}
              className="w-full h-14 rounded-xl flex items-center justify-center transition-all duration-200 hover:opacity-90"
              style={{
                backgroundColor: '#007AFF',
                boxShadow: '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
              }}
            >
              <span 
                className="text-white text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Continue
              </span>
            </button>
          </motion.div>
        )}

      </div>
    </MobileContainer>
  );
}
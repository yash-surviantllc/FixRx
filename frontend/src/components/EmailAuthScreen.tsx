import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';

interface EmailAuthScreenProps {
  onBack: () => void;
  onEmailSent: (email: string) => void;
}

export function EmailAuthScreen({ onBack, onEmailSent }: EmailAuthScreenProps) {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const valid = emailRegex.test(email);
    setIsValid(valid);
    if (email.length > 0 && !valid) {
      setHasError(true);
    } else {
      setHasError(false);
    }
  }, [email]);

  const handleSendLink = async () => {
    if (!isValid) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Magic link sent to:', email);
      onEmailSent(email);
    }, 2000);
  };

  const getInputBorderColor = () => {
    if (hasError) return '#DC2626';
    if (isFocused) return '#007AFF';
    return '#E5E7EB';
  };

  const getInputBoxShadow = () => {
    if (hasError) return '0 0 0 3px rgba(220, 38, 38, 0.1)';
    if (isFocused) return '0 0 0 3px rgba(0, 122, 255, 0.1)';
    return 'none';
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

        {/* Screen Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-[28px] font-bold ml-5 mt-6"
          style={{ 
            color: '#1D1D1F',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
          }}
        >
          What's your email?
        </motion.h1>
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col justify-center min-h-screen pt-32 pb-32 px-5">
        <div className="w-full max-w-sm mx-auto">
          
          {/* Email Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mb-4"
          >
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter your email address"
                inputMode="email"
                autoComplete="email"
                className={`w-full h-14 px-4 pr-12 rounded-xl transition-all duration-200 ${
                  hasError ? 'animate-pulse' : ''
                }`}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: `1px solid ${getInputBorderColor()}`,
                  boxShadow: getInputBoxShadow(),
                  fontSize: '16px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  color: '#1D1D1F'
                }}
              />
              
              {/* Validation Icon */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                {email.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isValid ? (
                      <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                        <Check size={12} color="white" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                        <X size={12} color="white" />
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Shake animation for errors */}
            {hasError && (
              <style>
                {`
                  @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                  }
                  .animate-shake {
                    animation: shake 0.3s ease-in-out;
                  }
                `}
              </style>
            )}
          </motion.div>

          {/* Helper Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-6 text-[14px]"
            style={{ 
              color: '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            We'll email you a secure link to sign in
          </motion.p>

          {/* Send Button */}
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={handleSendLink}
            disabled={!isValid || isLoading}
            className={`w-full h-14 rounded-xl flex items-center justify-center space-x-2 transition-all duration-200 ${
              !isValid || isLoading ? 'cursor-not-allowed' : 'hover:opacity-90'
            }`}
            style={{
              backgroundColor: (!isValid || isLoading) ? '#9CA3AF' : '#007AFF',
              boxShadow: (!isValid || isLoading) 
                ? 'none' 
                : '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={20} color="white" className="animate-spin" />
                <span 
                  className="text-white text-[16px] font-medium"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                >
                  Sending...
                </span>
              </>
            ) : (
              <span 
                className="text-white text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Send login link
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
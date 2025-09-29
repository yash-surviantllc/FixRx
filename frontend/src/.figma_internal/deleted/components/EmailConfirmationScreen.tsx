import { useState } from 'react';
import { Check, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface EmailConfirmationScreenProps {
  email: string;
  onBack: () => void;
  onUseDifferentEmail: () => void;
  onEmailVerified?: () => void;
}

// Gmail Icon Component
const GmailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L12 9.545l8.073-6.052C21.69 2.28 24 3.434 24 5.457z" fill="#EA4335"/>
  </svg>
);

// Apple Mail Icon Component
const AppleMailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" fill="#007AFF"/>
  </svg>
);

export function EmailConfirmationScreen({ email, onBack, onUseDifferentEmail, onEmailVerified }: EmailConfirmationScreenProps) {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResend = async () => {
    setIsResending(true);
    setResendSuccess(false);
    
    // Simulate API call
    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setResendSuccess(false), 3000);
    }, 1500);
  };

  const openEmailApp = (app: 'gmail' | 'apple') => {
    if (app === 'gmail') {
      // On mobile, this would open the Gmail app
      window.open('https://mail.google.com', '_blank');
    } else {
      // On iOS, this would open the Apple Mail app
      window.open('mailto:', '_self');
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-white">
      {/* Subtle email-themed illustration background */}
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23007AFF' fill-opacity='0.02'%3E%3Cpath d='M60 80c11.046 0 20-8.954 20-20s-8.954-20-20-20-20 8.954-20 20 8.954 20 20 20zm0-30c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '120px 120px'
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5">
        <div className="w-full max-w-sm text-center">
          
          {/* Success Checkmark Icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: "elastic.out",
              delay: 0.1 
            }}
            className="mb-8 flex justify-center"
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#28A745' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Check size={32} color="white" strokeWidth={3} />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[28px] font-bold mb-4"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Check your email
          </motion.h1>

          {/* Email Confirmation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[16px] mb-6"
            style={{ 
              color: '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            We sent a login link to <br />
            <span style={{ color: '#1D1D1F', fontWeight: 500 }}>{email}</span>
          </motion.p>

          {/* Primary Instruction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p
              className="text-[16px] font-medium mb-4"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Click the link to continue to FixRx
            </p>
            
            {/* Simulate email verification for demo */}
            <button
              onClick={() => onEmailVerified?.()}
              className="text-[14px] text-blue-500 underline mt-2"
              style={{ 
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              (Demo: Simulate email verified)
            </button>
          </motion.div>

          {/* Timeline Expectation */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-[14px] mb-8"
            style={{ 
              color: '#9CA3AF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Links typically arrive within 30 seconds
          </motion.p>

          {/* Resend Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-10"
          >
            {resendSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-[16px] font-medium"
                style={{ color: '#28A745' }}
              >
                Email sent again ✓
              </motion.div>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-[16px] font-medium transition-opacity duration-200 hover:opacity-70 disabled:opacity-50"
                style={{ 
                  color: '#007AFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {isResending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Sending...</span>
                  </div>
                ) : (
                  "Didn't get it? Send again"
                )}
              </button>
            )}
          </motion.div>

          {/* Email App Shortcuts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-10"
          >
            <p 
              className="text-[14px] mb-4"
              style={{ 
                color: '#9CA3AF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Quick access:
            </p>
            <div className="flex justify-center space-x-6">
              <button
                onClick={() => openEmailApp('gmail')}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <GmailIcon />
                <span 
                  className="text-[12px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Gmail
                </span>
              </button>
              <button
                onClick={() => openEmailApp('apple')}
                className="flex flex-col items-center space-y-2 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <AppleMailIcon />
                <span 
                  className="text-[12px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Mail
                </span>
              </button>
            </div>
          </motion.div>

          {/* Use Different Email Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <button
              onClick={onUseDifferentEmail}
              className="flex items-center justify-center space-x-2 text-[14px] transition-opacity duration-200 hover:opacity-70"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              <ArrowLeft size={14} />
              <span>Use different email</span>
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
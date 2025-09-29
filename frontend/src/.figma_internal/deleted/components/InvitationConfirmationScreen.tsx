import { useState, useEffect } from 'react';
import { 
  Check,
  Clock,
  DollarSign,
  Share2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Users,
  Settings,
  History,
  HelpCircle,
  ExternalLink,
  Copy,
  Smartphone,
  MessageSquare,
  Star,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InvitationConfirmationScreenProps {
  onBackToDashboard: () => void;
  onInviteMore: () => void;
  onViewHistory: () => void;
  onViewReferralDashboard: () => void;
  sentInvitations: SentInvitation[];
  totalEarnings: number;
  vendorName?: string;
}

interface SentInvitation {
  id: string;
  contactName: string;
  phone: string;
  status: 'delivered' | 'sending' | 'failed';
  sentAt: Date;
  messagePreview: string;
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  isLikelyContractor: boolean;
}

// Confetti particle component
const ConfettiParticle = ({ delay }: { delay: number }) => (
  <motion.div
    initial={{ 
      opacity: 0, 
      y: -20, 
      x: Math.random() * 400 - 200,
      rotate: 0,
      scale: 0
    }}
    animate={{ 
      opacity: [0, 1, 1, 0], 
      y: [0, -50, 100, 200],
      rotate: [0, 180, 360],
      scale: [0, 1, 1, 0]
    }}
    transition={{ 
      duration: 2.5, 
      delay: delay,
      ease: "easeOut"
    }}
    className="absolute w-2 h-2 rounded-full"
    style={{ 
      backgroundColor: ['#059669', '#007AFF', '#FF9500', '#FF3B30'][Math.floor(Math.random() * 4)],
      left: '50%',
      top: '50%'
    }}
  />
);

export function InvitationConfirmationScreen({ 
  onBackToDashboard, 
  onInviteMore, 
  onViewHistory,
  onViewReferralDashboard,
  sentInvitations = [],
  totalEarnings = 150,
  vendorName = 'Mike'
}: InvitationConfirmationScreenProps) {
  const [showInvitationDetails, setShowInvitationDetails] = useState(false);
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [showSocialShare, setShowSocialShare] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Mock data if none provided
  const mockInvitations: SentInvitation[] = sentInvitations.length > 0 ? sentInvitations : [
    {
      id: '1',
      contactName: 'Mike Rodriguez Plumbing',
      phone: '(555) 123-4567',
      status: 'delivered',
      sentAt: new Date(),
      messagePreview: 'Hi Mike Rodriguez Plumbing! I\'m Mike, using FixRx to connect...'
    },
    {
      id: '2',
      contactName: 'Elite Roofing Co',
      phone: '(555) 234-5678',
      status: 'delivered',
      sentAt: new Date(),
      messagePreview: 'Hi Elite Roofing Co! I\'m Mike, using FixRx to connect...'
    },
    {
      id: '3',
      contactName: 'Quick Fix Handyman',
      phone: '(555) 345-6789',
      status: 'sending',
      sentAt: new Date(),
      messagePreview: 'Hi Quick Fix Handyman! I\'m Mike, using FixRx to connect...'
    }
  ];

  const currentTime = new Date().toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const deliveredCount = mockInvitations.filter(inv => inv.status === 'delivered').length;
  const sendingCount = mockInvitations.filter(inv => inv.status === 'sending').length;

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://fixrx.com/join');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    const message = "I'm building my professional network on FixRx! Join me to connect with quality customers.";
    const url = "https://fixrx.com/join";
    
    switch (platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(message)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`);
        break;
    }
  };

  const getStatusIcon = (status: 'delivered' | 'sending' | 'failed') => {
    switch (status) {
      case 'delivered':
        return <Check size={16} color="#059669" />;
      case 'sending':
        return <Clock size={16} color="#FF9500" />;
      case 'failed':
        return <div className="w-4 h-4 rounded-full bg-red-500" />;
    }
  };

  const getStatusText = (status: 'delivered' | 'sending' | 'failed') => {
    switch (status) {
      case 'delivered':
        return 'Delivered ✓';
      case 'sending':
        return 'Sending...';
      case 'failed':
        return 'Failed';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-y-auto">
      {/* Confetti Animation */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <ConfettiParticle key={i} delay={i * 0.1} />
        ))}
      </div>

      <div className="px-5 py-8 pb-32">
        {/* Success Animation & Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 10
            }}
            className="relative mx-auto mb-6"
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ backgroundColor: '#059669' }}
            >
              <Check size={40} color="white" strokeWidth={3} />
            </div>
            
            {/* Success pulse effect */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.6, 0, 0.6]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full"
              style={{ backgroundColor: '#059669' }}
            />
          </motion.div>
          
          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-[28px] font-bold mb-3"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Invitations sent!
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-[18px] font-medium mb-2"
            style={{ 
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            {mockInvitations.length} invitation{mockInvitations.length === 1 ? '' : 's'} sent successfully
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-[14px]"
            style={{ 
              color: '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Sent on {currentTime}
          </motion.p>
        </motion.div>

        {/* Sent Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-[18px] font-bold"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Invitation Summary
            </h2>
            
            <button
              onClick={() => setShowInvitationDetails(!showInvitationDetails)}
              className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 transition-colors duration-200"
            >
              <span 
                className="text-[14px]"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                {showInvitationDetails ? 'Hide' : 'Show'} details
              </span>
              {showInvitationDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Check size={16} color="#059669" />
                <span 
                  className="text-[14px] font-medium"
                  style={{ 
                    color: '#059669',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Delivered
                </span>
              </div>
              <span 
                className="text-[24px] font-bold"
                style={{ 
                  color: '#059669',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {deliveredCount}
              </span>
            </div>
            
            {sendingCount > 0 && (
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock size={16} color="#FF9500" />
                  <span 
                    className="text-[14px] font-medium"
                    style={{ 
                      color: '#FF9500',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Sending
                  </span>
                </div>
                <span 
                  className="text-[24px] font-bold"
                  style={{ 
                    color: '#FF9500',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {sendingCount}
                </span>
              </div>
            )}
          </div>
          
          {/* Detailed List */}
          <AnimatePresence>
            {showInvitationDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {mockInvitations.map((invitation) => (
                  <div 
                    key={invitation.id} 
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 
                        className="text-[16px] font-medium"
                        style={{ 
                          color: '#1D1D1F',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {invitation.contactName}
                      </h4>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(invitation.status)}
                        <span 
                          className="text-[12px] font-medium"
                          style={{ 
                            color: invitation.status === 'delivered' ? '#059669' : 
                                   invitation.status === 'sending' ? '#FF9500' : '#FF3B30',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {getStatusText(invitation.status)}
                        </span>
                      </div>
                    </div>
                    
                    <p 
                      className="text-[14px] mb-2"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {invitation.phone}
                    </p>
                    
                    <p 
                      className="text-[12px] truncate"
                      style={{ 
                        color: '#9CA3AF',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      "{invitation.messagePreview}"
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tracking Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6"
        >
          <h3 
            className="text-[18px] font-medium mb-4"
            style={{ 
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Track your invitations
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                <MessageSquare size={12} color="#007AFF" />
              </div>
              <div>
                <p 
                  className="text-[14px] font-medium mb-1"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  We'll notify you when contractors join FixRx
                </p>
                <p 
                  className="text-[12px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Get instant notifications when your invites are accepted
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Settings size={12} color="#059669" />
              </div>
              <div>
                <p 
                  className="text-[14px] font-medium mb-1"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Track invitation status and responses in Settings
                </p>
                <p 
                  className="text-[12px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  View detailed analytics and response rates
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                <Clock size={12} color="#FF9500" />
              </div>
              <div>
                <p 
                  className="text-[14px] font-medium mb-1"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Most contractors respond within 48 hours
                </p>
                <p 
                  className="text-[12px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Peak response times are typically within the first day
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Referral Rewards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 mb-6"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
              <DollarSign size={24} color="white" />
            </div>
            
            <div className="flex-1">
              <h3 
                className="text-[18px] font-bold mb-2"
                style={{ 
                  color: '#059669',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Referral Rewards
              </h3>
              
              <p 
                className="text-[14px] mb-3"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Earn $50 for each contractor who joins and completes 3 services
              </p>
              
              <div className="bg-white rounded-lg p-4 mb-3">
                <div className="flex items-center justify-between">
                  <span 
                    className="text-[16px] font-medium"
                    style={{ 
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Potential earnings:
                  </span>
                  <span 
                    className="text-[20px] font-bold"
                    style={{ 
                      color: '#059669',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    ${totalEarnings}
                  </span>
                </div>
                <p 
                  className="text-[12px] mt-1"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  From these {mockInvitations.length} invitations
                </p>
              </div>
              
              <p 
                className="text-[12px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Rewards credited to your account after contractor milestones
              </p>
            </div>
          </div>
        </motion.div>

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6"
        >
          <button
            onClick={() => setShowNextSteps(!showNextSteps)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <h3 
              className="text-[18px] font-medium"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              What happens next?
            </h3>
            {showNextSteps ? <ChevronUp size={20} color="#6B7280" /> : <ChevronDown size={20} color="#6B7280" />}
          </button>
          
          <AnimatePresence>
            {showNextSteps && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-[12px] font-bold">1</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 mt-2"></div>
                  </div>
                  <div>
                    <p 
                      className="text-[14px] font-medium mb-1"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Contractor receives invitation
                    </p>
                    <p 
                      className="text-[12px]"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      SMS delivered to their phone with download link
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-[12px] font-bold">2</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 mt-2"></div>
                  </div>
                  <div>
                    <p 
                      className="text-[14px] font-medium mb-1"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Downloads app & mentions your referral code
                    </p>
                    <p 
                      className="text-[12px]"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      They enter code: {vendorName.toUpperCase()}2024 during signup
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-[12px] font-bold">3</span>
                    </div>
                    <div className="w-px h-8 bg-gray-200 mt-2"></div>
                  </div>
                  <div>
                    <p 
                      className="text-[14px] font-medium mb-1"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Completes onboarding & starts earning
                    </p>
                    <p 
                      className="text-[12px]"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      After 3 completed services, you earn your $50 reward
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={16} color="#007AFF" />
                    <p 
                      className="text-[14px] font-medium"
                      style={{ 
                        color: '#007AFF',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      You'll get notified at each step
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social Sharing */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6"
        >
          <button
            onClick={() => setShowSocialShare(!showSocialShare)}
            className="flex items-center justify-between w-full text-left mb-4"
          >
            <div className="flex items-center space-x-3">
              <Share2 size={20} color="#6B7280" />
              <h3 
                className="text-[18px] font-medium"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Share on social media
              </h3>
            </div>
            {showSocialShare ? <ChevronUp size={20} color="#6B7280" /> : <ChevronDown size={20} color="#6B7280" />}
          </button>
          
          <AnimatePresence>
            {showSocialShare && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p 
                    className="text-[14px] mb-3"
                    style={{ 
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    "I'm building my professional network on FixRx! Join me to connect with quality customers."
                  </p>
                  
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 transition-colors duration-200"
                  >
                    <Copy size={14} />
                    <span 
                      className="text-[12px]"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                    >
                      {copiedLink ? 'Link copied!' : 'Copy link'}
                    </span>
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleSocialShare('linkedin')}
                    className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mb-2">
                      <ExternalLink size={16} color="white" />
                    </div>
                    <span 
                      className="text-[12px]"
                      style={{ 
                        color: '#374151',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      LinkedIn
                    </span>
                  </button>
                  
                  <button
                    onClick={() => handleSocialShare('facebook')}
                    className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center mb-2">
                      <ExternalLink size={16} color="white" />
                    </div>
                    <span 
                      className="text-[12px]"
                      style={{ 
                        color: '#374151',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Facebook
                    </span>
                  </button>
                  
                  <button
                    onClick={() => handleSocialShare('twitter')}
                    className="flex flex-col items-center p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-black rounded flex items-center justify-center mb-2">
                      <ExternalLink size={16} color="white" />
                    </div>
                    <span 
                      className="text-[12px]"
                      style={{ 
                        color: '#374151',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Twitter
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <button
            onClick={onViewHistory}
            className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
          >
            <History size={20} color="#6B7280" />
            <span 
              className="text-[14px] font-medium"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              View invitation history
            </span>
          </button>
          
          <button
            onClick={onViewReferralDashboard}
            className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-green-300 hover:bg-green-50/50 transition-all duration-200"
          >
            <Target size={20} color="#6B7280" />
            <span 
              className="text-[14px] font-medium"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Referral dashboard
            </span>
          </button>
        </motion.div>

        {/* Support Link */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="text-center"
        >
          <button className="flex items-center space-x-2 mx-auto text-gray-500 hover:text-blue-500 transition-colors duration-200">
            <HelpCircle size={16} />
            <span 
              className="text-[14px]"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Need help with invitations?
            </span>
          </button>
        </motion.div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <div className="space-y-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={onBackToDashboard}
            className="w-full h-14 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
              boxShadow: '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
            }}
          >
            <span 
              className="text-white text-[16px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Back to dashboard
            </span>
          </motion.button>
          
          <div className="flex space-x-3">
            <button
              onClick={onInviteMore}
              className="flex-1 h-12 rounded-xl border-2 border-blue-500 bg-white hover:bg-blue-50 transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <Users size={16} color="#007AFF" />
              <span 
                className="text-blue-500 text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Invite more
              </span>
            </button>
            
            <button
              onClick={() => setShowSocialShare(true)}
              className="flex-1 h-12 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <Share2 size={16} color="#6B7280" />
              <span 
                className="text-gray-700 text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Share
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
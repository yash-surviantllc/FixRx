import { useState } from 'react';
import { 
  ArrowLeft,
  X,
  Users,
  Hammer,
  ChevronDown,
  ChevronUp,
  Shield,
  Star,
  DollarSign,
  Heart,
  ArrowRight,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InvitationTypeSelectionScreenProps {
  onBack: () => void;
  onInviteFriends: () => void;
  onReferContractors: () => void;
  userType?: 'consumer' | 'vendor';
  userName?: string;
}

type InvitationType = 'friends' | 'contractors' | null;

export function InvitationTypeSelectionScreen({ 
  onBack, 
  onInviteFriends, 
  onReferContractors, 
  userType = 'vendor',
  userName = 'User'
}: InvitationTypeSelectionScreenProps) {
  const [selectedType, setSelectedType] = useState<InvitationType>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<InvitationType>(null);

  const handleCardSelect = (type: InvitationType) => {
    setSelectedType(type);
    // Add haptic feedback simulation
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleContinue = () => {
    if (selectedType === 'friends') {
      onInviteFriends();
    } else if (selectedType === 'contractors') {
      onReferContractors();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4">
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
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 
            className="text-[28px] font-bold mb-3"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            {userType === 'vendor' ? 'Invite Contractors' : 'Build Your Network'}
          </h1>
          
          <p 
            className="text-[16px]"
            style={{ 
              color: '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            {userType === 'vendor' 
              ? 'Help fellow contractors join FixRx' 
              : 'Add contractors you know and invite friends'}
          </p>
        </motion.div>
      </div>

      <div className="px-5 py-8 pb-32">
        {/* Invitation Type Cards */}
        <div className="space-y-4 mb-8">
          {/* Invite Friends Card - Only for Consumers */}
          {userType === 'consumer' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onMouseEnter={() => setHoveredCard('friends')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <motion.button
                onClick={() => handleCardSelect('friends')}
                className={`w-full h-[140px] rounded-2xl p-6 transition-all duration-200 ${
                  selectedType === 'friends' ? 'transform scale-[0.98]' : ''
                }`}
                style={{
                  background: '#F0F8FF',
                  border: selectedType === 'friends' 
                    ? '3px solid #007AFF' 
                    : hoveredCard === 'friends' 
                      ? '2px solid #007AFF' 
                      : '2px solid rgba(0, 122, 255, 0.2)',
                  boxShadow: selectedType === 'friends'
                    ? '0 8px 24px rgba(0, 122, 255, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
                    : hoveredCard === 'friends'
                      ? '0 6px 20px rgba(0, 122, 255, 0.15)'
                      : '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center h-full">
                  {/* Icon with Selection State */}
                  <div className="relative mb-3">
                    <motion.div
                      animate={{ 
                        scale: selectedType === 'friends' ? 1.1 : 1,
                        rotate: selectedType === 'friends' ? 5 : 0
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center"
                    >
                      <Users size={24} color="white" />
                    </motion.div>
                    
                    {/* Selection Checkmark */}
                    <AnimatePresence>
                      {selectedType === 'friends' && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        >
                          <Check size={12} color="white" strokeWidth={3} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <h2 
                    className="text-[22px] font-bold mb-2"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Invite Friends
                  </h2>
                  
                  <p 
                    className="text-[16px] mb-3"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Share FixRx with people who need contractors
                  </p>
                  
                  {/* Benefits */}
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-[13px]" style={{ color: '#007AFF' }}>
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                        Help friends find trusted contractors
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-[13px]" style={{ color: '#007AFF' }}>
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                        Build stronger community network
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            </motion.div>
          )}

          {/* Refer Contractors Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: userType === 'consumer' ? 0.2 : 0.1 }}
            onMouseEnter={() => setHoveredCard('contractors')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <motion.button
              onClick={() => handleCardSelect('contractors')}
              className={`w-full h-[140px] rounded-2xl p-6 transition-all duration-200 ${
                selectedType === 'contractors' ? 'transform scale-[0.98]' : ''
              }`}
              style={{
                background: '#FFF7ED',
                border: selectedType === 'contractors' 
                  ? '3px solid #F97316' 
                  : hoveredCard === 'contractors' 
                    ? '2px solid #F97316' 
                    : '2px solid rgba(249, 115, 22, 0.2)',
                boxShadow: selectedType === 'contractors'
                  ? '0 8px 24px rgba(249, 115, 22, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
                  : hoveredCard === 'contractors'
                    ? '0 6px 20px rgba(249, 115, 22, 0.15)'
                    : '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center h-full">
                {/* Icon with Selection State */}
                <div className="relative mb-3">
                  <motion.div
                    animate={{ 
                      scale: selectedType === 'contractors' ? 1.1 : 1,
                      rotate: selectedType === 'contractors' ? -5 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center"
                  >
                    <Hammer size={24} color="white" />
                  </motion.div>
                  
                  {/* Selection Checkmark */}
                  <AnimatePresence>
                    {selectedType === 'contractors' && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                      >
                        <Check size={12} color="white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <h2 
                  className="text-[22px] font-bold mb-2"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {userType === 'vendor' ? 'Invite Contractors' : 'Refer Contractors'}
                </h2>
                
                <p 
                  className="text-[16px] mb-3"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {userType === 'vendor' 
                    ? 'Help fellow contractors join the platform' 
                    : 'Add trusted contractors you know'}
                </p>
                
                {/* Benefits */}
                <div className="space-y-1">
                  {userType === 'vendor' ? (
                    <>
                      <div className="flex items-center space-x-2 text-[13px]" style={{ color: '#F97316' }}>
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                          Support your network
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[13px]" style={{ color: '#F97316' }}>
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                          Earn referral rewards
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 text-[13px]" style={{ color: '#F97316' }}>
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                          Expand service options
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[13px]" style={{ color: '#F97316' }}>
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                          Earn referral rewards
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-[13px]" style={{ color: '#F97316' }}>
                        <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
                        <span style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>
                          Help contractors grow
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.button>
          </motion.div>
        </div>

        {/* Value Propositions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6"
        >
          <h3 
            className="text-[18px] font-bold mb-4"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Why grow our community?
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                <Heart size={16} color="#059669" />
              </div>
              <div>
                <h4 
                  className="text-[16px] font-medium mb-1"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Stronger network benefits everyone
                </h4>
                <p 
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  More connections mean better service matches and faster solutions
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                <Shield size={16} color="#007AFF" />
              </div>
              <div>
                <h4 
                  className="text-[16px] font-medium mb-1"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Only invite contractors you personally trust
                </h4>
                <p 
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Quality over quantity - your reputation backs every referral
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mt-0.5">
                <DollarSign size={16} color="#F97316" />
              </div>
              <div>
                <h4 
                  className="text-[16px] font-medium mb-1"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Earn credits for successful referrals
                </h4>
                <p 
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Get rewarded when your referrals complete their first services
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Why Invite? Expandable Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6"
        >
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 
              className="text-[18px] font-medium"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Why invite?
            </h3>
            {showDetails ? <ChevronUp size={20} color="#6B7280" /> : <ChevronDown size={20} color="#6B7280" />}
          </button>
          
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-4"
              >
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 
                    className="text-[14px] font-medium mb-2"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Community Benefits
                  </h4>
                  <p 
                    className="text-[12px] mb-2"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    • Help local businesses connect with customers
                  </p>
                  <p 
                    className="text-[12px] mb-2"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    • Improve service quality through social accountability
                  </p>
                  <p 
                    className="text-[12px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    • Build trust through friend recommendations
                  </p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield size={16} color="#007AFF" />
                    <h4 
                      className="text-[14px] font-medium"
                      style={{ 
                        color: '#007AFF',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Privacy Assurance
                    </h4>
                  </div>
                  <p 
                    className="text-[12px]"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Your contacts remain private. We only access what you choose to share.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star size={16} color="#059669" />
                    <h4 
                      className="text-[14px] font-medium"
                      style={{ 
                        color: '#059669',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Quality Focus
                    </h4>
                  </div>
                  <p 
                    className="text-[12px]"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    We prioritize quality over quantity. Every invitation matters.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <AnimatePresence>
          {selectedType && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={handleContinue}
              className="w-full h-14 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center justify-center space-x-3"
              style={{
                background: selectedType === 'friends' 
                  ? 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)'
                  : 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
                boxShadow: selectedType === 'friends'
                  ? '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                  : '0 4px 16px rgba(249, 115, 22, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
              }}
            >
              <span 
                className="text-white text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Continue with {selectedType === 'friends' ? 'Friends' : 'Contractors'}
              </span>
              <ArrowRight size={20} color="white" />
            </motion.button>
          )}
        </AnimatePresence>
        
        {!selectedType && (
          <div className="text-center">
            <p 
              className="text-[14px]"
              style={{ 
                color: '#9CA3AF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Select an invitation type to continue
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
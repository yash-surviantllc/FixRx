import { useState, useEffect } from 'react';
import { 
  Check, 
  Heart, 
  Share2, 
  Edit3, 
  HelpCircle,
  ArrowRight,
  Star,
  Users,
  Calendar,
  Copy,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RatingConfirmationScreenProps {
  onBackToDashboard: () => void;
  onFindAnotherContractor: () => void;
  onRateAnotherService?: () => void;
  onViewAllReviews: () => void;
  onBookAgain?: () => void;
  onEditReview: () => void;
  reviewData: {
    overallRating: number;
    vendorName: string;
    serviceName: string;
    topCategory?: string;
    topCategoryRating?: number;
  };
}

// Facebook Icon Component
const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

// Twitter/X Icon Component
const TwitterIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export function RatingConfirmationScreen({ 
  onBackToDashboard,
  onFindAnotherContractor,
  onRateAnotherService,
  onViewAllReviews,
  onBookAgain,
  onEditReview,
  reviewData
}: RatingConfirmationScreenProps) {
  const [showParticles, setShowParticles] = useState(true);
  const [sharePublicly, setSharePublicly] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToFavorites, setAddedToFavorites] = useState(false);

  const reviewsThisWeek = 47;
  const networkImpact = 127;
  const isHighRating = reviewData.overallRating >= 4.0;

  useEffect(() => {
    // Hide particles after animation
    const timer = setTimeout(() => setShowParticles(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://fixrx.com/review/${reviewData.vendorName.replace(' ', '-').toLowerCase()}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleShare = (platform: string) => {
    const message = `I had a great experience with ${reviewData.vendorName} through FixRx!`;
    const url = `https://fixrx.com/review/${reviewData.vendorName.replace(' ', '-').toLowerCase()}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
    }
  };

  const handleAddToFavorites = () => {
    setAddedToFavorites(true);
    setTimeout(() => setAddedToFavorites(false), 2000);
  };

  // Particle components for celebration effect
  const Particle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
    <motion.div
      initial={{ 
        opacity: 1, 
        scale: 0,
        x: 0,
        y: 0
      }}
      animate={{ 
        opacity: 0, 
        scale: 1,
        x: x,
        y: y
      }}
      transition={{ 
        duration: 2, 
        delay,
        ease: "easeOut"
      }}
      className="absolute"
      style={{ left: '50%', top: '50%' }}
    >
      <Sparkles size={12} color="#059669" />
    </motion.div>
  );

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Success Animation Section */}
      <div className="relative px-5 pt-16 pb-8 text-center">
        {/* Particle Effects */}
        {showParticles && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <Particle
                key={i}
                delay={i * 0.1}
                x={(Math.random() - 0.5) * 200}
                y={(Math.random() - 0.5) * 200}
              />
            ))}
          </div>
        )}

        {/* Large Success Checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            duration: 0.6, 
            type: "spring", 
            bounce: 0.4 
          }}
          className="relative mx-auto mb-8"
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: '#059669' }}
          >
            <Check size={40} color="white" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Thank You Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-[28px] font-bold mb-3"
          style={{ 
            color: '#1D1D1F',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
          }}
        >
          Thank you for your feedback!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-[16px] mb-8"
          style={{ 
            color: '#6B7280',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
          }}
        >
          Your review helps our community make better choices
        </motion.p>
      </div>

      <div className="px-5 pb-32">
        {/* Review Impact Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8 border border-green-100"
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Users size={24} color="#059669" />
              <h3 
                className="text-[18px] font-bold"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Community Impact
              </h3>
            </div>
            
            <p 
              className="text-[16px] font-medium"
              style={{ 
                color: '#059669',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Your review will help {networkImpact} people in your network
            </p>
            
            <p 
              className="text-[14px]"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Honest feedback builds a stronger community
            </p>
            
            <div 
              className="text-[14px] bg-white rounded-lg p-3 border border-green-200"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              You're one of <span className="font-bold text-green-600">{reviewsThisWeek}</span> reviews this week
            </div>
          </div>
        </motion.div>

        {/* Review Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-8"
        >
          <h3 
            className="text-[16px] font-medium mb-3"
            style={{ 
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Your Review Summary
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <span 
              className="text-[14px]"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              You rated this service
            </span>
            
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    color="#FFD700"
                    fill={star <= reviewData.overallRating ? "#FFD700" : "none"}
                  />
                ))}
              </div>
              <span 
                className="text-[16px] font-bold"
                style={{ 
                  color: '#007AFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {reviewData.overallRating}/5.0
              </span>
            </div>
          </div>
          
          {reviewData.topCategory && (
            <div className="flex items-center justify-between">
              <span 
                className="text-[14px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {reviewData.topCategory}
              </span>
              
              <span 
                className="text-[14px] font-medium px-2 py-1 rounded-md"
                style={{ 
                  backgroundColor: '#D1FAE5',
                  color: '#059669',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Excellent
              </span>
            </div>
          )}
        </motion.div>

        {/* Social Sharing Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mb-8"
        >
          <h3 
            className="text-[16px] font-medium mb-4"
            style={{ 
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Share your experience
          </h3>

          <div className="space-y-3 mb-4">
            <button
              onClick={() => handleShare('facebook')}
              className="w-full flex items-center justify-center space-x-3 h-12 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
            >
              <FacebookIcon size={20} />
              <span 
                className="text-[16px] font-medium"
                style={{ 
                  color: '#1877F2',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Share on Facebook
              </span>
            </button>

            <button
              onClick={() => handleShare('twitter')}
              className="w-full flex items-center justify-center space-x-3 h-12 rounded-xl border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              <TwitterIcon size={20} />
              <span 
                className="text-[16px] font-medium"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Share on Twitter
              </span>
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center space-x-3 h-12 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200"
            >
              {copiedLink ? (
                <>
                  <Check size={20} color="#059669" />
                  <span 
                    className="text-[16px] font-medium"
                    style={{ 
                      color: '#059669',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Link copied!
                  </span>
                </>
              ) : (
                <>
                  <Copy size={20} color="#6B7280" />
                  <span 
                    className="text-[16px] font-medium"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Copy link
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Privacy Control */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <span 
                className="text-[14px] font-medium"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Share publicly
              </span>
              <p 
                className="text-[12px] mt-1"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Include your name in shared reviews
              </p>
            </div>
            
            <button
              onClick={() => setSharePublicly(!sharePublicly)}
              className={`w-12 h-6 rounded-full transition-all duration-200 ${
                sharePublicly ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            >
              <div 
                className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                  sharePublicly ? 'transform translate-x-6' : 'transform translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Contractor Follow-up (if high rating) */}
        {isHighRating && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 mb-8"
          >
            <h3 
              className="text-[16px] font-medium mb-3"
              style={{ 
                color: '#374151',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Book {reviewData.vendorName} again?
            </h3>
            
            <div className="space-y-3">
              {onBookAgain && (
                <button
                  onClick={onBookAgain}
                  className="w-full flex items-center justify-between h-12 rounded-lg px-4 transition-all duration-200 hover:bg-white hover:shadow-sm"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar size={20} color="#007AFF" />
                    <span 
                      className="text-[14px] font-medium"
                      style={{ 
                        color: '#007AFF',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Schedule another service
                    </span>
                  </div>
                  <ArrowRight size={16} color="#007AFF" />
                </button>
              )}
              
              <button
                onClick={handleAddToFavorites}
                className="w-full flex items-center justify-between h-12 rounded-lg px-4 transition-all duration-200 hover:bg-white hover:shadow-sm"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
              >
                <div className="flex items-center space-x-3">
                  <Heart 
                    size={20} 
                    color={addedToFavorites ? "#059669" : "#6B7280"}
                    fill={addedToFavorites ? "#059669" : "none"}
                  />
                  <span 
                    className="text-[14px] font-medium"
                    style={{ 
                      color: addedToFavorites ? '#059669' : '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    {addedToFavorites ? 'Added to favorites!' : 'Add to favorites'}
                  </span>
                </div>
                {!addedToFavorites && <ArrowRight size={16} color="#6B7280" />}
                {addedToFavorites && <Check size={16} color="#059669" />}
              </button>
            </div>
          </motion.div>
        )}

        {/* Additional Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="space-y-3 mb-8"
        >
          <div className="flex items-center justify-between">
            <button
              onClick={onEditReview}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <Edit3 size={16} color="#6B7280" />
              <span 
                className="text-[14px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Edit review
              </span>
            </button>

            <button
              onClick={onViewAllReviews}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <span 
                className="text-[14px]"
                style={{ 
                  color: '#007AFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                View all my reviews
              </span>
              <ExternalLink size={16} color="#007AFF" />
            </button>
          </div>

          <div className="flex items-center justify-center space-x-4 pt-2">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200">
              <HelpCircle size={14} />
              <span 
                className="text-[12px]"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Review guidelines
              </span>
            </button>
            
            <span className="text-gray-300">•</span>
            
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors duration-200">
              <HelpCircle size={14} />
              <span 
                className="text-[12px]"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Need help?
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <div className="space-y-3">
          {/* Primary CTA */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            onClick={onFindAnotherContractor}
            className="w-full h-14 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
              boxShadow: '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
            }}
          >
            <span 
              className="text-white text-[16px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Find another contractor
            </span>
          </motion.button>

          {/* Secondary CTA */}
          {onRateAnotherService && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              onClick={onRateAnotherService}
              className="w-full h-12 rounded-xl border-2 border-blue-500 bg-white hover:bg-blue-50 transition-all duration-200 active:scale-[0.98] flex items-center justify-center"
            >
              <span 
                className="text-blue-500 text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Rate another recent service
              </span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
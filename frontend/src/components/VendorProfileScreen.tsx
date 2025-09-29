import { useState } from 'react';
import { ArrowLeft, Star, Phone, MessageCircle, ChevronRight, MapPin, Clock, Shield, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface VendorProfileScreenProps {
  onBack: () => void;
  onStartConversation: () => void;
  onQuickCall: () => void;
  onSeeAllRecommendations?: () => void;
}

const portfolioImages = [
  {
    url: "https://images.unsplash.com/photo-1664227430687-9299c593e3da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMHJlbW9kZWxpbmclMjBiZWZvcmUlMjBhZnRlcnxlbnwxfHx8fDE3NTc5MTIzMTV8MA&ixlib=rb-4.1.0&q=80&w=400",
    title: "Bathroom Remodel"
  },
  {
    url: "https://images.unsplash.com/photo-1661044437616-71100c9f638e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxraXRjaGVuJTIwc2luayUyMGluc3RhbGxhdGlvbiUyMHBsdW1iaW5nfGVufDF8fHx8MTc1NzkxMjMxOHww&ixlib=rb-4.1.0&q=80&w=400",
    title: "Kitchen Sink Installation"
  },
  {
    url: "https://images.unsplash.com/photo-1635221798248-8a3452ad07cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwcmVub3ZhdGlvbiUyMHBsdW1iaW5nJTIwd29ya3xlbnwxfHx8fDE3NTc5MTIzMjB8MA&ixlib=rb-4.1.0&q=80&w=400",
    title: "Pipe Renovation"
  },
  {
    url: "https://images.unsplash.com/photo-1664227430687-9299c593e3da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXRocm9vbSUyMHJlbW9kZWxpbmclMjBiZWZvcmUlMjBhZnRlcnxlbnwxfHx8fDE3NTc5MTIzMTV8MA&ixlib=rb-4.1.0&q=80&w=400",
    title: "Modern Bathroom"
  }
];

const serviceCategories = [
  "Emergency Repairs",
  "Bathroom Remodeling", 
  "Kitchen Plumbing",
  "Pipe Installation",
  "Water Heater Service",
  "Drain Cleaning",
  "Leak Detection"
];

const reviews = [
  {
    id: 1,
    text: "Great work on our kitchen sink! Professional and clean work.",
    author: "Sarah M.",
    rating: 5,
    date: "2 weeks ago",
    avatar: "https://images.unsplash.com/photo-1673745730961-b4bb9c98bfdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwd29tYW4lMjBzYXRpc2ZpZWR8ZW58MXx8fHwxNzU3OTEyMzIzfDA&ixlib=rb-4.1.0&q=80&w=100"
  },
  {
    id: 2,
    text: "Fixed our emergency leak quickly. Very reliable and fair pricing.",
    author: "Mike D.",
    rating: 5,
    date: "1 month ago",
    avatar: "https://images.unsplash.com/photo-1703759354716-b777fd195508?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwbWFuJTIwaGFwcHl8ZW58MXx8fHwxNzU3OTEyMzI2fDA&ixlib=rb-4.1.0&q=80&w=100"
  },
  {
    id: 3,
    text: "Complete bathroom renovation exceeded our expectations. Highly recommend!",
    author: "Lisa K.",
    rating: 5,
    date: "2 months ago",
    avatar: "https://images.unsplash.com/photo-1673745730961-b4bb9c98bfdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwd29tYW4lMjBzYXRpc2ZpZWR8ZW58MXx8fHwxNzU3OTEyMzIzfDA&ixlib=rb-4.1.0&q=80&w=100"
  }
];

const mutualFriends = [
  {
    name: "Alex",
    avatar: "https://images.unsplash.com/photo-1703759354716-b777fd195508?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwbWFuJTIwaGFwcHl8ZW58MXx8fHwxNzU3OTEyMzI2fDA&ixlib=rb-4.1.0&q=80&w=100"
  },
  {
    name: "Maria",
    avatar: "https://images.unsplash.com/photo-1673745730961-b4bb9c98bfdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwd29tYW4lMjBzYXRpc2ZpZWR8ZW58MXx8fHwxNzU3OTEyMzIzfDA&ixlib=rb-4.1.0&q=80&w=100"
  },
  {
    name: "David",
    avatar: "https://images.unsplash.com/photo-1703759354716-b777fd195508?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwbWFuJTIwaGFwcHl8ZW58MXx8fHwxNzU3OTEyMzI2fDA&ixlib=rb-4.1.0&q=80&w=100"
  }
];

export function VendorProfileScreen({ onBack, onStartConversation, onQuickCall, onSeeAllRecommendations }: VendorProfileScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedGallery, setExpandedGallery] = useState(false);

  const renderStars = (rating: number, size: number = 16) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        fill={i < rating ? "#F59E0B" : "none"}
        color={i < rating ? "#F59E0B" : "#E5E7EB"}
      />
    ));
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Header */}
      <div className="relative pt-5 pb-4 bg-white border-b border-gray-100">
        <div className="flex items-center px-5">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft size={24} color="#1D1D1F" />
          </motion.button>
          <span 
            className="ml-4 text-[18px] font-medium"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Contractor Profile
          </span>
        </div>
      </div>

      <div className="px-5 pb-32">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 mb-8"
        >
          <div className="flex items-start space-x-4">
            {/* Profile Photo with Verification Badge */}
            <div className="relative">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1604118600242-e7a6d23ec3a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwbHVtYmVyJTIwY29udHJhY3RvciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzkxMjMxMnww&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Rodriguez Plumbing"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Verification Badge */}
              <div 
                className="absolute -bottom-1 -right-1 w-[20px] h-[20px] bg-green-500 rounded-full flex items-center justify-center"
                style={{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}
              >
                <Shield size={12} color="white" />
              </div>
            </div>

            {/* Business Info */}
            <div className="flex-1 pt-1">
              <h1 
                className="text-[24px] font-bold mb-1"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Rodriguez Plumbing Services
              </h1>
              
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center space-x-1">
                  <Clock size={14} color="#6B7280" />
                  <span 
                    className="text-[16px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    8 years experience
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-1 mb-3">
                <MapPin size={14} color="#6B7280" />
                <span 
                  className="text-[16px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Serving Downtown & Midtown
                </span>
                <span 
                  className="text-[14px] ml-2"
                  style={{ 
                    color: '#007AFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  2.3 miles away
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rating and Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          {/* Overall Rating */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="flex items-center space-x-1">
              <Star size={20} fill="#F59E0B" color="#F59E0B" />
              <span 
                className="text-[20px] font-medium"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                4.9
              </span>
            </div>
            <span 
              className="text-[16px]"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              (127 reviews)
            </span>
          </div>

          {/* Social Proof */}
          <div className="flex items-center space-x-3">
            <Users size={16} color="#007AFF" />
            <span 
              className="text-[16px] font-medium"
              style={{ 
                color: '#007AFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Recommended by 3 mutual friends
            </span>
          </div>

          {/* Friend Avatars */}
          <div className="flex items-center space-x-2 mt-3">
            {mutualFriends.map((friend, index) => (
              <div key={index} className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <button 
              onClick={() => {
                console.log('See all recommendations clicked from vendor profile');
                if (onSeeAllRecommendations) {
                  onSeeAllRecommendations();
                } else {
                  alert('See all recommendations feature coming soon!');
                }
              }}
              className="text-[14px] ml-2 flex items-center space-x-1 hover:underline transition-opacity duration-200 hover:opacity-70"
            >
              <span style={{ color: '#007AFF' }}>See all recommendations</span>
              <ChevronRight size={14} color="#007AFF" />
            </button>
          </div>
        </motion.div>

        {/* Service Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <h3 
            className="text-[18px] font-medium mb-4"
            style={{ 
              color: '#374151',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Services
          </h3>
          
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {serviceCategories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className="whitespace-nowrap px-4 py-2 rounded-2xl text-[14px] font-medium transition-all duration-200 flex-shrink-0"
                style={{
                  backgroundColor: selectedCategory === category ? '#007AFF' : '#F3F4F6',
                  color: selectedCategory === category ? 'white' : '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Portfolio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h3 
            className="text-[20px] font-bold mb-4"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Recent Work
          </h3>
          
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {portfolioImages.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => setExpandedGallery(true)}
                className="flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity duration-200"
                style={{ width: '140px', height: '105px' }}
                whileTap={{ scale: 0.98 }}
              >
                <ImageWithFallback
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Review Excerpts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <h3 
            className="text-[18px] font-medium mb-4"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            What customers say
          </h3>
          
          <div className="space-y-4">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    <ImageWithFallback
                      src={review.avatar}
                      alt={review.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex space-x-1">
                        {renderStars(review.rating, 12)}
                      </div>
                      <span 
                        className="text-[12px]"
                        style={{ 
                          color: '#6B7280',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {review.date}
                      </span>
                    </div>
                    <p 
                      className="text-[16px] mb-2"
                      style={{ 
                        color: '#374151',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      "{review.text}"
                    </p>
                    <span 
                      className="text-[14px] font-medium"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      - {review.author}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <div className="space-y-3">
          {/* Primary Action Button */}
          <motion.button
            onClick={onStartConversation}
            className="w-full flex items-center justify-center space-x-2 rounded-xl transition-all duration-200 hover:opacity-90"
            style={{
              height: '56px',
              backgroundColor: '#007AFF',
              boxShadow: '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle size={20} color="white" />
            <span 
              className="text-white text-[16px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Start Conversation
            </span>
          </motion.button>

          {/* Secondary Action Button */}
          <motion.button
            onClick={onQuickCall}
            className="w-full flex items-center justify-center space-x-2 rounded-xl transition-all duration-200 hover:bg-blue-50"
            style={{
              height: '48px',
              backgroundColor: 'transparent',
              border: '2px solid #007AFF'
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Phone size={18} color="#007AFF" />
            <span 
              className="text-[16px] font-medium"
              style={{ 
                color: '#007AFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' 
              }}
            >
              Quick Call
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
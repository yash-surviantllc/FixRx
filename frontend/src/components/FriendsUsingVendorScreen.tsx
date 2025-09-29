import { useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  MessageCircle,
  Phone,
  Calendar,
  CheckCircle2,
  Award,
  Filter,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FriendsUsingVendorScreenProps {
  onBack: () => void;
  onContactFriend?: (friendId: string) => void;
  vendorName?: string;
}

interface FriendRecommendation {
  id: string;
  name: string;
  avatar: string;
  serviceUsed: string;
  completionDate: string;
  rating: number;
  review?: string;
  projectCost?: string;
  verified: boolean;
  responseTime?: string;
  helpfulCount?: number;
}

const mockFriends: FriendRecommendation[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1703759354716-b777fd195508?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwbWFuJTIwaGFwcHl8ZW58MXx8fHwxNzU3OTEyMzI2fDA&ixlib=rb-4.1.0&q=80&w=200',
    serviceUsed: 'Kitchen Sink Installation',
    completionDate: '3 weeks ago',
    rating: 5,
    review: 'Mike did an amazing job on our kitchen sink. Very professional, clean work, and finished earlier than expected. Highly recommend!',
    projectCost: '$175',
    verified: true,
    responseTime: '2 hours',
    helpfulCount: 8
  },
  {
    id: '2',
    name: 'Maria Garcia',
    avatar: 'https://images.unsplash.com/photo-1673745730961-b4bb9c98bfdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwd29tYW4lMjBzYXRpc2ZpZWR8ZW58MXx8fHwxNzU3OTEyMzIzfDA&ixlib=rb-4.1.0&q=80&w=200',
    serviceUsed: 'Emergency Leak Repair',
    completionDate: '2 months ago',
    rating: 5,
    review: 'Had a leak emergency on Sunday morning. Mike came out within 2 hours and fixed it perfectly. Saved our weekend!',
    projectCost: '$125',
    verified: true,
    responseTime: '45 minutes',
    helpfulCount: 12
  },
  {
    id: '3',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1703759354716-b777fd195508?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwbWFuJTIwaGFwcHl8ZW58MXx8fHwxNzU3OTEyMzI2fDA&ixlib=rb-4.1.0&q=80&w=200',
    serviceUsed: 'Bathroom Remodel',
    completionDate: '4 months ago',
    rating: 5,
    review: 'Complete bathroom renovation. Mike coordinated everything perfectly and the result exceeded our expectations.',
    projectCost: '$2,450',
    verified: true,
    responseTime: '3 hours',
    helpfulCount: 15
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    avatar: 'https://images.unsplash.com/photo-1673745730961-b4bb9c98bfdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwd29tYW4lMjBzYXRpc2ZpZWR8ZW58MXx8fHwxNzU3OTEyMzIzfDA&ixlib=rb-4.1.0&q=80&w=200',
    serviceUsed: 'Water Heater Replacement',
    completionDate: '6 months ago',
    rating: 5,
    review: 'Fair pricing, excellent work, and great communication. Mike explained everything clearly and left no mess.',
    projectCost: '$1,200',
    verified: true,
    responseTime: '1 hour',
    helpfulCount: 6
  },
  {
    id: '5',
    name: 'Jennifer Lopez',
    avatar: 'https://images.unsplash.com/photo-1673745730961-b4bb9c98bfdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHBvcnRyYWl0JTIwd29tYW4lMjBzYXRpc2ZpZWR8ZW58MXx8fHwxNzU3OTEyMzIzfDA&ixlib=rb-4.1.0&q=80&w=200',
    serviceUsed: 'Drain Cleaning',
    completionDate: '1 month ago',
    rating: 4,
    review: 'Quick and efficient service. Solved our drain problem and gave helpful maintenance tips.',
    projectCost: '$85',
    verified: true,
    responseTime: '4 hours',
    helpfulCount: 3
  }
];

export function FriendsUsingVendorScreen({ 
  onBack, 
  onContactFriend,
  vendorName = 'Mike Rodriguez'
}: FriendsUsingVendorScreenProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'rating' | 'helpful'>('recent');

  const filteredFriends = mockFriends.sort((a, b) => {
    if (sortBy === 'recent') {
      // Mock sorting by recent - in real app would use actual dates
      return 0;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'helpful') {
      return (b.helpfulCount || 0) - (a.helpfulCount || 0);
    }
    return 0;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={12}
        fill={i < rating ? "#F59E0B" : "none"}
        color={i < rating ? "#F59E0B" : "#E5E7EB"}
      />
    ));
  };



  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4">
        <div className="flex items-center mb-4">
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
            <h1 
              className="text-[24px] font-bold"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Friends Using {vendorName}
            </h1>
            <p 
              className="text-[14px] mt-1"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {filteredFriends.length} friends in your network
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <Filter size={20} color="#6B7280" />
          </button>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-gray-100 pt-4 mt-4"
            >
              {/* Sort Options */}
              <div>
                <h3 
                  className="text-[14px] font-medium mb-3"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Sort by
                </h3>
                <div className="flex space-x-2">
                  {[
                    { key: 'recent', label: 'Most Recent' },
                    { key: 'rating', label: 'Highest Rating' },
                    { key: 'helpful', label: 'Most Helpful' }
                  ].map((sort) => (
                    <button
                      key={sort.key}
                      onClick={() => setSortBy(sort.key as any)}
                      className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors duration-200 ${
                        sortBy === sort.key
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Friends List */}
      <div className="px-5 py-4">
        <div className="space-y-4">
          {filteredFriends.map((friend, index) => (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                    <ImageWithFallback
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {friend.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 size={10} color="white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 
                        className="text-[16px] font-medium"
                        style={{ 
                          color: '#1D1D1F',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {friend.name}
                      </h3>
                    </div>

                    <button
                      onClick={() => onContactFriend?.(friend.id)}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <MessageCircle size={18} color="#007AFF" />
                    </button>
                  </div>

                  {/* Service Details */}
                  <div className="mb-3">
                    <p 
                      className="text-[14px] font-medium mb-1"
                      style={{ 
                        color: '#374151',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {friend.serviceUsed}
                    </p>
                    <div className="flex items-center space-x-4 text-[12px]">
                      <div className="flex items-center space-x-1">
                        <Calendar size={12} color="#6B7280" />
                        <span 
                          style={{ 
                            color: '#6B7280',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {friend.completionDate}
                        </span>
                      </div>
                      {friend.projectCost && (
                        <span 
                          className="font-medium"
                          style={{ 
                            color: '#059669',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {friend.projectCost}
                        </span>
                      )}
                      {friend.responseTime && (
                        <div className="flex items-center space-x-1">
                          <Clock size={12} color="#6B7280" />
                          <span 
                            style={{ 
                              color: '#6B7280',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            {friend.responseTime} response
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex space-x-1">
                      {renderStars(friend.rating)}
                    </div>
                    <span 
                      className="text-[12px] font-medium"
                      style={{ 
                        color: '#F59E0B',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {friend.rating}.0
                    </span>
                  </div>

                  {/* Review */}
                  {friend.review && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p 
                        className="text-[14px] leading-relaxed"
                        style={{ 
                          color: '#374151',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        "{friend.review}"
                      </p>
                    </div>
                  )}

                  {/* Helpful Count */}
                  {friend.helpfulCount && (
                    <div className="flex items-center justify-between">
                      <span 
                        className="text-[12px]"
                        style={{ 
                          color: '#6B7280',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {friend.helpfulCount} people found this helpful
                      </span>
                      <button
                        className="text-[12px] text-blue-500 hover:text-blue-600 transition-colors duration-200"
                        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                      >
                        Helpful
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <h3 
            className="text-[16px] font-medium mb-3"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Your Network's Experience
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div 
                className="text-[24px] font-bold"
                style={{ 
                  color: '#007AFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {filteredFriends.length}
              </div>
              <div 
                className="text-[12px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Total Reviews
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-[24px] font-bold"
                style={{ 
                  color: '#F59E0B',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {(filteredFriends.reduce((sum, f) => sum + f.rating, 0) / filteredFriends.length).toFixed(1)}
              </div>
              <div 
                className="text-[12px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Average Rating
              </div>
            </div>
            <div className="text-center">
              <div 
                className="text-[24px] font-bold"
                style={{ 
                  color: '#059669',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                100%
              </div>
              <div 
                className="text-[12px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Would Recommend
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
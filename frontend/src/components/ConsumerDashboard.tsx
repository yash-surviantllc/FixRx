import { useState } from 'react';
import { Search, Mic, MapPin, Star, Check, Home, Users, MessageSquare, User, ArrowRight, Bell, UserPlus, Share } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ConsumerDashboardProps {
  userName?: string;
  userLocation?: string;
  onViewContractor?: () => void;
  onRateService?: () => void;
  onViewNotifications?: () => void;
  onSeeAllRecommendations?: () => void;
  onInviteContractors?: () => void;
  onInviteFriends?: () => void;
}

interface Contractor {
  id: string;
  name: string;
  service: string;
  rating: number;
  availability: 'Available' | 'Busy' | 'Offline';
  friendCount: number;
  verified: boolean;
  photo: string;
}

export function ConsumerDashboard({ userName = 'Sarah', userLocation = 'San Francisco, CA', onViewContractor, onRateService, onViewNotifications, onSeeAllRecommendations, onInviteContractors, onInviteFriends }: ConsumerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'contractors' | 'messages' | 'profile'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const contractors: Contractor[] = [
    {
      id: '1',
      name: 'Mike Rodriguez',
      service: 'Plumbing',
      rating: 4.9,
      availability: 'Available',
      friendCount: 3,
      verified: true,
      photo: 'https://images.unsplash.com/photo-1604118600242-e7a6d23ec3a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbHVtYmVyJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU3OTEwNTkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '2',
      name: 'Jennifer Chen',
      service: 'Electrical',
      rating: 4.8,
      availability: 'Available',
      friendCount: 7,
      verified: true,
      photo: 'https://images.unsplash.com/photo-1574420219493-3763be83ab66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHdvcmtlciUyMGhlYWRzaG90fGVufDF8fHx8MTc1NzkxMDU5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '3',
      name: 'David Kim',
      service: 'Handyman',
      rating: 4.7,
      availability: 'Available',
      friendCount: 2,
      verified: false,
      photo: 'https://images.unsplash.com/photo-1676630656246-3047520adfdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5keW1hbiUyMHByb2Zlc3Npb25hbCUyMHBob3RvfGVufDF8fHx8MTc1NzkxMDU4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '4',
      name: 'Carlos Martinez',
      service: 'Construction',
      rating: 4.9,
      availability: 'Busy',
      friendCount: 5,
      verified: true,
      photo: 'https://images.unsplash.com/photo-1672748341520-6a839e6c05bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3b3JrZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTc4NTEwMjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '5',
      name: 'Alex Thompson',
      service: 'HVAC',
      rating: 4.6,
      availability: 'Available',
      friendCount: 1,
      verified: true,
      photo: 'https://images.unsplash.com/photo-1730791979207-583e51851e2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwaGVhZHNob3R8ZW58MXx8fHwxNzU3OTEwNTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const filters = [
    { id: 'available', label: 'Available now' },
    { id: 'rated', label: 'Highly rated' },
    { id: 'nearby', label: 'Close by' }
  ];

  const getFriendBadgeColor = (count: number) => {
    if (count <= 2) return '#007AFF';
    if (count <= 5) return '#059669';
    return '#F59E0B';
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Available': return '#059669';
      case 'Busy': return '#F59E0B';
      case 'Offline': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const handleVoiceSearch = () => {
    console.log('Voice search activated');
    // Would integrate with browser speech recognition API
  };

  const filteredContractors = contractors.filter(contractor => {
    const matchesSearch = contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contractor.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!activeFilter) return matchesSearch;
    
    switch (activeFilter) {
      case 'available':
        return matchesSearch && contractor.availability === 'Available';
      case 'rated':
        return matchesSearch && contractor.rating >= 4.8;
      case 'nearby':
        return matchesSearch; // Would implement location-based filtering
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <div className="flex items-start justify-between mb-4">
          {/* Left side - Greeting and location */}
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[24px] font-bold mb-2"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Hello {userName}
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center space-x-1"
            >
              <MapPin size={16} color="#6B7280" />
              <span 
                className="text-[16px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {userLocation}
              </span>
            </motion.div>
          </div>

          {/* Right side - Notifications and Avatar */}
          <div className="flex items-start space-x-3">
            {/* Notification Bell */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={() => {
                console.log('Notification button clicked in ConsumerDashboard');
                if (onViewNotifications) {
                  onViewNotifications();
                } else {
                  console.error('onViewNotifications prop is undefined');
                }
              }}
              className="relative w-11 h-11 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
            >
              <Bell size={20} color="#6B7280" />
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[10px] font-bold" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}>3</span>
              </div>
            </motion.button>

            <div className="flex flex-col items-end">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="w-11 h-11 rounded-full overflow-hidden mb-2"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1704726135027-9c6f034cfa41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwYXZhdGFyJTIwcHJvZmlsZXxlbnwxfHx8fDE3NTc4NDkyMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-[14px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Cloudy, 72°F
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-5 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative"
        >
          <div className="flex items-center">
            <Search size={20} color="#6B7280" className="absolute left-4 z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find contractors you know"
              className="w-full h-12 pl-12 pr-12 rounded-xl border transition-all duration-200"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7EB',
                fontSize: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                color: '#1D1D1F'
              }}
            />
            <button
              onClick={handleVoiceSearch}
              className="absolute right-4 w-8 h-8 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
            >
              <Mic size={18} color="#6B7280" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions - Invite Section */}
      <div className="px-5 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          {/* Invite Contractors */}
          <button
            onClick={() => {
              console.log('Invite contractors clicked');
              if (onInviteContractors) {
                onInviteContractors();
              }
            }}
            className="flex items-center justify-center space-x-2 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl transition-all duration-200 active:scale-[0.98]"
            style={{
              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
            }}
          >
            <UserPlus size={18} color="white" />
            <span 
              className="text-white text-[14px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Add Contractor
            </span>
          </button>

          {/* Invite Friends */}
          <button
            onClick={() => {
              console.log('Invite friends clicked');
              if (onInviteFriends) {
                onInviteFriends();
              }
            }}
            className="flex items-center justify-center space-x-2 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl transition-all duration-200 active:scale-[0.98]"
            style={{
              boxShadow: '0 4px 16px rgba(147, 51, 234, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
            }}
          >
            <Share size={18} color="white" />
            <span 
              className="text-white text-[14px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Invite Friends
            </span>
          </button>
        </motion.div>
      </div>

      {/* Quick Filters */}
      <div className="px-5 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex space-x-3"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
              className={`px-4 py-2 h-9 rounded-full transition-all duration-200 flex items-center justify-center ${
                activeFilter === filter.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{
                fontSize: '14px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                fontWeight: 500
              }}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Recent Service Card - Rate Service Option */}
      {onRateService && (
        <div className="px-5 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 
                  className="text-[16px] font-medium mb-1"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Recent Service Complete
                </h3>
                <p 
                  className="text-[14px] mb-2"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Plumbing service with Mike Rodriguez
                </p>
                <button
                  onClick={onRateService}
                  className="px-4 py-2 h-10 rounded-lg transition-all duration-200 hover:opacity-90 flex items-center justify-center"
                  style={{ 
                    backgroundColor: '#007AFF',
                    boxShadow: '0 2px 8px rgba(0, 122, 255, 0.25)'
                  }}
                >
                  <span 
                    className="text-white text-[14px] font-medium"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                  >
                    Rate Service
                  </span>
                </button>
              </div>
              
              <div className="flex items-center space-x-1">
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <Star size={16} color="#FFD700" fill="#FFD700" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Recommended Contractors Section */}
      <div className="px-5 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex items-center justify-between mb-4"
        >
          <h2 
            className="text-[22px] font-bold"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Recommended Contractors
          </h2>
          
          <button 
            onClick={() => {
              console.log('See all recommendations clicked');
              if (onSeeAllRecommendations) {
                onSeeAllRecommendations();
              } else {
                alert('See all recommendations feature coming soon!');
              }
            }}
            className="flex items-center justify-center space-x-1 text-blue-500 hover:opacity-70 transition-opacity duration-200 h-8 px-2"
          >
            <span 
              className="text-[14px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              See all
            </span>
            <ArrowRight size={14} />
          </button>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="space-y-4">
          {filteredContractors.length > 0 ? (
            filteredContractors.map((contractor, index) => (
              <motion.button
                key={contractor.id}
                onClick={onViewContractor}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 + (index * 0.1) }}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-[0.98] text-left"
                style={{ height: '120px' }}
              >
                <div className="flex items-center h-full">
                  {/* Left section - Vendor photo with friend badge */}
                  <div className="relative mr-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                      <ImageWithFallback
                        src={contractor.photo}
                        alt={contractor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Friend indicator badge */}
                    <div 
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
                      style={{ 
                        backgroundColor: getFriendBadgeColor(contractor.friendCount),
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {contractor.friendCount}
                    </div>
                  </div>

                  {/* Center content */}
                  <div className="flex-1">
                    <h3 
                      className="text-[18px] font-medium mb-1"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {contractor.name}
                    </h3>
                    
                    <p 
                      className="text-[16px] mb-2"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {contractor.service}
                    </p>
                    
                    {/* Rating and availability */}
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star size={14} fill="#F59E0B" color="#F59E0B" />
                        <span 
                          className="text-[14px]"
                          style={{ 
                            color: '#374151',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {contractor.rating}
                        </span>
                      </div>
                      
                      <span className="text-[14px]" style={{ color: '#D1D5DB' }}>•</span>
                      
                      <span 
                        className="text-[14px]"
                        style={{ 
                          color: getAvailabilityColor(contractor.availability),
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {contractor.availability}
                      </span>
                    </div>
                  </div>

                  {/* Right section - Verification checkmark */}
                  {contractor.verified && (
                    <div className="ml-4">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check size={16} color="white" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.button>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-center py-12"
            >
              <p 
                className="text-[16px] mb-2"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                No contractors yet?
              </p>
              <button 
                className="text-[16px] text-blue-500 hover:opacity-70 transition-opacity duration-200 h-10 px-4 rounded-lg flex items-center justify-center"
                style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  fontWeight: 500
                }}
              >
                Invite friends to join FixRx
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200" style={{ height: '80px', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="flex items-center justify-around h-full px-5">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'contractors', icon: Users, label: 'Contractors' },
            { id: 'messages', icon: MessageSquare, label: 'Messages' },
            { id: 'profile', icon: User, label: 'Profile' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="flex flex-col items-center justify-center space-y-1 transition-colors duration-200 min-w-[60px] h-full"
            >
              <tab.icon 
                size={24} 
                color={activeTab === tab.id ? '#007AFF' : '#9CA3AF'} 
                fill={activeTab === tab.id ? '#007AFF' : 'none'}
              />
              <span 
                className="text-[12px]"
                style={{ 
                  color: activeTab === tab.id ? '#007AFF' : '#9CA3AF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  fontWeight: activeTab === tab.id ? 500 : 400
                }}
              >
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom spacing for fixed navigation */}
      <div style={{ height: '80px' }} />
    </div>
  );
}
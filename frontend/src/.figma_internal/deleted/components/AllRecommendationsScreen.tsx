import { useState } from 'react';
import { Search, Mic, ArrowLeft, Star, Check, Filter, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { MobileContainer } from './MobileContainer';

interface AllRecommendationsScreenProps {
  onBack?: () => void;
  onViewContractor?: () => void;
  userName?: string;
  userLocation?: string;
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
  distance: string;
  responseTime: string;
  completedJobs: number;
  tags: string[];
}

export function AllRecommendationsScreen({ 
  onBack, 
  onViewContractor,
  userName = 'Sarah',
  userLocation = 'San Francisco, CA'
}: AllRecommendationsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'availability'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const allContractors: Contractor[] = [
    {
      id: '1',
      name: 'Mike Rodriguez',
      service: 'Plumbing',
      rating: 4.9,
      availability: 'Available',
      friendCount: 3,
      verified: true,
      distance: '0.8 mi',
      responseTime: '< 1 hour',
      completedJobs: 127,
      tags: ['Emergency Service', 'Licensed', 'Insured'],
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
      distance: '1.2 mi',
      responseTime: '< 2 hours',
      completedJobs: 89,
      tags: ['Master Electrician', 'Smart Home'],
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
      distance: '2.1 mi',
      responseTime: '< 3 hours',
      completedJobs: 156,
      tags: ['General Repairs', 'Furniture Assembly'],
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
      distance: '3.5 mi',
      responseTime: '< 4 hours',
      completedJobs: 203,
      tags: ['Renovations', 'General Contractor'],
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
      distance: '1.8 mi',
      responseTime: '< 2 hours',
      completedJobs: 94,
      tags: ['Heating', 'Air Conditioning', 'Maintenance'],
      photo: 'https://images.unsplash.com/photo-1730791979207-583e51851e2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwaGVhZHNob3R8ZW58MXx8fHwxNzU3OTEwNTgwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '6',
      name: 'Maria Garcia',
      service: 'Cleaning',
      rating: 4.8,
      availability: 'Available',
      friendCount: 4,
      verified: true,
      distance: '1.5 mi',
      responseTime: '< 1 hour',
      completedJobs: 178,
      tags: ['Deep Cleaning', 'Eco-Friendly', 'Move-in/out'],
      photo: 'https://images.unsplash.com/photo-1631947430066-48c30d57b943?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbmluZyUyMHNlcnZpY2UlMjB3b3JrZXJ8ZW58MXx8fHwxNzU3OTEwNTk1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '7',
      name: 'Robert Johnson',
      service: 'Landscaping',
      rating: 4.5,
      availability: 'Available',
      friendCount: 6,
      verified: false,
      distance: '4.2 mi',
      responseTime: '< 6 hours',
      completedJobs: 67,
      tags: ['Garden Design', 'Tree Service', 'Irrigation'],
      photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGVyJTIwZ2FyZGVuZXJ8ZW58MXx8fHwxNzU3OTEwNTk3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: '8',
      name: 'Lisa Wong',
      service: 'Interior Design',
      rating: 4.9,
      availability: 'Busy',
      friendCount: 8,
      verified: true,
      distance: '2.8 mi',
      responseTime: '< 24 hours',
      completedJobs: 45,
      tags: ['Modern Design', 'Space Planning', 'Color Consultation'],
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlcmlvciUyMGRlc2lnbmVyJTIwd29tYW58ZW58MXx8fHwxNzU3OTEwNTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    }
  ];

  const filters = [
    { id: 'available', label: 'Available now' },
    { id: 'verified', label: 'Verified only' },
    { id: 'highRated', label: 'Highly rated (4.8+)' },
    { id: 'nearby', label: 'Within 2 miles' },
    { id: 'friends', label: 'Friends recommend' }
  ];

  const serviceCategories = [
    'All Services', 'Plumbing', 'Electrical', 'Handyman', 'Construction', 
    'HVAC', 'Cleaning', 'Landscaping', 'Interior Design'
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
  };

  const filteredAndSortedContractors = allContractors
    .filter(contractor => {
      const matchesSearch = contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contractor.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contractor.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!activeFilter) return matchesSearch;
      
      switch (activeFilter) {
        case 'available':
          return matchesSearch && contractor.availability === 'Available';
        case 'verified':
          return matchesSearch && contractor.verified;
        case 'highRated':
          return matchesSearch && contractor.rating >= 4.8;
        case 'nearby':
          return matchesSearch && parseFloat(contractor.distance) <= 2.0;
        case 'friends':
          return matchesSearch && contractor.friendCount >= 3;
        default:
          return matchesSearch;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'availability':
          if (a.availability === 'Available' && b.availability !== 'Available') return -1;
          if (b.availability === 'Available' && a.availability !== 'Available') return 1;
          return 0;
        default:
          return 0;
      }
    });

  return (
    <MobileContainer className="bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onBack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <ArrowLeft size={24} color="#007AFF" />
              </motion.button>
              
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-[24px] font-bold"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  All Recommendations
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {filteredAndSortedContractors.length} contractors near {userLocation}
                </motion.p>
              </div>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <SlidersHorizontal size={20} color="#6B7280" />
            </motion.button>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative mb-4"
          >
            <div className="flex items-center">
              <Search size={20} color="#6B7280" className="absolute left-4 z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contractors, services, or skills..."
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
                className="absolute right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <Mic size={20} color="#6B7280" />
              </button>
            </div>
          </motion.div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 mb-4"
            >
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
                    className={`px-3 py-2 rounded-full transition-all duration-200 ${ 
                      activeFilter === filter.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={{
                      fontSize: '14px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-3">
                <span 
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1 rounded-lg border border-gray-200 bg-white text-[14px]"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                >
                  <option value="rating">Rating</option>
                  <option value="distance">Distance</option>
                  <option value="availability">Availability</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Contractors Grid */}
      <div className="px-5 py-4">
        {filteredAndSortedContractors.length > 0 ? (
          <div className="space-y-4">
            {filteredAndSortedContractors.map((contractor, index) => (
              <motion.button
                key={contractor.id}
                onClick={onViewContractor}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-[0.98] text-left"
              >
                <div className="flex items-start space-x-4">
                  {/* Left section - Photo with friend badge */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <ImageWithFallback
                        src={contractor.photo}
                        alt={contractor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Friend indicator badge */}
                    <div 
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
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
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 
                          className="text-[16px] font-medium"
                          style={{ 
                            color: '#1D1D1F',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {contractor.name}
                        </h3>
                        <p 
                          className="text-[14px]"
                          style={{ 
                            color: '#6B7280',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {contractor.service}
                        </p>
                      </div>
                      
                      {contractor.verified && (
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                          <Check size={12} color="white" />
                        </div>
                      )}
                    </div>
                    
                    {/* Stats row */}
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-1">
                        <Star size={12} fill="#F59E0B" color="#F59E0B" />
                        <span 
                          className="text-[12px]"
                          style={{ 
                            color: '#374151',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {contractor.rating}
                        </span>
                      </div>
                      
                      <span className="text-[12px]" style={{ color: '#D1D5DB' }}>•</span>
                      
                      <span 
                        className="text-[12px]"
                        style={{ 
                          color: '#6B7280',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {contractor.distance}
                      </span>
                      
                      <span className="text-[12px]" style={{ color: '#D1D5DB' }}>•</span>
                      
                      <span 
                        className="text-[12px]"
                        style={{ 
                          color: getAvailabilityColor(contractor.availability),
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {contractor.availability}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {contractor.tags.slice(0, 2).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 rounded-full bg-blue-50 text-[10px]"
                          style={{ 
                            color: '#007AFF',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      {contractor.tags.length > 2 && (
                        <span
                          className="px-2 py-1 rounded-full bg-gray-100 text-[10px]"
                          style={{ 
                            color: '#6B7280',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          +{contractor.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <p 
              className="text-[16px] mb-2"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              No contractors found
            </p>
            <p 
              className="text-[14px] mb-4"
              style={{ 
                color: '#9CA3AF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Try adjusting your search or filters
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveFilter(null);
              }}
              className="text-[14px] text-blue-500 hover:opacity-70 transition-opacity duration-200"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom spacing */}
      <div style={{ height: '100px' }} />
    </MobileContainer>
  );
}
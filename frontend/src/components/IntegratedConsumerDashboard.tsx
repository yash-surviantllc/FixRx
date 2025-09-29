import React, { useState, useEffect } from 'react';
import { Search, Mic, MapPin, Star, Check, Home, Users, MessageSquare, User, ArrowRight, Bell, UserPlus, Share, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/app.store';
import { VendorService } from '../services/vendor.service';
import { ConsumerService } from '../services/consumer.service';
import type { Vendor, Connection, Rating } from '../types/api';

interface IntegratedConsumerDashboardProps {
  onViewContractor?: () => void;
  onRateService?: () => void;
  onViewNotifications?: () => void;
  onSeeAllRecommendations?: () => void;
  onInviteContractors?: () => void;
  onInviteFriends?: () => void;
}

interface DashboardData {
  recentConnections: Connection[];
  recommendedVendors: Vendor[];
  recentRatings: Rating[];
  stats: {
    totalConnections: number;
    totalRatings: number;
    favoriteCategories: string[];
  };
}

export function IntegratedConsumerDashboard({ 
  onViewContractor, 
  onRateService, 
  onViewNotifications, 
  onSeeAllRecommendations, 
  onInviteContractors, 
  onInviteFriends 
}: IntegratedConsumerDashboardProps) {
  const { user, consumer } = useAuth();
  const { 
    searchQuery, 
    setSearchQuery, 
    selectedVendor, 
    setSelectedVendor,
    isLoading,
    setLoading,
    error,
    setError,
    clearError
  } = useAppStore();

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [nearbyVendors, setNearbyVendors] = useState<Vendor[]>([]);
  const [searchResults, setSearchResults] = useState<Vendor[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
    loadNearbyVendors();
  }, []);

  // Search vendors when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchVendors();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      clearError();
      
      const data = await ConsumerService.getDashboardData();
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyVendors = async () => {
    try {
      if (consumer?.location) {
        const vendors = await VendorService.getNearbyVendors(
          consumer.location.latitude,
          consumer.location.longitude,
          consumer.searchRadius || 50,
          10
        );
        setNearbyVendors(vendors);
      }
    } catch (err: any) {
      console.error('Nearby vendors error:', err);
    }
  };

  const searchVendors = async () => {
    try {
      setIsSearching(true);
      
      const searchParams = {
        query: searchQuery,
        latitude: consumer?.location?.latitude,
        longitude: consumer?.location?.longitude,
        radius: consumer?.searchRadius || 50,
        limit: 20,
      };

      const response = await VendorService.searchVendors(searchParams);
      setSearchResults(response.vendors);
    } catch (err: any) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVendorSelect = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    onViewContractor?.();
  };

  const handleConnectWithVendor = async (vendorId: string) => {
    try {
      await VendorService.connectWithVendor(vendorId);
      // Refresh dashboard data to show new connection
      loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Failed to connect with vendor');
    }
  };

  const displayVendors = searchQuery.trim() ? searchResults : nearbyVendors;
  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';
  const userLocation = consumer?.location ? `${consumer.location.city}, ${consumer.location.state}` : 'Location not set';

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hi, {userName}!</h1>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{userLocation}</span>
            </div>
          </div>
          <button 
            onClick={onViewNotifications}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors relative"
          >
            <Bell className="w-6 h-6 text-gray-600" />
            {dashboardData && dashboardData.stats.totalConnections > 0 && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-3">
            <Search className="w-5 h-5 text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Search for contractors, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
            <button className="ml-3 p-1">
              <Mic className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {isSearching && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
          <button 
            onClick={clearError}
            className="text-red-600 text-xs underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-4 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            onClick={onInviteContractors}
            className="bg-blue-600 text-white p-4 rounded-lg flex items-center justify-between hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-left">
              <h3 className="font-semibold">Invite Contractors</h3>
              <p className="text-sm opacity-90">Find new services</p>
            </div>
            <UserPlus className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={onInviteFriends}
            className="bg-green-600 text-white p-4 rounded-lg flex items-center justify-between hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-left">
              <h3 className="font-semibold">Invite Friends</h3>
              <p className="text-sm opacity-90">Share FixRx</p>
            </div>
            <Share className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Stats Cards */}
        {dashboardData && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{dashboardData.stats.totalConnections}</div>
              <div className="text-sm text-gray-600">Connections</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{dashboardData.stats.totalRatings}</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">{dashboardData.stats.favoriteCategories.length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        )}

        {/* Recommended/Search Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {searchQuery.trim() ? 'Search Results' : 'Recommended for You'}
            </h2>
            {!searchQuery.trim() && (
              <button 
                onClick={onSeeAllRecommendations}
                className="text-blue-600 text-sm font-medium hover:text-blue-700"
              >
                See All
              </button>
            )}
          </div>

          {displayVendors.length > 0 ? (
            <div className="space-y-4">
              {displayVendors.slice(0, 5).map((vendor) => (
                <motion.div
                  key={vendor.id}
                  className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleVendorSelect(vendor)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      {vendor.portfolioImages?.[0] ? (
                        <ImageWithFallback
                          src={vendor.portfolioImages[0]}
                          alt={vendor.businessName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                          <User className="w-8 h-8 text-blue-600" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{vendor.businessName}</h3>
                          <p className="text-sm text-gray-600 mt-1">{vendor.serviceCategories.join(', ')}</p>
                          <div className="flex items-center mt-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-medium text-gray-900 ml-1">
                                {vendor.averageRating.toFixed(1)}
                              </span>
                              <span className="text-sm text-gray-500 ml-1">
                                ({vendor.totalRatings} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          {vendor.hourlyRate && (
                            <div className="text-lg font-semibold text-gray-900">
                              ${vendor.hourlyRate}/hr
                            </div>
                          )}
                          <div className="text-sm text-gray-500 mt-1">
                            {vendor.city}, {vendor.state}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          {vendor.licenseVerification === 'VERIFIED' && (
                            <div className="flex items-center text-green-600">
                              <Check className="w-4 h-4 mr-1" />
                              <span className="text-xs">Verified</span>
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConnectWithVendor(vendor.id);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery.trim() ? 'No results found' : 'No recommendations yet'}
              </h3>
              <p className="text-gray-600">
                {searchQuery.trim() 
                  ? 'Try adjusting your search terms or location'
                  : 'Complete your profile to get personalized recommendations'
                }
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        {dashboardData?.recentConnections && dashboardData.recentConnections.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {dashboardData.recentConnections.slice(0, 3).map((connection) => (
                <div key={connection.id} className="bg-white p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Connected with {connection.vendor?.businessName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(connection.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={onRateService}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700"
                    >
                      Rate Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

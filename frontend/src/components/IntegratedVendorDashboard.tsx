import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, Users, Calendar, MapPin, Phone, Mail, Edit, Camera, Loader2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/app.store';
import { VendorService } from '../services/vendor.service';
import type { Connection, Rating } from '../types/api';

interface VendorDashboardData {
  connections: Connection[];
  recentRatings: Rating[];
  stats: {
    totalConnections: number;
    totalRatings: number;
    averageRating: number;
    responseTime: number;
    totalJobs: number;
  };
  ratingBreakdown: {
    costEffectiveness: number;
    qualityOfService: number;
    timelinessOfDelivery: number;
    professionalism: number;
  };
}

export function IntegratedVendorDashboard() {
  const { user, vendor } = useAuth();
  const { isLoading, setLoading, error, setError, clearError } = useAppStore();
  
  const [dashboardData, setDashboardData] = useState<VendorDashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'connections' | 'ratings'>('overview');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      clearError();

      // Load vendor connections
      const connections = await VendorService.getVendorConnections();
      
      // Load vendor ratings if vendor exists
      let recentRatings: Rating[] = [];
      let ratingBreakdown = {
        costEffectiveness: 0,
        qualityOfService: 0,
        timelinessOfDelivery: 0,
        professionalism: 0,
      };

      if (vendor) {
        const ratingsData = await VendorService.getVendorRatings(vendor.id, 1, 10);
        recentRatings = ratingsData.ratings;
        ratingBreakdown = ratingsData.ratingBreakdown;
      }

      const stats = {
        totalConnections: connections.length,
        totalRatings: vendor?.totalRatings || 0,
        averageRating: vendor?.averageRating || 0,
        responseTime: vendor?.responseTime || 0,
        totalJobs: vendor?.totalJobs || 0,
      };

      setDashboardData({
        connections,
        recentRatings,
        stats,
        ratingBreakdown,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Vendor dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionUpdate = async (connectionId: string, status: string) => {
    try {
      await VendorService.updateConnectionStatus(connectionId, status);
      // Refresh dashboard data
      loadDashboardData();
    } catch (err: any) {
      setError(err.message || 'Failed to update connection');
    }
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'CONNECTED': return 'text-green-600 bg-green-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'BLOCKED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConnectionStatusIcon = (status: string) => {
    switch (status) {
      case 'CONNECTED': return <CheckCircle className="w-4 h-4" />;
      case 'PENDING': return <Clock className="w-4 h-4" />;
      case 'BLOCKED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

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

  if (!vendor) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Setup Required</h2>
          <p className="text-gray-600">Please complete your vendor profile to access the dashboard.</p>
        </div>
      </div>
    );
  }

  const businessName = vendor.businessName || `${user?.firstName} ${user?.lastName}`;
  const location = vendor.city && vendor.state ? `${vendor.city}, ${vendor.state}` : 'Location not set';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-6 py-6">
          <div className="flex items-start space-x-4">
            {/* Business Logo/Avatar */}
            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
              {vendor.portfolioImages?.[0] ? (
                <ImageWithFallback
                  src={vendor.portfolioImages[0]}
                  alt={businessName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {businessName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Business Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{businessName}</h1>
                  <p className="text-gray-600 mt-1">{vendor.serviceCategories.join(', ')}</p>
                  <div className="flex items-center text-gray-500 mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{location}</span>
                  </div>
                </div>
                <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Rating and Stats */}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-lg font-semibold text-gray-900 ml-1">
                    {dashboardData?.stats.averageRating.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-gray-500 ml-1">
                    ({dashboardData?.stats.totalRatings || 0} reviews)
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {dashboardData?.stats.totalJobs || 0} jobs completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <div className="flex space-x-8 border-b border-gray-100">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'connections', label: 'Connections' },
              { id: 'ratings', label: 'Reviews' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
      <div className="px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardData?.stats.totalConnections || 0}
                    </div>
                    <div className="text-sm text-gray-600">Connections</div>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {dashboardData?.stats.totalJobs || 0}
                    </div>
                    <div className="text-sm text-gray-600">Jobs Done</div>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {dashboardData?.stats.averageRating.toFixed(1) || '0.0'}
                    </div>
                    <div className="text-sm text-gray-600">Avg Rating</div>
                  </div>
                  <Star className="w-8 h-8 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {dashboardData?.stats.responseTime || 0}m
                    </div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            {dashboardData?.ratingBreakdown && (
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
                <div className="space-y-4">
                  {Object.entries(dashboardData.ratingBreakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(value / 5) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 w-8">
                          {value.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'connections' && (
          <div className="space-y-4">
            {dashboardData?.connections && dashboardData.connections.length > 0 ? (
              dashboardData.connections.map((connection) => (
                <motion.div
                  key={connection.id}
                  className="bg-white p-4 rounded-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-gray-600">
                          {connection.consumer?.user?.firstName?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {connection.consumer?.user?.firstName} {connection.consumer?.user?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Connected {new Date(connection.createdAt).toLocaleDateString()}
                        </p>
                        {connection.notes && (
                          <p className="text-sm text-gray-500 mt-1">{connection.notes}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConnectionStatusColor(connection.status)}`}>
                        {getConnectionStatusIcon(connection.status)}
                        <span className="ml-1 capitalize">{connection.status.toLowerCase()}</span>
                      </span>
                      
                      {connection.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleConnectionUpdate(connection.id, 'CONNECTED')}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleConnectionUpdate(connection.id, 'BLOCKED')}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No connections yet</h3>
                <p className="text-gray-600">Consumers will appear here when they connect with you</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ratings' && (
          <div className="space-y-4">
            {dashboardData?.recentRatings && dashboardData.recentRatings.length > 0 ? (
              dashboardData.recentRatings.map((rating) => (
                <motion.div
                  key={rating.id}
                  className="bg-white p-4 rounded-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-gray-600">
                        {rating.giver?.firstName?.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">
                          {rating.giver?.firstName} {rating.giver?.lastName}
                        </h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900 ml-1">
                            {rating.overallRating}
                          </span>
                        </div>
                      </div>
                      
                      {rating.reviewTitle && (
                        <h4 className="font-medium text-gray-900 mb-1">{rating.reviewTitle}</h4>
                      )}
                      
                      {rating.reviewText && (
                        <p className="text-gray-600 text-sm mb-2">{rating.reviewText}</p>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        {new Date(rating.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-600">Customer reviews will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { 
  Bell, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  Clock, 
  MapPin, 
  Phone, 
  Plus,
  Users,
  Target,
  Award,
  ChevronRight,
  User,
  Filter,
  MoreVertical
} from 'lucide-react';
import { motion } from 'motion/react';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';

interface VendorDashboardProps {
  vendorName: string;
  onNavigateToMessages: () => void;
  onViewRequest: (requestId: string) => void;
  onInviteContractors?: () => void;
  onViewNotifications?: () => void;
}

interface ServiceRequest {
  id: string;
  customerName: string;
  customerAvatar: string;
  serviceType: string;
  urgency: 'ASAP' | 'This week' | 'Flexible';
  distance: string;
  description: string;
  timestamp: string;
  budget: string;
}

interface Conversation {
  id: string;
  customerName: string;
  customerAvatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

const mockServiceRequests: ServiceRequest[] = [
  {
    id: '1',
    customerName: 'Sarah Chen',
    customerAvatar: '👩',
    serviceType: 'Kitchen Sink Repair',
    urgency: 'ASAP',
    distance: '2.1 mi',
    description: 'Kitchen sink is completely clogged, water backing up',
    timestamp: '5 min ago',
    budget: '$100-200'
  },
  {
    id: '2',
    customerName: 'David Wilson',
    customerAvatar: '👨',
    serviceType: 'Bathroom Faucet Install',
    urgency: 'This week',
    distance: '4.3 mi',
    description: 'Need new bathroom faucet installed, have parts',
    timestamp: '2 hours ago',
    budget: '$150-300'
  },
  {
    id: '3',
    customerName: 'Maria Garcia',
    customerAvatar: '👩',
    serviceType: 'Toilet Repair',
    urgency: 'Flexible',
    distance: '6.8 mi',
    description: 'Toilet running constantly, needs adjustment',
    timestamp: '1 day ago',
    budget: '$75-150'
  }
];

const mockConversations: Conversation[] = [
  {
    id: '1',
    customerName: 'Jennifer Kim',
    customerAvatar: '👩',
    lastMessage: 'Thanks! When can you start the project?',
    timestamp: '10 min ago',
    unread: true
  },
  {
    id: '2',
    customerName: 'Robert Taylor',
    customerAvatar: '👨',
    lastMessage: 'Perfect, see you Tuesday at 9am',
    timestamp: '2 hours ago',
    unread: false
  },
  {
    id: '3',
    customerName: 'Lisa Anderson',
    customerAvatar: '👩',
    lastMessage: 'Could you send me the quote again?',
    timestamp: 'Yesterday',
    unread: true
  }
];

export function VendorDashboard({ vendorName, onNavigateToMessages, onViewRequest, onInviteContractors, onViewNotifications }: VendorDashboardProps) {
  const [sortBy, setSortBy] = useState<'newest' | 'closest' | 'priority'>('newest');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'ASAP': return '#FF3B30';
      case 'This week': return '#FF9500';
      case 'Flexible': return '#34C759';
      default: return '#6B7280';
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const MetricCard = ({ title, value, change, trend, icon }: {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: React.ReactNode;
  }) => (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#F0F7FF' }}
        >
          <div style={{ color: '#007AFF' }}>
            {icon}
          </div>
        </div>
        <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span className="text-[12px] font-medium">{change}</span>
        </div>
      </div>
      
      <h3 
        className="text-[24px] font-bold mb-1"
        style={{ 
          color: '#1D1D1F',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
        }}
      >
        {value}
      </h3>
      
      <p 
        className="text-[12px]"
        style={{ 
          color: '#6B7280',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
        }}
      >
        {title}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 
              className="text-[24px] font-bold"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {getTimeGreeting()}, {vendorName}!
            </h1>
            
            {/* Business Health */}
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  4.9
                </span>
                <TrendingUp size={12} color="#34C759" />
              </div>
              
              <div className="w-px h-4 bg-gray-300" />
              
              <p 
                className="text-[16px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                2 appointments today
              </p>
            </div>
          </div>
          
          {/* Notification Bell */}
          <button 
            onClick={() => {
              console.log('Notification button clicked in VendorDashboard');
              if (onViewNotifications) {
                onViewNotifications();
              } else {
                console.error('onViewNotifications prop is undefined');
              }
            }}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <Bell size={24} color="#1D1D1F" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-medium">3</span>
            </div>
          </button>
        </div>
      </div>

      <div className="px-5 pb-24">
        {/* Business Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-6 mb-8">
          <MetricCard
            title="This Week's Revenue"
            value="$1,247"
            change="+12%"
            trend="up"
            icon={<DollarSign size={20} />}
          />
          
          <MetricCard
            title="Active Projects"
            value="3"
            change="+1"
            trend="up"
            icon={<Target size={20} />}
          />
          
          <MetricCard
            title="Response Rate"
            value="92%"
            change="+5%"
            trend="up"
            icon={<Clock size={20} />}
          />
          
          <MetricCard
            title="Customer Satisfaction"
            value="4.9"
            change="+0.2"
            trend="up"
            icon={<Award size={20} />}
          />
        </div>

        {/* Service Requests Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-[20px] font-bold"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              New Requests
            </h2>
            
            <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <Filter size={16} color="#6B7280" />
              <span 
                className="text-[14px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Sort: Newest first
              </span>
            </button>
          </div>

          <div className="space-y-3">
            {mockServiceRequests.map((request) => (
              <motion.div
                key={request.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-[18px]">{request.customerAvatar}</span>
                    </div>
                    
                    <div>
                      <h3 
                        className="text-[16px] font-medium"
                        style={{ 
                          color: '#1D1D1F',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {request.customerName}
                      </h3>
                      
                      <div className="flex items-center space-x-2 mt-1">
                        <span 
                          className="text-[14px]"
                          style={{ 
                            color: '#6B7280',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {request.serviceType}
                        </span>
                        
                        <Badge
                          style={{
                            backgroundColor: getUrgencyColor(request.urgency),
                            color: 'white',
                            fontSize: '10px',
                            padding: '2px 6px'
                          }}
                        >
                          {request.urgency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      <MapPin size={12} color="#6B7280" />
                      <span 
                        className="text-[12px]"
                        style={{ 
                          color: '#6B7280',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {request.distance}
                      </span>
                    </div>
                    
                    <span 
                      className="text-[12px]"
                      style={{ 
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {request.timestamp}
                    </span>
                  </div>
                </div>
                
                <p 
                  className="text-[14px] mb-3"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {request.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span 
                    className="text-[14px] font-medium"
                    style={{ 
                      color: '#007AFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Budget: {request.budget}
                  </span>
                  
                  <button
                    onClick={() => onViewRequest(request.id)}
                    className="px-4 py-2 rounded-lg"
                    style={{
                      backgroundColor: '#007AFF',
                      color: 'white'
                    }}
                  >
                    <span 
                      className="text-[14px] font-medium"
                      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                    >
                      Respond
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Conversations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 
              className="text-[20px] font-bold"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Messages
            </h2>
            
            <button 
              onClick={onNavigateToMessages}
              className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <span 
                className="text-[14px]"
                style={{ 
                  color: '#007AFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                View all
              </span>
              <ChevronRight size={14} color="#007AFF" />
            </button>
          </div>

          <div className="space-y-3">
            {mockConversations.slice(0, 3).map((conversation) => (
              <div
                key={conversation.id}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-[18px]">{conversation.customerAvatar}</span>
                    </div>
                    {conversation.unread && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 
                        className="text-[16px] font-medium"
                        style={{ 
                          color: '#1D1D1F',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {conversation.customerName}
                      </h3>
                      
                      <span 
                        className="text-[12px]"
                        style={{ 
                          color: '#6B7280',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {conversation.timestamp}
                      </span>
                    </div>
                    
                    <p 
                      className="text-[14px] mt-1"
                      style={{ 
                        color: conversation.unread ? '#1D1D1F' : '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {conversation.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mb-8">
          <h2 
            className="text-[20px] font-bold mb-4"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Your Business
          </h2>

          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#F0F7FF' }}
                >
                  <Clock size={16} color="#007AFF" />
                </div>
                
                <div>
                  <h3 
                    className="text-[16px] font-medium"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Response Time
                  </h3>
                  
                  <p 
                    className="text-[14px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Average 1.2 hours (Better than 78% of contractors)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-3 mb-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#F0FDF4' }}
                >
                  <TrendingUp size={16} color="#34C759" />
                </div>
                
                <div>
                  <h3 
                    className="text-[16px] font-medium"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Growth Opportunity
                  </h3>
                  
                  <p 
                    className="text-[14px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Consider adding: Bathroom Remodeling (+40% potential revenue)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Growth */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-3 mb-3">
              <Users size={24} color="#007AFF" />
              <div>
                <h3 
                  className="text-[18px] font-bold"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Invite contractor friends
                </h3>
                
                <p 
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Your referrals have earned $2,340 this month
                </p>
              </div>
            </div>
            
            <button
              onClick={onInviteContractors}
              className="w-full h-12 rounded-lg border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
              style={{ backgroundColor: 'white' }}
            >
              <span 
                className="text-[16px] font-medium"
                style={{ 
                  color: '#007AFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' 
                }}
              >
                Send Invitations
              </span>
            </button>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="mb-8">
          <h2 
            className="text-[20px] font-bold mb-4"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Today's Schedule
          </h2>

          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#F0F7FF' }}
                >
                  <Calendar size={16} color="#007AFF" />
                </div>
                
                <div>
                  <h3 
                    className="text-[16px] font-medium"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Next: Jennifer Kim - 2:00 PM
                  </h3>
                  
                  <p 
                    className="text-[14px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Kitchen Faucet Installation
                  </p>
                </div>
              </div>
              
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                <ChevronRight size={16} color="#6B7280" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="w-14 h-14 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
            boxShadow: '0 8px 24px rgba(0, 122, 255, 0.35)'
          }}
        >
          <Plus size={24} color="white" />
        </button>
        
        {/* Quick Actions Menu */}
        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute bottom-16 right-0 bg-white rounded-xl p-2 shadow-lg border border-gray-100 min-w-48"
          >
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Calendar size={18} color="#6B7280" />
              <span 
                className="text-[14px]"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Update availability
              </span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <DollarSign size={18} color="#6B7280" />
              <span 
                className="text-[14px]"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Create invoice
              </span>
            </button>
            
            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
              <Clock size={18} color="#6B7280" />
              <span 
                className="text-[14px]"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Schedule appointment
              </span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Emergency Mode Toggle (Fixed Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-3">
        <div className="flex items-center justify-between">
          <span 
            className="text-[16px] font-medium"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Available for emergency calls
          </span>
          
          <button
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`w-12 h-6 rounded-full transition-all duration-200 ${
              emergencyMode ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div 
              className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                emergencyMode ? 'transform translate-x-6' : 'transform translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
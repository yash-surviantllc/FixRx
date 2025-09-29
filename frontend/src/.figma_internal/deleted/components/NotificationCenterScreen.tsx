import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Bell,
  MessageCircle,
  Users,
  Settings,
  Trash2,
  Check,
  Filter,
  MoreHorizontal,
  ChevronRight,
  Clock,
  CreditCard,
  Shield,
  Star,
  Wrench,
  Phone,
  Calendar,
  DollarSign,
  UserPlus,
  Heart,
  CheckCircle2,
  AlertCircle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationItem {
  id: string;
  type: 'service' | 'friend' | 'system';
  category: string;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  icon: React.ReactNode;
  actionData?: any;
  avatar?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface NotificationCenterScreenProps {
  onBack: () => void;
  onNavigateToService?: (serviceId: string) => void;
  onNavigateToChat?: (chatId: string) => void;
  onNavigateToSettings?: () => void;
  userName?: string;
}

type TabType = 'service' | 'friend' | 'system';

export function NotificationCenterScreen({ 
  onBack, 
  onNavigateToService, 
  onNavigateToChat, 
  onNavigateToSettings,
  userName = 'User'
}: NotificationCenterScreenProps) {
  const [activeTab, setActiveTab] = useState<TabType>('service');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    // Service Updates
    {
      id: '1',
      type: 'service',
      category: 'contractor_response',
      title: 'Mike confirmed your plumbing appointment',
      description: 'Tomorrow at 2 PM for bathroom faucet repair',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      isRead: false,
      icon: <MessageCircle size={20} color="#007AFF" />,
      actionData: { contractorId: 'mike_123', serviceId: 'plumb_456' },
      priority: 'high'
    },
    {
      id: '2',
      type: 'service',
      category: 'service_complete',
      title: 'Sarah completed your electrical work',
      description: 'Rate your experience and help others',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: false,
      icon: <CheckCircle2 size={20} color="#34D399" />,
      actionData: { contractorId: 'sarah_789', serviceId: 'elec_012' },
      priority: 'medium'
    },
    {
      id: '3',
      type: 'service',
      category: 'quote_received',
      title: 'New quote received: $175',
      description: 'For bathroom faucet repair from Mike Rodriguez',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      isRead: true,
      icon: <DollarSign size={20} color="#F59E0B" />,
      actionData: { quoteId: 'quote_345', contractorId: 'mike_123' },
      priority: 'medium'
    },
    {
      id: '4',
      type: 'service',
      category: 'appointment_reminder',
      title: 'Plumbing appointment tomorrow',
      description: 'Mike Rodriguez • 2:00 PM • Don\'t forget to be home',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      isRead: true,
      icon: <Calendar size={20} color="#8B5CF6" />,
      actionData: { appointmentId: 'appt_678' },
      priority: 'medium'
    },
    
    // Friend Activity
    {
      id: '5',
      type: 'friend',
      category: 'friend_recommendation',
      title: 'Emma added a new contractor',
      description: 'Johnson Roofing Services in your area',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      isRead: false,
      icon: <UserPlus size={20} color="#F97316" />,
      actionData: { friendId: 'emma_456', contractorId: 'johnson_roof' },
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c05c?w=40&h=40&fit=crop&crop=face',
      priority: 'low'
    },
    {
      id: '6',
      type: 'friend',
      category: 'network_activity',
      title: '3 friends hired contractors this week',
      description: 'Alex, Maria, and Jake completed services',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      isRead: true,
      icon: <Users size={20} color="#10B981" />,
      actionData: { type: 'weekly_summary' },
      priority: 'low'
    },
    {
      id: '7',
      type: 'friend',
      category: 'high_rating',
      title: 'Michael rated a contractor 5 stars',
      description: 'Elite Plumbing Co in Downtown area',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
      isRead: true,
      icon: <Star size={20} color="#F59E0B" />,
      actionData: { friendId: 'michael_789', contractorId: 'elite_plumb' },
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      priority: 'low'
    },
    
    // System Messages
    {
      id: '8',
      type: 'system',
      category: 'payment_processed',
      title: 'Payment processed successfully',
      description: '$175 for plumbing service with Mike Rodriguez',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: false,
      icon: <CreditCard size={20} color="#8B5CF6" />,
      actionData: { paymentId: 'pay_123', amount: 175 },
      priority: 'medium'
    },
    {
      id: '9',
      type: 'system',
      category: 'verification_complete',
      title: 'Contractor license verification complete',
      description: 'Mike Rodriguez\'s credentials have been verified',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36), // 1.5 days ago
      isRead: true,
      icon: <Shield size={20} color="#059669" />,
      actionData: { contractorId: 'mike_123' },
      priority: 'low'
    },
    {
      id: '10',
      type: 'system',
      category: 'security_alert',
      title: 'New device login detected',
      description: 'iPhone 15 Pro from San Francisco, CA',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      isRead: true,
      icon: <AlertCircle size={20} color="#DC2626" />,
      actionData: { deviceInfo: 'iPhone 15 Pro' },
      priority: 'high'
    }
  ]);
  
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Get filtered notifications based on active tab
  const filteredNotifications = notifications.filter(notif => {
    if (notif.type !== activeTab) return false;
    if (showUnreadOnly && notif.isRead) return false;
    return true;
  });

  // Count unread notifications by type
  const unreadCounts = {
    service: notifications.filter(n => n.type === 'service' && !n.isRead).length,
    friend: notifications.filter(n => n.type === 'friend' && !n.isRead).length,
    system: notifications.filter(n => n.type === 'system' && !n.isRead).length
  };

  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => 
      notif.type === activeTab ? { ...notif, isRead: true } : notif
    ));
  };

  const handleNotificationPress = (notification: NotificationItem) => {
    if (isSelectionMode) {
      handleNotificationSelect(notification.id);
      return;
    }

    // Mark as read
    setNotifications(prev => prev.map(notif => 
      notif.id === notification.id ? { ...notif, isRead: true } : notif
    ));

    // Navigate based on notification type
    if (notification.type === 'service' && onNavigateToService) {
      onNavigateToService(notification.actionData?.serviceId || '');
    } else if (notification.category === 'contractor_response' && onNavigateToChat) {
      onNavigateToChat(notification.actionData?.contractorId || '');
    }
  };

  const handleNotificationSelect = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(notifId => notifId !== id)
        : [...prev, id]
    );
  };

  const handleSwipeAction = (id: string, action: 'read' | 'delete') => {
    if (action === 'read') {
      setNotifications(prev => prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      ));
    } else if (action === 'delete') {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }
  };

  const handleBulkActions = (action: 'read' | 'delete') => {
    if (action === 'read') {
      setNotifications(prev => prev.map(notif => 
        selectedNotifications.includes(notif.id) ? { ...notif, isRead: true } : notif
      ));
    } else if (action === 'delete') {
      setNotifications(prev => prev.filter(notif => !selectedNotifications.includes(notif.id)));
    }
    setSelectedNotifications([]);
    setIsSelectionMode(false);
  };

  const tabs = [
    {
      id: 'service' as TabType,
      label: 'Service Updates',
      icon: <Wrench size={20} />,
      color: '#007AFF',
      count: unreadCounts.service
    },
    {
      id: 'friend' as TabType,
      label: 'Friend Activity',
      icon: <Users size={20} />,
      color: '#10B981',
      count: unreadCounts.friend
    },
    {
      id: 'system' as TabType,
      label: 'System',
      icon: <Settings size={20} />,
      color: '#8B5CF6',
      count: unreadCounts.system
    }
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              onClick={onBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <ArrowLeft size={24} color="#1D1D1F" />
            </motion.button>
            
            <div>
              <h1 
                className="text-[24px] font-bold"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Notifications
              </h1>
              {totalUnread > 0 && (
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span 
                    className="text-[12px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    {totalUnread} unread
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <Filter size={20} color="#6B7280" />
            </button>
            
            {filteredNotifications.some(n => !n.isRead) && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
              >
                <span 
                  className="text-[14px] font-medium"
                  style={{ 
                    color: '#007AFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Mark all as read
                </span>
              </button>
            )}
          </div>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                      showUnreadOnly ? 'bg-blue-100 border border-blue-200' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      showUnreadOnly ? 'bg-blue-500 border-blue-500' : 'border-gray-400'
                    }`}>
                      {showUnreadOnly && <Check size={10} color="white" />}
                    </div>
                    <span 
                      className="text-[14px]"
                      style={{ 
                        color: showUnreadOnly ? '#007AFF' : '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      Show unread only
                    </span>
                  </button>
                </div>
                
                <button
                  onClick={() => setIsSelectionMode(!isSelectionMode)}
                  className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                >
                  <span 
                    className="text-[14px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    {isSelectionMode ? 'Cancel' : 'Select multiple'}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Tabs */}
        <div className="flex space-x-1 mt-4 bg-gray-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeTab === tab.id 
                  ? 'bg-white shadow-sm' 
                  : 'hover:bg-gray-200'
              }`}
            >
              <div style={{ color: activeTab === tab.id ? tab.color : '#6B7280' }}>
                {tab.icon}
              </div>
              <span 
                className="text-[14px] font-medium hidden sm:block"
                style={{ 
                  color: activeTab === tab.id ? '#1D1D1F' : '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {tab.label}
              </span>
              {tab.count > 0 && (
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: tab.color }}
                >
                  <span className="text-white text-[10px] font-bold">
                    {tab.count > 9 ? '9+' : tab.count}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {isSelectionMode && selectedNotifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border-b border-blue-100 px-5 py-3"
          >
            <div className="flex items-center justify-between">
              <span 
                className="text-[14px] font-medium"
                style={{ 
                  color: '#007AFF',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {selectedNotifications.length} selected
              </span>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleBulkActions('read')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                >
                  <Check size={16} color="#007AFF" />
                  <span 
                    className="text-[14px] font-medium"
                    style={{ 
                      color: '#007AFF',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Mark as read
                  </span>
                </button>
                
                <button
                  onClick={() => handleBulkActions('delete')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors duration-200"
                >
                  <Trash2 size={16} color="#DC2626" />
                  <span 
                    className="text-[14px] font-medium"
                    style={{ 
                      color: '#DC2626',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Delete
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications List */}
      <div className="flex-1 px-5 py-4">
        {filteredNotifications.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <Bell size={32} color="#9CA3AF" />
            </div>
            <h3 
              className="text-[18px] font-medium mb-2"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {showUnreadOnly ? 'You\'re all caught up!' : 'No notifications yet'}
            </h3>
            <p 
              className="text-[14px] mb-6"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {showUnreadOnly 
                ? 'All your notifications have been read' 
                : 'Turn on notifications to stay updated on your services'
              }
            </p>
            {!showUnreadOnly && (
              <button
                onClick={onNavigateToSettings}
                className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
              >
                <span 
                  className="text-white text-[14px] font-medium"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                >
                  Notification Settings
                </span>
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative"
              >
                <div 
                  className={`w-full bg-white rounded-xl p-4 border transition-all duration-200 cursor-pointer ${
                    !notification.isRead 
                      ? 'border-blue-200 bg-blue-50' 
                      : 'border-gray-100 hover:border-gray-200'
                  } ${
                    selectedNotifications.includes(notification.id)
                      ? 'ring-2 ring-blue-500 ring-opacity-50'
                      : ''
                  }`}
                  onClick={() => handleNotificationPress(notification)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Selection Checkbox */}
                    {isSelectionMode && (
                      <div className="mt-1">
                        <div 
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedNotifications.includes(notification.id)
                              ? 'bg-blue-500 border-blue-500'
                              : 'border-gray-300'
                          }`}
                        >
                          {selectedNotifications.includes(notification.id) && (
                            <Check size={12} color="white" />
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Icon/Avatar */}
                    <div className="flex-shrink-0">
                      {notification.avatar ? (
                        <img 
                          src={notification.avatar} 
                          alt="Friend"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            notification.type === 'service' 
                              ? 'bg-blue-100' 
                              : notification.type === 'friend'
                                ? 'bg-green-100'
                                : 'bg-purple-100'
                          }`}
                        >
                          {notification.icon}
                        </div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 
                            className="text-[16px] font-medium mb-1 truncate"
                            style={{ 
                              color: '#1D1D1F',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            {notification.title}
                          </h4>
                          <p 
                            className="text-[14px] leading-relaxed"
                            style={{ 
                              color: '#6B7280',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            {notification.description}
                          </p>
                          <p 
                            className="text-[12px] mt-2"
                            style={{ 
                              color: '#9CA3AF',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                            }}
                          >
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-3">
                          {/* Priority Indicator */}
                          {notification.priority === 'high' && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                          
                          {/* Unread Indicator */}
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          
                          {/* Action Arrow */}
                          {!isSelectionMode && (
                            <ChevronRight size={16} color="#9CA3AF" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions FAB */}
      {onNavigateToSettings && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          onClick={onNavigateToSettings}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
            boxShadow: '0 8px 24px rgba(0, 122, 255, 0.3)'
          }}
        >
          <Settings size={24} color="white" />
        </motion.button>
      )}
    </div>
  );
}
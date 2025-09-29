import { useState } from 'react';
import { Search, MessageCircle, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import fixRxLogo from 'figma:asset/3fb6e196b6099b5c44789eb56d35bb3516108cd0.png';

interface Conversation {
  id: string;
  vendorName: string;
  vendorService: string;
  vendorAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  projectStatus: 'quoted' | 'scheduled' | 'in-progress' | 'completed';
}

interface ChatListScreenProps {
  onSelectConversation: (conversation: Conversation) => void;
  userType: 'consumer' | 'vendor';
}

export function ChatListScreen({ onSelectConversation, userType }: ChatListScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: '1',
      vendorName: 'Mike Rodriguez',
      vendorService: 'Plumbing Service',
      vendorAvatar: 'https://images.unsplash.com/photo-1604118600242-e7a6d23ec3a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwbHVtYmVyJTIwY29udHJhY3RvciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzkxMjMxMnww&ixlib=rb-4.1.0&q=80&w=400',
      lastMessage: 'Sink installation complete ✓',
      lastMessageTime: new Date(Date.now() - 1800000), // 30 minutes ago
      unreadCount: 0,
      isOnline: true,
      projectStatus: 'in-progress'
    },
    {
      id: '2',
      vendorName: 'Sarah Chen',
      vendorService: 'Electrical Work',
      vendorAvatar: 'https://images.unsplash.com/photo-1594736797933-d0c6a4d70902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpY2lhbiUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU3OTEyMzEyfDA&ixlib=rb-4.1.0&q=80&w=400',
      lastMessage: 'I can start tomorrow morning at 9 AM',
      lastMessageTime: new Date(Date.now() - 7200000), // 2 hours ago
      unreadCount: 2,
      isOnline: false,
      projectStatus: 'scheduled'
    },
    {
      id: '3',
      vendorName: 'David Park',
      vendorService: 'HVAC Service',
      vendorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYmFjJTIwdGVjaG5pY2lhbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzkxMjMxMnww&ixlib=rb-4.1.0&q=80&w=400',
      lastMessage: 'Your heating system is working perfectly now',
      lastMessageTime: new Date(Date.now() - 86400000), // 1 day ago
      unreadCount: 0,
      isOnline: false,
      projectStatus: 'completed'
    },
    {
      id: '4',
      vendorName: 'Jessica Martinez',
      vendorService: 'Painting Service',
      vendorAvatar: 'https://images.unsplash.com/photo-1543132220-4bf3de6e10ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVyJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTc5MTIzMTJ8MA&ixlib=rb-4.1.0&q=80&w=400',
      lastMessage: 'Quote: $850 for living room painting',
      lastMessageTime: new Date(Date.now() - 172800000), // 2 days ago
      unreadCount: 1,
      isOnline: true,
      projectStatus: 'quoted'
    },
    {
      id: '5',
      vendorName: 'Alex Thompson',
      vendorService: 'Landscaping',
      vendorAvatar: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGVyJTIwbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU3OTEyMzEyfDA&ixlib=rb-4.1.0&q=80&w=400',
      lastMessage: 'Thank you for the great review!',
      lastMessageTime: new Date(Date.now() - 259200000), // 3 days ago
      unreadCount: 0,
      isOnline: false,
      projectStatus: 'completed'
    }
  ];

  const filteredConversations = conversations.filter(conversation =>
    conversation.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.vendorService.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return diffMins < 1 ? 'now' : `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quoted': return '#F59E0B';
      case 'scheduled': return '#007AFF';
      case 'in-progress': return '#7C3AED';
      case 'completed': return '#059669';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'quoted': return 'Quoted';
      case 'scheduled': return 'Scheduled';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return '';
    }
  };

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="relative pt-12 pb-6">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%)'
          }}
        />
        
        <div className="relative z-10 px-5">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <img 
                src={fixRxLogo} 
                alt="FixRx" 
                className="w-8 h-8"
              />
              <h1 
                className="text-[28px] font-bold"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Messages
              </h1>
              {totalUnreadCount > 0 && (
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#FF3B30' }}
                >
                  <span 
                    className="text-[12px] font-bold text-white"
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                  >
                    {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex items-center">
              <motion.button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                whileTap={{ scale: 0.95 }}
              >
                <MoreHorizontal size={20} color="#6B7280" />
              </motion.button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search size={16} color="#9CA3AF" />
            </div>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              style={{
                backgroundColor: '#F9FAFB',
                fontSize: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            />
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="px-5">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageCircle size={32} color="#9CA3AF" />
            </div>
            <h3 
              className="text-[18px] font-medium mb-2"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </h3>
            <p 
              className="text-[16px] text-center max-w-sm"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {searchQuery 
                ? 'Try searching for a different contractor or service'
                : 'Start a conversation with a contractor to see your messages here'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation, index) => (
              <motion.button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className="w-full bg-white rounded-2xl p-4 border border-gray-100 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar with Online Indicator */}
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full overflow-hidden">
                      <ImageWithFallback
                        src={conversation.vendorAvatar}
                        alt={conversation.vendorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {conversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Conversation Details */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 
                        className="font-bold text-[16px] truncate"
                        style={{ 
                          color: '#1D1D1F',
                          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                        }}
                      >
                        {conversation.vendorName}
                      </h3>
                      <div className="flex items-center space-x-2 ml-2">
                        {conversation.unreadCount > 0 && (
                          <div 
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#007AFF' }}
                          >
                            <span 
                              className="text-[10px] font-bold text-white"
                              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                            >
                              {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                            </span>
                          </div>
                        )}
                        <span 
                          className="text-[12px]"
                          style={{ 
                            color: '#9CA3AF',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {formatMessageTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p 
                          className="text-[14px] mb-1 truncate"
                          style={{ 
                            color: '#6B7280',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {conversation.vendorService}
                        </p>
                        <p 
                          className={`text-[14px] truncate ${conversation.unreadCount > 0 ? 'font-medium' : ''}`}
                          style={{ 
                            color: conversation.unreadCount > 0 ? '#1D1D1F' : '#9CA3AF',
                            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                          }}
                        >
                          {conversation.lastMessage}
                        </p>
                      </div>
                      
                      {/* Project Status */}
                      <div className="ml-2">
                        <div 
                          className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium"
                          style={{ 
                            backgroundColor: `${getStatusColor(conversation.projectStatus)}15`,
                            color: getStatusColor(conversation.projectStatus)
                          }}
                        >
                          {getStatusLabel(conversation.projectStatus)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
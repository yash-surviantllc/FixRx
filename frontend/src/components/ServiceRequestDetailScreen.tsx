import { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar,
  MessageSquare,
  Phone,
  Star,
  User,
  Camera,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { Badge } from './ui/badge';

interface ServiceRequestDetailScreenProps {
  onBack: () => void;
  onStartChat: (customerData: any) => void;
  requestId: string;
}

interface ServiceRequest {
  id: string;
  customerName: string;
  customerAvatar: string;
  customerRating: number;
  customerReviews: number;
  serviceType: string;
  urgency: 'ASAP' | 'This week' | 'Flexible';
  distance: string;
  description: string;
  detailedDescription: string;
  timestamp: string;
  budget: string;
  address: string;
  preferredTime: string;
  images?: string[];
  customerPhone: string;
  isVerified: boolean;
}

// Mock data - in real app this would come from props or API
const mockRequest: ServiceRequest = {
  id: '1',
  customerName: 'Sarah Chen',
  customerAvatar: '👩',
  customerRating: 4.8,
  customerReviews: 23,
  serviceType: 'Kitchen Sink Repair',
  urgency: 'ASAP',
  distance: '2.1 mi',
  description: 'Kitchen sink is completely clogged, water backing up',
  detailedDescription: 'My kitchen sink has been completely clogged for the past 2 days. Water is backing up into both sides of the double sink. I tried using a plunger and drain cleaner but nothing worked. There seems to be a blockage somewhere in the main drain line. The disposal is working fine, but water just won\'t drain at all. I need this fixed ASAP as I can\'t use my kitchen.',
  timestamp: '5 min ago',
  budget: '$100-200',
  address: '1234 Oak Street, San Francisco, CA',
  preferredTime: 'Today or tomorrow morning',
  images: [
    'https://images.unsplash.com/photo-1571935020276-d5c5b06eb43b?w=400',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'
  ],
  customerPhone: '+1 (555) 123-4567',
  isVerified: true
};

export function ServiceRequestDetailScreen({ onBack, onStartChat, requestId }: ServiceRequestDetailScreenProps) {
  const [request] = useState<ServiceRequest>(mockRequest);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [response, setResponse] = useState<'accept' | 'decline' | null>(null);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'ASAP': return '#FF3B30';
      case 'This week': return '#FF9500';
      case 'Flexible': return '#34C759';
      default: return '#6B7280';
    }
  };

  const handleStartChat = () => {
    const customerData = {
      id: 'chat-' + request.id,
      customerName: request.customerName,
      customerAvatar: request.customerAvatar,
      serviceType: request.serviceType,
      lastMessage: '',
      lastMessageTime: new Date(),
      unreadCount: 0,
      isOnline: true,
      projectStatus: 'pending',
      requestData: request
    };
    onStartChat(customerData);
  };

  const handleResponse = (responseType: 'accept' | 'decline') => {
    setResponse(responseType);
    // In real app, this would send the response to the backend
    console.log(`${responseType === 'accept' ? 'Accepting' : 'Declining'} request:`, requestId);
    
    if (responseType === 'accept') {
      // Auto-start chat when accepting
      setTimeout(() => {
        handleStartChat();
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <ArrowLeft size={24} color="#1D1D1F" />
          </motion.button>
          
          <h1 
            className="text-[20px] font-bold"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Service Request
          </h1>
          
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="px-5 py-6 pb-32">
        {/* Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-[24px]">{request.customerAvatar}</span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 
                  className="text-[18px] font-bold"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {request.customerName}
                </h2>
                {request.isVerified && (
                  <CheckCircle size={16} color="#34C759" />
                )}
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center space-x-1">
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <span 
                    className="text-[14px] font-medium"
                    style={{ 
                      color: '#1D1D1F',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    {request.customerRating}
                  </span>
                  <span 
                    className="text-[14px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    ({request.customerReviews} reviews)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin size={14} color="#6B7280" />
                  <span 
                    className="text-[14px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    {request.distance} away
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Clock size={14} color="#6B7280" />
                  <span 
                    className="text-[14px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    {request.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Service Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 
              className="text-[18px] font-bold"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {request.serviceType}
            </h3>
            
            <Badge
              style={{
                backgroundColor: getUrgencyColor(request.urgency),
                color: 'white',
                fontSize: '12px',
                padding: '4px 8px'
              }}
            >
              {request.urgency}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 
                className="text-[14px] font-medium mb-2"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Description
              </h4>
              <p 
                className="text-[14px] leading-relaxed"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {showFullDescription ? request.detailedDescription : request.description}
              </p>
              {request.detailedDescription !== request.description && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-[14px] font-medium mt-2 hover:underline"
                  style={{ color: '#007AFF' }}
                >
                  {showFullDescription ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <DollarSign size={16} color="#34C759" />
                  <span 
                    className="text-[14px] font-medium"
                    style={{ 
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Budget
                  </span>
                </div>
                <p 
                  className="text-[16px] font-bold"
                  style={{ 
                    color: '#34C759',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {request.budget}
                </p>
              </div>
              
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <Calendar size={16} color="#007AFF" />
                  <span 
                    className="text-[14px] font-medium"
                    style={{ 
                      color: '#374151',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Preferred Time
                  </span>
                </div>
                <p 
                  className="text-[14px]"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {request.preferredTime}
                </p>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <MapPin size={16} color="#F97316" />
                <span 
                  className="text-[14px] font-medium"
                  style={{ 
                    color: '#374151',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Location
                </span>
              </div>
              <p 
                className="text-[14px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {request.address}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Photos */}
        {request.images && request.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm mb-6"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Camera size={18} color="#6B7280" />
              <h3 
                className="text-[16px] font-bold"
                style={{ 
                  color: '#1D1D1F',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Photos ({request.images.length})
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {request.images.map((image, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={image} 
                    alt={`Issue photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Response Status */}
        {response && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl p-4 border mb-6 ${
              response === 'accept' 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              {response === 'accept' ? (
                <CheckCircle size={24} color="#34C759" />
              ) : (
                <XCircle size={24} color="#FF3B30" />
              )}
              <div>
                <h4 
                  className="text-[16px] font-bold mb-1"
                  style={{ 
                    color: response === 'accept' ? '#15803D' : '#DC2626',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {response === 'accept' ? 'Request Accepted!' : 'Request Declined'}
                </h4>
                <p 
                  className="text-[14px]"
                  style={{ 
                    color: response === 'accept' ? '#16A34A' : '#EF4444',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {response === 'accept' 
                    ? 'Starting conversation with customer...' 
                    : 'The customer has been notified'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom Actions */}
      {!response && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
          <div className="space-y-3">
            {/* Quick Actions */}
            <div className="flex space-x-3">
              <button
                onClick={handleStartChat}
                className="flex-1 h-12 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2"
                style={{ backgroundColor: 'white' }}
              >
                <MessageSquare size={18} color="#007AFF" />
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#007AFF',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' 
                  }}
                >
                  Message
                </span>
              </button>
              
              <button
                onClick={() => {
                  console.log('Calling customer:', request.customerPhone);
                  alert(`Calling ${request.customerName} at ${request.customerPhone}`);
                }}
                className="flex-1 h-12 rounded-xl border-2 border-green-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 flex items-center justify-center space-x-2"
                style={{ backgroundColor: 'white' }}
              >
                <Phone size={18} color="#34C759" />
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#34C759',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' 
                  }}
                >
                  Call
                </span>
              </button>
            </div>
            
            {/* Primary Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleResponse('decline')}
                className="flex-1 h-14 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center justify-center"
                style={{
                  backgroundColor: '#FF3B30',
                  boxShadow: '0 4px 16px rgba(255, 59, 48, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                }}
              >
                <span 
                  className="text-white text-[16px] font-medium"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                >
                  Decline
                </span>
              </button>
              
              <button
                onClick={() => handleResponse('accept')}
                className="flex-1 h-14 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
                  boxShadow: '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                }}
              >
                <span 
                  className="text-white text-[16px] font-medium"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                >
                  Accept & Chat
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
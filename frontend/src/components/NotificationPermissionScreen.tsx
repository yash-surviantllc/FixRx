import { useState } from 'react';
import { Bell, MessageCircle, Clock, Users, Shield, Check } from 'lucide-react';

interface NotificationPermissionScreenProps {
  onEnableNotifications: () => void;
  onMaybeLater: () => void;
  onSkip?: () => void;
  userName?: string;
  recentActivity?: {
    type: 'contractor_contact' | 'service_completed' | 'invitation_sent';
    contractorName?: string;
    serviceName?: string;
    date?: Date;
  };
}

export function NotificationPermissionScreen({ 
  onEnableNotifications, 
  onMaybeLater, 
  onSkip,
  userName = 'User',
  recentActivity = {
    type: 'contractor_contact',
    contractorName: 'Mike Rodriguez',
    date: new Date()
  }
}: NotificationPermissionScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      onEnableNotifications();
    } catch (error) {
      console.error('Error enabling notifications:', error);
    }
    setIsLoading(false);
  };

  const handleMaybeLater = async () => {
    setIsLoading(true);
    try {
      onMaybeLater();
    } catch (error) {
      console.error('Error in maybe later:', error);
    }
    setIsLoading(false);
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      onSkip?.();
    } catch (error) {
      console.error('Error in skip:', error);
    }
    setIsLoading(false);
  };

  const getContextMessage = () => {
    switch (recentActivity.type) {
      case 'contractor_contact':
        return `Since you just contacted ${recentActivity.contractorName}...`;
      case 'service_completed':
        return `Since you completed your ${recentActivity.serviceName}...`;
      case 'invitation_sent':
        return `Since you just sent contractor invitations...`;
      default:
        return `Since you're actively using FixRx...`;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23007AFF' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 px-5 py-12 pb-32">
        {/* Bell Icon */}
        <div className="text-center mb-8">
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
                boxShadow: '0 8px 32px rgba(0, 122, 255, 0.3)'
              }}
            >
              <Bell size={32} color="white" fill="white" />
            </div>
            
            {/* Badge */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">3</span>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mb-8">
          <h1 
            className="text-[28px] font-bold mb-4"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Stay updated on your services
          </h1>
          
          <p 
            className="text-[16px] mb-2"
            style={{ 
              color: '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            {getContextMessage()}
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm mb-6">
          <h2 
            className="text-[18px] font-bold mb-4"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Here's what you'll get notified about:
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mt-1 flex-shrink-0">
                <MessageCircle size={14} color="#007AFF" />
              </div>
              <p 
                className="text-[16px]"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Get notified when contractors respond to your requests
              </p>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 flex-shrink-0">
                <Clock size={14} color="#059669" />
              </div>
              <p 
                className="text-[16px]"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Track service progress and completion updates
              </p>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center mt-1 flex-shrink-0">
                <Users size={14} color="#F97316" />
              </div>
              <p 
                className="text-[16px]"
                style={{ 
                  color: '#374151',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                Discover newly recommended contractors from friends
              </p>
            </div>
          </div>
        </div>

        {/* Trust Elements */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 
            className="text-[16px] font-bold mb-4 flex items-center space-x-2"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            <Shield size={20} color="#059669" />
            <span>Your control & privacy</span>
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Check size={16} color="#059669" />
              <p 
                className="text-[14px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                You can change this anytime in Settings
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Check size={16} color="#059669" />
              <p 
                className="text-[14px]"
                style={{ 
                  color: '#6B7280',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                We only send relevant updates, never spam
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 pb-8">
        <div className="space-y-3">
          <button
            onClick={handleEnableNotifications}
            disabled={isLoading}
            className="w-full h-14 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-[0.98] flex items-center justify-center disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
              boxShadow: '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
            }}
          >
            <span 
              className="text-white text-[16px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              {isLoading ? 'Loading...' : 'Enable Notifications'}
            </span>
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={handleMaybeLater}
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl border-2 border-gray-300 bg-white hover:bg-gray-50 transition-all duration-200 active:scale-[0.98] flex items-center justify-center disabled:opacity-50"
            >
              <span 
                className="text-gray-600 text-[16px] font-medium"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
              >
                Maybe Later
              </span>
            </button>
            
            {onSkip && (
              <button
                onClick={handleSkip}
                disabled={isLoading}
                className="flex-1 h-12 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-all duration-200 active:scale-[0.98] flex items-center justify-center disabled:opacity-50"
              >
                <span 
                  className="text-gray-500 text-[16px] font-medium"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
                >
                  Skip
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
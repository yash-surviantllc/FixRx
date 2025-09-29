import { useState } from 'react';
import { Settings, Bell, HelpCircle, Shield, LogOut, ChevronRight, Star, Award, Calendar, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProfileScreenProps {
  userName: string;
  userEmail: string;
  userType: 'consumer' | 'vendor';
  userProfile?: any;
  onNavigateToNotifications: () => void;
  onNavigateToNotificationSettings: () => void;
  onLogout: () => void;
}

export function ProfileScreen({ 
  userName, 
  userEmail, 
  userType, 
  userProfile,
  onNavigateToNotifications,
  onNavigateToNotificationSettings,
  onLogout
}: ProfileScreenProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const profileImage = userType === 'vendor' 
    ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTc5MTIzMTJ8MA&ixlib=rb-4.1.0&q=80&w=400'
    : 'https://images.unsplash.com/photo-1494790108755-2616b612b330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwc21pbGluZ3xlbnwxfHx8fDE3NTc5MTIzMTJ8MA&ixlib=rb-4.1.0&q=80&w=400';

  const menuSections = [
    {
      title: 'Account',
      items: [
        { 
          icon: Bell, 
          label: 'Notifications', 
          action: onNavigateToNotifications,
          hasChevron: true 
        },
        { 
          icon: Settings, 
          label: 'Notification Settings', 
          action: onNavigateToNotificationSettings,
          hasChevron: true 
        },
        { 
          icon: Shield, 
          label: 'Privacy & Security', 
          action: () => console.log('Privacy settings'),
          hasChevron: true 
        },
      ]
    },
    {
      title: 'Support',
      items: [
        { 
          icon: HelpCircle, 
          label: 'Help Center', 
          action: () => console.log('Help center'),
          hasChevron: true 
        },
        { 
          icon: Shield, 
          label: 'Terms & Privacy', 
          action: () => console.log('Terms and privacy'),
          hasChevron: true 
        },
      ]
    }
  ];

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
          <h1 
            className="text-[28px] font-bold mb-8"
            style={{ 
              color: '#1D1D1F',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            Profile
          </h1>

          {/* Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <ImageWithFallback
                  src={profileImage}
                  alt={userName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h2 
                  className="text-[20px] font-bold mb-1"
                  style={{ 
                    color: '#1D1D1F',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {userName}
                </h2>
                <p 
                  className="text-[14px] mb-2"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  {userEmail}
                </p>
                <div 
                  className="inline-flex items-center px-2 py-1 rounded-full text-[12px] font-medium"
                  style={{ 
                    backgroundColor: userType === 'vendor' ? '#EFF6FF' : '#F0F9FF',
                    color: userType === 'vendor' ? '#1E40AF' : '#0369A1'
                  }}
                >
                  {userType === 'vendor' ? 'Contractor' : 'Consumer'}
                </div>
              </div>
            </div>

            {/* Stats for vendors */}
            {userType === 'vendor' && (
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Star size={16} color="#F59E0B" fill="#F59E0B" />
                    <span 
                      className="text-[16px] font-bold ml-1"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      4.9
                    </span>
                  </div>
                  <span 
                    className="text-[12px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Rating
                  </span>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Award size={16} color="#059669" />
                    <span 
                      className="text-[16px] font-bold ml-1"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      142
                    </span>
                  </div>
                  <span 
                    className="text-[12px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Jobs Done
                  </span>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Calendar size={16} color="#7C3AED" />
                    <span 
                      className="text-[16px] font-bold ml-1"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      8Y
                    </span>
                  </div>
                  <span 
                    className="text-[12px]"
                    style={{ 
                      color: '#6B7280',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                    }}
                  >
                    Experience
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="px-5 space-y-6">
        {menuSections.map((section, sectionIndex) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (sectionIndex + 1) }}
          >
            <h3 
              className="text-[14px] font-medium mb-3 uppercase tracking-wide"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              {section.title}
            </h3>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {section.items.map((item, itemIndex) => (
                <motion.button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 ${
                    itemIndex < section.items.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <item.icon size={20} color="#6B7280" />
                    <span 
                      className="text-[16px] font-medium"
                      style={{ 
                        color: '#1D1D1F',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  {item.hasChevron && (
                    <ChevronRight size={16} color="#9CA3AF" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Logout Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <motion.button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center p-4 hover:bg-red-50 transition-colors duration-200"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center">
                  <LogOut size={20} color="#DC2626" />
                </div>
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#DC2626',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Sign Out
                </span>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-5">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
          >
            <h3 
              className="text-[18px] font-bold mb-2 text-center"
              style={{ 
                color: '#1D1D1F',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Sign Out
            </h3>
            <p 
              className="text-[16px] text-center mb-6"
              style={{ 
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
              }}
            >
              Are you sure you want to sign out?
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 h-12 rounded-xl border-2 border-gray-200 transition-colors duration-200 hover:bg-gray-50 flex items-center justify-center"
              >
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    color: '#6B7280',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Cancel
                </span>
              </button>
              
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                className="flex-1 h-12 rounded-xl transition-colors duration-200 flex items-center justify-center"
                style={{
                  backgroundColor: '#DC2626',
                  color: 'white'
                }}
              >
                <span 
                  className="text-[16px] font-medium"
                  style={{ 
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                  }}
                >
                  Sign Out
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { Home, Users, MessageCircle, User } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavigationProps {
  activeTab: 'home' | 'contractors' | 'messages' | 'profile';
  onTabChange: (tab: 'home' | 'contractors' | 'messages' | 'profile') => void;
  userType?: 'consumer' | 'vendor';
}

export function BottomNavigation({ activeTab, onTabChange, userType = 'consumer' }: BottomNavigationProps) {
  const baseTabs = [
    {
      id: 'home' as const,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'messages' as const,
      label: 'Messages',
      icon: MessageCircle,
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
    },
  ];

  // Add contractors tab only for consumers
  const tabs = userType === 'consumer' 
    ? [
        baseTabs[0], // home
        {
          id: 'contractors' as const,
          label: 'Contractors',
          icon: Users,
        },
        baseTabs[1], // messages
        baseTabs[2], // profile
      ]
    : baseTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb z-50">
      <div className="flex items-center justify-around h-20 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center min-w-0 flex-1 py-2"
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <Icon 
                  size={24} 
                  color={isActive ? '#007AFF' : '#9CA3AF'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {/* Active indicator dot */}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: '#007AFF' }}
                  />
                )}
              </div>
              
              <span 
                className={`text-[11px] mt-1 font-medium transition-colors duration-200 ${
                  isActive ? 'text-[#007AFF]' : 'text-[#9CA3AF]'
                }`}
                style={{ 
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
                }}
              >
                {tab.label}
              </span>
              
              {/* Messages badge (example) */}
              {tab.id === 'messages' && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Safe area padding for iOS */}
      <div className="h-safe-area-inset-bottom bg-white" />
    </div>
  );
}
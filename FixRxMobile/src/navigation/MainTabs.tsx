import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { MainTabParamList } from '../types/navigation';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

// Screens
import ConsumerDashboard from '../screens/consumer/ConsumerDashboard';
import VendorDashboard from '../screens/vendor/VendorDashboard';
import AllRecommendationsScreen from '../screens/AllRecommendationsScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { userType } = useAppContext();
  const { theme, colors } = useTheme();
  const darkMode = theme === 'dark';

  console.log('=== MainTabs RENDERING ===');
  console.log('userType:', userType);
  console.log('theme:', theme);
  console.log('colors:', JSON.stringify(colors));
  console.log('VendorDashboard component:', VendorDashboard);
  console.log('ConsumerDashboard component:', ConsumerDashboard);

  // If userType is not set, default to vendor (since we're coming from vendor flow)
  const effectiveUserType = userType || 'vendor';
  console.log('Using effective userType:', effectiveUserType);
  console.log('Will render:', effectiveUserType === 'vendor' ? 'VendorDashboard' : 'ConsumerDashboard');

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Feather name="home" size={size} color={color} />;
          } else if (route.name === 'Contractors') {
            return <Feather name="search" size={size} color={color} />;
          } else if (route.name === 'Messages') {
            return <Feather name="message-square" size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <Feather name="user" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: darkMode ? '#9CA3AF' : 'gray',
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={effectiveUserType === 'vendor' ? VendorDashboard : ConsumerDashboard} 
      />
      {/* Only show Contractors tab for consumers */}
      {effectiveUserType === 'consumer' && (
        <Tab.Screen 
          name="Contractors" 
          component={AllRecommendationsScreen} 
        />
      )}
      <Tab.Screen 
        name="Messages" 
        component={ChatListScreen} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
      />
    </Tab.Navigator>
  );
}

export default MainTabs;

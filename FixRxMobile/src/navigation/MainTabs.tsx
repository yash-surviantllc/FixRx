import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { MainTabParamList } from '../types/navigation';
import { useAppContext } from '../context/AppContext';

// Screens
import ConsumerDashboard from '../screens/consumer/ConsumerDashboard';
import VendorDashboard from '../screens/vendor/VendorDashboard';
import AllRecommendationsScreen from '../screens/AllRecommendationsScreen';
import ChatListScreen from '../screens/ChatListScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { userType } = useAppContext();

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
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={userType === 'vendor' ? VendorDashboard : ConsumerDashboard} 
      />
      {/* Only show Contractors tab for consumers */}
      {userType === 'consumer' && (
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

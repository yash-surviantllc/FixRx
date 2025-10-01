/**
 * React Native Navigation Setup
 * Main navigation structure for the app
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { View, Text, Platform } from 'react-native';

// Import screens (these will be migrated versions)
// import EmailAuthScreen from '../screens/EmailAuthScreen.native';
// import ConsumerDashboard from '../screens/ConsumerDashboard.native';
// import VendorDashboard from '../screens/VendorDashboard.native';
// import ProfileScreen from '../screens/ProfileScreen.native';
// import NotificationCenterScreen from '../screens/NotificationCenterScreen.native';
// import MessagingScreen from '../screens/MessagingScreen.native';

// Type definitions for navigation
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  EmailAuth: undefined;
  EmailConfirmation: { email: string };
  UserTypeSelection: undefined;
  ConsumerProfileSetup: undefined;
  VendorProfileSetup: undefined;
  VendorServiceSelection: undefined;
  VendorPortfolioUpload: undefined;
  ServiceRating: { serviceId: string };
  RatingConfirmation: undefined;
  NotificationPermission: undefined;
  NotificationSettings: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Search: undefined;
  Messages: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Placeholder screens for demonstration
const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{title}</Text>
    <Text style={{ marginTop: 10, color: '#666' }}>Screen to be migrated</Text>
  </View>
);

// Main Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          paddingTop: 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={() => <PlaceholderScreen title="Dashboard" />}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
          headerTitle: 'Dashboard',
        }}
      />
      <Tab.Screen
        name="Search"
        component={() => <PlaceholderScreen title="Search" />}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
          headerTitle: 'Search',
        }}
      />
      <Tab.Screen
        name="Messages"
        component={() => <PlaceholderScreen title="Messages" />}
        options={{
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-square" size={size} color={color} />
          ),
          headerTitle: 'Messages',
          tabBarBadge: 3, // Example badge
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={() => <PlaceholderScreen title="Notifications" />}
        options={{
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Feather name="bell" size={size} color={color} />
          ),
          headerTitle: 'Notifications',
          tabBarBadge: 5, // Example badge
        }}
      />
      <Tab.Screen
        name="Profile"
        component={() => <PlaceholderScreen title="Profile" />}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
          headerTitle: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

// Auth Stack Navigator
function AuthStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FFFFFF' },
      }}
    >
      <Stack.Screen 
        name="EmailAuth" 
        component={() => <PlaceholderScreen title="Email Auth" />} 
      />
      <Stack.Screen 
        name="EmailConfirmation" 
        component={() => <PlaceholderScreen title="Email Confirmation" />} 
      />
      <Stack.Screen 
        name="UserTypeSelection" 
        component={() => <PlaceholderScreen title="User Type Selection" />} 
      />
      <Stack.Screen 
        name="ConsumerProfileSetup" 
        component={() => <PlaceholderScreen title="Consumer Profile Setup" />} 
      />
      <Stack.Screen 
        name="VendorProfileSetup" 
        component={() => <PlaceholderScreen title="Vendor Profile Setup" />} 
      />
      <Stack.Screen 
        name="VendorServiceSelection" 
        component={() => <PlaceholderScreen title="Service Selection" />} 
      />
      <Stack.Screen 
        name="VendorPortfolioUpload" 
        component={() => <PlaceholderScreen title="Portfolio Upload" />} 
      />
    </Stack.Navigator>
  );
}

// Root Navigator
export default function AppNavigator() {
  // This would typically check authentication state
  const isAuthenticated = false;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStackNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

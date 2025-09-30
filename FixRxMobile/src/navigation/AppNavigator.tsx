/**
 * React Native Navigation Setup
 * Main navigation structure for the app
 */

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Search, User, MessageSquare, Bell } from 'lucide-react-native';
import { View, Text, Platform } from 'react-native';
import PlaceholderScreen from '../screens/PlaceholderScreen';
import EmailAuthScreen from '../screens/auth/EmailAuthScreen';

// Create navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator (Main App)
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let Icon;

          if (route.name === 'Home') {
            Icon = Home;
          } else if (route.name === 'Search') {
            Icon = Search;
          } else if (route.name === 'Messages') {
            Icon = MessageSquare;
          } else if (route.name === 'Notifications') {
            Icon = Bell;
          } else if (route.name === 'Profile') {
            Icon = User;
          }

          return Icon ? <Icon size={size} color={color} /> : null;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingVertical: Platform.OS === 'ios' ? 10 : 0,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={PlaceholderScreen} 
        initialParams={{ title: 'Home Screen' }}
      />
      <Tab.Screen 
        name="Search" 
        component={PlaceholderScreen} 
        initialParams={{ title: 'Search Screen' }}
      />
      <Tab.Screen 
        name="Messages" 
        component={PlaceholderScreen} 
        initialParams={{ title: 'Messages Screen' }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={PlaceholderScreen} 
        initialParams={{ title: 'Notifications Screen' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={PlaceholderScreen} 
        initialParams={{ title: 'Profile Screen' }}
      />
    </Tab.Navigator>
  );
}

// Main App Navigator with Authentication Flow
function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleEmailSent = (email: string) => {
    console.log('Email sent to:', email);
    // In a real app, you would verify the magic link here
    // For now, we'll just set isAuthenticated to true
    setIsAuthenticated(true);
  };

  const handleBack = () => {
    // Handle back navigation if needed
    console.log('Back button pressed');
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="EmailAuth" component={EmailAuthScreen} />
        ) : (
          <Stack.Screen 
            name="MainTabs" 
            component={MainTabs} 
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

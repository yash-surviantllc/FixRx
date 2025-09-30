import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/context/AppContext';

// Auth Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import EmailAuthScreen from './src/screens/auth/EmailAuthScreen';
import EmailConfirmationScreen from './src/screens/auth/EmailConfirmationScreen';
import UserTypeSelectionScreen from './src/screens/auth/UserTypeSelectionScreen';

// Consumer Screens
import ConsumerProfileSetupScreen from './src/screens/consumer/ConsumerProfileSetupScreen';

// Vendor Screens
import VendorProfileSetupScreen from './src/screens/vendor/VendorProfileSetupScreen';
import VendorServiceSelectionScreen from './src/screens/vendor/VendorServiceSelectionScreen';
import VendorPortfolioUploadScreen from './src/screens/vendor/VendorPortfolioUploadScreen';

// Main App Navigation
import MainTabs from './src/navigation/MainTabs';

// Create a stack navigator
const Stack = createNativeStackNavigator();

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator 
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false,
              animation: 'fade',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
          >
            {/* Auth Flow */}
            <Stack.Screen 
              name="Welcome" 
              component={WelcomeScreen} 
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen 
              name="EmailAuth" 
              component={EmailAuthScreen} 
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="EmailConfirmation" 
              component={EmailConfirmationScreen} 
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="UserType" 
              component={UserTypeSelectionScreen} 
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
            
            {/* Consumer Onboarding */}
            <Stack.Screen 
              name="ConsumerProfile" 
              component={ConsumerProfileSetupScreen} 
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
            
            {/* Vendor Onboarding */}
            <Stack.Screen 
              name="VendorProfileSetup" 
              component={VendorProfileSetupScreen} 
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="VendorServiceSelection" 
              component={VendorServiceSelectionScreen} 
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="VendorPortfolioUpload" 
              component={VendorPortfolioUploadScreen} 
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
            
            {/* Main App */}
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs} 
              options={{
                gestureEnabled: false,
                animation: 'fade',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

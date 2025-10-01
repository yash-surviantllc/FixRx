import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/context/AppContext';
import { ThemeProvider } from './src/context/ThemeContext';


// Auth Screens
import WelcomeScreen from './src/screens/WelcomeScreen';
import EmailAuthScreen from './src/screens/auth/EmailAuthScreen';
import EmailConfirmationScreen from './src/screens/auth/EmailConfirmationScreen';
import UserTypeSelectionScreen from './src/screens/auth/UserTypeSelectionScreen';
import EmailLoginScreen from './src/screens/EmailLoginScreen';
import CheckEmailScreen from './src/screens/CheckEmailScreen';
import UserTypeSelection from './src/screens/UserTypeSelectionScreen';
import Toast from "react-native-toast-message";


// Consumer Screens
import ConsumerProfileSetupScreen from './src/screens/consumer/ConsumerProfileSetupScreen';

// Vendor Screens
import VendorProfileSetupScreen from './src/screens/vendor/VendorProfileSetupScreen';
import VendorServiceSelectionScreen from './src/screens/vendor/VendorServiceSelectionScreen';
import VendorPortfolioUploadScreen from './src/screens/vendor/VendorPortfolioUploadScreen';
import VendorInvitationScreen from './src/screens/vendor/VendorInvitationScreen';
import AppointmentsScreen from './src/screens/vendor/AppointmentsScreen';
import EarningsScreen from './src/screens/vendor/EarningsScreen';
import ClientsScreen from './src/screens/vendor/ClientsScreen';
import ScheduleScreen from './src/screens/vendor/ScheduleScreen';
import NotificationsScreen from './src/screens/vendor/NotificationsScreen';
import ServiceRequestDetailScreen from './src/screens/vendor/ServiceRequestDetailScreen';

// Messaging Screens
import MessagingScreen from './src/screens/MessagingScreen';

// Main App Navigation
import MainTabs from './src/navigation/MainTabs';

// Settings Screens
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen';
import SecuritySettingsScreen from './src/screens/SecuritySettingsScreen';
import HelpCenterScreen from './src/screens/HelpCenterScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';

// Create a stack navigator
const Stack = createNativeStackNavigator();

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppProvider>
          <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator 
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
              animationDuration: 200,
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
            <Stack.Screen 
              name="EmailLogin" 
              component={EmailLoginScreen} 
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="CheckEmail" 
              component={CheckEmailScreen} 
              options={{
                gestureEnabled: true,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="UserTypeSelection" 
              component={UserTypeSelection} 
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
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen 
              name="VendorInvitation" 
              component={VendorInvitationScreen} 
              options={{ gestureEnabled: false }}
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
            
            {/* Vendor Dashboard Screens */}
            <Stack.Screen 
              name="VendorAppointments" 
              component={AppointmentsScreen} 
            />
            <Stack.Screen 
              name="VendorEarnings" 
              component={EarningsScreen} 
            />
            <Stack.Screen 
              name="VendorClients" 
              component={ClientsScreen} 
            />
            <Stack.Screen 
              name="VendorSchedule" 
              component={ScheduleScreen} 
            />
            <Stack.Screen 
              name="VendorNotifications" 
              component={NotificationsScreen} 
            />
            <Stack.Screen 
              name="ServiceRequestDetail" 
              component={ServiceRequestDetailScreen} 
            />
            <Stack.Screen 
              name="Messaging" 
              component={MessagingScreen} 
            />
            
            {/* Settings Screens */}
            <Stack.Screen 
              name="PaymentMethods" 
              component={PaymentMethodsScreen} 
            />
            <Stack.Screen 
              name="SecuritySettings" 
              component={SecuritySettingsScreen} 
            />
            <Stack.Screen 
              name="HelpCenter" 
              component={HelpCenterScreen} 
            />
            <Stack.Screen 
              name="AboutUs" 
              component={AboutUsScreen} 
            />
          </Stack.Navigator>
          </NavigationContainer>
          <Toast />
        </AppProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

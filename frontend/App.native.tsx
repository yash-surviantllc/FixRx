/**
 * React Native App Entry Point
 * Main application component
 */

import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { Toaster } from './src/components/ui/sonner';

// If you're using any global providers (theme, auth, etc.), wrap them here
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#FFFFFF"
      />
      <AppNavigator />
      <Toaster />
    </SafeAreaProvider>
  );
}

import React, { useEffect } from 'react';
import { Mail, Chrome } from 'lucide-react';
// import fixRxLogo from 'figma:asset/3fb6e196b6099b5c44789eb56d35bb3516108cd0.png';

// Integrated components
import { IntegratedEmailAuthScreen } from './components/IntegratedEmailAuthScreen';
import { UserTypeSelectionScreen } from './components/UserTypeSelectionScreen';
import { ConsumerProfileSetupScreen } from './components/ConsumerProfileSetupScreen';
import { IntegratedConsumerDashboard } from './components/IntegratedConsumerDashboard';
import { VendorProfileScreen } from './components/VendorProfileScreen';
import { VendorProfileSetupScreen } from './components/VendorProfileSetupScreen';
import { VendorServiceSelectionScreen } from './components/VendorServiceSelectionScreen';
import { VendorPortfolioUploadScreen } from './components/VendorPortfolioUploadScreen';
import { IntegratedVendorDashboard } from './components/IntegratedVendorDashboard';

// Other screens (to be integrated later)
import { ServiceRatingScreen } from './components/ServiceRatingScreen';
import { RatingConfirmationScreen } from './components/RatingConfirmationScreen';
import { ServiceRequestDetailScreen } from './components/ServiceRequestDetailScreen';
import { ContractorInvitationScreen } from './components/ContractorInvitationScreen';
import { ContactSelectionScreen } from './components/ContactSelectionScreen';
import { InvitationPreviewScreen } from './components/InvitationPreviewScreen';
import { InvitationConfirmationScreen } from './components/InvitationConfirmationScreen';
import { NotificationPermissionScreen } from './components/NotificationPermissionScreen';
import { NotificationCenterScreen } from './components/NotificationCenterScreen';
import { NotificationSettingsScreen } from './components/NotificationSettingsScreen';
import { MessagingScreen } from './components/MessagingScreen';
import { AllRecommendationsScreen } from './components/AllRecommendationsScreen';
import { FriendsUsingVendorScreen } from './components/FriendsUsingVendorScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { ProfileScreen } from './components/ProfileScreen';
import { ChatListScreen } from './components/ChatListScreen';
import { ProgressFlowDemo } from './components/ProgressFlowDemo';

// Hooks and stores
import { useAuth } from './hooks/useAuth';
import { useAppStore } from './store/app.store';
import { UserRole } from './types/api';

// Facebook Icon Component
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function IntegratedApp() {
  const { user, isAuthenticated, isLoading, isConsumer, isVendor, hasProfile, logout } = useAuth();
  const { 
    currentScreen, 
    setCurrentScreen, 
    activeTab, 
    setActiveTab,
    selectedContacts,
    setSelectedContacts,
    clearSelectedContacts 
  } = useAppStore();

  // Initialize screen based on auth state
  useEffect(() => {
    console.log('🔍 Auth state changed:', {
      isAuthenticated,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
      hasProfile,
      isConsumer,
      isVendor,
      currentScreen,
      isLoading
    });

    try {
      if (isAuthenticated && user && user.role) {
        console.log('✅ User authenticated, checking profile...');
        if (!hasProfile) {
          // User needs to complete profile setup
          console.log('📝 No profile found, redirecting to profile setup...');
          if (isConsumer) {
            console.log('👤 Setting screen to consumerProfile');
            setCurrentScreen('consumerProfile');
          } else if (isVendor) {
            console.log('🏢 Setting screen to vendorProfileSetup');
            setCurrentScreen('vendorProfileSetup');
          }
        } else {
          // User has profile, go to dashboard
          console.log('🏠 Profile exists, redirecting to dashboard...');
          if (isConsumer) {
            console.log('👤 Setting screen to consumerDashboard');
            setCurrentScreen('consumerDashboard');
          } else if (isVendor) {
            console.log('🏢 Setting screen to vendorDashboard');
            setCurrentScreen('vendorDashboard');
          }
        }
      } else if (!isAuthenticated && currentScreen !== 'welcome' && currentScreen !== 'email' && currentScreen !== 'userType') {
        console.log('❌ Not authenticated, redirecting to welcome...');
        setCurrentScreen('welcome');
      } else {
        console.log('⏳ Waiting for authentication or already on correct screen...');
      }
    } catch (error) {
      console.error('Error in useEffect:', error);
      setCurrentScreen('welcome');
    }
  }, [isAuthenticated, user, hasProfile, isConsumer, isVendor, currentScreen, setCurrentScreen, isLoading]);

  const handleAuth = (buttonType: string) => {
    if (buttonType === 'email') {
      setCurrentScreen('email');
    } else {
      setCurrentScreen('userType');
    }
  };

  const handleTabChange = (tab: 'home' | 'contractors' | 'messages' | 'profile') => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'home':
        setCurrentScreen(isVendor ? 'vendorDashboard' : 'consumerDashboard');
        break;
      case 'contractors':
        setCurrentScreen('allRecommendations');
        break;
      case 'messages':
        setCurrentScreen('chatList');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentScreen('welcome');
    setActiveTab('home');
    clearSelectedContacts();
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Determine if bottom navigation should be shown
  const showBottomNav = currentScreen === 'consumerDashboard' || 
                       currentScreen === 'vendorDashboard' || 
                       currentScreen === 'allRecommendations' ||
                       currentScreen === 'messaging' || 
                       currentScreen === 'chatList' || 
                       currentScreen === 'profile';

  // Welcome Screen
  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
          {/* Logo */}
          <div className="mb-12">
            <div className="w-32 h-32 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-white">F</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to FixRx</h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Connect with trusted contractors and manage your home services with ease
            </p>
          </div>

          {/* Auth Buttons */}
          <div className="w-full max-w-sm space-y-4">
            <button
              onClick={() => handleAuth('email')}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-3 hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Continue with Email</span>
            </button>

            <button
              onClick={() => handleAuth('google')}
              className="w-full bg-white border border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            <button
              onClick={() => handleAuth('facebook')}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold flex items-center justify-center space-x-3 hover:bg-blue-700 transition-colors"
            >
              <FacebookIcon />
              <span>Continue with Facebook</span>
            </button>
          </div>

          {/* Terms */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              By continuing, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Authentication Screen
  if (currentScreen === 'email') {
    return (
      <IntegratedEmailAuthScreen 
        onBack={() => setCurrentScreen('welcome')} 
        onSuccess={() => {
          // Success handled by useEffect above
        }}
        mode="login"
      />
    );
  }

  // User Type Selection
  if (currentScreen === 'userType') {
    return (
      <UserTypeSelectionScreen 
        onUserTypeSelected={(type) => {
          setCurrentScreen('email');
        }}
      />
    );
  }

  // Consumer Profile Setup
  if (currentScreen === 'consumerProfile') {
    return (
      <ConsumerProfileSetupScreen 
        onBack={() => setCurrentScreen('userType')}
        onContinue={(profileData) => {
          console.log('Profile data:', profileData);
          setCurrentScreen('consumerDashboard');
        }}
      />
    );
  }

  // Consumer Dashboard
  if (currentScreen === 'consumerDashboard') {
    return (
      <>
        <IntegratedConsumerDashboard 
          onViewContractor={() => setCurrentScreen('vendorProfile')}
          onRateService={() => setCurrentScreen('serviceRating')}
          onViewNotifications={() => setCurrentScreen('notificationCenter')}
          onSeeAllRecommendations={() => setCurrentScreen('allRecommendations')}
          onInviteContractors={() => setCurrentScreen('contractorInvitation')}
          onInviteFriends={() => setCurrentScreen('contractorInvitation')}
        />
        {showBottomNav && (
          <BottomNavigation 
            activeTab={activeTab as 'home' | 'contractors' | 'messages' | 'profile'} 
            onTabChange={handleTabChange}
            userType={isVendor ? 'vendor' : 'consumer'}
          />
        )}
      </>
    );
  }

  // Vendor Profile Setup
  if (currentScreen === 'vendorProfileSetup') {
    return (
      <VendorProfileSetupScreen 
        onBack={() => setCurrentScreen('userType')}
        onContinue={(profileData) => {
          console.log('Vendor profile data:', profileData);
          setCurrentScreen('vendorServiceSelection');
        }}
      />
    );
  }

  // Vendor Service Selection
  if (currentScreen === 'vendorServiceSelection') {
    return (
      <VendorServiceSelectionScreen 
        onContinue={(selectedServices) => {
          console.log('Selected services:', selectedServices);
          setCurrentScreen('vendorPortfolioUpload');
        }}
        onBack={() => setCurrentScreen('vendorProfileSetup')}
      />
    );
  }

  // Vendor Portfolio Upload
  if (currentScreen === 'vendorPortfolioUpload') {
    return (
      <VendorPortfolioUploadScreen 
        onComplete={(portfolioData) => {
          console.log('Portfolio data:', portfolioData);
          setCurrentScreen('vendorDashboard');
        }}
        onBack={() => setCurrentScreen('vendorServiceSelection')}
        onSkip={() => setCurrentScreen('vendorDashboard')}
      />
    );
  }

  // Vendor Dashboard
  if (currentScreen === 'vendorDashboard') {
    return (
      <>
        <IntegratedVendorDashboard />
        {showBottomNav && (
          <BottomNavigation 
            activeTab={activeTab as 'home' | 'contractors' | 'messages' | 'profile'} 
            onTabChange={handleTabChange}
            userType="vendor"
          />
        )}
      </>
    );
  }

  // Other screens (keeping original implementations for now)
  // These will be integrated in subsequent updates

  if (currentScreen === 'progressDemo') {
    return <ProgressFlowDemo />;
  }

  // Default fallback
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Screen Not Found</h2>
        <p className="text-gray-600 mb-4">Current screen: {currentScreen}</p>
        <button
          onClick={() => setCurrentScreen('welcome')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Go to Welcome
        </button>
      </div>
    </div>
  );
}

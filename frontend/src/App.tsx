import { useState } from 'react';
import { Mail, Chrome } from 'lucide-react';
import fixRxLogo from 'figma:asset/3fb6e196b6099b5c44789eb56d35bb3516108cd0.png';
import { EmailAuthScreen } from './components/EmailAuthScreen';
import { EmailConfirmationScreen } from './components/EmailConfirmationScreen';
import { UserTypeSelectionScreen } from './components/UserTypeSelectionScreen';
import { ConsumerProfileSetupScreen } from './components/ConsumerProfileSetupScreen';
import { ConsumerDashboard } from './components/ConsumerDashboard';
import { VendorProfileScreen } from './components/VendorProfileScreen';
import { VendorProfileSetupScreen } from './components/VendorProfileSetupScreen';
import { VendorServiceSelectionScreen } from './components/VendorServiceSelectionScreen';
import { VendorPortfolioUploadScreen } from './components/VendorPortfolioUploadScreen';
import { VendorDashboard } from './components/VendorDashboard';
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

// Facebook Icon Component
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'email' | 'confirmation' | 'userType' | 'consumerProfile' | 'consumerDashboard' | 'allRecommendations' | 'friendsUsingVendor' | 'vendorProfile' | 'vendorProfileSetup' | 'vendorServiceSelection' | 'vendorPortfolioUpload' | 'vendorDashboard' | 'contractorInvitation' | 'contactSelection' | 'invitationPreview' | 'invitationConfirmation' | 'notificationPermission' | 'notificationCenter' | 'notificationSettings' | 'serviceRating' | 'ratingConfirmation' | 'messaging' | 'chatList' | 'profile' | 'progressDemo' | 'serviceRequestDetail'>('consumerDashboard');
  const [activeTab, setActiveTab] = useState<'home' | 'contractors' | 'messages' | 'profile'>('home');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userType, setUserType] = useState<'consumer' | 'vendor' | null>('consumer');
  const [userProfile, setUserProfile] = useState<any>({ fullName: 'John Smith', metroArea: 'San Francisco' });
  const [submittedReview, setSubmittedReview] = useState<any>(null);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [invitationType, setInvitationType] = useState<'contractors' | 'friends' | null>(null);
  const [hasContactedContractor, setHasContactedContractor] = useState(false);
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);
  const [previousScreen, setPreviousScreen] = useState<string>('consumerDashboard');
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');

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
        setCurrentScreen(userType === 'vendor' ? 'vendorDashboard' : 'consumerDashboard');
        break;
      case 'contractors':
        setPreviousScreen(userType === 'vendor' ? 'vendorDashboard' : 'consumerDashboard');
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

  const handleLogout = () => {
    // Reset all state
    setCurrentScreen('welcome');
    setUserEmail('');
    setUserType(null);
    setUserProfile(null);
    setActiveTab('home');
    setSubmittedReview(null);
    setSelectedContacts([]);
    setInvitationType(null);
    setSelectedConversation(null);
    setHasContactedContractor(false);
    setNotificationPermissionGranted(false);
    setPreviousScreen('consumerDashboard');
    setSelectedRequestId('');
  };

  // Determine if bottom navigation should be shown
  const showBottomNav = currentScreen === 'consumerDashboard' || 
                       currentScreen === 'vendorDashboard' || 
                       (currentScreen === 'allRecommendations' && userType === 'consumer') ||
                       currentScreen === 'messaging' || 
                       currentScreen === 'chatList' || 
                       currentScreen === 'profile';

  if (currentScreen === 'progressDemo') {
    return <ProgressFlowDemo />;
  }

  if (currentScreen === 'email') {
    return (
      <EmailAuthScreen 
        onBack={() => setCurrentScreen('welcome')} 
        onEmailSent={(email) => {
          setUserEmail(email);
          setCurrentScreen('confirmation');
        }}
      />
    );
  }

  if (currentScreen === 'confirmation') {
    return (
      <EmailConfirmationScreen 
        email={userEmail}
        onBack={() => setCurrentScreen('welcome')}
        onUseDifferentEmail={() => setCurrentScreen('email')}
        onEmailVerified={() => setCurrentScreen('userType')}
      />
    );
  }

  if (currentScreen === 'userType') {
    return (
      <UserTypeSelectionScreen 
        onUserTypeSelected={(type) => {
          setUserType(type);
          if (type === 'consumer') {
            setCurrentScreen('consumerProfile');
          } else {
            setCurrentScreen('vendorProfileSetup');
          }
        }}
      />
    );
  }

  if (currentScreen === 'consumerProfile') {
    return (
      <ConsumerProfileSetupScreen 
        onBack={() => setCurrentScreen('userType')}
        onContinue={(profileData) => {
          setUserProfile(profileData);
          setCurrentScreen('consumerDashboard');
        }}
      />
    );
  }

  if (currentScreen === 'vendorProfileSetup') {
    return (
      <VendorProfileSetupScreen 
        onBack={() => setCurrentScreen('userType')}
        onContinue={(profileData) => {
          setUserProfile(profileData);
          setCurrentScreen('vendorServiceSelection');
        }}
        userEmail={userEmail}
      />
    );
  }

  if (currentScreen === 'vendorServiceSelection') {
    return (
      <VendorServiceSelectionScreen 
        onBack={() => setCurrentScreen('vendorProfileSetup')}
        onContinue={(selectedServices) => {
          setUserProfile(prev => ({ ...prev, services: selectedServices }));
          setCurrentScreen('vendorPortfolioUpload');
        }}
      />
    );
  }

  if (currentScreen === 'vendorPortfolioUpload') {
    return (
      <VendorPortfolioUploadScreen 
        onBack={() => setCurrentScreen('vendorServiceSelection')}
        onComplete={(portfolioData) => {
          setUserProfile(prev => ({ ...prev, portfolio: portfolioData }));
          setCurrentScreen('vendorDashboard');
        }}
        onSkip={() => {
          setCurrentScreen('vendorDashboard');
        }}
      />
    );
  }

  if (currentScreen === 'vendorDashboard') {
    return (
      <div className="relative">
        <VendorDashboard 
          vendorName={userProfile?.firstName || 'Mike'}
          onNavigateToMessages={() => {
            setCurrentScreen('chatList');
            setActiveTab('messages');
          }}
          onViewRequest={(requestId) => {
            setSelectedRequestId(requestId);
            setCurrentScreen('serviceRequestDetail');
          }}
          onInviteContractors={() => {
            setInvitationType('contractors');
            setCurrentScreen('contactSelection');
          }}
          onViewNotifications={() => setCurrentScreen('notificationCenter')}
        />
        {showBottomNav && (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            userType={userType || 'consumer'}
          />
        )}
      </div>
    );
  }



  if (currentScreen === 'contractorInvitation') {
    return (
      <ContractorInvitationScreen 
        onBack={() => {
          if (userType === 'vendor') {
            setCurrentScreen('vendorDashboard');
          } else {
            setCurrentScreen('consumerDashboard');
          }
        }}
        onAccessContacts={() => setCurrentScreen('contactSelection')}
        vendorName={userProfile?.firstName || 'Mike'}
      />
    );
  }

  if (currentScreen === 'contactSelection') {
    return (
      <ContactSelectionScreen 
        onBack={() => {
          if (userType === 'vendor') {
            setCurrentScreen('vendorDashboard');
          } else {
            setCurrentScreen('consumerDashboard');
          }
        }}
        onContactsSelected={(contacts) => {
          setSelectedContacts(contacts);
          setCurrentScreen('invitationPreview');
        }}
        invitationType={invitationType || 'contractors'}
        vendorName={userProfile?.firstName || 'Mike'}
      />
    );
  }

  if (currentScreen === 'invitationPreview') {
    return (
      <InvitationPreviewScreen 
        onBack={() => setCurrentScreen('contactSelection')}
        onSendInvitations={(customization) => {
          console.log('Sending invitations with customization:', customization);
          setCurrentScreen('invitationConfirmation');
        }}
        selectedContacts={selectedContacts}
        invitationType={invitationType || 'contractors'}
        vendorName={userProfile?.firstName || 'Mike'}
        vendorProfile={{
          firstName: userProfile?.firstName || 'Mike',
          lastName: userProfile?.lastName || 'Rodriguez',
          rating: 4.9,
          yearsExperience: 8,
          services: userProfile?.services || ['Plumbing', 'Emergency Repairs']
        }}
      />
    );
  }

  if (currentScreen === 'invitationConfirmation') {
    const sentInvitations = selectedContacts.map((contact, index) => ({
      id: contact.id,
      contactName: contact.name,
      phone: contact.phone,
      status: index === selectedContacts.length - 1 ? 'sending' : 'delivered' as 'delivered' | 'sending' | 'failed',
      sentAt: new Date(),
      messagePreview: `Hi ${contact.name}! I'm ${userProfile?.firstName || 'Mike'}, using FixRx to connect...`
    }));

    return (
      <InvitationConfirmationScreen 
        onBackToDashboard={() => {
          if (userType === 'vendor') {
            setCurrentScreen('vendorDashboard');
          } else {
            setCurrentScreen('consumerDashboard');
          }
        }}
        onInviteMore={() => {
          setInvitationType('contractors');
          setCurrentScreen('contactSelection');
        }}
        onViewHistory={() => {
          console.log('Viewing invitation history');
          alert('Viewing invitation history...');
        }}
        onViewReferralDashboard={() => {
          console.log('Viewing referral dashboard');
          alert('Viewing referral dashboard...');
        }}
        sentInvitations={sentInvitations}
        totalEarnings={selectedContacts.length * 50}
        vendorName={userProfile?.firstName || userProfile?.fullName?.split(' ')[0] || 'User'}
      />
    );
  }

  if (currentScreen === 'consumerDashboard') {
    return (
      <div className="relative">
        <ConsumerDashboard 
          userName={userProfile?.fullName?.split(' ')[0] || 'User'}
          userLocation={userProfile?.metroArea || 'Your City'}
          onViewContractor={() => setCurrentScreen('vendorProfile')}
          onRateService={() => setCurrentScreen('serviceRating')}
          onViewNotifications={() => setCurrentScreen('notificationCenter')}
          onSeeAllRecommendations={() => {
            console.log('Navigating to all recommendations');
            setPreviousScreen('consumerDashboard');
            setCurrentScreen('allRecommendations');
            setActiveTab('contractors');
          }}
          onInviteContractors={() => {
            setInvitationType('contractors');
            setCurrentScreen('contactSelection');
          }}
          onInviteFriends={() => {
            setInvitationType('friends');
            setCurrentScreen('contactSelection');
          }}
        />
        {showBottomNav && (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            userType={userType || 'consumer'}
          />
        )}
      </div>
    );
  }

  if (currentScreen === 'allRecommendations') {
    return (
      <div className="relative">
        <AllRecommendationsScreen 
          onBack={() => {
            setCurrentScreen(previousScreen as any);
            setActiveTab('home');
          }}
          onViewContractor={() => setCurrentScreen('vendorProfile')}
          userName={userProfile?.fullName?.split(' ')[0] || 'User'}
          userLocation={userProfile?.metroArea || 'Your City'}
        />
        {showBottomNav && (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            userType={userType || 'consumer'}
          />
        )}
      </div>
    );
  }

  if (currentScreen === 'friendsUsingVendor') {
    return (
      <FriendsUsingVendorScreen 
        onBack={() => {
          setCurrentScreen(previousScreen as any);
        }}
        onContactFriend={(friendId) => {
          console.log('Contacting friend:', friendId);
          // Navigate to messaging with friend
          setSelectedConversation({
            id: `friend-${friendId}`,
            vendorName: 'Friend',
            vendorService: 'Personal Message',
            vendorAvatar: '',
            lastMessage: '',
            lastMessageTime: new Date(),
            unreadCount: 0,
            isOnline: true,
            projectStatus: 'quoted'
          });
          setCurrentScreen('messaging');
        }}
        vendorName="Mike Rodriguez"
      />
    );
  }

  if (currentScreen === 'vendorProfile') {
    return (
      <VendorProfileScreen 
        onBack={() => setCurrentScreen('consumerDashboard')}
        onStartConversation={() => {
          setHasContactedContractor(true);
          // Create a conversation object for the vendor
          setSelectedConversation({
            id: 'new-conversation',
            vendorName: 'Mike Rodriguez',
            vendorService: 'Plumbing Service',
            vendorAvatar: 'https://images.unsplash.com/photo-1604118600242-e7a6d23ec3a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwbHVtYmVyJTIwY29udHJhY3RvciUyMHBvcnRyYWl0fGVufDF8fHx8MTc1NzkxMjMxMnww&ixlib=rb-4.1.0&q=80&w=400',
            lastMessage: '',
            lastMessageTime: new Date(),
            unreadCount: 0,
            isOnline: true,
            projectStatus: 'quoted'
          });
          setCurrentScreen('messaging');
        }}
        onQuickCall={() => {
          console.log('Initiating quick call with contractor');
          setHasContactedContractor(true);
          if (!notificationPermissionGranted) {
            setCurrentScreen('notificationPermission');
          }
        }}
        onSeeAllRecommendations={() => {
          console.log('Navigating to friends using vendor from vendor profile');
          setPreviousScreen('vendorProfile');
          setCurrentScreen('friendsUsingVendor');
        }}
      />
    );
  }

  if (currentScreen === 'serviceRating') {
    return (
      <ServiceRatingScreen 
        onBack={() => setCurrentScreen('consumerDashboard')}
        onSubmitReview={(reviewData) => {
          console.log('Service review submitted:', reviewData);
          setSubmittedReview(reviewData);
          setCurrentScreen('ratingConfirmation');
        }}
        onSkipReview={() => {
          console.log('Service review skipped');
          setCurrentScreen('consumerDashboard');
        }}
        serviceName="Plumbing service"
        vendorName="Mike Rodriguez"
        completionDate={new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      />
    );
  }

  if (currentScreen === 'ratingConfirmation') {
    return (
      <RatingConfirmationScreen 
        onBackToDashboard={() => setCurrentScreen('consumerDashboard')}
        onFindAnotherContractor={() => setCurrentScreen('consumerDashboard')}
        onRateAnotherService={() => setCurrentScreen('serviceRating')}
        onViewAllReviews={() => {
          console.log('Viewing all reviews');
          alert('Navigating to all reviews...');
        }}
        onBookAgain={() => {
          console.log('Booking again with contractor');
          alert(`Booking another service with ${submittedReview?.vendorName || 'contractor'}...`);
        }}
        onEditReview={() => {
          console.log('Editing review');
          setCurrentScreen('serviceRating');
        }}
        reviewData={{
          overallRating: submittedReview?.overallRating || 4.3,
          vendorName: submittedReview?.vendorName || 'Mike Rodriguez',
          serviceName: submittedReview?.serviceName || 'Plumbing service',
          topCategory: 'Quality of Work',
          topCategoryRating: 5.0
        }}
      />
    );
  }

  if (currentScreen === 'notificationSettings') {
    return (
      <NotificationSettingsScreen 
        onBack={() => setCurrentScreen('notificationCenter')}
        onTestNotification={() => {
          console.log('Test notification sent');
          alert('Test notification sent! Check your device.');
        }}
        userType={userType || 'consumer'}
        userEmail={userEmail || 'user@example.com'}
        userPhone="+1 (555) 123-4567"
      />
    );
  }

  if (currentScreen === 'notificationCenter') {
    return (
      <NotificationCenterScreen 
        onBack={() => {
          if (userType === 'vendor') {
            setCurrentScreen('vendorDashboard');
          } else {
            setCurrentScreen('consumerDashboard');
          }
        }}
        onNavigateToService={(serviceId) => {
          console.log('Navigating to service:', serviceId);
          setCurrentScreen('serviceRating');
        }}
        onNavigateToChat={(chatId) => {
          console.log('Navigating to chat:', chatId);
          setActiveTab('messages');
          setCurrentScreen('chatList');
        }}
        onNavigateToSettings={() => {
          console.log('Navigating to notification settings');
          setCurrentScreen('notificationSettings');
        }}
        userName={userProfile?.firstName || userProfile?.fullName?.split(' ')[0] || 'User'}
      />
    );
  }

  if (currentScreen === 'notificationPermission') {
    return (
      <NotificationPermissionScreen 
        onEnableNotifications={() => {
          setNotificationPermissionGranted(true);
          if (userType === 'vendor') {
            setCurrentScreen('vendorDashboard');
          } else {
            setCurrentScreen('consumerDashboard');
          }
        }}
        onMaybeLater={() => {
          if (userType === 'vendor') {
            setCurrentScreen('vendorDashboard');
          } else {
            setCurrentScreen('consumerDashboard');
          }
        }}
        onSkip={() => {
          if (userType === 'vendor') {
            setCurrentScreen('vendorDashboard');
          } else {
            setCurrentScreen('consumerDashboard');
          }
        }}
        userName={userProfile?.firstName || userProfile?.fullName?.split(' ')[0] || 'User'}
        recentActivity={{
          type: 'contractor_contact',
          contractorName: 'Mike Rodriguez',
          date: new Date()
        }}
      />
    );
  }

  if (currentScreen === 'chatList') {
    return (
      <div className="relative">
        <ChatListScreen 
          onSelectConversation={(conversation) => {
            setSelectedConversation(conversation);
            setCurrentScreen('messaging');
          }}
          userType={userType || 'consumer'}
        />
        {showBottomNav && (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            userType={userType || 'consumer'}
          />
        )}
      </div>
    );
  }

  if (currentScreen === 'serviceRequestDetail') {
    return (
      <ServiceRequestDetailScreen 
        onBack={() => setCurrentScreen('vendorDashboard')}
        onStartChat={(customerData) => {
          setSelectedConversation(customerData);
          setCurrentScreen('messaging');
        }}
        requestId={selectedRequestId}
      />
    );
  }

  if (currentScreen === 'messaging') {
    return (
      <div className="relative">
        <MessagingScreen 
          onBack={() => {
            // Always go back to chat list when using bottom navigation
            if (activeTab === 'messages') {
              setCurrentScreen('chatList');
            } else {
              // Legacy behavior for direct navigation
              if (hasContactedContractor && !notificationPermissionGranted && userType === 'consumer') {
                setCurrentScreen('notificationPermission');
              } else {
                if (userType === 'vendor') {
                  setCurrentScreen('vendorDashboard');
                } else {
                  setCurrentScreen('vendorProfile');
                }
              }
            }
          }}
          vendorName={selectedConversation?.vendorName || selectedConversation?.customerName || "Mike Rodriguez"}
          vendorService={selectedConversation?.vendorService || selectedConversation?.serviceType || "Plumbing Service"}
          vendorAvatar={selectedConversation?.vendorAvatar || selectedConversation?.customerAvatar}
          initialProgress={selectedConversation?.projectStatus || 'quoted'}
          hasBottomNav={showBottomNav}
        />
        {showBottomNav && (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            userType={userType || 'consumer'}
          />
        )}
      </div>
    );
  }

  if (currentScreen === 'profile') {
    return (
      <div className="relative">
        <ProfileScreen
          userName={userProfile?.firstName || userProfile?.fullName?.split(' ')[0] || 'User'}
          userEmail={userEmail}
          userType={userType || 'consumer'}
          userProfile={userProfile}
          onNavigateToNotifications={() => setCurrentScreen('notificationCenter')}
          onNavigateToNotificationSettings={() => setCurrentScreen('notificationSettings')}
          onLogout={handleLogout}
        />
        {showBottomNav && (
          <BottomNavigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            userType={userType || 'consumer'}
          />
        )}
      </div>
    );
  }

  // Welcome Screen
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #F8FAFF 0%, #FFFFFF 100%)'
        }}
      >
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-5">
        {/* Logo */}
        <div className="mb-12">
          <img 
            src={fixRxLogo} 
            alt="FixRx" 
            className="w-24 h-24 mx-auto"
          />
        </div>

        {/* Title */}
        <h1 
          className="text-[36px] font-bold text-center mb-3 tracking-tight"
          style={{ 
            color: '#1D1D1F',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            fontWeight: '700',
            lineHeight: '1.1'
          }}
        >
          Welcome to FixRx
        </h1>

        {/* Subtitle */}
        <p 
          className="text-[19px] text-center mb-16 max-w-sm leading-relaxed"
          style={{ 
            color: '#6B7280',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            fontWeight: '400',
            lineHeight: '1.4'
          }}
        >
          Connect with trusted contractors through your network
        </p>

        {/* Auth Buttons */}
        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => handleAuth('google')}
            className="w-full h-14 rounded-2xl flex items-center justify-center space-x-3 transition-all duration-150 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
              boxShadow: '0 4px 16px rgba(0, 122, 255, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <Chrome size={20} color="white" />
            <span 
              className="text-white text-[16px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Continue with Google
            </span>
          </button>

          <button
            onClick={() => handleAuth('facebook')}
            className="w-full h-14 rounded-2xl flex items-center justify-center space-x-3 transition-all duration-150 active:scale-[0.98]"
            style={{
              backgroundColor: '#1877F2',
              boxShadow: '0 4px 16px rgba(24, 119, 242, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <FacebookIcon />
            <span 
              className="text-white text-[16px] font-medium"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' }}
            >
              Continue with Facebook
            </span>
          </button>

          <button
            onClick={() => handleAuth('email')}
            className="w-full h-14 rounded-2xl flex items-center justify-center space-x-3 transition-all duration-150 active:scale-[0.98]"
            style={{
              backgroundColor: 'transparent',
              border: '2px solid #007AFF',
              boxShadow: '0 4px 16px rgba(0, 122, 255, 0.15)'
            }}
          >
            <Mail size={20} color="#007AFF" />
            <span 
              className="text-[16px] font-medium"
              style={{ 
                color: '#007AFF',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif' 
              }}
            >
              Continue with Email
            </span>
          </button>
        </div>



        {/* Footer */}
        <div className="mt-12 text-center" style={{ marginBottom: '40px' }}>
          <p 
            className="text-[12px]"
            style={{ 
              color: '#9CA3AF',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif'
            }}
          >
            By continuing, you agree to{' '}
            <button 
              className="underline hover:no-underline transition-all duration-150"
              style={{ color: '#007AFF' }}
            >
              Terms
            </button>
            {' & '}
            <button 
              className="underline hover:no-underline transition-all duration-150"
              style={{ color: '#007AFF' }}
            >
              Privacy
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
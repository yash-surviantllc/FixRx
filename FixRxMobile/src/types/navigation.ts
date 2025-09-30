import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  // Auth Flow
  Welcome: undefined;
  EmailAuth: undefined;
  EmailConfirmation: { email: string };
  UserType: undefined;
  
  // Consumer Onboarding
  ConsumerProfile: undefined;
  
  // Vendor Onboarding
  VendorProfileSetup: undefined;
  ServiceSelection: undefined;
  LocationSetup: undefined;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  EditProfile: undefined;
  NotificationSettings: undefined;
  PaymentMethods: undefined;
  Security: undefined;
  HelpSupport: undefined;
  About: undefined;
  Messaging: { conversationId: string };
  ChatList: undefined;
  AllRecommendations: undefined;
  ContactSelection: { inviteType: 'contractor' | 'friend' };
  MessagePreview: { 
    selectedContacts: any[];
    inviteType: 'contractor' | 'friend';
  };
  InvitationSuccess: {
    invitationCount: number;
    inviteType: 'contractor' | 'friend';
  };
  ContractorProfile: {
    contractor?: any;
  };
  Notifications: undefined;
  RatingConfirmation: { rating: number; comment: string };
  FriendsUsingVendor: { vendorId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Contractors: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type UserType = 'consumer' | 'vendor' | null;

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  profileImage?: string; // Alias for avatar
  businessName?: string;
  metroArea?: string;
  services?: string[];
  portfolio?: any[];
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

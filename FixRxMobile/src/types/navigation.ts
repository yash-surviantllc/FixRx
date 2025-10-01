export type RootStackParamList = {
  // Auth Flow
  Welcome: undefined;
  EmailAuth: undefined;
  EmailConfirmation: { email: string };
  UserType: undefined;
  EmailLogin: undefined;
  CheckEmail: { email: string };
  UserTypeSelection: { email: string };
  
  // Consumer Onboarding
  ConsumerProfile: undefined;
  
  // Vendor Onboarding
  VendorProfileSetup: { email?: string };
  VendorServiceSelection: undefined;
  VendorPortfolioUpload: undefined;
  
  // Main Tabs
  MainTabs: undefined;
  
  // Consumer Screens
  ConsumerDashboard: undefined;
  
  // Vendor Screens
  VendorDashboard: undefined;
  VendorAppointments: undefined;
  VendorEarnings: undefined;
  VendorClients: undefined;
  VendorSchedule: undefined;
  VendorInvitation: undefined;
  VendorNotifications: undefined;
  ServiceRequestDetail: { request: any };
  
  // Shared Screens
  AllRecommendations: undefined;
  ChatList: undefined;
  Messages: { conversationId: string };
  Profile: undefined;
  EditProfile: undefined;
  PaymentMethods: undefined;
  SecuritySettings: undefined;
  HelpCenter: undefined;
  AboutUs: undefined;
  ContractorInvitation: undefined;
  ContactSelection: undefined;
  InvitationPreview: undefined;
  InvitationConfirmation: undefined;
  NotificationPermission: undefined;
  NotificationCenter: undefined;
  NotificationSettings: undefined;
  Messaging: { 
    conversationId: string; 
    customerName?: string;
    serviceDetails?: {
      service: string;
      date: string;
      time: string;
      status: string;
      amount?: number;
    };
  };
  ServiceRating: { serviceId: string };
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

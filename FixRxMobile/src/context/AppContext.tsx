import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/apiService';
import { websocketService, useWebSocket } from '../services/websocketService';
import { ServiceRequest as ApiServiceRequest, Conversation as ApiConversation, Appointment as ApiAppointment } from '../types/api';
import { UserProfile, UserType } from '../types/navigation';

interface AppContextType {
  userEmail: string;
  setUserEmail: (email: string) => void;
  userType: UserType;
  setUserType: (type: UserType) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  // Centralized data used across VendorDashboard, Messaging, and Request Details
  conversations: Array<{
    id: string;
    customerName: string;
    lastMessage: string;
    time: string; // e.g. '2h ago'
    unread?: boolean;
    avatar: string;
    serviceDetails?: {
      service: string;
      date: string;
      time: string;
      status: string;
      amount?: number;
    };
  }>;
  setConversations: (list: AppContextType['conversations']) => void;
  serviceRequests: Array<{
    id: string;
    title: string;
    description: string;
    customerName: string;
    distance: string;
    budget: number;
    priority: 'high' | 'medium' | 'low';
    date: string;
    timeRange: string;
    status: 'pending' | 'confirmed' | 'scheduled' | 'completed';
    address?: string;
    photos?: string[];
  }>;
  setServiceRequests: (list: AppContextType['serviceRequests']) => void;
  // Mutators
  updateConversationMeta: (conversationId: string, patch: Partial<AppContextType['conversations'][number]>) => void;
  addMessageToConversation: (conversationId: string, text: string) => Promise<void>;
  
  // Backend Integration
  isBackendConnected: boolean;
  isLoading: boolean;
  lastSync: Date | null;
  syncWithBackend: () => Promise<void>;
  initializeBackendConnection: () => Promise<void>;
  selectedContacts: any[];
  setSelectedContacts: (contacts: any[]) => void;
  invitationType: 'contractors' | 'friends' | null;
  setInvitationType: (type: 'contractors' | 'friends' | null) => void;
  hasContactedContractor: boolean;
  setHasContactedContractor: (value: boolean) => void;
  notificationPermissionGranted: boolean;
  setNotificationPermissionGranted: (value: boolean) => void;
  selectedRequestId: string;
  setSelectedRequestId: (id: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userType, setUserType] = useState<UserType>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  // Seed conversations so Messages list and Messaging screen use same source
  const [conversations, setConversations] = useState<AppContextType['conversations']>([
    {
      id: 'req_1',
      customerName: 'Jennifer Wilson',
      lastMessage: "Hi! I need help with my kitchen sink. It's been leaking for a few days.",
      time: '2 min ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      serviceDetails: { service: 'Kitchen Sink Repair', date: 'ASAP', time: '5 min ago', status: 'pending', amount: 175 },
    },
    {
      id: 'req_2',
      customerName: 'Robert Taylor',
      lastMessage: 'Multiple outlets in my home office stopped working. Need urgent repair.',
      time: '8 min ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      serviceDetails: { service: 'Electrical Work', date: 'ASAP', time: '5 min ago', status: 'pending', amount: 125 },
    },
    {
      id: 'req_3',
      customerName: 'Amanda Clark',
      lastMessage: 'Emergency! My bathroom pipe burst and water damage is spreading rapidly.',
      time: '15 min ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      serviceDetails: { service: 'Plumbing Repair', date: 'ASAP', time: '5 min ago', status: 'pending', amount: 350 },
    },
    {
      id: 'conv_4',
      customerName: 'Michael Davis',
      lastMessage: 'Thanks for fixing my HVAC system! It\'s working perfectly now.',
      time: '15 min ago',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      serviceDetails: { service: 'HVAC Service', date: 'Completed', time: '15 min ago', status: 'completed', amount: 200 },
    },
    {
      id: 'conv_5',
      customerName: 'Lisa Martinez',
      lastMessage: 'Can you come tomorrow at 2 PM for the dishwasher repair?',
      time: '1 hr ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      serviceDetails: { service: 'Appliance Repair', date: 'Tomorrow', time: '2:00 PM', status: 'scheduled', amount: 150 },
    },
    {
      id: 'conv_6',
      customerName: 'David Thompson',
      lastMessage: 'I\'ve sent you the quote details. Let me know if you have any questions.',
      time: '2 hrs ago',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      serviceDetails: { service: 'General Maintenance', date: 'Next week', time: 'Flexible', status: 'quoted', amount: 100 },
    },
    {
      id: 'conv_7',
      customerName: 'Sarah Johnson',
      lastMessage: 'Great work on the AC maintenance! Cooling much better now.',
      time: '4 hrs ago',
      unread: false,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      serviceDetails: { service: 'AC Maintenance', date: 'Completed', time: '4 hrs ago', status: 'completed', amount: 89 },
    },
    {
      id: 'conv_8',
      customerName: 'Mark Rodriguez',
      lastMessage: 'Do you provide emergency plumbing services? I have a water leak.',
      time: '6 hrs ago',
      unread: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      serviceDetails: { service: 'Emergency Plumbing', date: 'ASAP', time: '6 hrs ago', status: 'pending', amount: 250 },
    },
  ]);
  // Seed service requests so details/list can consume same source
  const [serviceRequests, setServiceRequests] = useState<AppContextType['serviceRequests']>([
    {
      id: 'req_1',
      title: 'Kitchen Sink Repair',
      description: 'Kitchen sink is completely clogged, water backing up',
      customerName: 'Jennifer Wilson',
      distance: '2.1 mi',
      budget: 175,
      priority: 'high',
      date: '2 min ago',
      timeRange: 'ASAP',
      status: 'pending',
      address: '1234 Oak Street, San Francisco, CA',
      photos: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    },
    {
      id: 'req_2',
      title: 'Electrical Work',
      description: 'Multiple outlets not working in home office, need urgent repair',
      customerName: 'Robert Taylor',
      distance: '3.5 mi',
      budget: 125,
      priority: 'medium',
      date: '8 min ago',
      timeRange: 'ASAP',
      status: 'pending',
      address: '5678 Pine Avenue, San Francisco, CA',
      photos: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    },
    {
      id: 'req_3',
      title: 'Plumbing Repair',
      description: 'Bathroom pipe burst, water damage spreading rapidly',
      customerName: 'Amanda Clark',
      distance: '1.8 mi',
      budget: 350,
      priority: 'high',
      date: '15 min ago',
      timeRange: 'ASAP',
      status: 'pending',
      address: '9012 Elm Street, San Francisco, CA',
      photos: ['https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'],
    },
    {
      id: 'req_4',
      title: 'HVAC Service',
      description: 'Heating system making loud noises, not warming house properly',
      customerName: 'Michael Davis',
      distance: '4.3 mi',
      budget: 200,
      priority: 'medium',
      date: '15 min ago',
      timeRange: 'Today',
      status: 'pending',
    },
    {
      id: 'req_5',
      title: 'Appliance Repair',
      description: 'Dishwasher leaking and not draining, kitchen floor getting wet',
      customerName: 'Lisa Martinez',
      distance: '6.8 mi',
      budget: 150,
      priority: 'medium',
      date: '1 hr ago',
      timeRange: 'This week',
      status: 'pending',
    },
    {
      id: 'req_6',
      title: 'General Maintenance',
      description: 'Several small repairs needed around the house, flexible timing',
      customerName: 'David Thompson',
      distance: '8.2 mi',
      budget: 100,
      priority: 'low',
      date: '2 hrs ago',
      timeRange: 'Next week',
      status: 'pending',
    },
  ]);
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [invitationType, setInvitationType] = useState<'contractors' | 'friends' | null>(null);
  const [hasContactedContractor, setHasContactedContractor] = useState(false);
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState('');

  // --- Mutators ---
  const updateConversationMeta: AppContextType['updateConversationMeta'] = (conversationId, patch) => {
    setConversations(prev => prev.map(c => (c.id === conversationId ? { ...c, ...patch } : c)));
  };

  const addMessageToConversation: AppContextType['addMessageToConversation'] = async (conversationId, text) => {
    try {
      // Update UI immediately (optimistic update)
      const now = new Date();
      const relative = 'just now';
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? {
                ...c,
                lastMessage: text,
                time: relative,
                unread: false,
              }
            : c
        )
      );

      // Send to backend when ready
      if (isBackendConnected) {
        // Uncomment when backend is ready:
        // await apiService.sendMessage(conversationId, { type: 'text', text });
        console.log('Message sent to backend:', { conversationId, text });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Could implement retry logic or show error to user
    }
  };

  // Backend Integration Setup
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // WebSocket integration for real-time updates
  const { connect: connectWS, disconnect: disconnectWS, on: onWSEvent } = useWebSocket();

  // Initialize backend connection when user logs in
  // DISABLED: Uncomment when backend is ready
  // useEffect(() => {
  //   if (userProfile && userType) {
  //     initializeBackendConnection();
  //   }
  // }, [userProfile, userType]);

  // Setup WebSocket event listeners
  useEffect(() => {
    const unsubscribers = [
      onWSEvent('message:new', handleNewMessage),
      onWSEvent('request:updated', handleRequestUpdate),
      onWSEvent('appointment:updated', handleAppointmentUpdate),
      onWSEvent('notification:new', handleNewNotification),
    ];

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  // Backend connection initialization
  const initializeBackendConnection = async () => {
    try {
      setIsLoading(true);
      
      // Connect WebSocket for real-time updates
      connectWS();
      
      // Load initial data from backend
      await Promise.all([
        loadConversations(),
        loadServiceRequests(),
        loadAppointments(),
      ]);
      
      setIsBackendConnected(true);
      setLastSync(new Date());
    } catch (error) {
      console.error('Failed to connect to backend:', error);
      // Fall back to mock data
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data from backend (ready for implementation)
  const loadConversations = async () => {
    try {
      // When backend is ready, uncomment this:
      // const response = await apiService.getConversations();
      // if (response.success) {
      //   setConversations(response.data);
      // }
      
      // For now, keep using mock data
      console.log('Loading conversations from backend...');
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadServiceRequests = async () => {
    try {
      // When backend is ready, uncomment this:
      // const response = await apiService.getServiceRequests();
      // if (response.success) {
      //   setServiceRequests(response.data);
      // }
      
      console.log('Loading service requests from backend...');
    } catch (error) {
      console.error('Error loading service requests:', error);
    }
  };

  const loadAppointments = async () => {
    try {
      // When backend is ready, uncomment this:
      // const response = await apiService.getAppointments();
      // if (response.success) {
      //   // Update appointments in relevant screens
      // }
      
      console.log('Loading appointments from backend...');
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  // Real-time event handlers
  const handleNewMessage = (message: any) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === message.conversationId
          ? { ...conv, lastMessage: message.content.text, time: 'just now', unread: true }
          : conv
      )
    );
  };

  const handleRequestUpdate = (request: any) => {
    setServiceRequests(prev => 
      prev.map(req => req.id === request.id ? { ...req, ...request } : req)
    );
  };

  const handleAppointmentUpdate = (appointment: any) => {
    // Update appointments in relevant screens
    console.log('Appointment updated:', appointment);
  };

  const handleNewNotification = (notification: any) => {
    // Handle new notifications
    console.log('New notification:', notification);
  };

  // Sync data with backend
  const syncWithBackend = async () => {
    if (isBackendConnected) {
      await Promise.all([
        loadConversations(),
        loadServiceRequests(),
        loadAppointments(),
      ]);
      setLastSync(new Date());
    }
  };

  const logout = () => {
    setUserEmail('');
    setUserType(null);
    setUserProfile(null);
    setSelectedContacts([]);
    setInvitationType(null);
    setHasContactedContractor(false);
    setNotificationPermissionGranted(false);
    setSelectedRequestId('');
  };

  return (
    <AppContext.Provider
      value={{
        userEmail,
        setUserEmail,
        userType,
        setUserType,
        userProfile,
        setUserProfile,
        conversations,
        setConversations,
        serviceRequests,
        setServiceRequests,
        updateConversationMeta,
        addMessageToConversation,
        
        // Backend Integration
        isBackendConnected,
        isLoading,
        lastSync,
        syncWithBackend,
        initializeBackendConnection,
        selectedContacts,
        setSelectedContacts,
        invitationType,
        setInvitationType,
        hasContactedContractor,
        setHasContactedContractor,
        notificationPermissionGranted,
        setNotificationPermissionGranted,
        selectedRequestId,
        setSelectedRequestId,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

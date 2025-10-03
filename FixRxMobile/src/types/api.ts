/**
 * API Types and Interfaces for Backend Integration
 * This file defines all the data structures and API contracts
 * that the frontend expects from the backend
 */

// Base API Response Structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// User and Authentication
export interface User {
  id: string;
  email: string;
  userType: 'vendor' | 'consumer';
  profile: VendorProfile | ConsumerProfile;
  createdAt: string;
  updatedAt: string;
}

export interface VendorProfile {
  id: string;
  businessName: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  services: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  avatar?: string;
}

export interface ConsumerProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  avatar?: string;
}

// Service Requests
export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    distance?: string; // calculated from vendor location
  };
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  priority: 'low' | 'medium' | 'high';
  urgency: 'flexible' | 'today' | 'asap';
  preferredTime?: string;
  photos: string[];
  status: 'pending' | 'quoted' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  vendorId?: string; // assigned vendor
  quote?: Quote;
}

export interface Quote {
  id: string;
  serviceRequestId: string;
  vendorId: string;
  amount: number;
  currency: string;
  description: string;
  estimatedDuration: string;
  validUntil: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
}

// Conversations and Messages
export interface Conversation {
  id: string;
  participants: {
    vendorId: string;
    customerId: string;
  };
  serviceRequestId?: string;
  lastMessage: Message;
  unreadCount: {
    vendor: number;
    customer: number;
  };
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'vendor' | 'customer';
  content: {
    type: 'text' | 'image' | 'quote' | 'appointment' | 'system';
    text?: string;
    imageUrl?: string;
    quote?: Quote;
    appointment?: Appointment;
    systemData?: any;
  };
  readBy: {
    userId: string;
    readAt: string;
  }[];
  createdAt: string;
}

// Appointments
export interface Appointment {
  id: string;
  serviceRequestId: string;
  vendorId: string;
  customerId: string;
  title: string;
  description: string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  amount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Clients (for vendors)
export interface Client {
  id: string;
  customerId: string;
  vendorId: string;
  customerProfile: ConsumerProfile;
  totalProjects: number;
  totalSpent: number;
  averageRating: number;
  lastServiceDate: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: 'new_request' | 'message' | 'appointment' | 'quote' | 'payment' | 'review';
  title: string;
  message: string;
  data?: any; // additional context data
  isRead: boolean;
  createdAt: string;
}

// Real-time Events
export interface RealTimeEvent {
  type: 'message' | 'request_update' | 'appointment_update' | 'notification';
  data: any;
  timestamp: string;
}

// API Endpoints Interface (for future implementation)
export interface ApiEndpoints {
  // Authentication
  login: (email: string, password: string) => Promise<ApiResponse<{ user: User; token: string }>>;
  register: (userData: any) => Promise<ApiResponse<{ user: User; token: string }>>;
  logout: () => Promise<ApiResponse<void>>;
  
  // Service Requests
  getServiceRequests: (filters?: any) => Promise<ApiResponse<PaginatedResponse<ServiceRequest>>>;
  getServiceRequest: (id: string) => Promise<ApiResponse<ServiceRequest>>;
  createServiceRequest: (data: Partial<ServiceRequest>) => Promise<ApiResponse<ServiceRequest>>;
  updateServiceRequest: (id: string, data: Partial<ServiceRequest>) => Promise<ApiResponse<ServiceRequest>>;
  
  // Conversations
  getConversations: () => Promise<ApiResponse<Conversation[]>>;
  getConversation: (id: string) => Promise<ApiResponse<Conversation>>;
  getMessages: (conversationId: string) => Promise<ApiResponse<Message[]>>;
  sendMessage: (conversationId: string, content: any) => Promise<ApiResponse<Message>>;
  markAsRead: (conversationId: string, messageIds: string[]) => Promise<ApiResponse<void>>;
  
  // Appointments
  getAppointments: (filters?: any) => Promise<ApiResponse<Appointment[]>>;
  createAppointment: (data: Partial<Appointment>) => Promise<ApiResponse<Appointment>>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<ApiResponse<Appointment>>;
  
  // Clients
  getClients: () => Promise<ApiResponse<Client[]>>;
  getClient: (id: string) => Promise<ApiResponse<Client>>;
  
  // Notifications
  getNotifications: () => Promise<ApiResponse<Notification[]>>;
  markNotificationRead: (id: string) => Promise<ApiResponse<void>>;
}

// WebSocket Events
export interface WebSocketEvents {
  // Incoming events from server
  'message:new': (message: Message) => void;
  'request:updated': (request: ServiceRequest) => void;
  'appointment:updated': (appointment: Appointment) => void;
  'notification:new': (notification: Notification) => void;
  'user:online': (userId: string) => void;
  'user:offline': (userId: string) => void;
  
  // Outgoing events to server
  'join:room': (roomId: string) => void;
  'leave:room': (roomId: string) => void;
  'typing:start': (conversationId: string) => void;
  'typing:stop': (conversationId: string) => void;
}

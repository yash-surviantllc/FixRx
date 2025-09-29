// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'CONSUMER' | 'VENDOR' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  emailVerified: boolean;
  phoneVerified: boolean;
  auth0Id?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// Vendor types
export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessDescription?: string;
  businessAddress?: string;
  businessPhone?: string;
  businessEmail?: string;
  website?: string;
  serviceCategories: string[];
  serviceTags: string[];
  serviceArea?: any;
  hourlyRate?: number;
  availability?: any;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  licenseNumber?: string;
  licenseVerification: 'PENDING' | 'VERIFIED' | 'FAILED' | 'EXPIRED';
  licenseVerifiedAt?: Date;
  licenseExpiresAt?: Date;
  totalRatings: number;
  averageRating: number;
  totalJobs: number;
  responseTime?: number;
  portfolioImages: string[];
  certifications: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Consumer types
export interface Consumer {
  id: string;
  userId: string;
  preferences?: any;
  location?: any;
  searchRadius: number;
  createdAt: Date;
  updatedAt: Date;
}

// Rating types
export interface Rating {
  id: string;
  giverId: string;
  receiverId: string;
  consumerId: string;
  vendorId: string;
  costEffectiveness: number;
  qualityOfService: number;
  timelinessOfDelivery: number;
  professionalism: number;
  overallRating: number;
  reviewTitle?: string;
  reviewText?: string;
  reviewImages: string[];
  jobDescription?: string;
  jobCompletedAt?: Date;
  jobValue?: number;
  isPublic: boolean;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Connection types
export interface Connection {
  id: string;
  consumerId: string;
  vendorId: string;
  status: 'PENDING' | 'CONNECTED' | 'BLOCKED' | 'DISCONNECTED';
  connectedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Invitation types
export interface Invitation {
  id: string;
  senderId: string;
  receiverId?: string;
  consumerId?: string;
  vendorId?: string;
  type: 'SMS' | 'EMAIL';
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';
  recipientEmail?: string;
  recipientPhone?: string;
  message?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  acceptedAt?: Date;
  declinedAt?: Date;
  expiresAt?: Date;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Contact types
export interface Contact {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  displayName?: string;
  isRegistered: boolean;
  registeredUserId?: string;
  lastSyncAt: Date;
  invitationsSent: number;
  lastInvitedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    code?: string;
    statusCode: number;
    stack?: string;
    details?: any;
  };
  timestamp: string;
  path?: string;
  method?: string;
}

export interface PaginationResponse<T = any> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Search types
export interface VendorSearchParams {
  latitude?: number;
  longitude?: number;
  radius?: number;
  serviceCategories?: string[];
  city?: string;
  state?: string;
  minRating?: number;
  maxHourlyRate?: number;
  page?: number;
  limit?: number;
}

export interface VendorSearchResult extends Vendor {
  distance?: number;
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar' | 'status'>;
}

// Queue job types
export interface EmailJobData {
  to: string;
  subject?: string;
  template?: string;
  templateData?: any;
  html?: string;
  text?: string;
}

export interface SMSJobData {
  to: string;
  message: string;
  from?: string;
}

export interface NotificationJobData {
  userId: string;
  title: string;
  body: string;
  data?: any;
}

// File upload types
export interface FileUpload {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  category: 'avatar' | 'portfolio' | 'certification' | 'rating';
  description?: string;
  uploadedBy: string;
  uploadedAt: Date;
}

// Geographic types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface Location {
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

// Statistics types
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  consumerCount: number;
  vendorCount: number;
  pendingVerification: number;
  suspendedUsers: number;
  registrationTrend: any[];
}

export interface VendorAnalytics {
  overview: {
    totalRatings: number;
    averageRating: number;
    totalConnections: number;
  };
  recentRatings: Rating[];
  ratingDistribution: any[];
}

export interface ConsumerAnalytics {
  overview: {
    totalConnections: number;
    totalRatingsGiven: number;
    averageRatingGiven: number;
  };
  recentActivity: Rating[];
}

export interface InvitationStats {
  overview: {
    totalSent: number;
    totalAccepted: number;
    totalDeclined: number;
    totalPending: number;
    acceptanceRate: number;
  };
  recentInvitations: Invitation[];
}

// Validation types
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// JWT types
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  auth0Id?: string;
  iat?: number;
  exp?: number;
}

// Express types extension
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        auth0Id?: string;
      };
    }
  }
}

export {};

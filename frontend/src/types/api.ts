// API Types for FixRx Frontend
// These types match the backend Prisma models

export enum UserRole {
  CONSUMER = 'CONSUMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  EXPIRED = 'EXPIRED',
}

export enum InvitationType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
}

export enum ConnectionStatus {
  PENDING = 'PENDING',
  CONNECTED = 'CONNECTED',
  BLOCKED = 'BLOCKED',
  DISCONNECTED = 'DISCONNECTED',
}

export enum LicenseVerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED',
}

export enum RatingCategory {
  COST_EFFECTIVENESS = 'COST_EFFECTIVENESS',
  QUALITY_OF_SERVICE = 'QUALITY_OF_SERVICE',
  TIMELINESS_OF_DELIVERY = 'TIMELINESS_OF_DELIVERY',
  PROFESSIONALISM = 'PROFESSIONALISM',
}

// Base User type
export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  auth0Id?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Consumer profile
export interface Consumer {
  id: string;
  userId: string;
  user?: User;
  preferences?: any;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  searchRadius: number;
  createdAt: string;
  updatedAt: string;
}

// Vendor profile
export interface Vendor {
  id: string;
  userId: string;
  user?: User;
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
  licenseVerification: LicenseVerificationStatus;
  licenseVerifiedAt?: string;
  licenseExpiresAt?: string;
  totalRatings: number;
  averageRating: number;
  totalJobs: number;
  responseTime?: number;
  portfolioImages: string[];
  certifications: string[];
  createdAt: string;
  updatedAt: string;
}

// Connection between consumer and vendor
export interface Connection {
  id: string;
  consumerId: string;
  vendorId: string;
  status: ConnectionStatus;
  connectedAt?: string;
  notes?: string;
  consumer?: Consumer;
  vendor?: Vendor;
  createdAt: string;
  updatedAt: string;
}

// Invitation
export interface Invitation {
  id: string;
  senderId: string;
  receiverId?: string;
  consumerId?: string;
  vendorId?: string;
  type: InvitationType;
  status: InvitationStatus;
  recipientEmail?: string;
  recipientPhone?: string;
  message?: string;
  sentAt?: string;
  deliveredAt?: string;
  acceptedAt?: string;
  declinedAt?: string;
  expiresAt?: string;
  metadata?: any;
  sender?: User;
  receiver?: User;
  consumer?: Consumer;
  vendor?: Vendor;
  createdAt: string;
  updatedAt: string;
}

// Rating
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
  jobCompletedAt?: string;
  jobValue?: number;
  isPublic: boolean;
  isVerified: boolean;
  helpfulCount: number;
  giver?: User;
  receiver?: User;
  consumer?: Consumer;
  vendor?: Vendor;
  createdAt: string;
  updatedAt: string;
}

// Contact
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
  lastSyncAt: string;
  invitationsSent: number;
  lastInvitedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// API Request/Response types
export interface VendorSearchRequest {
  query?: string;
  categories?: string[];
  latitude?: number;
  longitude?: number;
  radius?: number;
  minRating?: number;
  maxPrice?: number;
  availability?: boolean;
  page?: number;
  limit?: number;
}

export interface VendorSearchResponse {
  vendors: Vendor[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CreateRatingRequest {
  vendorId: string;
  costEffectiveness: number;
  qualityOfService: number;
  timelinessOfDelivery: number;
  professionalism: number;
  reviewTitle?: string;
  reviewText?: string;
  jobDescription?: string;
  jobValue?: number;
}

export interface SendInvitationRequest {
  type: InvitationType;
  recipientEmail?: string;
  recipientPhone?: string;
  message?: string;
  vendorId?: string;
}

export interface BulkInvitationRequest {
  type: InvitationType;
  recipients: Array<{
    email?: string;
    phone?: string;
    name?: string;
  }>;
  message?: string;
}

// File upload types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

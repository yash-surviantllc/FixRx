/**
 * API Configuration for FixRx Mobile
 * Non-intrusive backend integration
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Health
  HEALTH: '/health',
  
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/users/profile',
  },
  
  // Consumer
  CONSUMER: {
    DASHBOARD: '/consumers/dashboard',
    RECOMMENDATIONS: '/consumers/recommendations',
    PROFILE: '/consumers/profile',
  },
  
  // Vendor
  VENDOR: {
    DASHBOARD: '/vendors/dashboard',
    PROFILE: '/vendors/profile',
    SEARCH: '/vendors/search',
  },
  
  // Ratings
  RATINGS: {
    CREATE: '/ratings',
    GET: '/ratings',
    UPDATE: '/ratings',
  },
  
  // Invitations
  INVITATIONS: {
    SEND: '/invitations/send',
    BULK: '/invitations/bulk',
    RECEIVED: '/invitations/received',
    SENT: '/invitations/sent',
  },
  
  // Contacts
  CONTACTS: {
    IMPORT: '/contacts/import',
    SYNC: '/contacts/sync',
    SEARCH: '/contacts/search',
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
};

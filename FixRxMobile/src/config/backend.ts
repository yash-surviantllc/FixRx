/**
 * Backend Configuration
 * Centralized configuration for backend integration
 */

export const BACKEND_CONFIG = {
  // Environment settings
  isDevelopment: __DEV__,
  
  // API Configuration
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  
  // WebSocket Configuration
  websocket: {
    url: process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000',
    reconnectAttempts: 5,
    reconnectDelay: 1000,
    heartbeatInterval: 30000,
  },
  
  // Feature Flags
  features: {
    // Set to false to use mock data, true for real backend
    useRealBackend: process.env.EXPO_PUBLIC_USE_REAL_BACKEND === 'true',
    
    // Real-time features
    enableWebSocket: true,
    enablePushNotifications: true,
    
    // Data sync settings
    autoSync: true,
    syncInterval: 60000, // 1 minute
    
    // Offline support
    enableOfflineMode: true,
    offlineStorageLimit: 100, // MB
  },
  
  // Authentication
  auth: {
    tokenStorageKey: 'fixrx_auth_token',
    refreshTokenKey: 'fixrx_refresh_token',
    tokenExpiryBuffer: 300000, // 5 minutes
  },
  
  // File Upload
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'text/plain'],
    compressionQuality: 0.8,
  },
  
  // Pagination
  pagination: {
    defaultLimit: 20,
    maxLimit: 100,
  },
  
  // Cache settings
  cache: {
    ttl: 300000, // 5 minutes
    maxSize: 50, // number of items
  },
};

// Environment-specific overrides
if (BACKEND_CONFIG.isDevelopment) {
  // Development settings
  BACKEND_CONFIG.api.baseUrl = 'http://localhost:3000/api';
  BACKEND_CONFIG.websocket.url = 'ws://localhost:3000';
} else {
  // Production settings
  BACKEND_CONFIG.api.baseUrl = 'https://api.fixrx.com/api';
  BACKEND_CONFIG.websocket.url = 'wss://api.fixrx.com';
}

// Quick toggle for switching between mock and real data
export const USE_MOCK_DATA = !BACKEND_CONFIG.features.useRealBackend;

// Export individual configs for convenience
export const { api: API_CONFIG, websocket: WS_CONFIG, features: FEATURES } = BACKEND_CONFIG;

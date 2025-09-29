// Environment configuration for FixRx frontend
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'FixRx',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENVIRONMENT || 'development',
  },
  auth: {
    tokenKey: import.meta.env.VITE_JWT_STORAGE_KEY || 'fixrx_token',
    refreshTokenKey: import.meta.env.VITE_REFRESH_TOKEN_KEY || 'fixrx_refresh_token',
  },
  features: {
    notifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
    geolocation: import.meta.env.VITE_ENABLE_GEOLOCATION === 'true',
    fileUpload: import.meta.env.VITE_ENABLE_FILE_UPLOAD === 'true',
  },
  debug: {
    enabled: import.meta.env.VITE_DEBUG_MODE === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  },
} as const;

export type Config = typeof config;

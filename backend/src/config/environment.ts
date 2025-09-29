import dotenv from 'dotenv';
import Joi from 'joi';

// Load environment variables
dotenv.config();

// Environment validation schema
const envSchema = Joi.object({
  // Server Configuration
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  API_VERSION: Joi.string().default('v1'),

  // Database Configuration
  DATABASE_URL: Joi.string().required(),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),

  // Redis Configuration
  REDIS_URL: Joi.string().optional(),
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional(),

  // JWT Configuration
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().default('7d'),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('30d'),

  // Auth0 Configuration (optional for development)
  AUTH0_DOMAIN: Joi.string().optional(),
  AUTH0_CLIENT_ID: Joi.string().optional(),
  AUTH0_CLIENT_SECRET: Joi.string().optional(),
  AUTH0_AUDIENCE: Joi.string().optional(),

  // Twilio Configuration (optional for development)
  TWILIO_ACCOUNT_SID: Joi.string().optional(),
  TWILIO_AUTH_TOKEN: Joi.string().optional(),
  TWILIO_PHONE_NUMBER: Joi.string().optional(),

  // SendGrid Configuration (optional for development)
  SENDGRID_API_KEY: Joi.string().optional(),
  SENDGRID_FROM_EMAIL: Joi.string().email().optional(),
  SENDGRID_FROM_NAME: Joi.string().default('FixRx'),

  // Firebase Configuration (optional for development)
  FIREBASE_PROJECT_ID: Joi.string().optional(),
  FIREBASE_PRIVATE_KEY_ID: Joi.string().optional(),
  FIREBASE_PRIVATE_KEY: Joi.string().optional(),
  FIREBASE_CLIENT_EMAIL: Joi.string().email().optional(),
  FIREBASE_CLIENT_ID: Joi.string().optional(),
  FIREBASE_AUTH_URI: Joi.string().uri().optional(),
  FIREBASE_TOKEN_URI: Joi.string().uri().optional(),

  // AWS Configuration
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
  AWS_REGION: Joi.string().default('us-east-1'),
  AWS_S3_BUCKET: Joi.string().optional(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: Joi.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: Joi.number().default(100),

  // File Upload Configuration
  MAX_FILE_SIZE: Joi.number().default(5242880),
  ALLOWED_FILE_TYPES: Joi.string().default('image/jpeg,image/png,image/gif,application/pdf'),

  // Geographic Search Configuration
  DEFAULT_SEARCH_RADIUS_KM: Joi.number().default(50),
  MAX_SEARCH_RADIUS_KM: Joi.number().default(500),

  // Email Templates
  EMAIL_TEMPLATE_INVITATION: Joi.string().optional(),
  EMAIL_TEMPLATE_WELCOME: Joi.string().optional(),
  EMAIL_TEMPLATE_PASSWORD_RESET: Joi.string().optional(),

  // Monitoring and Logging
  SENTRY_DSN: Joi.string().optional(),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),

  // External API Configuration
  MESH_API_KEY: Joi.string().optional(),
  MESH_API_URL: Joi.string().uri().optional(),
});

// Validate environment variables
const { error, value: env } = envSchema.validate(process.env, { 
  allowUnknown: true,
  stripUnknown: true 
});

if (error) {
  console.error('❌ Invalid environment variables:');
  console.error(error.details);
  process.exit(1);
}

// Export configuration object
export const config = {
  // Server
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  apiVersion: env.API_VERSION,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',

  // CORS origins based on environment
  corsOrigins: env.NODE_ENV === 'production' 
    ? ['https://fixrx.com', 'https://app.fixrx.com']
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8081'],

  // Database
  database: {
    url: env.DATABASE_URL,
    host: env.DB_HOST,
    port: env.DB_PORT,
    name: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },

  // Redis
  redis: {
    url: env.REDIS_URL,
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
  },

  // JWT
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  // Auth0
  auth0: {
    domain: env.AUTH0_DOMAIN,
    clientId: env.AUTH0_CLIENT_ID,
    clientSecret: env.AUTH0_CLIENT_SECRET,
    audience: env.AUTH0_AUDIENCE,
  },

  // Twilio
  twilio: {
    accountSid: env.TWILIO_ACCOUNT_SID,
    authToken: env.TWILIO_AUTH_TOKEN,
    phoneNumber: env.TWILIO_PHONE_NUMBER,
  },

  // SendGrid
  sendgrid: {
    apiKey: env.SENDGRID_API_KEY,
    fromEmail: env.SENDGRID_FROM_EMAIL,
    fromName: env.SENDGRID_FROM_NAME,
    templates: {
      invitation: env.EMAIL_TEMPLATE_INVITATION,
      welcome: env.EMAIL_TEMPLATE_WELCOME,
      passwordReset: env.EMAIL_TEMPLATE_PASSWORD_RESET,
    },
  },

  // Firebase
  firebase: {
    projectId: env.FIREBASE_PROJECT_ID,
    privateKeyId: env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: env.FIREBASE_PRIVATE_KEY ? env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    clientId: env.FIREBASE_CLIENT_ID,
    authUri: env.FIREBASE_AUTH_URI,
    tokenUri: env.FIREBASE_TOKEN_URI,
  },

  // AWS
  aws: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
    s3Bucket: env.AWS_S3_BUCKET,
  },

  // Rate Limiting
  rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: env.RATE_LIMIT_MAX_REQUESTS,

  // File Upload
  fileUpload: {
    maxSize: env.MAX_FILE_SIZE,
    allowedTypes: env.ALLOWED_FILE_TYPES.split(','),
  },

  // Geographic Search
  search: {
    defaultRadiusKm: env.DEFAULT_SEARCH_RADIUS_KM,
    maxRadiusKm: env.MAX_SEARCH_RADIUS_KM,
  },

  // Monitoring
  sentry: {
    dsn: env.SENTRY_DSN,
  },
  logLevel: env.LOG_LEVEL,

  // External APIs
  mesh: {
    apiKey: env.MESH_API_KEY,
    apiUrl: env.MESH_API_URL,
  },
} as const;

export type Config = typeof config;

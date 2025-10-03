import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';

import { config } from '@/config/environment';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { authMiddleware } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';

// Import routes
import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/users';
import vendorRoutes from '@/routes/vendors';
import consumerRoutes from '@/routes/consumers';
import invitationRoutes from '@/routes/invitations';
import ratingRoutes from '@/routes/ratings';
import contactRoutes from '@/routes/contacts';
import uploadRoutes from '@/routes/uploads';

// Import services
import { DatabaseService } from '@/services/database';
import { RedisService } from '@/services/redis';
import { QueueService } from '@/services/queue';
import { initializeJobProcessors } from '@/services/job-processors';

class Server {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.port;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Enhanced security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", "https:", "data:"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      frameguard: { action: 'deny' }, // Prevent clickjacking
      noSniff: true, // Prevent MIME sniffing
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimitWindowMs,
      max: config.rateLimitMaxRequests,
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware with appropriate limits
    this.app.use(express.json({ limit: '1mb' })); // Default small limit for API requests
    this.app.use(express.urlencoded({ extended: true, limit: '1mb' }));

    // Compression
    this.app.use(compression());

    // Logging
    if (config.nodeEnv !== 'test') {
      this.app.use(morgan('combined', {
        stream: {
          write: (message: string) => logger.info(message.trim()),
        },
      }));
    }

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.nodeEnv,
        version: process.env.npm_package_version || '1.0.0',
      });
    });
  }

  private initializeRoutes(): void {
    const apiRouter = express.Router();

    // Public routes (no authentication required)
    apiRouter.use('/auth', authRoutes);

    // Protected routes (authentication required)
    apiRouter.use('/users', authMiddleware, userRoutes);
    // Vendor routes - some are public, auth handled per-route
    apiRouter.use('/vendors', vendorRoutes);
    apiRouter.use('/consumers', authMiddleware, consumerRoutes);
    apiRouter.use('/invitations', authMiddleware, invitationRoutes);
    // Rating routes - some are public, auth handled per-route
    apiRouter.use('/ratings', ratingRoutes);
    apiRouter.use('/contacts', authMiddleware, contactRoutes);
    
    // Upload routes with larger body limit
    apiRouter.use('/uploads', 
      express.json({ limit: '10mb' }), 
      express.urlencoded({ extended: true, limit: '10mb' }),
      authMiddleware, 
      uploadRoutes
    );

    // Mount API routes
    this.app.use(`/api/${config.apiVersion}`, apiRouter);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        message: 'FixRx API Server',
        version: config.apiVersion,
        documentation: `/api/${config.apiVersion}/docs`,
        health: '/health',
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      // Initialize database connection
      await DatabaseService.connect();
      logger.info('Database connected successfully');

      // Initialize Redis connection
      await RedisService.connect();
      logger.info('Redis connected successfully');

      // Initialize queue service
      await QueueService.initialize();
      logger.info('Queue service initialized');

      // Initialize job processors
      initializeJobProcessors();
      logger.info('Background job processors initialized');

      // Start server
      this.app.listen(this.port, () => {
        logger.info(`FixRx API Server running on port ${this.port}`);
        logger.info(`Environment: ${config.nodeEnv}`);
        logger.info(`API Version: ${config.apiVersion}`);
      });

      // Graceful shutdown handling
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  private setupGracefulShutdown(): void {
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);

      try {
        // Close database connections
        await DatabaseService.disconnect();
        logger.info('Database connections closed');

        // Close Redis connections
        await RedisService.disconnect();
        logger.info('Redis connections closed');

        // Close queue connections
        await QueueService.close();
        logger.info('Queue connections closed');

        logger.info('Graceful shutdown completed');
        process.exit(0);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new Server();
  server.start().catch((error) => {
    logger.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default Server;

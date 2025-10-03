import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/environment';
import { AppError } from './errorHandler';
import { prisma } from '@/services/database';
import { logger } from '@/utils/logger';
import { RedisService } from '@/services/redis';

// Extend Request interface to include user
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

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  auth0Id?: string | null;
  iat?: number;
  exp?: number;
}

// Main authentication middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with strict validation
    const decoded = jwt.verify(token, config.jwt.secret, {
      algorithms: ['HS256'], // Only allow HS256 algorithm
      issuer: 'fixrx-api',   // Validate issuer
      audience: 'fixrx-app', // Validate audience
    }) as JWTPayload;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        auth0Id: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 401);
    }

    if (user.status !== 'ACTIVE' && user.status !== 'PENDING_VERIFICATION') {
      throw new AppError('Account is not active', 401);
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      auth0Id: user.auth0Id || undefined,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

// Optional authentication middleware (doesn't throw error if no token)
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        auth0Id: true,
      },
    });

    if (user && user.status === 'ACTIVE') {
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        auth0Id: user.auth0Id || undefined,
      };
    }

    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }

    next();
  };
};

// Vendor-only middleware
export const requireVendor = requireRole('VENDOR');

// Consumer-only middleware
export const requireConsumer = requireRole('CONSUMER');

// Admin-only middleware
export const requireAdmin = requireRole('ADMIN');

// Consumer or Vendor middleware
export const requireConsumerOrVendor = requireRole(['CONSUMER', 'VENDOR']);

// Self or admin access middleware (for accessing own resources)
export const requireSelfOrAdmin = (userIdParam: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Authentication required', 401);
    }

    const targetUserId = req.params[userIdParam];
    
    if (req.user.role === 'ADMIN' || req.user.id === targetUserId) {
      return next();
    }

    throw new AppError('Access denied', 403);
  };
};

// Generate JWT token with security claims
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
    issuer: 'fixrx-api',
    audience: 'fixrx-app',
    algorithm: 'HS256',
  });
};

// Generate refresh token with security claims
export const generateRefreshToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: 'fixrx-api',
    audience: 'fixrx-app',
    algorithm: 'HS256',
  });
};

// Verify refresh token with security claims
export const verifyRefreshToken = (token: string): JWTPayload => {
  return jwt.verify(token, config.jwt.refreshSecret, {
    algorithms: ['HS256'],
    issuer: 'fixrx-api',
    audience: 'fixrx-app',
  }) as JWTPayload;
};

// Enhanced rate limiting for authentication endpoints with Redis support
export const authRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  // Fallback in-memory storage if Redis is unavailable
  const memoryAttempts = new Map<string, { count: number; resetTime: number }>();

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = `auth_rate_limit:${req.ip}:${req.body.email || req.body.phone || 'unknown'}`;
    const now = Date.now();
    const ttlSeconds = Math.ceil(windowMs / 1000);
    
    try {
      // Try Redis first for distributed rate limiting
      const currentCount = await RedisService.get(key);
      
      if (currentCount) {
        const count = parseInt(currentCount, 10);
        if (count >= maxAttempts) {
          const ttl = await RedisService.ttl(key);
          throw new AppError(
            `Too many authentication attempts. Please try again in ${Math.ceil(ttl / 60)} minutes.`, 
            429
          );
        }
        await RedisService.incr(key);
      } else {
        // First attempt in this window
        await RedisService.setEx(key, ttlSeconds, '1');
      }
      
    } catch (redisError) {
      // Fallback to in-memory rate limiting if Redis fails
      logger.warn('Redis unavailable for rate limiting, using memory fallback');
      
      const userAttempts = memoryAttempts.get(key);
      
      if (userAttempts) {
        if (now > userAttempts.resetTime) {
          // Reset window
          memoryAttempts.set(key, { count: 1, resetTime: now + windowMs });
        } else if (userAttempts.count >= maxAttempts) {
          const remainingTime = Math.ceil((userAttempts.resetTime - now) / 60000);
          throw new AppError(
            `Too many authentication attempts. Please try again in ${remainingTime} minutes.`, 
            429
          );
        } else {
          userAttempts.count++;
        }
      } else {
        memoryAttempts.set(key, { count: 1, resetTime: now + windowMs });
      }
    }

    next();
  };
};

// Middleware to log authentication events
export const logAuthEvent = (event: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    logger.info(`Auth Event: ${event}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      email: req.body.email,
      timestamp: new Date().toISOString(),
    });
    next();
  };
};

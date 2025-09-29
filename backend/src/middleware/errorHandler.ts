import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { config } from '@/config/environment';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error response interface
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    statusCode: number;
    stack?: string;
    details?: any;
  };
  timestamp: string;
  path: string;
  method: string;
}

// Global error handler middleware
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Set default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  
  // Log error
  logger.error('Error occurred:', {
    message: err.message,
    statusCode,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  }

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message,
      statusCode,
    },
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
  };

  // Include stack trace in development
  if (config.isDevelopment) {
    errorResponse.error.stack = err.stack;
  }

  // Include additional error details if available
  if (err.name === 'ValidationError' && (err as any).details) {
    errorResponse.error.details = (err as any).details;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Not found error creator
export const createNotFoundError = (resource: string = 'Resource') => {
  return new AppError(`${resource} not found`, 404);
};

// Validation error creator
export const createValidationError = (message: string, details?: any) => {
  const error = new AppError(message, 400);
  (error as any).details = details;
  return error;
};

// Unauthorized error creator
export const createUnauthorizedError = (message: string = 'Unauthorized') => {
  return new AppError(message, 401);
};

// Forbidden error creator
export const createForbiddenError = (message: string = 'Forbidden') => {
  return new AppError(message, 403);
};

// Conflict error creator
export const createConflictError = (message: string) => {
  return new AppError(message, 409);
};

// Too many requests error creator
export const createTooManyRequestsError = (message: string = 'Too many requests') => {
  return new AppError(message, 429);
};

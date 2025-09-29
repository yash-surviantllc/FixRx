import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from './errorHandler';

// Validation middleware factory
export const validateRequest = (schema: {
  body?: Joi.AnySchema;
  query?: Joi.AnySchema;
  params?: Joi.AnySchema;
}) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    // Validate request body
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        errors.push(`Body: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate query parameters
    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        errors.push(`Query: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    // Validate route parameters
    if (schema.params) {
      const { error } = schema.params.validate(req.params);
      if (error) {
        errors.push(`Params: ${error.details.map(d => d.message).join(', ')}`);
      }
    }

    if (errors.length > 0) {
      throw new AppError(`Validation failed: ${errors.join('; ')}`, 400);
    }

    next();
  };
};

// Common validation schemas
export const commonSchemas = {
  id: Joi.string().required().messages({
    'string.empty': 'ID is required',
    'any.required': 'ID is required',
  }),

  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),

  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).messages({
    'string.pattern.base': 'Please provide a valid phone number',
  }),

  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).messages({
    'string.min': 'Password must be at least 8 characters long',
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  }),

  name: Joi.string().min(2).max(50).pattern(/^[a-zA-Z\s]+$/).messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 50 characters',
    'string.pattern.base': 'Name can only contain letters and spaces',
  }),

  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
  },

  coordinates: {
    latitude: Joi.number().min(-90).max(90).required().messages({
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90',
      'any.required': 'Latitude is required',
    }),
    longitude: Joi.number().min(-180).max(180).required().messages({
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180',
      'any.required': 'Longitude is required',
    }),
  },

  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.min': 'Rating must be between 1 and 5',
    'number.max': 'Rating must be between 1 and 5',
    'any.required': 'Rating is required',
  }),
};

// User validation schemas
export const userValidation = {
  register: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    firstName: commonSchemas.name.required(),
    lastName: commonSchemas.name.required(),
    phone: commonSchemas.phone.optional(),
    role: Joi.string().valid('CONSUMER', 'VENDOR').required(),
  }),

  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required(),
  }),

  updateProfile: Joi.object({
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
    phone: commonSchemas.phone.optional(),
    avatar: Joi.string().uri().optional(),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: commonSchemas.password,
  }),
};

// Vendor validation schemas
export const vendorValidation = {
  create: Joi.object({
    businessName: Joi.string().min(2).max(100).required(),
    businessDescription: Joi.string().max(1000).optional(),
    businessAddress: Joi.string().max(200).optional(),
    businessPhone: commonSchemas.phone.optional(),
    businessEmail: Joi.string().email().optional(),
    website: Joi.string().uri().optional(),
    serviceCategories: Joi.array().items(Joi.string()).min(1).required(),
    serviceTags: Joi.array().items(Joi.string()).optional(),
    hourlyRate: Joi.number().min(0).optional(),
    latitude: commonSchemas.coordinates.latitude.optional(),
    longitude: commonSchemas.coordinates.longitude.optional(),
    address: Joi.string().max(200).optional(),
    city: Joi.string().max(50).optional(),
    state: Joi.string().max(50).optional(),
    zipCode: Joi.string().max(10).optional(),
    licenseNumber: Joi.string().optional(),
  }),

  update: Joi.object({
    businessName: Joi.string().min(2).max(100).optional(),
    businessDescription: Joi.string().max(1000).optional(),
    businessAddress: Joi.string().max(200).optional(),
    businessPhone: commonSchemas.phone.optional(),
    businessEmail: Joi.string().email().optional(),
    website: Joi.string().uri().optional(),
    serviceCategories: Joi.array().items(Joi.string()).min(1).optional(),
    serviceTags: Joi.array().items(Joi.string()).optional(),
    hourlyRate: Joi.number().min(0).optional(),
    latitude: commonSchemas.coordinates.latitude.optional(),
    longitude: commonSchemas.coordinates.longitude.optional(),
    address: Joi.string().max(200).optional(),
    city: Joi.string().max(50).optional(),
    state: Joi.string().max(50).optional(),
    zipCode: Joi.string().max(10).optional(),
    licenseNumber: Joi.string().optional(),
  }),

  search: Joi.object({
    latitude: commonSchemas.coordinates.latitude.optional(),
    longitude: commonSchemas.coordinates.longitude.optional(),
    radius: Joi.number().min(1).max(500).default(50),
    serviceCategories: Joi.array().items(Joi.string()).optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
    minRating: Joi.number().min(1).max(5).optional(),
    maxHourlyRate: Joi.number().min(0).optional(),
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
  }),
};

// Rating validation schemas
export const ratingValidation = {
  create: Joi.object({
    vendorId: commonSchemas.id,
    costEffectiveness: commonSchemas.rating,
    qualityOfService: commonSchemas.rating,
    timelinessOfDelivery: commonSchemas.rating,
    professionalism: commonSchemas.rating,
    reviewTitle: Joi.string().max(100).optional(),
    reviewText: Joi.string().max(1000).optional(),
    jobDescription: Joi.string().max(500).optional(),
    jobValue: Joi.number().min(0).optional(),
    isPublic: Joi.boolean().default(true),
  }),

  update: Joi.object({
    costEffectiveness: commonSchemas.rating.optional(),
    qualityOfService: commonSchemas.rating.optional(),
    timelinessOfDelivery: commonSchemas.rating.optional(),
    professionalism: commonSchemas.rating.optional(),
    reviewTitle: Joi.string().max(100).optional(),
    reviewText: Joi.string().max(1000).optional(),
    jobDescription: Joi.string().max(500).optional(),
    jobValue: Joi.number().min(0).optional(),
    isPublic: Joi.boolean().optional(),
  }),
};

// Invitation validation schemas
export const invitationValidation = {
  send: Joi.object({
    type: Joi.string().valid('SMS', 'EMAIL').required(),
    recipientEmail: Joi.when('type', {
      is: 'EMAIL',
      then: commonSchemas.email,
      otherwise: Joi.optional(),
    }),
    recipientPhone: Joi.when('type', {
      is: 'SMS',
      then: commonSchemas.phone.required(),
      otherwise: Joi.optional(),
    }),
    message: Joi.string().max(500).optional(),
  }),

  bulk: Joi.object({
    type: Joi.string().valid('SMS', 'EMAIL').required(),
    recipients: Joi.array().items(
      Joi.object({
        email: Joi.string().email().optional(),
        phone: commonSchemas.phone.optional(),
        name: Joi.string().optional(),
      })
    ).min(1).max(100).required(),
    message: Joi.string().max(500).optional(),
  }),
};

// Contact validation schemas
export const contactValidation = {
  import: Joi.object({
    contacts: Joi.array().items(
      Joi.object({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        email: Joi.string().email().optional(),
        phone: commonSchemas.phone.required(),
        displayName: Joi.string().optional(),
      })
    ).min(1).max(1000).required(),
  }),

  sync: Joi.object({
    contacts: Joi.array().items(
      Joi.object({
        firstName: Joi.string().optional(),
        lastName: Joi.string().optional(),
        email: Joi.string().email().optional(),
        phone: commonSchemas.phone.required(),
        displayName: Joi.string().optional(),
      })
    ).required(),
  }),
};

// Parameter validation schemas
export const paramValidation = {
  id: Joi.object({
    id: commonSchemas.id,
  }),

  userId: Joi.object({
    userId: commonSchemas.id,
  }),

  vendorId: Joi.object({
    vendorId: commonSchemas.id,
  }),

  ratingId: Joi.object({
    ratingId: commonSchemas.id,
  }),

  invitationId: Joi.object({
    invitationId: commonSchemas.id,
  }),
};

// Query validation schemas
export const queryValidation = {
  pagination: Joi.object({
    page: commonSchemas.pagination.page,
    limit: commonSchemas.pagination.limit,
    sortBy: Joi.string().optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
  }),

  search: Joi.object({
    q: Joi.string().min(1).max(100).optional(),
    category: Joi.string().optional(),
    status: Joi.string().optional(),
    ...commonSchemas.pagination,
  }),
};

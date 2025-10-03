import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '@/middleware/validation';
import { authRateLimit, logAuthEvent } from '@/middleware/auth';
import { userValidation } from '@/middleware/validation';
import { AuthController } from '@/controllers/authController';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Rate limiting for auth endpoints
const authLimiter = authRateLimit(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

// Register new user
router.post(
  '/register',
  authLimiter,
  logAuthEvent('register_attempt'),
  validateRequest({ body: userValidation.register }),
  asyncHandler(AuthController.register)
);

// Login user
router.post(
  '/login',
  authLimiter,
  logAuthEvent('login_attempt'),
  validateRequest({ body: userValidation.login }),
  asyncHandler(AuthController.login)
);

// Auth0 callback
router.post(
  '/auth0/callback',
  logAuthEvent('auth0_callback'),
  asyncHandler(AuthController.auth0Callback)
);

// Social login (Google/Facebook)
router.post(
  '/social/login',
  logAuthEvent('social_login'),
  validateRequest({
    body: Joi.object({
      provider: Joi.string().valid('google', 'facebook').required(),
      accessToken: Joi.string().required(),
      profile: Joi.object({
        id: Joi.string().required(),
        email: Joi.string().email().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        avatar: Joi.string().uri().optional(),
      }).required(),
      role: Joi.string().valid('CONSUMER', 'VENDOR').optional(), // Optional role for new users
    }),
  }),
  asyncHandler(AuthController.socialLogin)
);

// Refresh token
router.post(
  '/refresh',
  authLimiter,
  asyncHandler(AuthController.refreshToken)
);

// Logout
router.post(
  '/logout',
  asyncHandler(AuthController.logout)
);

// Verify email
router.post(
  '/verify-email',
  validateRequest({
    body: Joi.object({
      token: Joi.string().required(),
    }),
  }),
  asyncHandler(AuthController.verifyEmail)
);

// Resend verification email
router.post(
  '/resend-verification',
  authLimiter,
  validateRequest({
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  }),
  asyncHandler(AuthController.resendVerification)
);

// Forgot password
router.post(
  '/forgot-password',
  authLimiter,
  validateRequest({
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  }),
  asyncHandler(AuthController.forgotPassword)
);

// Reset password
router.post(
  '/reset-password',
  authLimiter,
  validateRequest({
    body: Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
    }),
  }),
  asyncHandler(AuthController.resetPassword)
);

// Verify phone number
router.post(
  '/verify-phone',
  validateRequest({
    body: Joi.object({
      phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
      code: Joi.string().length(6).required(),
    }),
  }),
  asyncHandler(AuthController.verifyPhone)
);

// Send phone verification code
router.post(
  '/send-phone-verification',
  authLimiter,
  validateRequest({
    body: Joi.object({
      phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    }),
  }),
  asyncHandler(AuthController.sendPhoneVerification)
);

export default router;

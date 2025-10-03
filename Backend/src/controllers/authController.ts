import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { ManagementClient, AuthenticationClient } from 'auth0';
import { prisma } from '../services/database';
import { RedisService } from '../services/redis';
import { QueueService } from '../services/queue';
import { JobHelpers } from '../services/job-processors';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { config } from '../config/environment';
import { sanitizeObject } from '../utils/sanitization';

// Password validation utility
interface PasswordValidation {
  isValid: boolean;
  message: string;
}

const validatePassword = (password: string): PasswordValidation => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/(?=.*[@$!%*?&])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (@$!%*?&)' };
  }
  
  // Check for common weak passwords
  const weakPasswords = ['password', '12345678', 'qwerty123', 'admin123'];
  if (weakPasswords.includes(password.toLowerCase())) {
    return { isValid: false, message: 'Password is too common. Please choose a stronger password' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

// Auth0 clients (only initialize if Auth0 is configured)
let auth0Management: ManagementClient | null = null;
let auth0Auth: AuthenticationClient | null = null;

if (config.auth0.domain && config.auth0.clientId && config.auth0.clientSecret) {
  auth0Management = new ManagementClient({
    domain: config.auth0.domain,
    clientId: config.auth0.clientId,
    clientSecret: config.auth0.clientSecret
  });

  auth0Auth = new AuthenticationClient({
    domain: config.auth0.domain,
    clientId: config.auth0.clientId,
    clientSecret: config.auth0.clientSecret
  });
}

export class AuthController {
  // Register new user
  static async register(req: Request, res: Response): Promise<void> {
    // Sanitize user inputs to prevent XSS attacks
    const sanitizedBody = sanitizeObject(req.body, {
      emailFields: ['email'],
      nameFields: ['firstName', 'lastName'],
      phoneFields: ['phone']
    });
    
    const { email, password, firstName, lastName, phone, role } = sanitizedBody;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existingUser) {
      throw new AppError('User already exists with this email or phone', 409);
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new AppError(passwordValidation.message, 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        password: hashedPassword,
        role,
        status: 'PENDING_VERIFICATION',
      },
    });

    // NOTE: Profile creation removed - will be created when user completes profile setup
    // This allows the frontend to show the profile setup screen after registration

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token in Redis
    await RedisService.set(`refresh_token:${user.id}`, refreshToken, 30 * 24 * 60 * 60); // 30 days

    // Queue welcome email
    await JobHelpers.queueWelcomeEmail(
      email,
      firstName,
      `${config.corsOrigins[0]}/verify-email?token=${accessToken}`
    );

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  }

  // Login user
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    // Find user with password
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password with Auth0 or local storage
    let isPasswordValid = false;
    
    if (user.auth0Id && auth0Auth) {
      // Verify with Auth0
      try {
        await auth0Auth.oauth.passwordGrant({
          username: email,
          password,
          scope: 'openid profile email'
        });
        isPasswordValid = true;
      } catch (error) {
        logger.warn(`Auth0 login failed for ${email}:`, error);
        isPasswordValid = false;
      }
    } else if (user.password) {
      // Verify with local password hash
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      // No password set (should not happen with proper registration)
      isPasswordValid = false;
    }
    
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError('Account is suspended', 401);
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      ...(user.auth0Id && { auth0Id: user.auth0Id }),
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token in Redis
    await RedisService.set(`refresh_token:${user.id}`, refreshToken, 30 * 24 * 60 * 60);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  }

  // Auth0 callback
  static async auth0Callback(req: Request, res: Response): Promise<void> {
    const { auth0Id, email, firstName, lastName, avatar, role } = req.body;

    let user = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (!user) {
      // If no role provided, return user data and flag for role selection
      if (!role) {
        res.json({
          success: true,
          needsRoleSelection: true,
          tempUserData: {
            auth0Id,
            email,
            firstName,
            lastName,
            avatar,
          },
          message: 'Please select your role to complete registration',
        });
        return;
      }

      // Create new user from Auth0 data with selected role
      user = await prisma.user.create({
        data: {
          auth0Id,
          email,
          firstName,
          lastName,
          avatar,
          role: role, // Use provided role
          status: 'PENDING_VERIFICATION',
          emailVerified: true,
        },
      });

      // Create role-specific profile
      if (role === 'CONSUMER') {
        await prisma.consumer.create({
          data: {
            userId: user.id,
          },
        });
      } else if (role === 'VENDOR') {
        await prisma.vendor.create({
          data: {
            userId: user.id,
            businessName: `${firstName} ${lastName}`,
          },
        });
      }
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      ...(user.auth0Id && { auth0Id: user.auth0Id }),
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token
    await RedisService.set(`refresh_token:${user.id}`, refreshToken, 30 * 24 * 60 * 60);

    res.json({
      success: true,
      message: 'Auth0 authentication successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      },
    });
  }

  // Refresh token
  static async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    try {
      const decoded = verifyRefreshToken(refreshToken);
      
      // Check if refresh token exists in Redis
      const storedToken = await RedisService.get(`refresh_token:${decoded.userId}`);
      if (storedToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || (user.status !== 'ACTIVE' && user.status !== 'PENDING_VERIFICATION')) {
        throw new AppError('User not found or inactive', 401);
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        auth0Id: user.auth0Id,
      };

      const newAccessToken = generateToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      // Update refresh token in Redis
      await RedisService.set(`refresh_token:${user.id}`, newRefreshToken, 30 * 24 * 60 * 60);

      res.json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: {
          tokens: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          },
        },
      });
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  // Logout
  static async logout(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (userId) {
      // Remove refresh token from Redis
      await RedisService.del(`refresh_token:${userId}`);
    }

    res.json({
      success: true,
      message: 'Logout successful',
    });
  }

  // Verify email
  static async verifyEmail(req: Request, res: Response): Promise<void> {
    const { token } = req.body;

    try {
      const decoded = verifyRefreshToken(token);
      
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { 
          emailVerified: true,
          status: 'ACTIVE',
        },
      });

      res.json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      throw new AppError('Invalid or expired verification token', 400);
    }
  }

  // Resend verification email
  static async resendVerification(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.emailVerified) {
      throw new AppError('Email is already verified', 400);
    }

    // Generate verification token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const verificationToken = generateToken(tokenPayload);

    // Send verification email
    await QueueService.addEmailJob({
      to: email,
      subject: 'Verify Your Email Address - FixRx',
      template: config.sendgrid.templates.welcome,
      templateData: {
        firstName: user.firstName,
        verificationLink: `${config.corsOrigins[0]}/verify-email?token=${verificationToken}`,
      },
    });

    res.json({
      success: true,
      message: 'Verification email sent',
    });
  }

  // Forgot password
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent',
      });
      return;
    }

    // Generate reset token
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const resetToken = generateToken(tokenPayload);

    // Store reset token in Redis with 1 hour expiry
    await RedisService.set(`password_reset:${user.id}`, resetToken, 60 * 60);

    // Send password reset email
    await QueueService.addEmailJob({
      to: email,
      subject: 'Reset Your Password - FixRx',
      template: config.sendgrid.templates.passwordReset,
      templateData: {
        firstName: user.firstName,
        resetLink: `${config.corsOrigins[0]}/reset-password?token=${resetToken}`,
      },
    });

    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent',
    });
  }

  // Social login (Google/Facebook)
  static async socialLogin(req: Request, res: Response): Promise<void> {
    const { provider, accessToken, profile, role } = req.body;

    if (!provider || !accessToken || !profile) {
      throw new AppError('Missing required social login parameters', 400);
    }

    const { id: socialId, email, firstName, lastName, avatar } = profile;

    // Check if user exists with this social ID
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { auth0Id: socialId },
          { email },
        ],
      },
    });

    // New user signing up via OAuth
    if (!user) {
      // If no role provided, return user data and flag for role selection
      if (!role) {
        res.json({
          success: true,
          needsRoleSelection: true,
          tempUserData: {
            auth0Id: socialId,
            email,
            firstName,
            lastName,
            avatar,
          },
          message: 'Please select your role to complete registration',
        });
        return;
      }

      // Create new user with selected role
      user = await prisma.user.create({
        data: {
          auth0Id: socialId,
          email,
          firstName,
          lastName,
          avatar,
          role: role, // Use provided role
          status: 'PENDING_VERIFICATION',
          emailVerified: true,
        },
      });

      // Create role-specific profile
      if (role === 'CONSUMER') {
        await prisma.consumer.create({
          data: {
            userId: user.id,
          },
        });
      } else if (role === 'VENDOR') {
        await prisma.vendor.create({
          data: {
            userId: user.id,
            businessName: `${firstName} ${lastName}`,
          },
        });
      }
    } else if (!user.auth0Id) {
      // Link social account to existing user
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          auth0Id: socialId,
          avatar: avatar || user.avatar,
          emailVerified: true,
        },
      });
    }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      ...(user.auth0Id && { auth0Id: user.auth0Id }),
    };

    const jwtAccessToken = generateToken(tokenPayload);
    const jwtRefreshToken = generateRefreshToken(tokenPayload);

    // Store refresh token
    await RedisService.set(`refresh_token:${user.id}`, jwtRefreshToken, 30 * 24 * 60 * 60);

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    logger.info(`Social login successful: ${email} via ${provider}`);

    res.json({
      success: true,
      message: 'Social login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
        },
        tokens: {
          accessToken: jwtAccessToken,
          refreshToken: jwtRefreshToken,
        },
      },
    });
  }

  // Reset password
  static async resetPassword(req: Request, res: Response): Promise<void> {
    const { token, password } = req.body;

    try {
      const decoded = verifyRefreshToken(token);
      
      // Check if reset token exists
      const storedToken = await RedisService.get(`password_reset:${decoded.userId}`);
      if (storedToken !== token) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await prisma.user.update({
        where: { id: decoded.userId },
        data: { 
          password: hashedPassword,
        },
      });

      // Remove reset token
      await RedisService.del(`password_reset:${decoded.userId}`);

      res.json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error) {
      throw new AppError('Invalid or expired reset token', 400);
    }
  }

  // Verify phone
  static async verifyPhone(req: Request, res: Response): Promise<void> {
    const { phone, code } = req.body;
    const userId = req.user?.id;

    // Check verification code from Redis
    const storedCode = await RedisService.get(`phone_verification:${phone}`);
    if (storedCode !== code) {
      throw new AppError('Invalid verification code', 400);
    }

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { 
          phone,
          phoneVerified: true,
        },
      });
    }

    // Remove verification code
    await RedisService.del(`phone_verification:${phone}`);

    res.json({
      success: true,
      message: 'Phone verified successfully',
    });
  }

  // Send phone verification
  static async sendPhoneVerification(req: Request, res: Response): Promise<void> {
    const { phone } = req.body;

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store code in Redis with 10 minutes expiry
    await RedisService.set(`phone_verification:${phone}`, code, 10 * 60);

    // Send SMS
    await QueueService.addSMSJob({
      to: phone,
      message: `Your FixRx verification code is: ${code}`,
    });

    res.json({
      success: true,
      message: 'Verification code sent',
    });
  }
}

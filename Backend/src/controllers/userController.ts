import type { Request, Response } from 'express';
import { prisma } from '../services/database';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import bcrypt from 'bcryptjs';

export class UserController {
  // Get current user profile
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        lastLoginAt: true,
        consumer: {
          select: {
            id: true,
            preferences: true,
            location: true,
            searchRadius: true,
          },
        },
        vendor: {
          select: {
            id: true,
            businessName: true,
            businessDescription: true,
            serviceCategories: true,
            averageRating: true,
            totalRatings: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  }

  // Update current user profile
  static async updateCurrentUser(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { firstName, lastName, phone, avatar } = req.body;

    // Check if phone is already taken by another user
    if (phone) {
      const existingUser = await prisma.user.findFirst({
        where: {
          phone,
          id: { not: userId },
        },
      });

      if (existingUser) {
        throw new AppError('Phone number is already in use', 409);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        avatar,
        phoneVerified: phone ? false : undefined, // Reset phone verification if phone changed
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
      },
    });

    logger.info(`User profile updated: ${userId}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser },
    });
  }

  // Change password
  static async changePassword(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { currentPassword, newPassword } = req.body;

    // In a real implementation, you would verify the current password
    // const user = await prisma.user.findUnique({ where: { id: userId } });
    // const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    // if (!isCurrentPasswordValid) {
    //   throw new AppError('Current password is incorrect', 400);
    // }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        // password: hashedNewPassword, // Uncomment when adding password field to schema
      },
    });

    logger.info(`Password changed for user: ${userId}`);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  }

  // Delete current user account
  static async deleteCurrentUser(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info(`User account deleted: ${userId}`);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  }

  // Upload avatar
  static async uploadAvatar(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const file = req.file;

    if (!file) {
      throw new AppError('No file uploaded', 400);
    }

    // In a real implementation, you would upload to S3 and get the URL
    const avatarUrl = `https://your-s3-bucket.s3.amazonaws.com/avatars/${userId}/${file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        avatar: true,
      },
    });

    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: { user: updatedUser },
    });
  }

  // Get user by ID (admin or self only)
  static async getUserById(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  }

  // Update user by ID (admin or self only)
  static async updateUserById(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { firstName, lastName, phone, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone,
        avatar,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatar: true,
        role: true,
        status: true,
      },
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: updatedUser },
    });
  }

  // Delete user by ID (admin only)
  static async deleteUserById(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;

    await prisma.user.delete({
      where: { id: userId },
    });

    logger.info(`User deleted by admin: ${userId}`);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  }

  // Get all users (admin only)
  static async getAllUsers(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    
    // Validate sortBy field
    const validSortFields = ['createdAt', 'firstName', 'lastName', 'email', 'status', 'role'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 'asc' : 'desc';

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: Number(limit),
        orderBy: { [sortField]: sortDirection },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          role: true,
          status: true,
          emailVerified: true,
          phoneVerified: true,
          createdAt: true,
          lastLoginAt: true,
        },
      }),
      prisma.user.count(),
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  // Update user status (admin only)
  static async updateUserStatus(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    const { status } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
      },
    });

    logger.info(`User status updated: ${userId} -> ${status}`);

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: { user: updatedUser },
    });
  }

  // Get user statistics (admin only)
  static async getUserStats(req: Request, res: Response): Promise<void> {
    const [
      totalUsers,
      activeUsers,
      consumerCount,
      vendorCount,
      pendingVerification,
      suspendedUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'CONSUMER' } }),
      prisma.user.count({ where: { role: 'VENDOR' } }),
      prisma.user.count({ where: { status: 'PENDING_VERIFICATION' } }),
      prisma.user.count({ where: { status: 'SUSPENDED' } }),
    ]);

    // Get user registration trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationTrend = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _count: {
        id: true,
      },
    });

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          consumerCount,
          vendorCount,
          pendingVerification,
          suspendedUsers,
        },
        trends: {
          registrationTrend,
        },
      },
    });
  }
}

import type { Request, Response } from 'express';
import { prisma } from '../services/database';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class ConsumerController {
  // Get current consumer profile
  static async getCurrentConsumerProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const consumer = await prisma.consumer.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
    });

    if (!consumer) {
      throw new AppError('Consumer profile not found', 404);
    }

    res.json({
      success: true,
      data: { consumer },
    });
  }

  // Create consumer profile
  static async createConsumerProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { preferences, location, searchRadius } = req.body;

    // Check if consumer profile already exists
    const existingConsumer = await prisma.consumer.findUnique({
      where: { userId },
    });

    if (existingConsumer) {
      throw new AppError('Consumer profile already exists', 409);
    }

    const consumer = await prisma.consumer.create({
      data: {
        userId,
        preferences,
        location,
        searchRadius: searchRadius || 50,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Update user status to ACTIVE after profile creation
    await prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
    });

    logger.info(`Consumer profile created and user activated: ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Consumer profile created successfully',
      data: { consumer },
    });
  }

  // Update consumer profile
  static async updateConsumerProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const updateData = req.body;

    const consumer = await prisma.consumer.update({
      where: { userId },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    logger.info(`Consumer profile updated: ${userId}`);

    res.json({
      success: true,
      message: 'Consumer profile updated successfully',
      data: { consumer },
    });
  }

  // Get consumer connections
  static async getConsumerConnections(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const consumer = await prisma.consumer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!consumer) {
      throw new AppError('Consumer profile not found', 404);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [connections, total] = await Promise.all([
      prisma.connection.findMany({
        where: { consumerId: consumer.id },
        skip,
        take: Number(limit),
        include: {
          vendor: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.connection.count({ where: { consumerId: consumer.id } }),
    ]);

    res.json({
      success: true,
      data: {
        connections,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  // Connect to vendor
  static async connectToVendor(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { vendorId } = req.params;
    const { notes } = req.body;

    const consumer = await prisma.consumer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!consumer) {
      throw new AppError('Consumer profile not found', 404);
    }

    // Check if vendor exists
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    // Check if connection already exists
    const existingConnection = await prisma.connection.findUnique({
      where: {
        consumerId_vendorId: {
          consumerId: consumer.id,
          vendorId,
        },
      },
    });

    if (existingConnection) {
      throw new AppError('Connection already exists', 409);
    }

    const connection = await prisma.connection.create({
      data: {
        consumerId: consumer.id,
        vendorId,
        status: 'PENDING',
        notes,
      },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    logger.info(`Connection created: ${consumer.id} -> ${vendorId}`);

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully',
      data: { connection },
    });
  }

  // Update connection status
  static async updateConnection(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { vendorId } = req.params;
    const { status, notes } = req.body;

    const consumer = await prisma.consumer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!consumer) {
      throw new AppError('Consumer profile not found', 404);
    }

    const connection = await prisma.connection.findUnique({
      where: {
        consumerId_vendorId: {
          consumerId: consumer.id,
          vendorId,
        },
      },
    });

    if (!connection) {
      throw new AppError('Connection not found', 404);
    }

    const updatedConnection = await prisma.connection.update({
      where: {
        consumerId_vendorId: {
          consumerId: consumer.id,
          vendorId,
        },
      },
      data: {
        status,
        notes,
        connectedAt: status === 'CONNECTED' ? new Date() : connection.connectedAt,
      },
      include: {
        vendor: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Connection updated successfully',
      data: { connection: updatedConnection },
    });
  }

  // Remove connection
  static async removeConnection(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { vendorId } = req.params;

    const consumer = await prisma.consumer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!consumer) {
      throw new AppError('Consumer profile not found', 404);
    }

    const connection = await prisma.connection.findUnique({
      where: {
        consumerId_vendorId: {
          consumerId: consumer.id,
          vendorId,
        },
      },
    });

    if (!connection) {
      throw new AppError('Connection not found', 404);
    }

    await prisma.connection.delete({
      where: {
        consumerId_vendorId: {
          consumerId: consumer.id,
          vendorId,
        },
      },
    });

    logger.info(`Connection removed: ${consumer.id} -> ${vendorId}`);

    res.json({
      success: true,
      message: 'Connection removed successfully',
    });
  }

  // Get consumer ratings given
  static async getGivenRatings(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { giverId: userId },
        skip,
        take: Number(limit),
        include: {
          vendor: {
            select: {
              businessName: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.rating.count({ where: { giverId: userId } }),
    ]);

    res.json({
      success: true,
      data: {
        ratings,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  // Get consumer favorites (placeholder - would need a favorites table)
  static async getFavoriteVendors(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20 } = req.query;

    // This is a placeholder implementation
    // In a real app, you'd have a favorites table
    res.json({
      success: true,
      data: {
        vendors: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          pages: 0,
        },
      },
    });
  }

  // Add vendor to favorites
  static async addToFavorites(req: Request, res: Response): Promise<void> {
    const { vendorId } = req.params;

    // Placeholder implementation
    res.json({
      success: true,
      message: 'Vendor added to favorites',
    });
  }

  // Remove vendor from favorites
  static async removeFromFavorites(req: Request, res: Response): Promise<void> {
    const { vendorId } = req.params;

    // Placeholder implementation
    res.json({
      success: true,
      message: 'Vendor removed from favorites',
    });
  }

  // Get search history (placeholder)
  static async getSearchHistory(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20 } = req.query;

    // Placeholder implementation
    res.json({
      success: true,
      data: {
        searches: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          pages: 0,
        },
      },
    });
  }

  // Clear search history
  static async clearSearchHistory(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({
      success: true,
      message: 'Search history cleared',
    });
  }

  // Get consumer analytics
  static async getConsumerAnalytics(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const consumer = await prisma.consumer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!consumer) {
      throw new AppError('Consumer profile not found', 404);
    }

    const [
      totalConnections,
      totalRatingsGiven,
      averageRatingGiven,
      recentActivity,
    ] = await Promise.all([
      prisma.connection.count({ 
        where: { 
          consumerId: consumer.id,
          status: 'CONNECTED',
        } 
      }),
      prisma.rating.count({ where: { giverId: userId } }),
      prisma.rating.aggregate({
        where: { giverId: userId },
        _avg: { overallRating: true },
      }),
      prisma.rating.findMany({
        where: { giverId: userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: {
            select: {
              businessName: true,
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalConnections,
          totalRatingsGiven,
          averageRatingGiven: averageRatingGiven._avg.overallRating || 0,
        },
        recentActivity,
      },
    });
  }

  // Update location
  static async updateLocation(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const locationData = req.body;

    const consumer = await prisma.consumer.update({
      where: { userId },
      data: { location: locationData },
      select: {
        id: true,
        location: true,
      },
    });

    res.json({
      success: true,
      message: 'Location updated successfully',
      data: { consumer },
    });
  }

  // Get consumer dashboard
  static async getDashboard(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    // Get consumer profile
    const consumer = await prisma.consumer.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!consumer) {
      throw new AppError('Consumer profile not found', 404);
    }

    // Get basic dashboard data
    const dashboardData = {
      user: consumer.user,
      profile: {
        id: consumer.id,
        location: consumer.location,
        preferences: consumer.preferences,
        searchRadius: consumer.searchRadius,
      },
      stats: {
        connectionsCount: 0,
        ratingsGiven: 0,
        favoriteVendors: 0,
      },
    };

    res.json({
      success: true,
      data: dashboardData,
    });
  }
}

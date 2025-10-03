import type { Request, Response } from 'express';
import { prisma } from '../services/database';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class RatingController {
  // Create rating (consumer only)
  static async createRating(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const {
      vendorId,
      costEffectiveness,
      qualityOfService,
      timelinessOfDelivery,
      professionalism,
      reviewTitle,
      reviewText,
      jobDescription,
      jobValue,
      isPublic = true,
    } = req.body;

    // Check if consumer profile exists
    const consumer = await prisma.consumer.findUnique({
      where: { userId },
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

    // Check if rating already exists
    const existingRating = await prisma.rating.findUnique({
      where: {
        giverId_receiverId_consumerId_vendorId: {
          giverId: userId,
          receiverId: vendor.userId,
          consumerId: consumer.id,
          vendorId,
        },
      },
    });

    if (existingRating) {
      throw new AppError('You have already rated this vendor', 409);
    }

    // Calculate overall rating
    const overallRating = (costEffectiveness + qualityOfService + timelinessOfDelivery + professionalism) / 4;

    const rating = await prisma.rating.create({
      data: {
        giverId: userId,
        receiverId: vendor.userId,
        consumerId: consumer.id,
        vendorId,
        costEffectiveness,
        qualityOfService,
        timelinessOfDelivery,
        professionalism,
        overallRating,
        reviewTitle,
        reviewText,
        jobDescription,
        jobValue: jobValue ? Number(jobValue) : null,
        isPublic,
      },
      include: {
        giver: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        vendor: {
          select: {
            businessName: true,
          },
        },
      },
    });

    // Update vendor's average ratings
    await RatingController.updateVendorRatings(vendorId);

    logger.info(`Rating created for vendor ${vendorId} by consumer ${consumer.id}`);

    res.status(201).json({
      success: true,
      message: 'Rating created successfully',
      data: { rating },
    });
  }

  // Get rating by ID
  static async getRatingById(req: Request, res: Response): Promise<void> {
    const { ratingId } = req.params;

    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
      include: {
        giver: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
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
    });

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    res.json({
      success: true,
      data: { rating },
    });
  }

  // Update rating (only by rating creator)
  static async updateRating(req: Request, res: Response): Promise<void> {
    const { ratingId } = req.params;
    const userId = req.user!.id;
    const updateData = req.body;

    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    if (rating.giverId !== userId) {
      throw new AppError('You can only update your own ratings', 403);
    }

    // Recalculate overall rating if individual ratings are updated
    if (updateData.costEffectiveness || updateData.qualityOfService || 
        updateData.timelinessOfDelivery || updateData.professionalism) {
      const cost = updateData.costEffectiveness || rating.costEffectiveness;
      const quality = updateData.qualityOfService || rating.qualityOfService;
      const timeliness = updateData.timelinessOfDelivery || rating.timelinessOfDelivery;
      const professional = updateData.professionalism || rating.professionalism;
      
      updateData.overallRating = (cost + quality + timeliness + professional) / 4;
    }

    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: updateData,
      include: {
        giver: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        vendor: {
          select: {
            businessName: true,
          },
        },
      },
    });

    // Update vendor's rating statistics
    await updateVendorRatingStats(rating.vendorId);

    logger.info(`Rating updated: ${ratingId}`);

    res.json({
      success: true,
      message: 'Rating updated successfully',
      data: { rating: updatedRating },
    });
  }

  // Delete rating (only by rating creator or admin)
  static async deleteRating(req: Request, res: Response): Promise<void> {
    const { ratingId } = req.params;
    const userId = req.user!.id;
    const userRole = req.user!.role;

    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    if (rating.giverId !== userId && userRole !== 'ADMIN') {
      throw new AppError('You can only delete your own ratings', 403);
    }

    await prisma.rating.delete({
      where: { id: ratingId },
    });

    // Update vendor's rating statistics
    await updateVendorRatingStats(rating.vendorId);

    logger.info(`Rating deleted: ${ratingId}`);

    res.json({
      success: true,
      message: 'Rating deleted successfully',
    });
  }

  // Get ratings for a vendor
  static async getVendorRatings(req: Request, res: Response): Promise<void> {
    const { vendorId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      minRating, 
      category, 
      verified 
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: {
      vendorId: string;
      isPublic: boolean;
      overallRating?: { gte: number };
      createdAt?: { gte: Date };
      isVerified?: boolean;
      [key: string]: any;
    } = { 
      vendorId,
      isPublic: true,
    };

    if (minRating) {
      where.overallRating = { gte: Number(minRating) };
    }

    if (verified !== undefined) {
      where.isVerified = verified === 'true';
    }

    // Filter by specific rating category
    if (category) {
      const categoryField = category as string;
      if (['costEffectiveness', 'qualityOfService', 'timelinessOfDelivery', 'professionalism'].includes(categoryField)) {
        where[categoryField] = { gte: minRating ? Number(minRating) : 1 };
      }
    }

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          giver: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.rating.count({ where }),
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

  // Get ratings by a consumer
  static async getConsumerRatings(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
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

  // Upload rating images
  static async uploadRatingImages(req: Request, res: Response): Promise<void> {
    const { ratingId } = req.params;
    const userId = req.user!.id;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    if (rating.giverId !== userId) {
      throw new AppError('You can only upload images to your own ratings', 403);
    }

    // In a real implementation, upload to S3 and get URLs
    const imageUrls = files.map(file => 
      `https://your-s3-bucket.s3.amazonaws.com/ratings/${ratingId}/${file.filename}`
    );

    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: {
        reviewImages: [...rating.reviewImages, ...imageUrls],
      },
      select: {
        id: true,
        reviewImages: true,
      },
    });

    res.json({
      success: true,
      message: 'Rating images uploaded successfully',
      data: { rating: updatedRating },
    });
  }

  // Delete rating image
  static async deleteRatingImage(req: Request, res: Response): Promise<void> {
    const { ratingId, imageId } = req.params;
    const userId = req.user!.id;

    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    if (rating.giverId !== userId) {
      throw new AppError('You can only delete images from your own ratings', 403);
    }

    const imageIndex = parseInt(imageId);
    if (imageIndex < 0 || imageIndex >= rating.reviewImages.length) {
      throw new AppError('Invalid image index', 400);
    }

    const updatedImages = rating.reviewImages.filter((_: string, index: number) => index !== imageIndex);

    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: { reviewImages: updatedImages },
      select: {
        id: true,
        reviewImages: true,
      },
    });

    res.json({
      success: true,
      message: 'Rating image deleted successfully',
      data: { rating: updatedRating },
    });
  }

  // Mark rating as helpful
  static async markRatingHelpful(req: Request, res: Response): Promise<void> {
    const { ratingId } = req.params;

    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: {
        helpfulCount: rating.helpfulCount + 1,
      },
      select: {
        id: true,
        helpfulCount: true,
      },
    });

    res.json({
      success: true,
      message: 'Rating marked as helpful',
      data: { rating: updatedRating },
    });
  }

  // Remove helpful mark
  static async removeHelpfulMark(req: Request, res: Response): Promise<void> {
    const { ratingId } = req.params;

    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    const updatedRating = await prisma.rating.update({
      where: { id: ratingId },
      data: {
        helpfulCount: Math.max(0, rating.helpfulCount - 1),
      },
      select: {
        id: true,
        helpfulCount: true,
      },
    });

    res.json({
      success: true,
      message: 'Helpful mark removed',
      data: { rating: updatedRating },
    });
  }

  // Report rating
  static async reportRating(req: Request, res: Response): Promise<void> {
    const { ratingId } = req.params;
    const { reason, description } = req.body;
    const userId = req.user!.id;

    const rating = await prisma.rating.findUnique({
      where: { id: ratingId },
    });

    if (!rating) {
      throw new AppError('Rating not found', 404);
    }

    // In a real implementation, you would store the report in a separate table
    // For now, we'll just log it
    logger.warn(`Rating reported: ${ratingId}`, {
      reportedBy: userId,
      reason,
      description,
      ratingId,
    });

    res.json({
      success: true,
      message: 'Rating reported successfully',
    });
  }

  // Get rating statistics for vendor
  static async getVendorRatingStats(req: Request, res: Response): Promise<void> {
    const { vendorId } = req.params;

    const [
      totalRatings,
      averageRating,
      categoryAverages,
      ratingDistribution,
    ] = await Promise.all([
      prisma.rating.count({ where: { vendorId } }),
      prisma.rating.aggregate({
        where: { vendorId },
        _avg: {
          overallRating: true,
          costEffectiveness: true,
          qualityOfService: true,
          timelinessOfDelivery: true,
          professionalism: true,
        },
      }),
      prisma.rating.aggregate({
        where: { vendorId },
        _avg: {
          costEffectiveness: true,
          qualityOfService: true,
          timelinessOfDelivery: true,
          professionalism: true,
        },
      }),
      prisma.rating.groupBy({
        by: ['overallRating'],
        where: { vendorId },
        _count: { overallRating: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalRatings,
        averageRating: averageRating._avg.overallRating || 0,
        categoryAverages: {
          costEffectiveness: categoryAverages._avg.costEffectiveness || 0,
          qualityOfService: categoryAverages._avg.qualityOfService || 0,
          timelinessOfDelivery: categoryAverages._avg.timelinessOfDelivery || 0,
          professionalism: categoryAverages._avg.professionalism || 0,
        },
        ratingDistribution,
      },
    });
  }

  // Get trending ratings
  static async getTrendingRatings(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const ratings = await prisma.rating.findMany({
      where: {
        isPublic: true,
        helpfulCount: { gte: 3 }, // Ratings with at least 3 helpful marks
      },
      skip,
      take: Number(limit),
      include: {
        giver: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
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
      orderBy: [
        { helpfulCount: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({
      success: true,
      data: { ratings },
    });
  }

  // Get recent ratings
  static async getRecentRatings(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const ratings = await prisma.rating.findMany({
      where: { isPublic: true },
      skip,
      take: Number(limit),
      include: {
        giver: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
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
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: { ratings },
    });
  }

  // Verify rating (admin only)
  static async verifyRating(req: Request, res: Response): Promise<void> {
    const { ratingId } = req.params;
    const { isVerified } = req.body;

    const rating = await prisma.rating.update({
      where: { id: ratingId },
      data: { isVerified },
      select: {
        id: true,
        isVerified: true,
      },
    });

    logger.info(`Rating verification updated: ${ratingId} -> ${isVerified}`);

    res.json({
      success: true,
      message: 'Rating verification updated successfully', 
      data: { rating },
    });
  }

  // Update vendor ratings with detailed analytics
  static async updateVendorRatings(vendorId: string): Promise<void> {
    const ratings = await prisma.rating.findMany({
      where: { vendorId },
      select: {
        costEffectiveness: true,
        qualityOfService: true,
        timelinessOfDelivery: true,
        professionalism: true,
        overallRating: true,
      },
    });

    if (ratings.length === 0) return;

    // Calculate detailed averages (convert Decimal to number)
    const averages = {
      costEffectiveness: ratings.reduce((sum, r) => sum + Number(r.costEffectiveness), 0) / ratings.length,
      qualityOfService: ratings.reduce((sum, r) => sum + Number(r.qualityOfService), 0) / ratings.length,
      timelinessOfDelivery: ratings.reduce((sum, r) => sum + Number(r.timelinessOfDelivery), 0) / ratings.length,
      professionalism: ratings.reduce((sum, r) => sum + Number(r.professionalism), 0) / ratings.length,
      overall: ratings.reduce((sum, r) => sum + Number(r.overallRating), 0) / ratings.length,
    };

    // Update vendor with detailed ratings
    await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        averageRating: averages.overall,
        totalRatings: ratings.length,
      },
    });

    logger.info(`Updated vendor ${vendorId} ratings: ${ratings.length} reviews, avg: ${averages.overall.toFixed(2)}`);
  }
}

// Helper function to update vendor rating statistics
async function updateVendorRatingStats(vendorId: string): Promise<void> {
  const stats = await prisma.rating.aggregate({
    where: { vendorId },
    _avg: { overallRating: true },
    _count: { id: true },
  });

  await prisma.vendor.update({
    where: { id: vendorId },
    data: {
      averageRating: stats._avg.overallRating || 0,
      totalRatings: stats._count.id,
    },
  });
}

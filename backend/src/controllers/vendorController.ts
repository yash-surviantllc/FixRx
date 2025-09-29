import type { Request, Response } from 'express';
import { prisma } from '../services/database';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

type VendorWithUser = {
  id: string;
  userId: string;
  businessName: string;
  businessDescription?: string | null;
  businessAddress?: string | null;
  businessPhone?: string | null;
  businessEmail?: string | null;
  website?: string | null;
  serviceCategories: string[];
  serviceTags: string[];
  hourlyRate?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country: string;
  licenseNumber?: string | null;
  totalRatings: number;
  averageRating: number;
  totalJobs: number;
  responseTime?: number | null;
  portfolioImages: string[];
  certifications: string[];
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    status: string;
    email?: string;
    phone?: string;
    createdAt?: Date;
  };
  distance?: number | null;
};

export class VendorController {
  // Search vendors with geographic and filter options
  static async searchVendors(req: Request, res: Response): Promise<void> {
    const {
      latitude,
      longitude,
      radius = 50,
      serviceCategories,
      city,
      state,
      minRating,
      maxHourlyRate,
      page = 1,
      limit = 20,
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: {
      user: { status: string };
      latitude?: { gte: number; lte: number };
      longitude?: { gte: number; lte: number };
      serviceCategories?: { hasSome: string[] };
      city?: { contains: string; mode: 'insensitive' };
      state?: { contains: string; mode: 'insensitive' };
      averageRating?: { gte: number };
      hourlyRate?: { lte: number };
    } = {
      user: {
        status: 'ACTIVE',
      },
    };

    // Geographic search using bounding box
    if (latitude && longitude) {
      const lat = Number(latitude);
      const lng = Number(longitude);
      const radiusKm = Number(radius);
      
      // Calculate bounding box (approximate)
      const latDelta = radiusKm / 111; // 1 degree lat ≈ 111 km
      const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

      where.latitude = {
        gte: lat - latDelta,
        lte: lat + latDelta,
      };
      where.longitude = {
        gte: lng - lngDelta,
        lte: lng + lngDelta,
      };
    }

    // Filter by service categories
    if (serviceCategories) {
      const categories = Array.isArray(serviceCategories) 
        ? serviceCategories 
        : [serviceCategories];
      where.serviceCategories = {
        hasSome: categories,
      };
    }

    // Filter by location
    if (city) where.city = { contains: city as string, mode: 'insensitive' };
    if (state) where.state = { contains: state as string, mode: 'insensitive' };

    // Filter by rating
    if (minRating) {
      where.averageRating = { gte: Number(minRating) };
    }

    // Filter by hourly rate
    if (maxHourlyRate) {
      where.hourlyRate = { lte: Number(maxHourlyRate) };
    }

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              status: true,
            },
          },
        },
        orderBy: [
          { averageRating: 'desc' },
          { totalRatings: 'desc' },
          { createdAt: 'desc' },
        ],
      }),
      prisma.vendor.count({ where }),
    ]);

    // Calculate distance if coordinates provided
    const vendorsWithDistance = vendors.map((vendor: VendorWithUser) => {
      let distance = null;
      if (latitude && longitude && vendor.latitude && vendor.longitude) {
        const lat1 = Number(latitude);
        const lng1 = Number(longitude);
        const lat2 = Number(vendor.latitude);
        const lng2 = Number(vendor.longitude);
        
        // Haversine formula for distance calculation
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distance = R * c;
      }

      return {
        ...vendor,
        distance: distance ? Math.round(distance * 10) / 10 : null,
      };
    });

    res.json({
      success: true,
      data: {
        vendors: vendorsWithDistance,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
        filters: {
          latitude: latitude ? Number(latitude) : null,
          longitude: longitude ? Number(longitude) : null,
          radius: Number(radius),
          serviceCategories,
          city,
          state,
          minRating: minRating ? Number(minRating) : null,
          maxHourlyRate: maxHourlyRate ? Number(maxHourlyRate) : null,
        },
      },
    });
  }

  // Get vendor by ID
  static async getVendorById(req: Request, res: Response): Promise<void> {
    const { vendorId } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            status: true,
            createdAt: true,
          },
        },
        receivedRatings: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: {
            giver: {
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

    if (!vendor) {
      throw new AppError('Vendor not found', 404);
    }

    res.json({
      success: true,
      data: { vendor },
    });
  }

  // Get current vendor profile
  static async getCurrentVendorProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const vendor = await prisma.vendor.findUnique({
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

    if (!vendor) {
      throw new AppError('Vendor profile not found', 404);
    }

    res.json({
      success: true,
      data: { vendor },
    });
  }

  // Create vendor profile
  static async createVendorProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const {
      businessName,
      businessDescription,
      businessAddress,
      businessPhone,
      businessEmail,
      website,
      serviceCategories,
      serviceTags,
      hourlyRate,
      latitude,
      longitude,
      address,
      city,
      state,
      zipCode,
      licenseNumber,
    } = req.body;

    // Check if vendor profile already exists
    const existingVendor = await prisma.vendor.findUnique({
      where: { userId },
    });

    if (existingVendor) {
      throw new AppError('Vendor profile already exists', 409);
    }

    const vendor = await prisma.vendor.create({
      data: {
        userId,
        businessName,
        businessDescription,
        businessAddress,
        businessPhone,
        businessEmail,
        website,
        serviceCategories,
        serviceTags: serviceTags || [],
        hourlyRate: hourlyRate ? Number(hourlyRate) : null,
        latitude: latitude ? Number(latitude) : null,
        longitude: longitude ? Number(longitude) : null,
        address,
        city,
        state,
        zipCode,
        licenseNumber,
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

    logger.info(`Vendor profile created: ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Vendor profile created successfully',
      data: { vendor },
    });
  }

  // Update vendor profile
  static async updateVendorProfile(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const updateData = req.body;

    // Convert numeric fields
    if (updateData.hourlyRate) updateData.hourlyRate = Number(updateData.hourlyRate);
    if (updateData.latitude) updateData.latitude = Number(updateData.latitude);
    if (updateData.longitude) updateData.longitude = Number(updateData.longitude);

    const vendor = await prisma.vendor.update({
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

    logger.info(`Vendor profile updated: ${userId}`);

    res.json({
      success: true,
      message: 'Vendor profile updated successfully',
      data: { vendor },
    });
  }

  // Upload portfolio images
  static async uploadPortfolioImages(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    // In a real implementation, upload to S3 and get URLs
    const imageUrls = files.map(file => 
      `https://your-s3-bucket.s3.amazonaws.com/portfolio/${userId}/${file.filename}`
    );

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { portfolioImages: true },
    });

    if (!vendor) {
      throw new AppError('Vendor profile not found', 404);
    }

    const updatedVendor = await prisma.vendor.update({
      where: { userId },
      data: {
        portfolioImages: [...vendor.portfolioImages, ...imageUrls],
      },
      select: {
        id: true,
        portfolioImages: true,
      },
    });

    res.json({
      success: true,
      message: 'Portfolio images uploaded successfully',
      data: { vendor: updatedVendor },
    });
  }

  // Delete portfolio image
  static async deletePortfolioImage(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { imageId } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { portfolioImages: true },
    });

    if (!vendor) {
      throw new AppError('Vendor profile not found', 404);
    }

    const imageIndex = parseInt(imageId);
    if (imageIndex < 0 || imageIndex >= vendor.portfolioImages.length) {
      throw new AppError('Invalid image index', 400);
    }

    const updatedImages = vendor.portfolioImages.filter((_: string, index: number) => index !== imageIndex);

    const updatedVendor = await prisma.vendor.update({
      where: { userId },
      data: { portfolioImages: updatedImages },
      select: {
        id: true,
        portfolioImages: true,
      },
    });

    res.json({
      success: true,
      message: 'Portfolio image deleted successfully',
      data: { vendor: updatedVendor },
    });
  }

  // Upload certifications
  static async uploadCertifications(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      throw new AppError('No files uploaded', 400);
    }

    // In a real implementation, upload to S3 and get URLs
    const certificationUrls = files.map(file => 
      `https://your-s3-bucket.s3.amazonaws.com/certifications/${userId}/${file.filename}`
    );

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { certifications: true },
    });

    if (!vendor) {
      throw new AppError('Vendor profile not found', 404);
    }

    const updatedVendor = await prisma.vendor.update({
      where: { userId },
      data: {
        certifications: [...vendor.certifications, ...certificationUrls],
      },
      select: {
        id: true,
        certifications: true,
      },
    });

    res.json({
      success: true,
      message: 'Certifications uploaded successfully',
      data: { vendor: updatedVendor },
    });
  }

  // Delete certification
  static async deleteCertification(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { certId } = req.params;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { certifications: true },
    });

    if (!vendor) {
      throw new AppError('Vendor profile not found', 404);
    }

    const certIndex = parseInt(certId);
    if (certIndex < 0 || certIndex >= vendor.certifications.length) {
      throw new AppError('Invalid certification index', 400);
    }

    const updatedCertifications = vendor.certifications.filter((_: string, index: number) => index !== certIndex);

    const updatedVendor = await prisma.vendor.update({
      where: { userId },
      data: { certifications: updatedCertifications },
      select: {
        id: true,
        certifications: true,
      },
    });

    res.json({
      success: true,
      message: 'Certification deleted successfully',
      data: { vendor: updatedVendor },
    });
  }

  // Get vendor ratings
  static async getVendorRatings(req: Request, res: Response): Promise<void> {
    const { vendorId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [ratings, total] = await Promise.all([
      prisma.rating.findMany({
        where: { vendorId },
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
      prisma.rating.count({ where: { vendorId } }),
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

  // Get vendor analytics
  static async getVendorAnalytics(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!vendor) {
      throw new AppError('Vendor profile not found', 404);
    }

    const [
      totalRatings,
      averageRating,
      totalConnections,
      recentRatings,
      ratingDistribution,
    ] = await Promise.all([
      prisma.rating.count({ where: { vendorId: vendor.id } }),
      prisma.rating.aggregate({
        where: { vendorId: vendor.id },
        _avg: { overallRating: true },
      }),
      prisma.connection.count({ 
        where: { 
          vendorId: vendor.id,
          status: 'CONNECTED',
        } 
      }),
      prisma.rating.findMany({
        where: { vendorId: vendor.id },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          giver: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
      }),
      prisma.rating.groupBy({
        by: ['overallRating'],
        where: { vendorId: vendor.id },
        _count: { overallRating: true },
      }),
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalRatings,
          averageRating: averageRating._avg.overallRating || 0,
          totalConnections,
        },
        recentRatings,
        ratingDistribution,
      },
    });
  }

  // Get vendor connections
  static async getVendorConnections(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const vendor = await prisma.vendor.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!vendor) {
      throw new AppError('Vendor profile not found', 404);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [connections, total] = await Promise.all([
      prisma.connection.findMany({
        where: { vendorId: vendor.id },
        skip,
        take: Number(limit),
        include: {
          consumer: {
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
      prisma.connection.count({ where: { vendorId: vendor.id } }),
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

  // Update availability
  static async updateAvailability(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { availability } = req.body;

    const vendor = await prisma.vendor.update({
      where: { userId },
      data: { availability },
      select: {
        id: true,
        availability: true,
      },
    });

    res.json({
      success: true,
      message: 'Availability updated successfully',
      data: { vendor },
    });
  }

  // Get nearby vendors
  static async getNearbyVendors(req: Request, res: Response): Promise<void> {
    const { latitude, longitude } = req.params;
    const { radius = 50, serviceCategories, limit = 20 } = req.query;

    const lat = Number(latitude);
    const lng = Number(longitude);
    const radiusKm = Number(radius);

    // Calculate bounding box
    const latDelta = radiusKm / 111;
    const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));

    const where: {
      latitude: { gte: number; lte: number };
      longitude: { gte: number; lte: number };
      user: { status: string };
      serviceCategories?: { hasSome: string[] };
    } = {
      latitude: {
        gte: lat - latDelta,
        lte: lat + latDelta,
      },
      longitude: {
        gte: lng - lngDelta,
        lte: lng + lngDelta,
      },
      user: {
        status: 'ACTIVE',
      },
    };

    if (serviceCategories) {
      const categories = Array.isArray(serviceCategories) 
        ? serviceCategories 
        : [serviceCategories];
      where.serviceCategories = {
        hasSome: categories,
      };
    }

    const vendors = await prisma.vendor.findMany({
      where,
      take: Number(limit),
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: [
        { averageRating: 'desc' },
        { totalRatings: 'desc' },
      ],
    });

    // Calculate exact distances
    const vendorsWithDistance = vendors.map((vendor: VendorWithUser) => {
      const distance = vendor.latitude && vendor.longitude 
        ? calculateDistance(lat, lng, Number(vendor.latitude), Number(vendor.longitude))
        : null;

      return {
        ...vendor,
        distance: distance ? Math.round(distance * 10) / 10 : null,
      };
    }).filter((vendor: VendorWithUser) => !vendor.distance || vendor.distance <= radiusKm);

    res.json({
      success: true,
      data: { vendors: vendorsWithDistance },
    });
  }

  // Verify license
  static async verifyLicense(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { licenseNumber, licenseType, state } = req.body;

    // In a real implementation, you would call an external API like Mesh
    // For now, we'll simulate the verification process
    const isValid = Math.random() > 0.2; // 80% success rate for demo

    const vendor = await prisma.vendor.update({
      where: { userId },
      data: {
        licenseNumber,
        licenseVerification: isValid ? 'VERIFIED' : 'FAILED',
        licenseVerifiedAt: isValid ? new Date() : null,
      },
      select: {
        id: true,
        licenseNumber: true,
        licenseVerification: true,
        licenseVerifiedAt: true,
      },
    });

    logger.info(`License verification ${isValid ? 'successful' : 'failed'}: ${userId}`);

    res.json({
      success: true,
      message: `License verification ${isValid ? 'successful' : 'failed'}`,
      data: { vendor },
    });
  }

  // Get vendor categories
  static async getVendorCategories(req: Request, res: Response): Promise<void> {
    // In a real implementation, this might come from a database table
    const categories = [
      'Plumbing',
      'Electrical',
      'HVAC',
      'Carpentry',
      'Painting',
      'Roofing',
      'Landscaping',
      'Cleaning',
      'Moving',
      'Handyman',
      'Appliance Repair',
      'Pest Control',
    ];

    res.json({
      success: true,
      data: { categories },
    });
  }

  // Get featured vendors
  static async getFeaturedVendors(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [vendors, total] = await Promise.all([
      prisma.vendor.findMany({
        where: {
          user: { status: 'ACTIVE' },
          averageRating: { gte: 4.0 },
          totalRatings: { gte: 5 },
        },
        skip,
        take: Number(limit),
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: [
          { averageRating: 'desc' },
          { totalRatings: 'desc' },
        ],
      }),
      prisma.vendor.count({
        where: {
          user: { status: 'ACTIVE' },
          averageRating: { gte: 4.0 },
          totalRatings: { gte: 5 },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        vendors,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }
}

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '@/middleware/validation';
import { authMiddleware, requireVendor, requireConsumerOrVendor, requireSelfOrAdmin } from '@/middleware/auth';
import { vendorValidation, paramValidation, queryValidation } from '@/middleware/validation';
import { VendorController } from '@/controllers/vendorController';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Search vendors (public endpoint with optional auth)
router.get(
  '/search',
  validateRequest({ query: vendorValidation.search }),
  asyncHandler(VendorController.searchVendors)
);

// Get vendor categories (public)
router.get(
  '/categories/list',
  asyncHandler(VendorController.getVendorCategories)
);

// Get featured vendors (public)
router.get(
  '/featured/list',
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(VendorController.getFeaturedVendors)
);

// Get nearby vendors (public)
router.get(
  '/nearby/:latitude/:longitude',
  validateRequest({
    params: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
    }),
    query: Joi.object({
      radius: Joi.number().min(1).max(500).default(50),
      serviceCategories: Joi.array().items(Joi.string()).optional(),
      limit: Joi.number().min(1).max(100).default(20),
    })
  }),
  asyncHandler(VendorController.getNearbyVendors)
);

// Get vendor profile (vendor only)
router.get(
  '/profile/me',
  authMiddleware,
  requireVendor,
  asyncHandler(VendorController.getCurrentVendorProfile)
);

// Create vendor profile (vendor only)
router.post(
  '/profile',
  authMiddleware,
  requireVendor,
  validateRequest({ body: vendorValidation.create }),
  asyncHandler(VendorController.createVendorProfile)
);

// Update vendor profile (vendor only)
router.put(
  '/profile',
  authMiddleware,
  requireVendor,
  validateRequest({ body: vendorValidation.update }),
  asyncHandler(VendorController.updateVendorProfile)
);

// Update vendor availability
router.put(
  '/profile/availability',
  authMiddleware,
  requireVendor,
  validateRequest({
    body: Joi.object({
      availability: Joi.object().required(),
    })
  }),
  asyncHandler(VendorController.updateAvailability)
);

// Upload vendor portfolio images
router.post(
  '/profile/portfolio',
  authMiddleware,
  requireVendor,
  asyncHandler(VendorController.uploadPortfolioImages)
);

// Delete portfolio image
router.delete(
  '/profile/portfolio/:imageId',
  authMiddleware,
  requireVendor,
  validateRequest({
    params: Joi.object({
      imageId: Joi.string().required(),
    })
  }),
  asyncHandler(VendorController.deletePortfolioImage)
);

// Upload vendor certifications
router.post(
  '/profile/certifications',
  authMiddleware,
  requireVendor,
  asyncHandler(VendorController.uploadCertifications)
);

// Delete certification
router.delete(
  '/profile/certifications/:certId',
  authMiddleware,
  requireVendor,
  validateRequest({
    params: Joi.object({
      certId: Joi.string().required(),
    })
  }),
  asyncHandler(VendorController.deleteCertification)
);

// Verify vendor license
router.post(
  '/profile/verify-license',
  authMiddleware,
  requireVendor,
  validateRequest({
    body: Joi.object({
      licenseNumber: Joi.string().required(),
      licenseType: Joi.string().required(),
      state: Joi.string().required(),
    })
  }),
  asyncHandler(VendorController.verifyLicense)
);

// Get vendor analytics (vendor only)
router.get(
  '/analytics/overview',
  authMiddleware,
  requireVendor,
  asyncHandler(VendorController.getVendorAnalytics)
);

// Get vendor connections
router.get(
  '/connections/list',
  authMiddleware,
  requireVendor,
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(VendorController.getVendorConnections)
);

// Get vendor by ID (public) - MUST BE LAST to avoid conflicts
router.get(
  '/:vendorId',
  validateRequest({ params: paramValidation.vendorId }),
  asyncHandler(VendorController.getVendorById)
);

// Get vendor ratings (public)
router.get(
  '/:vendorId/ratings',
  validateRequest({ 
    params: paramValidation.vendorId,
    query: queryValidation.pagination 
  }),
  asyncHandler(VendorController.getVendorRatings)
);

export default router;

import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '@/middleware/validation';
import { authMiddleware, requireConsumer, requireSelfOrAdmin, requireAdmin } from '@/middleware/auth';
import { ratingValidation, paramValidation, queryValidation } from '@/middleware/validation';
import { RatingController } from '@/controllers/ratingController';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Create rating (consumer only)
router.post(
  '/',
  authMiddleware,
  requireConsumer,
  validateRequest({ body: ratingValidation.create }),
  asyncHandler(RatingController.createRating)
);

// Get rating by ID
router.get(
  '/:ratingId',
  validateRequest({ params: paramValidation.ratingId }),
  asyncHandler(RatingController.getRatingById)
);

// Update rating (only by rating creator)
router.put(
  '/:ratingId',
  authMiddleware,
  validateRequest({ 
    params: paramValidation.ratingId,
    body: ratingValidation.update 
  }),
  asyncHandler(RatingController.updateRating)
);

// Delete rating (only by rating creator or admin)
router.delete(
  '/:ratingId',
  authMiddleware,
  validateRequest({ params: paramValidation.ratingId }),
  asyncHandler(RatingController.deleteRating)
);

// Get ratings for a vendor
router.get(
  '/vendor/:vendorId',
  validateRequest({ 
    params: paramValidation.vendorId,
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      minRating: Joi.number().min(1).max(5).optional(),
      category: Joi.string().valid('COST_EFFECTIVENESS', 'QUALITY_OF_SERVICE', 'TIMELINESS_OF_DELIVERY', 'PROFESSIONALISM').optional(),
      verified: Joi.boolean().optional(),
    })
  }),
  asyncHandler(RatingController.getVendorRatings)
);

// Get ratings by a consumer
router.get(
  '/consumer/:userId',
  authMiddleware,
  validateRequest({ 
    params: paramValidation.userId,
    query: queryValidation.pagination 
  }),
  requireSelfOrAdmin('userId'),
  asyncHandler(RatingController.getConsumerRatings)
);

// Upload rating images
router.post(
  '/:ratingId/images',
  authMiddleware,
  validateRequest({ params: paramValidation.ratingId }),
  asyncHandler(RatingController.uploadRatingImages)
);

// Delete rating image
router.delete(
  '/:ratingId/images/:imageId',
  authMiddleware,
  validateRequest({ 
    params: Joi.object({
      ratingId: Joi.string().required(),
      imageId: Joi.string().required(),
    })
  }),
  asyncHandler(RatingController.deleteRatingImage)
);

// Mark rating as helpful
router.post(
  '/:ratingId/helpful',
  authMiddleware,
  validateRequest({ params: paramValidation.ratingId }),
  asyncHandler(RatingController.markRatingHelpful)
);

// Remove helpful mark
router.delete(
  '/:ratingId/helpful',
  authMiddleware,
  validateRequest({ params: paramValidation.ratingId }),
  asyncHandler(RatingController.removeHelpfulMark)
);

// Report rating
router.post(
  '/:ratingId/report',
  authMiddleware,
  validateRequest({ 
    params: paramValidation.ratingId,
    body: Joi.object({
      reason: Joi.string().valid('SPAM', 'INAPPROPRIATE', 'FAKE', 'OTHER').required(),
      description: Joi.string().max(500).optional(),
    })
  }),
  asyncHandler(RatingController.reportRating)
);

// Get rating statistics for vendor
router.get(
  '/vendor/:vendorId/stats',
  validateRequest({ params: paramValidation.vendorId }),
  asyncHandler(RatingController.getVendorRatingStats)
);

// Get trending ratings
router.get(
  '/trending/list',
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(RatingController.getTrendingRatings)
);

// Get recent ratings
router.get(
  '/recent/list',
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(RatingController.getRecentRatings)
);

// Verify rating (admin only)
router.patch(
  '/:ratingId/verify',
  authMiddleware,
  validateRequest({ 
    params: paramValidation.ratingId,
    body: Joi.object({
      isVerified: Joi.boolean().required(),
    })
  }),
  requireAdmin,
  asyncHandler(RatingController.verifyRating)
);

export default router;

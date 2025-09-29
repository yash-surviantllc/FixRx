import { Router } from 'express';
import { validateRequest } from '@/middleware/validation';
import { requireConsumer, requireSelfOrAdmin } from '@/middleware/auth';
import { ratingValidation, paramValidation, queryValidation } from '@/middleware/validation';
import { RatingController } from '@/controllers/ratingController';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Create rating (consumer only)
router.post(
  '/',
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
  validateRequest({ 
    params: paramValidation.ratingId,
    body: ratingValidation.update 
  }),
  asyncHandler(RatingController.updateRating)
);

// Delete rating (only by rating creator or admin)
router.delete(
  '/:ratingId',
  validateRequest({ params: paramValidation.ratingId }),
  asyncHandler(RatingController.deleteRating)
);

// Get ratings for a vendor
router.get(
  '/vendor/:vendorId',
  validateRequest({ 
    params: paramValidation.vendorId,
    query: {
      ...queryValidation.pagination,
      minRating: require('joi').number().min(1).max(5).optional(),
      category: require('joi').string().valid('COST_EFFECTIVENESS', 'QUALITY_OF_SERVICE', 'TIMELINESS_OF_DELIVERY', 'PROFESSIONALISM').optional(),
      verified: require('joi').boolean().optional(),
    }
  }),
  asyncHandler(RatingController.getVendorRatings)
);

// Get ratings by a consumer
router.get(
  '/consumer/:userId',
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
  validateRequest({ params: paramValidation.ratingId }),
  asyncHandler(RatingController.uploadRatingImages)
);

// Delete rating image
router.delete(
  '/:ratingId/images/:imageId',
  validateRequest({ 
    params: {
      ratingId: require('joi').string().required(),
      imageId: require('joi').string().required(),
    }
  }),
  asyncHandler(RatingController.deleteRatingImage)
);

// Mark rating as helpful
router.post(
  '/:ratingId/helpful',
  validateRequest({ params: paramValidation.ratingId }),
  asyncHandler(RatingController.markRatingHelpful)
);

// Remove helpful mark
router.delete(
  '/:ratingId/helpful',
  validateRequest({ params: paramValidation.ratingId }),
  asyncHandler(RatingController.removeHelpfulMark)
);

// Report rating
router.post(
  '/:ratingId/report',
  validateRequest({ 
    params: paramValidation.ratingId,
    body: {
      reason: require('joi').string().valid('SPAM', 'INAPPROPRIATE', 'FAKE', 'OTHER').required(),
      description: require('joi').string().max(500).optional(),
    }
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
  validateRequest({ 
    params: paramValidation.ratingId,
    body: {
      isVerified: require('joi').boolean().required(),
    }
  }),
  require('@/middleware/auth').requireAdmin,
  asyncHandler(RatingController.verifyRating)
);

export default router;

import { Router } from 'express';
import Joi from 'joi';
import { validateRequest } from '@/middleware/validation';
import { authMiddleware, requireConsumer, requireConsumerOrVendor } from '@/middleware/auth';
import { paramValidation, queryValidation } from '@/middleware/validation';
import { ConsumerController } from '@/controllers/consumerController';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();
// Get consumer profile (both /profile/me and /profile for compatibility)
router.get(
  '/profile/me',
  requireConsumer,
  asyncHandler(ConsumerController.getCurrentConsumerProfile)
);

router.get(
  '/profile',
  requireConsumer,
  asyncHandler(ConsumerController.getCurrentConsumerProfile)
);

// Get consumer dashboard
router.get(
  '/dashboard',
  requireConsumer,
  asyncHandler(ConsumerController.getDashboard)
);

// Create consumer profile (uses authMiddleware so pending users can create profiles)
router.post(
  '/profile',
  authMiddleware,  // Allow pending users to create profile
  asyncHandler(ConsumerController.createConsumerProfile)
);

// Update consumer profile
router.put(
  '/profile',
  requireConsumer,
  validateRequest({
    body: Joi.object({
      preferences: Joi.object().optional(),
      location: Joi.object({
        latitude: Joi.number().min(-90).max(90).optional(),
        longitude: Joi.number().min(-180).max(180).optional(),
        address: Joi.string().optional(),
        city: Joi.string().optional(),
        state: Joi.string().optional(),
        zipCode: Joi.string().optional(),
      }).optional(),
      searchRadius: Joi.number().min(1).max(500).optional(),
    })
  }),
  asyncHandler(ConsumerController.updateConsumerProfile)
);

// Get consumer connections
router.get(
  '/connections',
  requireConsumer,
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(ConsumerController.getConsumerConnections)
);

// Connect to vendor
router.post(
  '/connections/:vendorId',
  requireConsumer,
  validateRequest({ 
    params: paramValidation.vendorId,
    body: Joi.object({
      notes: Joi.string().max(500).optional(),
    })
  }),
  asyncHandler(ConsumerController.connectToVendor)
);

// Update connection status
router.put(
  '/connections/:vendorId',
  requireConsumer,
  validateRequest({ 
    params: paramValidation.vendorId,
    body: Joi.object({
      status: Joi.string().valid('CONNECTED', 'BLOCKED', 'DISCONNECTED').required(),
      notes: Joi.string().max(500).optional(),
    })
  }),
  asyncHandler(ConsumerController.updateConnection)
);

// Remove connection
router.delete(
  '/connections/:vendorId',
  requireConsumer,
  validateRequest({ params: paramValidation.vendorId }),
  asyncHandler(ConsumerController.removeConnection)
);

// Get consumer ratings given
router.get(
  '/ratings/given',
  requireConsumer,
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(ConsumerController.getGivenRatings)
);

// Get consumer favorites
router.get(
  '/favorites',
  requireConsumer,
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(ConsumerController.getFavoriteVendors)
);

// Add vendor to favorites
router.post(
  '/favorites/:vendorId',
  requireConsumer,
  validateRequest({ params: paramValidation.vendorId }),
  asyncHandler(ConsumerController.addToFavorites)
);

// Remove vendor from favorites
router.delete(
  '/favorites/:vendorId',
  requireConsumer,
  validateRequest({ params: paramValidation.vendorId }),
  asyncHandler(ConsumerController.removeFromFavorites)
);

// Get search history
router.get(
  '/search-history',
  requireConsumer,
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(ConsumerController.getSearchHistory)
);

// Clear search history
router.delete(
  '/search-history',
  requireConsumer,
  asyncHandler(ConsumerController.clearSearchHistory)
);

// Get consumer analytics
router.get(
  '/analytics/overview',
  requireConsumer,
  asyncHandler(ConsumerController.getConsumerAnalytics)
);

// Update location
router.put(
  '/location',
  requireConsumer,
  validateRequest({
    body: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required(),
      address: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      zipCode: Joi.string().optional(),
    })
  }),
  asyncHandler(ConsumerController.updateLocation)
);

export default router;

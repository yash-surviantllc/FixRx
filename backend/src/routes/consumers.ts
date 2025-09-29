import { Router } from 'express';
import { validateRequest } from '@/middleware/validation';
import { requireConsumer, requireConsumerOrVendor } from '@/middleware/auth';
import { paramValidation, queryValidation } from '@/middleware/validation';
import { ConsumerController } from '@/controllers/consumerController';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Get consumer profile
router.get(
  '/profile/me',
  requireConsumer,
  asyncHandler(ConsumerController.getCurrentConsumerProfile)
);

// Create consumer profile
router.post(
  '/profile',
  requireConsumer,
  validateRequest({
    body: {
      preferences: require('joi').object().optional(),
      location: require('joi').object({
        latitude: require('joi').number().min(-90).max(90).required(),
        longitude: require('joi').number().min(-180).max(180).required(),
        address: require('joi').string().optional(),
        city: require('joi').string().optional(),
        state: require('joi').string().optional(),
        zipCode: require('joi').string().optional(),
      }).optional(),
      searchRadius: require('joi').number().min(1).max(500).default(50),
    }
  }),
  asyncHandler(ConsumerController.createConsumerProfile)
);

// Update consumer profile
router.put(
  '/profile',
  requireConsumer,
  validateRequest({
    body: {
      preferences: require('joi').object().optional(),
      location: require('joi').object({
        latitude: require('joi').number().min(-90).max(90).optional(),
        longitude: require('joi').number().min(-180).max(180).optional(),
        address: require('joi').string().optional(),
        city: require('joi').string().optional(),
        state: require('joi').string().optional(),
        zipCode: require('joi').string().optional(),
      }).optional(),
      searchRadius: require('joi').number().min(1).max(500).optional(),
    }
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
    body: {
      notes: require('joi').string().max(500).optional(),
    }
  }),
  asyncHandler(ConsumerController.connectToVendor)
);

// Update connection status
router.put(
  '/connections/:vendorId',
  requireConsumer,
  validateRequest({ 
    params: paramValidation.vendorId,
    body: {
      status: require('joi').string().valid('CONNECTED', 'BLOCKED', 'DISCONNECTED').required(),
      notes: require('joi').string().max(500).optional(),
    }
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
    body: {
      latitude: require('joi').number().min(-90).max(90).required(),
      longitude: require('joi').number().min(-180).max(180).required(),
      address: require('joi').string().optional(),
      city: require('joi').string().optional(),
      state: require('joi').string().optional(),
      zipCode: require('joi').string().optional(),
    }
  }),
  asyncHandler(ConsumerController.updateLocation)
);

export default router;

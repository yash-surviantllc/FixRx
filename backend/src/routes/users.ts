import { Router } from 'express';
import { validateRequest } from '@/middleware/validation';
import { requireSelfOrAdmin, requireAdmin } from '@/middleware/auth';
import { userValidation, paramValidation, queryValidation } from '@/middleware/validation';
import { UserController } from '@/controllers/userController';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Get current user profile
router.get(
  '/me',
  asyncHandler(UserController.getCurrentUser)
);

// Update current user profile
router.put(
  '/me',
  validateRequest({ body: userValidation.updateProfile }),
  asyncHandler(UserController.updateCurrentUser)
);

// Change password
router.put(
  '/me/password',
  validateRequest({ body: userValidation.changePassword }),
  asyncHandler(UserController.changePassword)
);

// Delete current user account
router.delete(
  '/me',
  asyncHandler(UserController.deleteCurrentUser)
);

// Upload profile avatar
router.post(
  '/me/avatar',
  asyncHandler(UserController.uploadAvatar)
);

// Get user by ID (admin or self only)
router.get(
  '/:userId',
  validateRequest({ params: paramValidation.userId }),
  requireSelfOrAdmin('userId'),
  asyncHandler(UserController.getUserById)
);

// Update user by ID (admin or self only)
router.put(
  '/:userId',
  validateRequest({ 
    params: paramValidation.userId,
    body: userValidation.updateProfile 
  }),
  requireSelfOrAdmin('userId'),
  asyncHandler(UserController.updateUserById)
);

// Delete user by ID (admin only)
router.delete(
  '/:userId',
  validateRequest({ params: paramValidation.userId }),
  requireAdmin,
  asyncHandler(UserController.deleteUserById)
);

// Admin routes
// Get all users (admin only)
router.get(
  '/',
  validateRequest({ query: queryValidation.pagination }),
  requireAdmin,
  asyncHandler(UserController.getAllUsers)
);

// Update user status (admin only)
router.patch(
  '/:userId/status',
  validateRequest({ 
    params: paramValidation.userId,
    body: {
      status: require('joi').string().valid('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION').required(),
    }
  }),
  requireAdmin,
  asyncHandler(UserController.updateUserStatus)
);

// Get user statistics (admin only)
router.get(
  '/stats/overview',
  requireAdmin,
  asyncHandler(UserController.getUserStats)
);

export default router;

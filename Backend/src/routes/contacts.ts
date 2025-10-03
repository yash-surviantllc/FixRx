import { Router } from 'express';
import { validateRequest } from '@/middleware/validation';
import { requireConsumerOrVendor } from '@/middleware/auth';
import { contactValidation, paramValidation, queryValidation } from '@/middleware/validation';
import { ContactController } from '@/controllers/contactController';
import { asyncHandler } from '@/middleware/errorHandler';
import Joi from 'joi';

const router = Router();

// Import contacts from phone directory
router.post(
  '/import',
  requireConsumerOrVendor,
  validateRequest({ body: contactValidation.import }),
  asyncHandler(ContactController.importContacts)
);

// Sync contacts
router.post(
  '/sync',
  requireConsumerOrVendor,
  validateRequest({ body: contactValidation.sync }),
  asyncHandler(ContactController.syncContacts)
);

// Get user's contacts
router.get(
  '/',
  requireConsumerOrVendor,
  validateRequest({ 
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
      search: Joi.string().optional(),
      registered: Joi.boolean().optional(),
    })
  }),
  asyncHandler(ContactController.getUserContacts)
);

// Get contact by ID
router.get(
  '/:contactId',
  requireConsumerOrVendor,
  validateRequest({ 
    params: {
      contactId: Joi.string().required(),
    }
  }),
  asyncHandler(ContactController.getContactById)
);

// Update contact
router.put(
  '/:contactId',
  requireConsumerOrVendor,
  validateRequest({
    params: {
      contactId: Joi.string().required(),
    },
    body: {
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
      displayName: Joi.string().optional(),
    }
  }),
  asyncHandler(ContactController.updateContact)
);

// Delete contact
router.delete(
  '/:contactId',
  requireConsumerOrVendor,
  validateRequest({ 
    params: {
      contactId: Joi.string().required(),
    }
  }),
  asyncHandler(ContactController.deleteContact)
);

// Get registered contacts (contacts who are app users)
router.get(
  '/registered/list',
  requireConsumerOrVendor,
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(ContactController.getRegisteredContacts)
);

// Get unregistered contacts
router.get(
  '/unregistered/list',
  requireConsumerOrVendor,
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(ContactController.getUnregisteredContacts)
);

// Search contacts
router.get(
  '/search/:query',
  requireConsumerOrVendor,
  validateRequest({
    params: {
      query: Joi.string().min(1).max(50).required(),
    },
    query: queryValidation.pagination,
  }),
  asyncHandler(ContactController.searchContacts)
);

// Get contact statistics
router.get(
  '/stats/overview',
  requireConsumerOrVendor,
  asyncHandler(ContactController.getContactStats)
);

// Export contacts
router.get(
  '/export/csv',
  requireConsumerOrVendor,
  asyncHandler(ContactController.exportContacts)
);

// Bulk delete contacts
router.delete(
  '/bulk',
  requireConsumerOrVendor,
  validateRequest({
    body: {
      contactIds: Joi.array().items(Joi.string()).min(1).max(100).required(),
    }
  }),
  asyncHandler(ContactController.bulkDeleteContacts)
);

// Check if contacts are registered
router.post(
  '/check-registration',
  requireConsumerOrVendor,
  validateRequest({
    body: {
      phones: Joi.array().items(
        Joi.string().pattern(/^\+?[1-9]\d{1,14}$/)
      ).min(1).max(100).required(),
    }
  }),
  asyncHandler(ContactController.checkContactRegistration)
);

// Get contact invitation history
router.get(
  '/:contactId/invitations',
  requireConsumerOrVendor,
  validateRequest({ 
    params: {
      contactId: Joi.string().required(),
    },
    query: queryValidation.pagination,
  }),
  asyncHandler(ContactController.getContactInvitationHistory)
);

// Mark contact as favorite
router.post(
  '/:contactId/favorite',
  requireConsumerOrVendor,
  validateRequest({ 
    params: {
      contactId: Joi.string().required(),
    }
  }),
  asyncHandler(ContactController.markContactAsFavorite)
);

// Remove contact from favorites
router.delete(
  '/:contactId/favorite',
  requireConsumerOrVendor,
  validateRequest({ 
    params: {
      contactId: Joi.string().required(),
    }
  }),
  asyncHandler(ContactController.removeContactFromFavorites)
);

// Get favorite contacts
router.get(
  '/favorites/list',
  requireConsumerOrVendor,
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(ContactController.getFavoriteContacts)
);

export default router;

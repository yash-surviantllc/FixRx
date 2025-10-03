import { Router } from 'express';
import { validateRequest } from '@/middleware/validation';
import { requireConsumerOrVendor } from '@/middleware/auth';
import { invitationValidation, paramValidation, queryValidation } from '@/middleware/validation';
import { InvitationController } from '@/controllers/invitationController';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Send single invitation
router.post(
  '/send',
  requireConsumerOrVendor,
  validateRequest({ body: invitationValidation.send }),
  asyncHandler(InvitationController.sendInvitation)
);

// Send bulk invitations
router.post(
  '/bulk',
  requireConsumerOrVendor,
  validateRequest({ body: invitationValidation.bulk }),
  asyncHandler(InvitationController.sendBulkInvitations)
);

// Get sent invitations
router.get(
  '/sent',
  requireConsumerOrVendor,
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(InvitationController.getSentInvitations)
);

// Get received invitations
router.get(
  '/received',
  requireConsumerOrVendor,
  validateRequest({ query: queryValidation.pagination }),
  asyncHandler(InvitationController.getReceivedInvitations)
);

// Get invitation by ID
router.get(
  '/:invitationId',
  validateRequest({ params: paramValidation.invitationId }),
  asyncHandler(InvitationController.getInvitationById)
);

// Accept invitation
router.post(
  '/:invitationId/accept',
  validateRequest({ params: paramValidation.invitationId }),
  asyncHandler(InvitationController.acceptInvitation)
);

// Decline invitation
router.post(
  '/:invitationId/decline',
  validateRequest({ params: paramValidation.invitationId }),
  asyncHandler(InvitationController.declineInvitation)
);

// Resend invitation
router.post(
  '/:invitationId/resend',
  validateRequest({ params: paramValidation.invitationId }),
  requireConsumerOrVendor,
  asyncHandler(InvitationController.resendInvitation)
);

// Cancel invitation
router.delete(
  '/:invitationId',
  validateRequest({ params: paramValidation.invitationId }),
  requireConsumerOrVendor,
  asyncHandler(InvitationController.cancelInvitation)
);

// Get invitation statistics
router.get(
  '/stats/overview',
  requireConsumerOrVendor,
  asyncHandler(InvitationController.getInvitationStats)
);

// Track invitation delivery (webhook endpoint)
router.post(
  '/webhook/delivery',
  validateRequest({
    body: {
      invitationId: require('joi').string().required(),
      status: require('joi').string().valid('DELIVERED', 'FAILED', 'BOUNCED').required(),
      provider: require('joi').string().valid('TWILIO', 'SENDGRID').required(),
      metadata: require('joi').object().optional(),
    }
  }),
  asyncHandler(InvitationController.trackDelivery)
);

// Get invitation templates
router.get(
  '/templates/list',
  requireConsumerOrVendor,
  asyncHandler(InvitationController.getInvitationTemplates)
);

// Create custom invitation template
router.post(
  '/templates',
  requireConsumerOrVendor,
  validateRequest({
    body: {
      name: require('joi').string().min(2).max(50).required(),
      type: require('joi').string().valid('SMS', 'EMAIL').required(),
      subject: require('joi').string().max(100).optional(), // For email only
      message: require('joi').string().min(10).max(500).required(),
      isDefault: require('joi').boolean().default(false),
    }
  }),
  asyncHandler(InvitationController.createInvitationTemplate)
);

// Update invitation template
router.put(
  '/templates/:templateId',
  requireConsumerOrVendor,
  validateRequest({
    params: {
      templateId: require('joi').string().required(),
    },
    body: {
      name: require('joi').string().min(2).max(50).optional(),
      subject: require('joi').string().max(100).optional(),
      message: require('joi').string().min(10).max(500).optional(),
      isDefault: require('joi').boolean().optional(),
    }
  }),
  asyncHandler(InvitationController.updateInvitationTemplate)
);

// Delete invitation template
router.delete(
  '/templates/:templateId',
  requireConsumerOrVendor,
  validateRequest({
    params: {
      templateId: require('joi').string().required(),
    }
  }),
  asyncHandler(InvitationController.deleteInvitationTemplate)
);

// Import contacts and send invitations
router.post(
  '/import-and-invite',
  requireConsumerOrVendor,
  validateRequest({
    body: {
      contacts: require('joi').array().items(
        require('joi').object({
          firstName: require('joi').string().optional(),
          lastName: require('joi').string().optional(),
          email: require('joi').string().email().optional(),
          phone: require('joi').string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
          displayName: require('joi').string().optional(),
        })
      ).min(1).max(100).required(),
      type: require('joi').string().valid('SMS', 'EMAIL').required(),
      message: require('joi').string().max(500).optional(),
      templateId: require('joi').string().optional(),
    }
  }),
  asyncHandler(InvitationController.importAndInvite)
);

export default router;

import type { Request, Response } from 'express';
import { prisma } from '../services/database';
import { QueueService } from '../services/queue';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { config } from '../config/environment';

export class InvitationController {
  // Send single invitation
  static async sendInvitation(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { type, recipientEmail, recipientPhone, message } = req.body;

    // Validate recipient based on type
    if (type === 'EMAIL' && !recipientEmail) {
      throw new AppError('Email is required for email invitations', 400);
    }
    if (type === 'SMS' && !recipientPhone) {
      throw new AppError('Phone is required for SMS invitations', 400);
    }

    // Check if user is already registered
    let existingUser = null;
    if (recipientEmail) {
      existingUser = await prisma.user.findUnique({
        where: { email: recipientEmail },
      });
    } else if (recipientPhone) {
      existingUser = await prisma.user.findUnique({
        where: { phone: recipientPhone },
      });
    }

    if (existingUser) {
      throw new AppError('User is already registered', 409);
    }

    // Create invitation
    const invitation = await prisma.invitation.create({
      data: {
        senderId: userId,
        type,
        recipientEmail,
        recipientPhone,
        message: message || getDefaultMessage(type),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Send invitation via appropriate channel
    try {
      if (type === 'EMAIL') {
        await QueueService.addEmailJob({
          to: recipientEmail!,
          subject: 'You\'re invited to join FixRx!',
          template: config.sendgrid.templates.invitation,
          templateData: {
            senderName: `${invitation.sender.firstName} ${invitation.sender.lastName}`,
            message: invitation.message,
            downloadLink: 'https://fixrx.com/download',
            invitationId: invitation.id,
          },
        });
      } else if (type === 'SMS') {
        await QueueService.addSMSJob({
          to: recipientPhone!,
          message: `${invitation.sender.firstName} invited you to join FixRx! ${invitation.message} Download: https://fixrx.com/download`,
        });
      }

      // Update invitation status
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: { 
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      logger.info(`Invitation sent: ${invitation.id} via ${type}`);

      res.status(201).json({
        success: true,
        message: 'Invitation sent successfully',
        data: { invitation },
      });
    } catch (error) {
      logger.error('Failed to send invitation:', error);
      throw new AppError('Failed to send invitation', 500);
    }
  }

  // Send bulk invitations
  static async sendBulkInvitations(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { type, recipients, message } = req.body;

    if (recipients.length > 100) {
      throw new AppError('Maximum 100 recipients allowed per bulk invitation', 400);
    }

    const invitations = [];
    const emailJobs: Array<{ data: { to: string; subject: string; template: string; templateData: Record<string, any> } }> = [];
    const smsJobs: Array<{ data: { to: string; message: string } }> = [];

    for (const recipient of recipients) {
      // Validate recipient data
      if (type === 'EMAIL' && !recipient.email) continue;
      if (type === 'SMS' && !recipient.phone) continue;

      // Check if user is already registered
      let existingUser = null;
      if (recipient.email) {
        existingUser = await prisma.user.findUnique({
          where: { email: recipient.email },
        });
      } else if (recipient.phone) {
        existingUser = await prisma.user.findUnique({
          where: { phone: recipient.phone },
        });
      }

      if (existingUser) continue; // Skip already registered users

      // Create invitation
      const invitation = await prisma.invitation.create({
        data: {
          senderId: userId,
          type,
          recipientEmail: recipient.email,
          recipientPhone: recipient.phone,
          message: message || getDefaultMessage(type),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      invitations.push(invitation);

      // Prepare job for queue
      if (type === 'EMAIL' && recipient.email) {
        emailJobs.push({
          data: {
            to: recipient.email,
            subject: 'You\'re invited to join FixRx!',
            template: config.sendgrid.templates.invitation,
            templateData: {
              recipientName: recipient.name || 'there',
              message: invitation.message,
              downloadLink: 'https://fixrx.com/download',
              invitationId: invitation.id,
            },
          },
        });
      } else if (type === 'SMS' && recipient.phone) {
        smsJobs.push({
          data: {
            to: recipient.phone,
            message: `You're invited to join FixRx! ${invitation.message} Download: https://fixrx.com/download`,
          },
        });
      }
    }

    // Send bulk jobs to queue
    try {
      if (type === 'EMAIL' && emailJobs.length > 0) {
        await QueueService.addBulkEmailJobs(emailJobs);
      } else if (type === 'SMS' && smsJobs.length > 0) {
        await QueueService.addBulkSMSJobs(smsJobs);
      }

      // Update all invitations status
      await prisma.invitation.updateMany({
        where: {
          id: { in: invitations.map(inv => inv.id) },
        },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      logger.info(`Bulk invitations sent: ${invitations.length} via ${type}`);

      res.status(201).json({
        success: true,
        message: `${invitations.length} invitations sent successfully`,
        data: {
          totalSent: invitations.length,
          totalSkipped: recipients.length - invitations.length,
        },
      });
    } catch (error) {
      logger.error('Failed to send bulk invitations:', error);
      throw new AppError('Failed to send bulk invitations', 500);
    }
  }

  // Get sent invitations
  static async getSentInvitations(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        where: { senderId: userId },
        skip,
        take: Number(limit),
        include: {
          receiver: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invitation.count({ where: { senderId: userId } }),
    ]);

    res.json({
      success: true,
      data: {
        invitations,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  // Get received invitations
  static async getReceivedInvitations(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        where: { receiverId: userId },
        skip,
        take: Number(limit),
        include: {
          sender: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invitation.count({ where: { receiverId: userId } }),
    ]);

    res.json({
      success: true,
      data: {
        invitations,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  // Get invitation by ID
  static async getInvitationById(req: Request, res: Response): Promise<void> {
    const { invitationId } = req.params;

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
        receiver: {
          select: {
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new AppError('Invitation not found', 404);
    }

    res.json({
      success: true,
      data: { invitation },
    });
  }

  // Accept invitation
  static async acceptInvitation(req: Request, res: Response): Promise<void> {
    const { invitationId } = req.params;
    const userId = req.user?.id;

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new AppError('Invitation not found', 404);
    }

    if (invitation.status !== 'SENT' && invitation.status !== 'DELIVERED') {
      throw new AppError('Invitation cannot be accepted', 400);
    }

    if (invitation.expiresAt && invitation.expiresAt < new Date()) {
      throw new AppError('Invitation has expired', 400);
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
        receiverId: userId,
      },
    });

    logger.info(`Invitation accepted: ${invitationId}`);

    res.json({
      success: true,
      message: 'Invitation accepted successfully',
    });
  }

  // Decline invitation
  static async declineInvitation(req: Request, res: Response): Promise<void> {
    const { invitationId } = req.params;

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new AppError('Invitation not found', 404);
    }

    if (invitation.status !== 'SENT' && invitation.status !== 'DELIVERED') {
      throw new AppError('Invitation cannot be declined', 400);
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        status: 'DECLINED',
        declinedAt: new Date(),
      },
    });

    logger.info(`Invitation declined: ${invitationId}`);

    res.json({
      success: true,
      message: 'Invitation declined',
    });
  }

  // Resend invitation
  static async resendInvitation(req: Request, res: Response): Promise<void> {
    const { invitationId } = req.params;
    const userId = req.user!.id;

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new AppError('Invitation not found', 404);
    }

    if (invitation.senderId !== userId) {
      throw new AppError('You can only resend your own invitations', 403);
    }

    if (invitation.status === 'ACCEPTED') {
      throw new AppError('Cannot resend accepted invitation', 400);
    }

    // Send invitation again
    try {
      if (invitation.type === 'EMAIL' && invitation.recipientEmail) {
        await QueueService.addEmailJob({
          to: invitation.recipientEmail,
          subject: 'You\'re invited to join FixRx!',
          template: config.sendgrid.templates.invitation,
          templateData: {
            senderName: `${invitation.sender.firstName} ${invitation.sender.lastName}`,
            message: invitation.message,
            downloadLink: 'https://fixrx.com/download',
            invitationId: invitation.id,
          },
        });
      } else if (invitation.type === 'SMS' && invitation.recipientPhone) {
        await QueueService.addSMSJob({
          to: invitation.recipientPhone,
          message: `${invitation.sender.firstName} invited you to join FixRx! ${invitation.message} Download: https://fixrx.com/download`,
        });
      }

      await prisma.invitation.update({
        where: { id: invitationId },
        data: {
          status: 'SENT',
          sentAt: new Date(),
        },
      });

      logger.info(`Invitation resent: ${invitationId}`);

      res.json({
        success: true,
        message: 'Invitation resent successfully',
      });
    } catch (error) {
      logger.error('Failed to resend invitation:', error);
      throw new AppError('Failed to resend invitation', 500);
    }
  }

  // Cancel invitation
  static async cancelInvitation(req: Request, res: Response): Promise<void> {
    const { invitationId } = req.params;
    const userId = req.user!.id;

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new AppError('Invitation not found', 404);
    }

    if (invitation.senderId !== userId) {
      throw new AppError('You can only cancel your own invitations', 403);
    }

    if (invitation.status === 'ACCEPTED') {
      throw new AppError('Cannot cancel accepted invitation', 400);
    }

    await prisma.invitation.delete({
      where: { id: invitationId },
    });

    logger.info(`Invitation cancelled: ${invitationId}`);

    res.json({
      success: true,
      message: 'Invitation cancelled successfully',
    });
  }

  // Get invitation statistics
  static async getInvitationStats(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const [
      totalSent,
      totalAccepted,
      totalDeclined,
      totalPending,
      recentInvitations,
    ] = await Promise.all([
      prisma.invitation.count({ where: { senderId: userId } }),
      prisma.invitation.count({ 
        where: { 
          senderId: userId,
          status: 'ACCEPTED',
        } 
      }),
      prisma.invitation.count({ 
        where: { 
          senderId: userId,
          status: 'DECLINED',
        } 
      }),
      prisma.invitation.count({ 
        where: { 
          senderId: userId,
          status: { in: ['SENT', 'DELIVERED'] },
        } 
      }),
      prisma.invitation.findMany({
        where: { senderId: userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          status: true,
          recipientEmail: true,
          recipientPhone: true,
          createdAt: true,
        },
      }),
    ]);

    const acceptanceRate = totalSent > 0 ? (totalAccepted / totalSent) * 100 : 0;

    res.json({
      success: true,
      data: {
        overview: {
          totalSent,
          totalAccepted,
          totalDeclined,
          totalPending,
          acceptanceRate: Math.round(acceptanceRate * 10) / 10,
        },
        recentInvitations,
      },
    });
  }

  // Track invitation delivery (webhook endpoint)
  static async trackDelivery(req: Request, res: Response): Promise<void> {
    const { invitationId, status, provider, metadata } = req.body;

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });

    if (!invitation) {
      throw new AppError('Invitation not found', 404);
    }

    let newStatus = invitation.status;
    let deliveredAt = invitation.deliveredAt;

    if (status === 'DELIVERED') {
      newStatus = 'DELIVERED';
      deliveredAt = new Date();
    } else if (status === 'FAILED' || status === 'BOUNCED') {
      newStatus = 'FAILED';
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: {
        status: newStatus,
        deliveredAt,
        metadata: {
          ...(invitation.metadata as Record<string, any> || {}),
          delivery: {
            provider,
            status,
            timestamp: new Date(),
            ...metadata,
          },
        },
      },
    });

    logger.info(`Invitation delivery tracked: ${invitationId} -> ${status}`);

    res.json({
      success: true,
      message: 'Delivery status updated',
    });
  }

  // Get invitation templates (placeholder)
  static async getInvitationTemplates(req: Request, res: Response): Promise<void> {
    // Placeholder implementation - in a real app, you'd store templates in DB
    const templates = [
      {
        id: '1',
        name: 'Default SMS',
        type: 'SMS',
        message: 'Join me on FixRx to connect with trusted service providers!',
        isDefault: true,
      },
      {
        id: '2',
        name: 'Default Email',
        type: 'EMAIL',
        subject: 'Join FixRx - Connect with Trusted Service Providers',
        message: 'I thought you might be interested in FixRx, a platform that connects you with trusted service providers in your area.',
        isDefault: true,
      },
    ];

    res.json({
      success: true,
      data: { templates },
    });
  }

  // Create custom invitation template (placeholder)
  static async createInvitationTemplate(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({
      success: true,
      message: 'Template created successfully',
    });
  }

  // Update invitation template (placeholder)
  static async updateInvitationTemplate(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({
      success: true,
      message: 'Template updated successfully',
    });
  }

  // Delete invitation template (placeholder)
  static async deleteInvitationTemplate(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({
      success: true,
      message: 'Template deleted successfully',
    });
  }

  // Import contacts and send invitations
  static async importAndInvite(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { contacts, type, message, templateId } = req.body;

    // Import contacts first
    const importedContacts = [];
    for (const contact of contacts) {
      if ((type === 'EMAIL' && contact.email) || (type === 'SMS' && contact.phone)) {
        try {
          const existingContact = await prisma.contact.findFirst({
            where: {
              userId,
              OR: [
                { email: contact.email },
                { phone: contact.phone },
              ],
            },
          });

          if (!existingContact) {
            const newContact = await prisma.contact.create({
              data: {
                userId,
                firstName: contact.firstName,
                lastName: contact.lastName,
                email: contact.email,
                phone: contact.phone,
                displayName: contact.displayName,
              },
            });
            importedContacts.push(newContact);
          }
        } catch (error) {
          logger.error('Failed to import contact:', error);
        }
      }
    }

    // Send invitations to imported contacts
    const invitationData = {
      type,
      recipients: importedContacts.map(contact => ({
        email: contact.email,
        phone: contact.phone,
        name: contact.displayName || `${contact.firstName} ${contact.lastName}`,
      })),
      message,
    };

    // Reuse bulk invitation logic
    req.body = invitationData;
    await InvitationController.sendBulkInvitations(req, res);
  }
}

// Helper function to get default invitation message
function getDefaultMessage(type: string): string {
  if (type === 'SMS') {
    return 'Join me on FixRx to connect with trusted service providers!';
  } else {
    return 'I thought you might be interested in FixRx, a platform that connects you with trusted service providers in your area.';
  }
}

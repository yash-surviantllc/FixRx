import type { Request, Response } from 'express';
import { prisma } from '../services/database';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class ContactController {
  // Import contacts from phone directory
  static async importContacts(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { contacts } = req.body;

    const importedContacts = [];
    const skippedContacts = [];

    for (const contactData of contacts) {
      try {
        // Check if contact already exists
        const existingContact = await prisma.contact.findFirst({
          where: {
            userId,
            phone: contactData.phone,
          },
        });

        if (existingContact) {
          skippedContacts.push(contactData);
          continue;
        }

        // Check if the contact is a registered user
        const registeredUser = await prisma.user.findFirst({
          where: {
            OR: [
              { phone: contactData.phone },
              { email: contactData.email },
            ],
          },
        });

        const contact = await prisma.contact.create({
          data: {
            userId,
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email,
            phone: contactData.phone,
            displayName: contactData.displayName || `${contactData.firstName || ''} ${contactData.lastName || ''}`.trim(),
            isRegistered: !!registeredUser,
            registeredUserId: registeredUser?.id,
          },
        });

        importedContacts.push(contact);
      } catch (error) {
        logger.error('Failed to import contact:', error);
        skippedContacts.push(contactData);
      }
    }

    logger.info(`Contacts imported: ${importedContacts.length}, skipped: ${skippedContacts.length}`);

    res.status(201).json({
      success: true,
      message: 'Contacts imported successfully',
      data: {
        imported: importedContacts.length,
        skipped: skippedContacts.length,
        contacts: importedContacts,
      },
    });
  }

  // Sync contacts
  static async syncContacts(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { contacts } = req.body;

    const syncResults = {
      created: 0,
      updated: 0,
      skipped: 0,
    };

    for (const contactData of contacts) {
      try {
        const existingContact = await prisma.contact.findFirst({
          where: {
            userId,
            phone: contactData.phone,
          },
        });

        if (existingContact) {
          // Update existing contact
          await prisma.contact.update({
            where: { id: existingContact.id },
            data: {
              firstName: contactData.firstName,
              lastName: contactData.lastName,
              email: contactData.email,
              displayName: contactData.displayName,
              lastSyncAt: new Date(),
            },
          });
          syncResults.updated++;
        } else {
          // Create new contact
          const registeredUser = await prisma.user.findFirst({
            where: {
              OR: [
                { phone: contactData.phone },
                { email: contactData.email },
              ],
            },
          });

          await prisma.contact.create({
            data: {
              userId,
              firstName: contactData.firstName,
              lastName: contactData.lastName,
              email: contactData.email,
              phone: contactData.phone,
              displayName: contactData.displayName,
              isRegistered: !!registeredUser,
              registeredUserId: registeredUser?.id,
              lastSyncAt: new Date(),
            },
          });
          syncResults.created++;
        }
      } catch (error) {
        logger.error('Failed to sync contact:', error);
        syncResults.skipped++;
      }
    }

    logger.info(`Contacts synced - Created: ${syncResults.created}, Updated: ${syncResults.updated}, Skipped: ${syncResults.skipped}`);

    res.json({
      success: true,
      message: 'Contacts synced successfully',
      data: syncResults,
    });
  }

  // Get user's contacts
  static async getUserContacts(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { page = 1, limit = 20, search, registered } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: {
      userId: string;
      OR?: Array<{
        firstName?: { contains: string; mode: 'insensitive' };
        lastName?: { contains: string; mode: 'insensitive' };
        displayName?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
        phone?: { contains: string };
      }>;
      isRegistered?: boolean;
    } = { userId };

    // Search filter
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { displayName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string } },
      ];
    }

    // Registration filter
    if (registered !== undefined) {
      where.isRegistered = registered === 'true';
    }

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: [
          { displayName: 'asc' },
          { firstName: 'asc' },
        ],
      }),
      prisma.contact.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  // Get contact by ID
  static async getContactById(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { contactId } = req.params;

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
      },
    });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    res.json({
      success: true,
      data: { contact },
    });
  }

  // Update contact
  static async updateContact(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { contactId } = req.params;
    const updateData = req.body;

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
      },
    });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    const updatedContact = await prisma.contact.update({
      where: { id: contactId },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: { contact: updatedContact },
    });
  }

  // Delete contact
  static async deleteContact(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { contactId } = req.params;

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
      },
    });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    await prisma.contact.delete({
      where: { id: contactId },
    });

    logger.info(`Contact deleted: ${contactId}`);

    res.json({
      success: true,
      message: 'Contact deleted successfully',
    });
  }

  // Get registered contacts
  static async getRegisteredContacts(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: {
          userId,
          isRegistered: true,
        },
        skip,
        take: Number(limit),
        orderBy: { displayName: 'asc' },
      }),
      prisma.contact.count({
        where: {
          userId,
          isRegistered: true,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  // Get unregistered contacts
  static async getUnregisteredContacts(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: {
          userId,
          isRegistered: false,
        },
        skip,
        take: Number(limit),
        orderBy: { displayName: 'asc' },
      }),
      prisma.contact.count({
        where: {
          userId,
          isRegistered: false,
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  // Search contacts
  static async searchContacts(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { query } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where: {
          userId,
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { displayName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query } },
          ],
        },
        skip,
        take: Number(limit),
        orderBy: { displayName: 'asc' },
      }),
      prisma.contact.count({
        where: {
          userId,
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { displayName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query } },
          ],
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  }

  // Get contact statistics
  static async getContactStats(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const [
      totalContacts,
      registeredContacts,
      unregisteredContacts,
      recentlyAdded,
    ] = await Promise.all([
      prisma.contact.count({ where: { userId } }),
      prisma.contact.count({ where: { userId, isRegistered: true } }),
      prisma.contact.count({ where: { userId, isRegistered: false } }),
      prisma.contact.count({
        where: {
          userId,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        totalContacts,
        registeredContacts,
        unregisteredContacts,
        recentlyAdded,
        registrationRate: totalContacts > 0 ? (registeredContacts / totalContacts) * 100 : 0,
      },
    });
  }

  // Export contacts
  static async exportContacts(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;

    const contacts = await prisma.contact.findMany({
      where: { userId },
      orderBy: { displayName: 'asc' },
    });

    // Convert to CSV format
    const csvHeader = 'First Name,Last Name,Display Name,Email,Phone,Registered\n';
    const csvData = contacts.map(contact => 
      `"${contact.firstName || ''}","${contact.lastName || ''}","${contact.displayName || ''}","${contact.email || ''}","${contact.phone}","${contact.isRegistered}"`
    ).join('\n');

    const csv = csvHeader + csvData;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=contacts.csv');
    res.send(csv);
  }

  // Bulk delete contacts
  static async bulkDeleteContacts(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { contactIds } = req.body;

    // Verify all contacts belong to the user
    const contacts = await prisma.contact.findMany({
      where: {
        id: { in: contactIds },
        userId,
      },
    });

    if (contacts.length !== contactIds.length) {
      throw new AppError('Some contacts not found or do not belong to you', 400);
    }

    await prisma.contact.deleteMany({
      where: {
        id: { in: contactIds },
        userId,
      },
    });

    logger.info(`Bulk deleted ${contactIds.length} contacts for user ${userId}`);

    res.json({
      success: true,
      message: `${contactIds.length} contacts deleted successfully`,
    });
  }

  // Check if contacts are registered
  static async checkContactRegistration(req: Request, res: Response): Promise<void> {
    const { phones } = req.body;

    const registeredUsers = await prisma.user.findMany({
      where: {
        phone: { in: phones },
      },
      select: {
        phone: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
      },
    });

    const registrationStatus = phones.map((phone: string) => {
      const user = registeredUsers.find(u => u.phone === phone);
      return {
        phone,
        isRegistered: !!user,
        user: user || null,
      };
    });

    res.json({
      success: true,
      data: { registrationStatus },
    });
  }

  // Get contact invitation history
  static async getContactInvitationHistory(req: Request, res: Response): Promise<void> {
    const userId = req.user!.id;
    const { contactId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const contact = await prisma.contact.findFirst({
      where: {
        id: contactId,
        userId,
      },
    });

    if (!contact) {
      throw new AppError('Contact not found', 404);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [invitations, total] = await Promise.all([
      prisma.invitation.findMany({
        where: {
          senderId: userId,
          OR: [
            { recipientEmail: contact.email },
            { recipientPhone: contact.phone },
          ],
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invitation.count({
        where: {
          senderId: userId,
          OR: [
            { recipientEmail: contact.email },
            { recipientPhone: contact.phone },
          ],
        },
      }),
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

  // Mark contact as favorite (placeholder)
  static async markContactAsFavorite(req: Request, res: Response): Promise<void> {
    // Placeholder implementation - would need a favorites field or separate table
    res.json({
      success: true,
      message: 'Contact marked as favorite',
    });
  }

  // Remove contact from favorites (placeholder)
  static async removeContactFromFavorites(req: Request, res: Response): Promise<void> {
    // Placeholder implementation
    res.json({
      success: true,
      message: 'Contact removed from favorites',
    });
  }

  // Get favorite contacts (placeholder)
  static async getFavoriteContacts(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20 } = req.query;

    // Placeholder implementation
    res.json({
      success: true,
      data: {
        contacts: [],
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: 0,
          pages: 0,
        },
      },
    });
  }
}

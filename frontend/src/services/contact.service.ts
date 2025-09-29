import { apiClient } from '../lib/api-client';
import type { Contact } from '../types/api';

export class ContactService {
  // Import contacts from phone
  static async importContacts(contacts: Array<{
    firstName?: string;
    lastName?: string;
    phone: string;
    email?: string;
    displayName?: string;
  }>): Promise<{
    imported: number;
    updated: number;
    skipped: number;
    contacts: Contact[];
  }> {
    const response = await apiClient.post('/contacts/import', { contacts });
    return response.data;
  }

  // Get all contacts
  static async getContacts(
    page: number = 1,
    limit: number = 50,
    search?: string
  ): Promise<{
    contacts: Contact[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get('/contacts', {
      params: { page, limit, search },
    });
    return response.data;
  }

  // Get contact by ID
  static async getContact(contactId: string): Promise<Contact> {
    const response = await apiClient.get<Contact>(`/contacts/${contactId}`);
    return response.data;
  }

  // Create new contact
  static async createContact(data: {
    firstName?: string;
    lastName?: string;
    phone: string;
    email?: string;
    displayName?: string;
  }): Promise<Contact> {
    const response = await apiClient.post<Contact>('/contacts', data);
    return response.data;
  }

  // Update contact
  static async updateContact(contactId: string, data: Partial<Contact>): Promise<Contact> {
    const response = await apiClient.put<Contact>(`/contacts/${contactId}`, data);
    return response.data;
  }

  // Delete contact
  static async deleteContact(contactId: string): Promise<void> {
    await apiClient.delete(`/contacts/${contactId}`);
  }

  // Sync contacts with phone
  static async syncContacts(): Promise<{
    synced: number;
    added: number;
    updated: number;
    removed: number;
    lastSyncAt: string;
  }> {
    const response = await apiClient.post('/contacts/sync');
    return response.data;
  }

  // Search contacts
  static async searchContacts(query: string, limit: number = 20): Promise<Contact[]> {
    const response = await apiClient.get<Contact[]>('/contacts/search', {
      params: { query, limit },
    });
    return response.data;
  }

  // Get contacts that are registered users
  static async getRegisteredContacts(): Promise<Contact[]> {
    const response = await apiClient.get<Contact[]>('/contacts/registered');
    return response.data;
  }

  // Get contacts that are not registered
  static async getUnregisteredContacts(): Promise<Contact[]> {
    const response = await apiClient.get<Contact[]>('/contacts/unregistered');
    return response.data;
  }

  // Get contacts by invitation status
  static async getContactsByInvitationStatus(
    status: 'invited' | 'not_invited' | 'accepted' | 'declined'
  ): Promise<Contact[]> {
    const response = await apiClient.get<Contact[]>('/contacts/by-invitation-status', {
      params: { status },
    });
    return response.data;
  }

  // Mark contact as invited
  static async markContactAsInvited(contactId: string): Promise<Contact> {
    const response = await apiClient.patch<Contact>(`/contacts/${contactId}/invited`);
    return response.data;
  }

  // Get contact statistics
  static async getContactStatistics(): Promise<{
    total: number;
    registered: number;
    unregistered: number;
    invited: number;
    notInvited: number;
    lastSyncAt?: string;
  }> {
    const response = await apiClient.get('/contacts/statistics');
    return response.data;
  }

  // Bulk delete contacts
  static async bulkDeleteContacts(contactIds: string[]): Promise<{
    deleted: number;
    failed: number;
    errors: Array<{ contactId: string; error: string }>;
  }> {
    const response = await apiClient.post('/contacts/bulk-delete', { contactIds });
    return response.data;
  }

  // Export contacts
  static async exportContacts(format: 'csv' | 'json' = 'csv'): Promise<{
    downloadUrl: string;
    filename: string;
    count: number;
  }> {
    const response = await apiClient.get('/contacts/export', {
      params: { format },
    });
    return response.data;
  }

  // Get duplicate contacts
  static async getDuplicateContacts(): Promise<Array<{
    phone: string;
    contacts: Contact[];
  }>> {
    const response = await apiClient.get('/contacts/duplicates');
    return response.data;
  }

  // Merge duplicate contacts
  static async mergeDuplicateContacts(
    primaryContactId: string,
    duplicateContactIds: string[]
  ): Promise<Contact> {
    const response = await apiClient.post<Contact>('/contacts/merge', {
      primaryContactId,
      duplicateContactIds,
    });
    return response.data;
  }
}

export default ContactService;

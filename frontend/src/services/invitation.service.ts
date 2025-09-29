import { apiClient } from '../lib/api-client';
import type {
  Invitation,
  SendInvitationRequest,
  BulkInvitationRequest,
  Contact,
} from '../types/api';

export class InvitationService {
  // Send single invitation
  static async sendInvitation(data: SendInvitationRequest): Promise<Invitation> {
    const response = await apiClient.post<Invitation>('/invitations/send', data);
    return response.data;
  }

  // Send bulk invitations
  static async sendBulkInvitations(data: BulkInvitationRequest): Promise<{
    sent: number;
    failed: number;
    invitations: Invitation[];
    errors: Array<{ recipient: string; error: string }>;
  }> {
    const response = await apiClient.post('/invitations/bulk', data);
    return response.data;
  }

  // Get sent invitations
  static async getSentInvitations(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<{
    invitations: Invitation[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get('/invitations/sent', {
      params: { page, limit, status },
    });
    return response.data;
  }

  // Get received invitations
  static async getReceivedInvitations(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<{
    invitations: Invitation[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get('/invitations/received', {
      params: { page, limit, status },
    });
    return response.data;
  }

  // Accept invitation
  static async acceptInvitation(invitationId: string): Promise<Invitation> {
    const response = await apiClient.patch<Invitation>(`/invitations/${invitationId}/accept`);
    return response.data;
  }

  // Decline invitation
  static async declineInvitation(invitationId: string, reason?: string): Promise<Invitation> {
    const response = await apiClient.patch<Invitation>(`/invitations/${invitationId}/decline`, {
      reason,
    });
    return response.data;
  }

  // Cancel invitation (for sender)
  static async cancelInvitation(invitationId: string): Promise<void> {
    await apiClient.delete(`/invitations/${invitationId}`);
  }

  // Resend invitation
  static async resendInvitation(invitationId: string): Promise<Invitation> {
    const response = await apiClient.post<Invitation>(`/invitations/${invitationId}/resend`);
    return response.data;
  }

  // Get invitation statistics
  static async getInvitationStats(): Promise<{
    sent: {
      total: number;
      pending: number;
      accepted: number;
      declined: number;
      expired: number;
    };
    received: {
      total: number;
      pending: number;
      accepted: number;
      declined: number;
    };
    successRate: number;
    responseRate: number;
  }> {
    const response = await apiClient.get('/invitations/statistics');
    return response.data;
  }

  // Get invitation by ID
  static async getInvitation(invitationId: string): Promise<Invitation> {
    const response = await apiClient.get<Invitation>(`/invitations/${invitationId}`);
    return response.data;
  }

  // Update invitation message
  static async updateInvitationMessage(invitationId: string, message: string): Promise<Invitation> {
    const response = await apiClient.patch<Invitation>(`/invitations/${invitationId}/message`, {
      message,
    });
    return response.data;
  }

  // Get invitation templates
  static async getInvitationTemplates(): Promise<Array<{
    id: string;
    name: string;
    subject: string;
    message: string;
    type: 'SMS' | 'EMAIL';
  }>> {
    const response = await apiClient.get('/invitations/templates');
    return response.data;
  }

  // Create custom invitation template
  static async createInvitationTemplate(data: {
    name: string;
    subject: string;
    message: string;
    type: 'SMS' | 'EMAIL';
  }): Promise<any> {
    const response = await apiClient.post('/invitations/templates', data);
    return response.data;
  }

  // Preview invitation before sending
  static async previewInvitation(data: SendInvitationRequest): Promise<{
    preview: {
      subject?: string;
      message: string;
      estimatedCost?: number;
    };
  }> {
    const response = await apiClient.post('/invitations/preview', data);
    return response.data;
  }
}

export default InvitationService;

/**
 * API Service Layer - Ready for Backend Integration
 * This service layer provides a clean interface between the frontend and backend
 * Currently uses mock data, but can be easily switched to real API calls
 */

import { 
  ApiResponse, 
  ServiceRequest, 
  Conversation, 
  Message, 
  Appointment, 
  Client, 
  Notification,
  User 
} from '../types/api';

// Configuration
const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  retryAttempts: 3,
};

// Mock flag - set to false when connecting to real backend
const USE_MOCK_DATA = true;

class ApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
  }

  // Set authentication token
  setAuthToken(token: string) {
    this.authToken = token;
  }

  // Generic API call method (ready for real implementation)
  private async apiCall<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    if (USE_MOCK_DATA) {
      // Return mock data for now
      return this.getMockResponse<T>(endpoint);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
          ...options.headers,
        },
        timeout: API_CONFIG.timeout,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  }

  // Mock response handler (will be removed when backend is ready)
  private getMockResponse<T>(endpoint: string): Promise<ApiResponse<T>> {
    // This simulates API delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {} as T, // Mock data would be returned here
          message: 'Mock response'
        });
      }, 500);
    });
  }

  // Authentication APIs
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    const result = await this.apiCall<void>('/auth/logout', { method: 'POST' });
    this.authToken = null;
    return result;
  }

  // Service Requests APIs
  async getServiceRequests(filters?: any): Promise<ApiResponse<ServiceRequest[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.apiCall(`/service-requests${queryParams}`);
  }

  async getServiceRequest(id: string): Promise<ApiResponse<ServiceRequest>> {
    return this.apiCall(`/service-requests/${id}`);
  }

  async createServiceRequest(data: Partial<ServiceRequest>): Promise<ApiResponse<ServiceRequest>> {
    return this.apiCall('/service-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateServiceRequest(id: string, data: Partial<ServiceRequest>): Promise<ApiResponse<ServiceRequest>> {
    return this.apiCall(`/service-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Conversations APIs
  async getConversations(): Promise<ApiResponse<Conversation[]>> {
    return this.apiCall('/conversations');
  }

  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    return this.apiCall(`/conversations/${id}`);
  }

  async getMessages(conversationId: string): Promise<ApiResponse<Message[]>> {
    return this.apiCall(`/conversations/${conversationId}/messages`);
  }

  async sendMessage(conversationId: string, content: any): Promise<ApiResponse<Message>> {
    return this.apiCall(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async markAsRead(conversationId: string, messageIds: string[]): Promise<ApiResponse<void>> {
    return this.apiCall(`/conversations/${conversationId}/read`, {
      method: 'POST',
      body: JSON.stringify({ messageIds }),
    });
  }

  // Appointments APIs
  async getAppointments(filters?: any): Promise<ApiResponse<Appointment[]>> {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.apiCall(`/appointments${queryParams}`);
  }

  async createAppointment(data: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.apiCall('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return this.apiCall(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Clients APIs
  async getClients(): Promise<ApiResponse<Client[]>> {
    return this.apiCall('/clients');
  }

  async getClient(id: string): Promise<ApiResponse<Client>> {
    return this.apiCall(`/clients/${id}`);
  }

  // Notifications APIs
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    return this.apiCall('/notifications');
  }

  async markNotificationRead(id: string): Promise<ApiResponse<void>> {
    return this.apiCall(`/notifications/${id}/read`, { method: 'POST' });
  }

  // File Upload API
  async uploadFile(file: any, type: 'image' | 'document'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.apiCall('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export individual methods for easier imports
export const {
  login,
  register,
  logout,
  getServiceRequests,
  getServiceRequest,
  createServiceRequest,
  updateServiceRequest,
  getConversations,
  getConversation,
  getMessages,
  sendMessage,
  markAsRead,
  getAppointments,
  createAppointment,
  updateAppointment,
  getClients,
  getClient,
  getNotifications,
  markNotificationRead,
  uploadFile,
} = apiService;

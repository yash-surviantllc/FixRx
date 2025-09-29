import { apiClient } from '../lib/api-client';
import type {
  Vendor,
  VendorSearchRequest,
  VendorSearchResponse,
  Rating,
} from '../types/api';

export class VendorService {
  // Search vendors
  static async searchVendors(params: VendorSearchRequest): Promise<VendorSearchResponse> {
    const response = await apiClient.get<VendorSearchResponse>('/vendors/search', {
      params,
    });
    return response.data;
  }

  // Get vendor by ID
  static async getVendor(vendorId: string): Promise<Vendor> {
    const response = await apiClient.get<Vendor>(`/vendors/${vendorId}`);
    return response.data;
  }

  // Get nearby vendors
  static async getNearbyVendors(
    latitude: number,
    longitude: number,
    radius: number = 50,
    limit: number = 20
  ): Promise<Vendor[]> {
    const response = await apiClient.get<Vendor[]>('/vendors/nearby', {
      params: { latitude, longitude, radius, limit },
    });
    return response.data;
  }

  // Get vendor ratings
  static async getVendorRatings(vendorId: string, page: number = 1, limit: number = 10): Promise<{
    ratings: Rating[];
    total: number;
    averageRating: number;
    ratingBreakdown: {
      costEffectiveness: number;
      qualityOfService: number;
      timelinessOfDelivery: number;
      professionalism: number;
    };
  }> {
    const response = await apiClient.get(`/ratings/vendor/${vendorId}`, {
      params: { page, limit },
    });
    return response.data;
  }

  // Create vendor profile (for vendors)
  static async createVendorProfile(data: Partial<Vendor>): Promise<Vendor> {
    const response = await apiClient.post<Vendor>('/vendors/profile', data);
    return response.data;
  }

  // Update vendor profile (for vendors)
  static async updateVendorProfile(data: Partial<Vendor>): Promise<Vendor> {
    const response = await apiClient.put<Vendor>('/vendors/profile', data);
    return response.data;
  }

  // Get current vendor profile (for authenticated vendors)
  static async getCurrentVendorProfile(): Promise<Vendor> {
    const response = await apiClient.get<Vendor>('/vendors/profile');
    return response.data;
  }

  // Upload portfolio images
  static async uploadPortfolioImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.upload<{ url: string }>('/uploads/portfolio', formData);
    return response.data;
  }

  // Upload certification documents
  static async uploadCertification(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('document', file);
    
    const response = await apiClient.upload<{ url: string }>('/uploads/certification', formData);
    return response.data;
  }

  // Get vendor categories
  static async getVendorCategories(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/vendors/categories');
    return response.data;
  }

  // Get vendor service tags
  static async getServiceTags(category?: string): Promise<string[]> {
    const response = await apiClient.get<string[]>('/vendors/service-tags', {
      params: category ? { category } : {},
    });
    return response.data;
  }

  // Connect with vendor (for consumers)
  static async connectWithVendor(vendorId: string, notes?: string): Promise<void> {
    await apiClient.post('/vendors/connect', { vendorId, notes });
  }

  // Get vendor connections (for vendors)
  static async getVendorConnections(status?: string): Promise<any[]> {
    const response = await apiClient.get('/vendors/connections', {
      params: status ? { status } : {},
    });
    return response.data;
  }

  // Update connection status (for vendors)
  static async updateConnectionStatus(connectionId: string, status: string): Promise<void> {
    await apiClient.patch(`/vendors/connections/${connectionId}`, { status });
  }
}

export default VendorService;

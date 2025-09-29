import { apiClient } from '../lib/api-client';
import type {
  Consumer,
  Connection,
  Rating,
  CreateRatingRequest,
} from '../types/api';

export class ConsumerService {
  // Get current consumer profile
  static async getCurrentConsumerProfile(): Promise<Consumer> {
    const response = await apiClient.get<Consumer>('/consumers/profile');
    return response.data;
  }

  // Create consumer profile
  static async createConsumerProfile(data: Partial<Consumer>): Promise<Consumer> {
    const response = await apiClient.post<Consumer>('/consumers/profile', data);
    return response.data;
  }

  // Update consumer profile
  static async updateConsumerProfile(data: Partial<Consumer>): Promise<Consumer> {
    const response = await apiClient.put<Consumer>('/consumers/profile', data);
    return response.data;
  }

  // Update consumer preferences
  static async updatePreferences(preferences: any): Promise<Consumer> {
    const response = await apiClient.patch<Consumer>('/consumers/preferences', {
      preferences,
    });
    return response.data;
  }

  // Update consumer location
  static async updateLocation(location: {
    latitude: number;
    longitude: number;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  }): Promise<Consumer> {
    const response = await apiClient.patch<Consumer>('/consumers/location', {
      location,
    });
    return response.data;
  }

  // Get consumer connections
  static async getConnections(status?: string): Promise<Connection[]> {
    const response = await apiClient.get<Connection[]>('/consumers/connections', {
      params: status ? { status } : {},
    });
    return response.data;
  }

  // Get consumer ratings (ratings given by this consumer)
  static async getGivenRatings(page: number = 1, limit: number = 10): Promise<{
    ratings: Rating[];
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await apiClient.get('/consumers/ratings/given', {
      params: { page, limit },
    });
    return response.data;
  }

  // Create a rating for a vendor
  static async createRating(data: CreateRatingRequest): Promise<Rating> {
    const response = await apiClient.post<Rating>('/ratings', data);
    return response.data;
  }

  // Update a rating
  static async updateRating(ratingId: string, data: Partial<CreateRatingRequest>): Promise<Rating> {
    const response = await apiClient.put<Rating>(`/ratings/${ratingId}`, data);
    return response.data;
  }

  // Delete a rating
  static async deleteRating(ratingId: string): Promise<void> {
    await apiClient.delete(`/ratings/${ratingId}`);
  }

  // Get recommended vendors based on consumer profile
  static async getRecommendedVendors(limit: number = 10): Promise<any[]> {
    const response = await apiClient.get('/consumers/recommendations', {
      params: { limit },
    });
    return response.data;
  }

  // Get consumer dashboard data
  static async getDashboardData(): Promise<{
    recentConnections: Connection[];
    recommendedVendors: any[];
    recentRatings: Rating[];
    stats: {
      totalConnections: number;
      totalRatings: number;
      favoriteCategories: string[];
    };
  }> {
    const response = await apiClient.get('/consumers/dashboard');
    return response.data;
  }

  // Search consumer's connection history
  static async searchConnections(query: string): Promise<Connection[]> {
    const response = await apiClient.get<Connection[]>('/consumers/connections/search', {
      params: { query },
    });
    return response.data;
  }

  // Get consumer activity feed
  static async getActivityFeed(page: number = 1, limit: number = 20): Promise<{
    activities: any[];
    total: number;
    page: number;
    hasMore: boolean;
  }> {
    const response = await apiClient.get('/consumers/activity', {
      params: { page, limit },
    });
    return response.data;
  }

  // Update search radius
  static async updateSearchRadius(radius: number): Promise<Consumer> {
    const response = await apiClient.patch<Consumer>('/consumers/search-radius', {
      searchRadius: radius,
    });
    return response.data;
  }

  // Get consumer statistics
  static async getStatistics(): Promise<{
    totalConnections: number;
    totalRatings: number;
    averageRatingGiven: number;
    favoriteCategories: Array<{ category: string; count: number }>;
    monthlyActivity: Array<{ month: string; connections: number; ratings: number }>;
  }> {
    const response = await apiClient.get('/consumers/statistics');
    return response.data;
  }
}

export default ConsumerService;

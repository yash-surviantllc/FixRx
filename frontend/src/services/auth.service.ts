import { apiClient, TokenManager } from '../lib/api-client';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '../types/api';

export class AuthService {
  // Register new user
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    console.log('Raw register response:', response);
    
    // Handle the actual backend response structure
    const backendData = response.data as any;
    console.log('Backend register data:', backendData);
    
    // Transform backend response to expected AuthResponse format
    const authResponse: AuthResponse = {
      user: backendData.user,
      accessToken: backendData.token || backendData.accessToken || backendData.tokens?.accessToken,
      refreshToken: backendData.refreshToken || backendData.tokens?.refreshToken || backendData.token,
    };
    
    if (authResponse.accessToken) {
      TokenManager.setToken(authResponse.accessToken);
      if (authResponse.refreshToken) {
        TokenManager.setRefreshToken(authResponse.refreshToken);
      }
    }
    
    console.log('Transformed register response:', authResponse);
    return authResponse;
  }

  // Login user
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    console.log('Raw login response:', response);
    
    // Handle the actual backend response structure
    const backendData = response.data as any;
    console.log('Backend login data:', backendData);
    
    // Transform backend response to expected AuthResponse format
    const authResponse: AuthResponse = {
      user: backendData.user,
      accessToken: backendData.token || backendData.accessToken || backendData.tokens?.accessToken,
      refreshToken: backendData.refreshToken || backendData.tokens?.refreshToken || backendData.token,
    };
    
    if (authResponse.accessToken) {
      TokenManager.setToken(authResponse.accessToken);
      if (authResponse.refreshToken) {
        TokenManager.setRefreshToken(authResponse.refreshToken);
      }
    }
    
    console.log('Transformed login response:', authResponse);
    return authResponse;
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn('Logout API call failed:', error);
    } finally {
      TokenManager.clearTokens();
    }
  }

  // Refresh access token
  static async refreshToken(): Promise<AuthResponse> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>('/auth/refresh', {
      refreshToken,
    });

    if (response.success && response.data) {
      TokenManager.setToken(response.data.accessToken);
      TokenManager.setRefreshToken(response.data.refreshToken);
    }

    return response.data;
  }

  // Get current user profile
  static async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  }

  // Update user profile
  static async updateProfile(data: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>('/users/me', data);
    return response.data;
  }

  // Request password reset
  static async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  // Reset password
  static async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password });
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!TokenManager.getToken();
  }

  // Get current token
  static getToken(): string | null {
    return TokenManager.getToken();
  }

  // Clear authentication
  static clearAuth(): void {
    TokenManager.clearTokens();
  }
}

export default AuthService;

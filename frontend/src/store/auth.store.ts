import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Consumer, Vendor } from '../types/api';
import { AuthService } from '../services/auth.service';
import { ConsumerService } from '../services/consumer.service';
import { VendorService } from '../services/vendor.service';

interface AuthState {
  // State
  user: User | null;
  consumer: Consumer | null;
  vendor: Vendor | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  updateConsumerProfile: (data: Partial<Consumer>) => Promise<void>;
  updateVendorProfile: (data: Partial<Vendor>) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      consumer: null,
      vendor: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const authResponse = await AuthService.login({ email, password });
          console.log('Login response:', authResponse);
          
          if (authResponse && authResponse.user && authResponse.user.role) {
            set({
              user: authResponse.user,
              isAuthenticated: true,
              isLoading: false,
            });

            // Load profile data based on user role
            await get().loadProfile();
          } else {
            console.error('Invalid login response:', authResponse);
            throw new Error('Invalid response structure from login - missing user or user role');
          }
        } catch (error: any) {
          console.error('Login error:', error);
          set({
            error: error.message || 'Login failed',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Register action
      register: async (data: any) => {
        try {
          set({ isLoading: true, error: null });
          
          const authResponse = await AuthService.register(data);
          console.log('Register response:', authResponse);
          
          if (authResponse && authResponse.user && authResponse.user.role) {
            set({
              user: authResponse.user,
              isAuthenticated: true,
              isLoading: false,
            });

            // Load profile data based on user role
            await get().loadProfile();
          } else {
            console.error('Invalid registration response:', authResponse);
            throw new Error('Invalid response structure from registration - missing user or user role');
          }
        } catch (error: any) {
          console.error('Registration error:', error);
          let errorMessage = 'Registration failed';
          
          if (error.error === 'User already exists') {
            errorMessage = 'This email is already registered. Please try logging in instead.';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Logout action
      logout: async () => {
        try {
          await AuthService.logout();
        } catch (error) {
          console.warn('Logout API call failed:', error);
        } finally {
          set({
            user: null,
            consumer: null,
            vendor: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      // Load current user
      loadUser: async () => {
        try {
          if (!AuthService.isAuthenticated()) {
            set({ isAuthenticated: false });
            return;
          }

          set({ isLoading: true, error: null });
          
          const user = await AuthService.getCurrentUser();
          
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Load profile data
          await get().loadProfile();
        } catch (error: any) {
          set({
            error: error.message || 'Failed to load user',
            isLoading: false,
            isAuthenticated: false,
            user: null,
          });
        }
      },

      // Load profile based on user role
      loadProfile: async () => {
        const { user } = get();
        console.log('Loading profile for user:', user);
        
        if (!user || !user.role) {
          console.warn('No user or user role found, skipping profile load');
          return;
        }

        try {
          if (user.role === 'CONSUMER') {
            try {
              const consumer = await ConsumerService.getCurrentConsumerProfile();
              set({ consumer });
              console.log('Consumer profile loaded:', consumer);
            } catch (error) {
              // Consumer profile might not exist yet
              console.warn('Consumer profile not found');
            }
          } else if (user.role === 'VENDOR') {
            try {
              const vendor = await VendorService.getCurrentVendorProfile();
              set({ vendor });
              console.log('Vendor profile loaded:', vendor);
            } catch (error) {
              // Vendor profile might not exist yet
              console.warn('Vendor profile not found');
            }
          }
        } catch (error: any) {
          console.warn('Failed to load profile:', error.message);
        }
      },

      // Update user profile
      updateUser: async (data: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          const updatedUser = await AuthService.updateProfile(data);
          
          set({
            user: updatedUser,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to update profile',
            isLoading: false,
          });
          throw error;
        }
      },

      // Update consumer profile
      updateConsumerProfile: async (data: Partial<Consumer>) => {
        try {
          set({ isLoading: true, error: null });
          
          const updatedConsumer = await ConsumerService.updateConsumerProfile(data);
          
          set({
            consumer: updatedConsumer,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to update consumer profile',
            isLoading: false,
          });
          throw error;
        }
      },

      // Update vendor profile
      updateVendorProfile: async (data: Partial<Vendor>) => {
        try {
          set({ isLoading: true, error: null });
          
          const updatedVendor = await VendorService.updateVendorProfile(data);
          
          set({
            vendor: updatedVendor,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Failed to update vendor profile',
            isLoading: false,
          });
          throw error;
        }
      },

      // Clear error
      clearError: () => set({ error: null }),

      // Set loading state
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    {
      name: 'fixrx-auth-store',
      partialize: (state) => ({
        user: state.user,
        consumer: state.consumer,
        vendor: state.vendor,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;

import { useEffect } from 'react';
import { useAuthStore } from '../store/auth.store';
import { AuthService } from '../services/auth.service';

export const useAuth = () => {
  const {
    user,
    consumer,
    vendor,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    loadUser,
    updateUser,
    updateConsumerProfile,
    updateVendorProfile,
    clearError,
  } = useAuthStore();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (AuthService.isAuthenticated() && !user) {
        await loadUser();
      }
    };

    initializeAuth();
  }, [user, loadUser]);

  // Helper functions with safety checks
  const isConsumer = user && user.role === 'CONSUMER';
  const isVendor = user && user.role === 'VENDOR';
  const hasProfile = isConsumer ? !!consumer : isVendor ? !!vendor : false;

  return {
    // State
    user,
    consumer,
    vendor,
    isAuthenticated,
    isLoading,
    error,
    isConsumer,
    isVendor,
    hasProfile,

    // Actions
    login,
    register,
    logout,
    loadUser,
    updateUser,
    updateConsumerProfile,
    updateVendorProfile,
    clearError,
  };
};

export default useAuth;

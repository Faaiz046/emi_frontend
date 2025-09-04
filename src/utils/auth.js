import { store } from '../store';
import { logoutUser } from '../store/slices/authSlice';
import { removeAuthToken } from '../services/api-client/api';
import Toast from './toast';

// Flag to prevent multiple simultaneous logout attempts
let isLoggingOut = false;

/**
 * Handle automatic logout when token expires
 * This function clears all auth data and redirects to login
 */
export const handleTokenExpiration = () => {
  // Prevent multiple simultaneous logout attempts
  if (isLoggingOut) {
    return;
  }
  
  // Check if already on login page to avoid redirect loops
  if (window.location.pathname === '/login') {
    return;
  }
  
  isLoggingOut = true;
  
  try {
    // Clear auth token from API client
    removeAuthToken();
    
    // Clear all auth-related data from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
    localStorage.removeItem('persist:root');
    
    // Dispatch logout action to clear Redux state
    store.dispatch(logoutUser());
    
    // Show notification to user
    Toast.error('Session expired. Please login again.');
    
    // Redirect to login page
    window.location.href = '/login';
  } catch (error) {
    console.error('Error during automatic logout:', error);
  } finally {
    // Reset flag after a delay to allow for cleanup
    setTimeout(() => {
      isLoggingOut = false;
    }, 1000);
  }
};

/**
 * Check if the current response indicates token expiration
 */
export const isTokenExpired = (error) => {
  return error?.response?.status === 403 || 
         error?.status === 403 ||
         error?.message?.includes('token expired') ||
         error?.message?.includes('forbidden');
};

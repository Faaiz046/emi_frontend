import { post, put, get, setAuthToken, removeAuthToken, getAuthToken } from '../api-client/api';
import { API_ENDPOINTS } from '../../config';

// Authentication functions
export const login = async (credentials) => {
  try {
          const response = await post(API_ENDPOINTS.auth.login, credentials);
      
      if (response?.data?.token) {
        setAuthToken(response?.data?.token);
      }
    
    if (response.refreshToken) {
      localStorage.setItem('refresh_token', response.refreshToken);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
          const response = await post(API_ENDPOINTS.auth.register, userData);
      
      if (response.token) {
        setAuthToken(response.token);
      }
    
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
          await post(API_ENDPOINTS.auth.logout);
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.warn('Logout failed on server:', error);
    } finally {
      // Always clear local tokens
      removeAuthToken();
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
  }
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

          const response = await post(API_ENDPOINTS.auth.refresh, {
        refreshToken,
      });

      if (response.token) {
        setAuthToken(response.token);
      }

    if (response.refreshToken) {
      localStorage.setItem('refresh_token', response.refreshToken);
    }

    return response;
  } catch (error) {
          // If refresh fails, clear all tokens
      removeAuthToken();
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_profile');
    throw error;
  }
};

export const forgotPassword = async (email) => {
  try {
          const response = await post(API_ENDPOINTS.auth.forgotPassword, { email });
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
          const response = await post(API_ENDPOINTS.auth.resetPassword, {
        token,
        password: newPassword,
      });
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    // You can implement a token verification endpoint
    // For now, we'll just check if token exists
    return !!token;
  } catch (error) {
    return false;
  }
};

// User management functions
export const getCurrentUser = async () => {
  try {
    const response = await get('/user/profile');
    localStorage.setItem('user_profile', JSON.stringify(response));
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await put('/user/profile', userData);
    localStorage.setItem('user_profile', JSON.stringify(response));
    return response;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await post('/user/change-password', {
      currentPassword,
      newPassword,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const socialLogin = async (provider, token) => {
  try {
    const response = await post(`/auth/${provider}`, { token });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// Utility functions
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

export const getStoredUserProfile = () => {
  try {
    const profile = localStorage.getItem('user_profile');
    return profile ? JSON.parse(profile) : null;
  } catch (error) {
    console.error('Error parsing stored user profile:', error);
    return null;
  }
};

export const clearStoredUserData = () => {
  removeAuthToken();
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_profile');
};

// For backward compatibility, export a default object with all functions
const authService = {
  login,
  register,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyToken,
  getCurrentUser,
  updateProfile,
  changePassword,
  socialLogin,
  isAuthenticated,
  getStoredUserProfile,
  clearStoredUserData,
};

export default authService; 
import axios from 'axios';
import { APP_CONFIG, ERROR_MESSAGES } from '../../config';
import { handleTokenExpiration, isTokenExpired } from '../../utils/auth';

// Configuration constants
const baseURL = APP_CONFIG.api.baseUrl;
const timeout = APP_CONFIG.api.timeout;
const retries = APP_CONFIG.api.retries;

// Create axios instance
const axiosInstance = axios.create({
  baseURL,
  timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management functions
export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
  delete axiosInstance.defaults.headers.common['Authorization'];
};

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 403 errors (token expired/forbidden)
    if (error.response?.status === 403) {
      handleTokenExpiration();
      return Promise.reject(error);
    }

    // Handle 401 errors and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axiosInstance.post('/auth/refresh', { refreshToken });
          if (response.token) {
            setAuthToken(response.token);
            originalRequest.headers.Authorization = `Bearer ${response.token}`;
            return axiosInstance(originalRequest);
          }
        }
      } catch (refreshError) {
        removeAuthToken();
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_profile');
      }
    }

    // Handle specific error cases
    const errorMessage = getErrorMessage(error);
    const customError = new Error(errorMessage);
    customError.status = error.response?.status;
    customError.statusText = error.response?.statusText;
    customError.response = error.response;

    return Promise.reject(customError);
  }
);

// Helper function to get error message
const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error.response?.status) {
    switch (error.response.status) {
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 422:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      default:
        if (error.response.status >= 500) {
          return ERROR_MESSAGES.SERVER_ERROR;
        } else if (error.response.status >= 400) {
          return ERROR_MESSAGES.VALIDATION_ERROR;
        }
    }
  }
  
  if (error.code === 'ECONNABORTED') {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }
  
  if (error.message === 'Network Error') {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  return ERROR_MESSAGES.SERVER_ERROR;
};

// Retry mechanism
export const retryRequest = async (fn, retryCount = retries) => {
  try {
    return await fn();
  } catch (error) {
    // Handle 403 errors immediately (don't retry)
    if (error.status === 403 || error.response?.status === 403) {
      handleTokenExpiration();
      throw error;
    }
    
    if (retryCount > 0 && shouldRetry(error)) {
      await delay(1000 * (retries - retryCount + 1)); // Exponential backoff
      return retryRequest(fn, retryCount - 1);
    }
    throw error;
  }
};

// Check if request should be retried
export const shouldRetry = (error) => {
  // Don't retry 403 errors (token expired)
  if (error.status === 403) {
    return false;
  }
  
  return (
    error.status > 500 ||
    error.status === 429 ||
    error.message === ERROR_MESSAGES.NETWORK_ERROR ||
    error.message === ERROR_MESSAGES.TIMEOUT_ERROR
  );
};

// Delay function for retry mechanism
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// HTTP method functions
export const get = async (url, options = {}) => {
  return retryRequest(() => axiosInstance.get(url, options));
};

export const post = async (url, data = null, options = {}) => {
  return retryRequest(() => axiosInstance.post(url, data || undefined, options));
};

export const put = async (url, data = null, options = {}) => {
  return retryRequest(() => axiosInstance.put(url, data, options));
};

export const patch = async (url, data = null, options = {}) => {
  return retryRequest(() => axiosInstance.patch(url, data, options));
};

export const del = async (url, options = {}) => {
  return retryRequest(() => axiosInstance.delete(url, options));
};

// Upload file
export const upload = async (url, file, options = {}) => {
  const formData = new FormData();
  formData.append('file', file);

  const config = {
    ...options,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...options.headers,
    },
  };

  return retryRequest(() => axiosInstance.post(url, formData, config));
};

// Download file
export const download = async (url, filename = null, options = {}) => {
  const config = {
    ...options,
    responseType: 'blob',
  };

  const response = await retryRequest(() => axiosInstance.get(url, config));
  
  const blob = new Blob([response]);
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = filename || 'download';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(downloadUrl);
};

// For backward compatibility, export a default object with all functions
const apiClient = {
  get,
  post,
  put,
  patch,
  delete: del,
  upload,
  download,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  retryRequest,
  shouldRetry,
  delay,
  axiosInstance,
};

export { apiClient };
export default apiClient; 
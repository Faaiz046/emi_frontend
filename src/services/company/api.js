import { apiClient } from '../api-client/api';

export const companyApi = {
  // Get all companies with pagination and filters
  getAll: async (params = {}) => {
    const { page = 0, limit = 10, search, status, subscription_plan, expired, expiring_days } = params;

    return apiClient.post(`/companies/list`, {
      page,
      limit,
      search,
      status,
      subscription_plan,
      expired,
      expiring_days
    });
  },

  // Get company by ID
  getById: async (id) => {
    return apiClient.get(`/companies/${id}`);
  },

  // Create new company
  create: async (companyData) => {
    return apiClient.post('/companies', companyData);
  },

  // Update company
  update: async (id, updateData) => {
    return apiClient.put(`/companies/${id}`, updateData);
  },

  // Delete company
  delete: async (id) => {
    return apiClient.delete(`/companies/${id}`);
  },

  // Generate license key
  generateLicenseKey: async () => {
    return apiClient.post('/companies/generate-license-key');
  },

  // Check subscription status
  checkSubscription: async (id) => {
    return apiClient.get(`/companies/${id}/subscription-status`);
  },

  // Get company statistics
  getStats: async () => {
    return apiClient.get('/companies/stats');
  }
}; 
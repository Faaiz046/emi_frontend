import { apiClient } from '../api-client/api';

export const userApi = {
  // Get all users with pagination and filters
  getAll: async (params = {}) => {
    const { page = 0, limit = 10, search, role_id, branch_ids, primary_branch_id, is_active, is_verified, department, position } = params;
    const queryParams = new URLSearchParams();
    
    if (page) queryParams.append('page', page);
    if (limit) queryParams.append('limit', limit);
    if (search) queryParams.append('search', search);
    if (role_id) queryParams.append('role_id', role_id);
    if (branch_ids) queryParams.append('branch_ids', branch_ids);
    if (primary_branch_id) queryParams.append('primary_branch_id', primary_branch_id);
    if (is_active !== undefined) queryParams.append('is_active', is_active);
    if (is_verified !== undefined) queryParams.append('is_verified', is_verified);
    if (department) queryParams.append('department', department);
    if (position) queryParams.append('position', position);

    return apiClient.post(`/users/list`,{
      page,
      limit,
      search,
      role_id,
      branch_ids,
    });
  },

  // Get user by ID
  getById: async (id) => {
    return apiClient.get(`/users/${id}`);
  },

  // Create new user
  create: async (userData) => {
    return apiClient.post('/users', userData);
  },

  // Update user
  update: async (id, updateData) => {
    return apiClient.put(`/users/${id}`, updateData);
  },

  // Delete user
  delete: async (id) => {
    return apiClient.delete(`/users/${id}`);
  },

  // Get user's assigned branches
  getUserBranches: async (id) => {
    return apiClient.get(`/users/${id}/branches`);
  },

  // Update user's last login
  updateLastLogin: async (id) => {
    return apiClient.put(`/users/${id}/last-login`);
  },

  // Verify user password
  verifyPassword: async (id, password) => {
    return apiClient.post(`/users/${id}/verify-password`, { password });
  },

  // Get user statistics
  getStats: async () => {
    return apiClient.get('/users/stats');
  },

  // Get user by email
  getByEmail: async (email) => {
    return apiClient.get(`/users/email/${email}`);
  },

  // Get user by username
  getByUsername: async (username) => {
    return apiClient.get(`/users/username/${username}`);
  }
}; 
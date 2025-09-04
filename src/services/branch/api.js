import { apiClient } from "../api-client/api";

export const branchApi = {
  // Get all branches with pagination and filters
  getAll: async (params = {}) => {
    const {
      page = 0,
      limit = 100,
      search,
      is_active = true,
      is_headquarters,
    } = params;

    return apiClient.post(`/branches/list`, {
      page: page,
      limit: limit,
      search: search,
      is_active: is_active,
      is_headquarters: is_headquarters,
    });
  },

  // Get branch by ID
  getById: async (id) => {
    return apiClient.get(`/branches/${id}`);
  },

  // Create new branch
  create: async (branchData) => {
    return apiClient.post("/branches", branchData);
  },

  // Update branch
  update: async (id, updateData) => {
    return apiClient.put(`/branches/${id}`, updateData);
  },

  // Delete branch
  delete: async (id) => {
    return apiClient.delete(`/branches/${id}`);
  },

  // Get branches by tenant ID
  getByTenantId: async (tenantId) => {
    return apiClient.get(`/branches/tenant/${tenantId}`);
  },

  // Get branch statistics
  getStats: async () => {
    return apiClient.get("/branches/stats");
  },

  // Get active branches
  getActive: async () => {
    return apiClient.get("/branches/active");
  },

  // Get headquarters branch
  getHeadquarters: async () => {
    return apiClient.get("/branches/headquarters");
  },
};

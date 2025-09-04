import { apiClient } from "../api-client/api";

export const roleApi = {
  // Get all roles with pagination and filters
  getAll: async () => {
    return apiClient.get(`/roles`);
  },

  // Get role by ID
  getById: async (id) => {
    return apiClient.get(`/roles/${id}`);
  },

  // Create new role
  create: async (roleData) => {
    return apiClient.post("/roles", roleData);
  },

  // Update role
  update: async (id, updateData) => {
    return apiClient.put(`/roles/${id}`, updateData);
  },

  // Delete role
  delete: async (id) => {
    return apiClient.delete(`/roles/${id}`);
  },

  // Get roles by tenant ID
  getByTenantId: async (tenantId) => {
    return apiClient.get(`/roles/tenant/${tenantId}`);
  },

  // Get role by title and tenant
  getByTitleAndTenant: async (title, tenantId) => {
    return apiClient.get(`/roles/title/${title}/tenant/${tenantId}`);
  },

  // Get role statistics
  getStats: async () => {
    return apiClient.get("/roles/stats");
  },

  // Get active roles
  getActive: async () => {
    return apiClient.get("/roles/active");
  },
};

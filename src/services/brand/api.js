import { apiClient } from "../api-client/api";

export const brandApi = {
  // Get all brands with pagination and filters
  getAll: async (params = {}) => {
    return apiClient.get(`/brands`);
  },

  // Get brand by ID
  getById: async (id) => {
    return apiClient.get(`/brands/${id}`);
  },

  // Create new brand
  create: async (brandData) => {
    const formData = new FormData();
    Object.keys(brandData || {}).forEach((key) => {
      if (key === "logo") return; // handle below
      if (brandData[key] !== undefined && brandData[key] !== null) {
        formData.append(key, brandData[key]);
      }
    });

    if (brandData.logo) {
      // Only append file if it's a File/Blob; ignore if string (server can derive or ignore)
      if (brandData.logo instanceof File || brandData.logo instanceof Blob) {
        formData.append("logo", brandData.logo);
      }
    }

    return apiClient.post("/brands", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update brand
  update: async (id, updateData) => {
    const formData = new FormData();
    Object.keys(updateData || {}).forEach((key) => {
      if (key === "logo") return; // handle below
      if (updateData[key] !== undefined && updateData[key] !== null) {
        formData.append(key, updateData[key]);
      }
    });

    if (updateData.logo) {
      if (updateData.logo instanceof File || updateData.logo instanceof Blob) {
        formData.append("logo", updateData.logo);
      }
      // If string, skip to keep existing logo unless backend expects a URL string
    }

    return apiClient.put(`/brands/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete brand
  delete: async (id) => {
    return apiClient.delete(`/brands/${id}`);
  },

  // Get brands by tenant ID
  getByTenantId: async (tenantId) => {
    return apiClient.get(`/brands/tenant/${tenantId}`);
  },

  // Get active brands by tenant ID
  getActiveByTenantId: async (tenantId) => {
    return apiClient.get(`/brands/tenant/${tenantId}/active`);
  },

  // Get brand statistics
  getStats: async () => {
    return apiClient.get("/brands/stats");
  },

  // Get active brands
  getActive: async () => {
    return apiClient.get("/brands/active");
  },
};

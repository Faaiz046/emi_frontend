import { apiClient } from "../api-client/api";

export const categoryApi = {
  // Get all categories with pagination and filters
  getAll: async () => {
    return apiClient.get(`/categories`);
  },

  // Get category by ID
  getById: async (id) => {
    return apiClient.get(`/categories/${id}`);
  },

  // Create new category
  create: async (categoryData) => {
    const formData = new FormData();

    // Add text fields
    Object.keys(categoryData).forEach((key) => {
      if (key !== "logo" && key !== "image" && key !== "file") {
        formData.append(key, categoryData[key]);
      }
    });

    // Add file if present
    if (categoryData.logo) {
      formData.append("logo", categoryData.logo);
    } else if (categoryData.image) {
      formData.append("image", categoryData.image);
    } else if (categoryData.file) {
      formData.append("file", categoryData.file);
    }

    return apiClient.post("/categories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update category
  update: async (id, updateData) => {
    const formData = new FormData();

    // Add text fields
    Object.keys(updateData).forEach((key) => {
      if (key !== "logo" && key !== "image" && key !== "file") {
        formData.append(key, updateData[key]);
      }
    });

    // Add file if present
    if (updateData.logo) {
      formData.append("logo", updateData.logo);
    } else if (updateData.image) {
      formData.append("image", updateData.image);
    } else if (updateData.file) {
      formData.append("file", updateData.file);
    }

    return apiClient.put(`/categories/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete category
  delete: async (id) => {
    return apiClient.delete(`/categories/${id}`);
  },

  // Get category statistics
  getStats: async () => {
    return apiClient.get("/categories/stats");
  },

  // Get active categories
  getActive: async () => {
    return apiClient.get("/categories/active");
  },

  // Get categories by tenant ID
  getByTenantId: async (tenantId) => {
    return apiClient.get(`/categories/tenant/${tenantId}`);
  },
};

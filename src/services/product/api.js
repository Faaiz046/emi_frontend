import { apiClient } from "../api-client/api";

export const productApi = {
  // Get all products with pagination and filters
  getAll: async (params = {}) => {
    return apiClient.get(`/products`);
  },

  // Get product by ID
  getById: async (id) => {
    return apiClient.get(`/products/${id}`);
  },

  // Create new product
  create: async (productData) => {
    const formData = new FormData();

    // Add text fields
    Object.keys(productData).forEach((key) => {
      if (key !== "images" && key !== "image" && key !== "file") {
        formData.append(key, productData[key]);
      }
    });

    // Add files if present
    if (productData.images) {
      if (Array.isArray(productData.images)) {
        productData.images.forEach((file, index) => {
          formData.append("images", file);
        });
      } else {
        formData.append("images", productData.images);
      }
    } else if (productData.image) {
      if (Array.isArray(productData.image)) {
        productData.image.forEach((file, index) => {
          formData.append("image", file);
        });
      } else {
        formData.append("image", productData.image);
      }
    } else if (productData.file) {
      if (Array.isArray(productData.file)) {
        productData.file.forEach((file, index) => {
          formData.append("file", file);
        });
      } else {
        formData.append("file", productData.file);
      }
    }

    return apiClient.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update product
  update: async (id, updateData) => {
    const formData = new FormData();

    // Add text fields
    Object.keys(updateData).forEach((key) => {
      if (key !== "images" && key !== "image" && key !== "file") {
        formData.append(key, updateData[key]);
      }
    });

    // Add files if present
    if (updateData.images) {
      if (Array.isArray(updateData.images)) {
        updateData.images.forEach((file, index) => {
          formData.append("images", file);
        });
      } else {
        formData.append("images", updateData.images);
      }
    } else if (updateData.image) {
      if (Array.isArray(updateData.image)) {
        updateData.image.forEach((file, index) => {
          formData.append("image", file);
        });
      } else {
        formData.append("image", updateData.image);
      }
    } else if (updateData.file) {
      if (Array.isArray(updateData.file)) {
        updateData.file.forEach((file, index) => {
          formData.append("file", file);
        });
      } else {
        formData.append("file", updateData.file);
      }
    }

    return apiClient.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Delete product
  delete: async (id) => {
    return apiClient.delete(`/products/${id}`);
  },

  // Update product stock
  updateStock: async (id, stockData) => {
    return apiClient.put(`/products/${id}/stock`, stockData);
  },

  // Get product statistics
  getStats: async () => {
    return apiClient.get("/products/stats");
  },

  // Get active products
  getSearch: async (q = '') => {
    return apiClient.get(`/products/search?q=${q}`);
  },

  // Get products by category
  getByCategory: async (categoryId) => {
    return apiClient.get(`/products/category/${categoryId}`);
  },

  // Get products by brand
  getByBrand: async (brandId) => {
    return apiClient.get(`/products/brand/${brandId}`);
  },

  // Get low stock products
  getLowStock: async (threshold = 10) => {
    return apiClient.get(`/products/low-stock?threshold=${threshold}`);
  },

  // Get out of stock products
  getOutOfStock: async () => {
    return apiClient.get("/products/out-of-stock");
  },
};

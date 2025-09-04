import { apiClient } from "../../../services/api-client/api";

const BASE_URL = "/outstanding_payments";

export const outstandApi = {
  // Get list of outstanding accounts
  load: async (params = {}) => {
    try {
      const response = await apiClient.post(`${BASE_URL}/calculate`, params);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get outstanding accounts by account number
  list: async (params = {}) => {
    try {
      const response = await apiClient.post(`${BASE_URL}`, params);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get outstanding accounts by customer
  getByCustomer: async (customerId) => {
    try {
      const response = await apiClient.get(
        `${BASE_URL}/customer/${customerId}`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get outstanding accounts by branch
  getByBranch: async (branchId) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/branch/${branchId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get outstanding summary statistics
  getSummary: async () => {
    try {
      const response = await apiClient.get(`${BASE_URL}/summary`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get outstanding accounts with overdue installments
  getOverdue: async (params = {}) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/overdue`, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export outstanding data
  export: async (params = {}) => {
    try {
      const response = await apiClient.get(`${BASE_URL}/export`, {
        params,
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

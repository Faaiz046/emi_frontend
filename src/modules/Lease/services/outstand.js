import { apiClient } from "../../../services/api-client/api";

const BASE_URL = "/outstanding_payments";

export const outstandApi = {
  // Get list of outstanding accounts
  loadOutstand: async (params = {}) => {
    const response = await apiClient.post(`${BASE_URL}/calculate`, params);
    return response.data;
  },

  // Get outstanding accounts by account number
  OutstandList: async (params = {}) => {
    const response = await apiClient.post(`${BASE_URL}`, params);
    return response;
  },
  clearOutstand: async (data) => {
    const response = await apiClient.post(`${BASE_URL}/cleanup`, data);
    return response;
  },
  assign_recovery_officer: async (data) => {
    const response = await apiClient.post(
      `${BASE_URL}/assign_recovery_officer`,
      data
    );
    return response;
  },
};

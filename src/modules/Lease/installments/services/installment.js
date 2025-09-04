import { apiClient } from "../../../../services/api-client/api";

const BASE_URL = "/installments";

export const installmentApi = {
  // Get all installments with pagination and filters
  list: async (params = {}) => {
    const response = await apiClient.get(BASE_URL, { params });
    return response.data;
  },

  // Get installment by ID
  getById: async (id) => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Get installments by account ID
  getByAccountId: async (accountId, params = {}) => {
    const response = await apiClient.get(`${BASE_URL}/account/${accountId}`, { params });
    return response.data;
  },

  // Create new installment
  create: async (data) => {
    const response = await apiClient.post(BASE_URL, data);
    return response.data;
  },

  // Update installment
  update: async (id, data) => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Delete installment
  delete: async (id) => {
    const response = await apiClient.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Mark installment as paid
  markAsPaid: async (id, data) => {
    const response = await apiClient.patch(`${BASE_URL}/${id}/pay`, data);
    return response.data;
  },

  // Send SMS reminder
  sendSMS: async (id) => {
    const response = await apiClient.post(`${BASE_URL}/${id}/sms`);
    return response.data;
  },

  // Get installment statistics
  getStats: async (accountId) => {
    const response = await apiClient.get(`${BASE_URL}/stats/${accountId}`);
    return response.data;
  },
};

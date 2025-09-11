import { apiClient } from "../../../services/api-client/api";

// Helper to append single or multiple files under the same field name
const appendFile = (formData, fieldName, fileOrFiles) => {
  if (!fileOrFiles) return;
  if (Array.isArray(fileOrFiles)) {
    fileOrFiles.forEach((file) => file && formData.append(fieldName, file));
  } else {
    formData.append(fieldName, fileOrFiles);
  }
};

export const leaseAccountApi = {
  // List Lease Accounts with pagination and filters
  list: async (params = {}) => {
    const { page = 0, limit = 10, search, branch_id, status, start_date, end_date } = params;
    return apiClient.post("/lease_accounts/list", {
      page,
      limit,
      search,
      branch_id,
      status,
      start_date,
      end_date,
    });
  },

  // Get Lease Account by ID
  getById: async (params = {}) => {
    return apiClient.get(`/lease_accounts/${params?.id || null}`, {
      params: { acc_no: params?.acc_no },
    });
  },

  accountDetails: async (params = {}) => {
    return apiClient.post(`/lease_accounts/details`, {
      account_id: params?.id || null,
      acc_no: params?.acc_no || null,
    });
  },

  // Create Lease Account (processing, customer, advance + images)
  create: async (payload = {}) => {
    const { images = {}, ...formFields } = payload;

    // // Clean up the form data - remove fields that shouldn't be sent
    // const { ...cleanFormFields } = formFields;

    const formData = new FormData();

    // Append cleaned form fields as a single object
    formData.append("formData", JSON.stringify(formFields));

    // Append image files using exact backend field names
    const {
      form_pic,
      customer_card_front,
      customer_card_back,
      g1_card_front,
      g1_card_back,
      g2_card_front,
      g2_card_back,
      g3_card_front,
      g3_card_back,
      warranty_card_pic,
      picture_url, // Extract customer picture from images
    } = images || {};

    appendFile(formData, "form_pic", form_pic);
    appendFile(formData, "customer_card_front", customer_card_front);
    appendFile(formData, "customer_card_back", customer_card_back);
    appendFile(formData, "g1_card_front", g1_card_front);
    appendFile(formData, "g1_card_back", g1_card_back);
    appendFile(formData, "g2_card_front", g2_card_front);
    appendFile(formData, "g2_card_back", g2_card_back);
    appendFile(formData, "g3_card_front", g3_card_front);
    appendFile(formData, "g3_card_back", g3_card_back);
    appendFile(formData, "warranty_card_pic", warranty_card_pic);
    appendFile(formData, "picture_url", picture_url); // Append customer picture

    return apiClient.post("/lease_accounts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Update Lease Account
  update: async (id, payload = {}) => {
    const { images = {}, ...formFields } = payload;

    // Clean up the form data - remove fields that shouldn't be sent
    // const { ...cleanFormFields } = formFields;

    const formData = new FormData();

    // Append cleaned form fields as a single object
    formData.append("formData", JSON.stringify(formFields));

    // Append image files using exact backend field names
    const {
      form_pic,
      customer_card_front,
      customer_card_back,
      g1_card_front,
      g1_card_back,
      g2_card_front,
      g2_card_back,
      g3_card_front,
      g3_card_back,
      warranty_card_pic,
      picture_url, // Extract customer picture from images
    } = images || {};

    appendFile(formData, "form_pic", form_pic);
    appendFile(formData, "customer_card_front", customer_card_front);
    appendFile(formData, "customer_card_back", customer_card_back);
    appendFile(formData, "g1_card_front", g1_card_front);
    appendFile(formData, "g1_card_back", g1_card_back);
    appendFile(formData, "g2_card_front", g2_card_front);
    appendFile(formData, "g2_card_back", g2_card_back);
    appendFile(formData, "g3_card_front", g3_card_front);
    appendFile(formData, "g3_card_back", g3_card_back);
    appendFile(formData, "warranty_card_pic", warranty_card_pic);
    appendFile(formData, "picture_url", picture_url); // Append customer picture

    return apiClient.put(`/lease_accounts/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default leaseAccountApi;

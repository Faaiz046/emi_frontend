import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { companyApi } from "../../services/company/api";
import {
  mockCompanies,
  createMockResponse,
  mockApiDelay,
} from "../../services/mockData";

const searchCompanies = (companies, searchTerm) => {
  if (!searchTerm) return companies;

  const search = searchTerm.toLowerCase();

  return companies.filter((company) => {
    const searchableFields = [
      company.company_name || "",
      company.email || "",
      company.phone || "",
      company.address || "",
      company.license_key || "",
      company.status || "",
      company.subscription_plan || "",
      company.max_users?.toString() || "",
    ];
    return searchableFields.some((field) =>
      field.toLowerCase().includes(search)
    );
  });
};

// Async thunks
export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (params, { rejectWithValue }) => {
    try {
      // Try API first, fallback to mock
      try {
        const response = await companyApi.getAll(params);
        if (response.status) {
          return response.data;
        }
      } catch (apiError) {
        console.warn("API call failed, using mock data:", apiError);
      }

      // Fallback to mock data
      await mockApiDelay();

      // Filter mock data based on params
      let filteredData = mockCompanies;
      if (params?.search) {
        filteredData = mockCompanies.filter(
          (company) =>
            company.company_name
              .toLowerCase()
              .includes(params.search.toLowerCase()) ||
            company.email.toLowerCase().includes(params.search.toLowerCase()) ||
            company.phone.toLowerCase().includes(params.search.toLowerCase()) ||
            company.status
              .toLowerCase()
              .includes(params.search.toLowerCase()) ||
            company.subscription_plan
              .toLowerCase()
              .includes(params.search.toLowerCase())
        );
      }

      if (params?.status) {
        filteredData = filteredData.filter(
          (company) => company.status === params.status
        );
      }

      if (params?.subscription_plan) {
        filteredData = filteredData.filter(
          (company) => company.subscription_plan === params.subscription_plan
        );
      }

      return createMockResponse(filteredData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCompany = createAsyncThunk(
  "company/createCompany",
  async (companyData, { rejectWithValue }) => {
    console.log("🚀 ~ createCompany ~ companyData:", companyData);
    try {
      // Try API first, fallback to mock
      try {
        const response = await companyApi.create(companyData);
        if (response.status === true || response.status === undefined) {
          return response;
        } else {
          return rejectWithValue(response.message || "Company creation failed");
        }
      } catch (apiError) {
        console.warn("API call failed, using mock operation:", apiError);
        return rejectWithValue(apiError.message || "API call failed");
      }

      // Mock operation (commented out)
      // await mockApiDelay()
      // const newCompany = {
      //   id: Date.now(),
      //   ...companyData,
      //   created_at: new Date().toISOString(),
      //   updated_at: new Date().toISOString()
      // }
      // return newCompany
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCompany = createAsyncThunk(
  "company/updateCompany",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Try API first, fallback to mock
      try {
        const response = await companyApi.update(id, data);
        if (response.status) {
          return response.data;
        }
      } catch (apiError) {
        console.warn("API call failed, using mock operation:", apiError);
      }

      // Mock operation
      await mockApiDelay();
      return { id, ...data, updated_at: new Date().toISOString() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id, { rejectWithValue }) => {
    try {
      // Try API first, fallback to mock
      try {
        const response = await companyApi.delete(id);
        if (response.status) {
          return id;
        }
      } catch (apiError) {
        console.warn("API call failed, using mock operation:", apiError);
      }

      // Mock operation
      await mockApiDelay();
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  companies: [],
  loading: false,
  error: null,
  pagination: {
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: "",
    status: "",
    subscription_plan: "",
  },
};

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies =
          action.payload.companies || action.payload.data || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create company
      .addCase(createCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies.unshift(action.payload?.data);
        state.pagination.total += 1;
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.companies.findIndex(
          (company) => company.id === action.payload.id
        );
        if (index !== -1) {
          state.companies[index] = {
            ...state.companies[index],
            ...action.payload,
          };
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete company
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = state.companies.filter(
          (company) => company.id !== action.payload
        );
        state.pagination.total -= 1;
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setPagination, clearError } =
  companySlice.actions;

// Selectors
export const selectCompanies = (state) => state.company?.companies || [];
export const selectCompanyLoading = (state) => state.company?.loading || false;
export const selectCompanyError = (state) => state.company?.error || null;
export const selectCompanyPagination = (state) =>
  state.company?.pagination || initialState.pagination;
export const selectCompanyFilters = (state) =>
  state.company?.filters || initialState.filters;

export default companySlice.reducer;

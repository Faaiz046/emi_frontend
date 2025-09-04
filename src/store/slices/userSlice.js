import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { userApi } from '../../services/user/api'
import { mockUsers, createMockResponse, mockApiDelay } from '../../services/mockData'

// Async thunks
export const fetchUsers = createAsyncThunk(
  'user/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      // Try API first, fallback to mock
      try {
        const response = await userApi.getAll(params)
        if (response.status) {
          return response.data
        }
      } catch (apiError) {
        console.warn('API call failed, using mock data:', apiError)
      }
      
      // Fallback to mock data
      await mockApiDelay()
      
      // Filter mock data based on params
      let filteredData = mockUsers
      if (params?.search) {
        filteredData = mockUsers.filter(user =>
          user.name.toLowerCase().includes(params.search.toLowerCase()) ||
          user.email.toLowerCase().includes(params.search.toLowerCase())
        )
      }
      
      if (params?.role_id) {
        filteredData = filteredData.filter(user => user.role === params.role_id)
      }
      
      return createMockResponse(filteredData)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createUser = createAsyncThunk(
  'user/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Try API first, fallback to mock
      try {
        const response = await userApi.create(userData)
        if (response.status) {
          return response.data
        }
      } catch (apiError) {
        console.warn('API call failed, using mock operation:', apiError)
      }
      
      // Mock operation
      await mockApiDelay()
      const newUser = {
        id: Date.now(),
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return newUser
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Try API first, fallback to mock
      try {
        const response = await userApi.update(id, data)
        if (response.status) {
          return response.data
        }
      } catch (apiError) {
        console.warn('API call failed, using mock operation:', apiError)
      }
      
      // Mock operation
      await mockApiDelay()
      return { id, ...data, updated_at: new Date().toISOString() }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      // Try API first, fallback to mock
      try {
        const response = await userApi.delete(id)
        if (response.status) {
          return id
        }
      } catch (apiError) {
        console.warn('API call failed, using mock operation:', apiError)
      }
      
      // Mock operation
      await mockApiDelay()
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  users: [],
  loading: false,
  error: null,
  pagination: {
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {
    search: '',
    role_id: '',
    branch_ids: '',
    primary_branch_id: '',
    is_active: '',
    is_verified: '',
    department: '',
    position: ''
  }
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = initialState.filters
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.users || action.payload.data || action.payload
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Create user
      .addCase(createUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false
        state.users.unshift(action.payload)
        state.pagination.total += 1
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false
        const index = state.users.findIndex(user => user.id === action.payload.id)
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Delete user
      .addCase(deleteUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false
        state.users = state.users.filter(user => user.id !== action.payload)
        state.pagination.total -= 1
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setFilters, clearFilters, setPagination, clearError } = userSlice.actions

// Selectors
export const selectUsers = (state) => state.user?.users || []
export const selectUserLoading = (state) => state.user?.loading || false
export const selectUserError = (state) => state.user?.error || null
export const selectUserPagination = (state) => state.user?.pagination || initialState.pagination
export const selectUserFilters = (state) => state.user?.filters || initialState.filters

export default userSlice.reducer 
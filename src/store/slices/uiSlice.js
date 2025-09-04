import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  // Modal states
  modals: {
    login: false,
    register: false,
    forgotPassword: false,
    profile: false,
    settings: false,
  },
  
  // Notification states
  notifications: [],
  
  // Loading states
  loadingStates: {
    global: false,
    auth: false,
    dashboard: false,
  },
  
  // Sidebar state
  sidebar: {
    isOpen: false,
    isCollapsed: false,
  },
  
  // Theme state
  theme: {
    mode: localStorage.getItem('theme') || 'light',
    primaryColor: localStorage.getItem('primaryColor') || 'blue',
  },
  
  // Toast notifications
  toasts: [],
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    openModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = true;
      }
    },
    
    closeModal: (state, action) => {
      const modalName = action.payload;
      if (state.modals.hasOwnProperty(modalName)) {
        state.modals[modalName] = false;
      }
    },
    
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key] = false;
      });
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...action.payload,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Loading state actions
    setLoading: (state, action) => {
      const { key, isLoading } = action.payload;
      if (state.loadingStates.hasOwnProperty(key)) {
        state.loadingStates[key] = isLoading;
      }
    },
    
    setGlobalLoading: (state, action) => {
      state.loadingStates.global = action.payload;
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    
    openSidebar: (state) => {
      state.sidebar.isOpen = true;
    },
    
    closeSidebar: (state) => {
      state.sidebar.isOpen = false;
    },
    
    toggleSidebarCollapse: (state) => {
      state.sidebar.isCollapsed = !state.sidebar.isCollapsed;
    },
    
    // Theme actions
    setTheme: (state, action) => {
      state.theme.mode = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    
    setPrimaryColor: (state, action) => {
      state.theme.primaryColor = action.payload;
      localStorage.setItem('primaryColor', action.payload);
    },
    
    // Toast actions
    addToast: (state, action) => {
      const toast = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        duration: 5000, // 5 seconds default
        ...action.payload,
      };
      state.toasts.push(toast);
      
      // Keep only last 5 toasts
      if (state.toasts.length > 5) {
        state.toasts = state.toasts.slice(-5);
      }
    },
    
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(
        toast => toast.id !== action.payload
      );
    },
    
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

// Export actions
export const {
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  setLoading,
  setGlobalLoading,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  toggleSidebarCollapse,
  setTheme,
  setPrimaryColor,
  addToast,
  removeToast,
  clearToasts,
} = uiSlice.actions;

// Export selectors
export const selectUI = (state) => state.ui;
export const selectModals = (state) => state.ui.modals;
export const selectModal = (modalName) => (state) => state.ui.modals[modalName];
export const selectNotifications = (state) => state.ui.notifications;
export const selectLoadingStates = (state) => state.ui.loadingStates;
export const selectIsLoading = (key) => (state) => state.ui.loadingStates[key];
export const selectIsGlobalLoading = (state) => state.ui.loadingStates.global;
export const selectSidebar = (state) => state.ui.sidebar;
export const selectTheme = (state) => state.ui.theme;
export const selectToasts = (state) => state.ui.toasts;

export default uiSlice.reducer; 
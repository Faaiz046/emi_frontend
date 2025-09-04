// Application Configuration
export const APP_CONFIG = {
  name: "EMI Frontend",
  version: "1.0.0",
  environment: import.meta.env.MODE || "development",
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    timeout: 10000,
    retries: 3,
  },
  auth: {
    tokenKey: "auth_token",
    refreshTokenKey: "refresh_token",
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 hours
  },
  features: {
    auth: true,
    dashboard: true,
    userManagement: true,
    analytics: true,
    notifications: true,
    fileManagement: true,
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["image/*", "application/pdf", "text/*"],
  },
};

// Feature flags
export const FEATURE_FLAGS = {
  enableDarkMode: true,
  enableNotifications: true,
  enableAnalytics: true,
  enableFileUpload: true,
  enableSocialLogin: true,
};

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: "/login",
    register: "/register",
    logout: "/logout",
    refresh: "/refresh",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
  },
  user: {
    profile: "/user/profile",
    update: "/user/update",
    delete: "/user/delete",
    list: "/user/list",
  },
  dashboard: {
    stats: "/dashboard/stats",
    charts: "/dashboard/charts",
    recent: "/dashboard/recent",
  },
  analytics: {
    overview: "/analytics/overview",
    detailed: "/analytics/detailed",
    export: "/analytics/export",
  },
  notifications: {
    list: "/notifications",
    markRead: "/notifications/mark-read",
    settings: "/notifications/settings",
  },
  files: {
    upload: "/files/upload",
    list: "/files/list",
    download: "/files/download",
    delete: "/files/delete",
  },
};

// Theme Configuration
export const THEME_CONFIG = {
  colors: {
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
    },
    secondary: {
      50: "#f8fafc",
      100: "#f1f5f9",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
    },
    success: {
      50: "#f0fdf4",
      100: "#dcfce7",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
    },
    warning: {
      50: "#fffbeb",
      100: "#fef3c7",
      500: "#f59e0b",
      600: "#d97706",
      700: "#b45309",
    },
    error: {
      50: "#fef2f2",
      100: "#fee2e2",
      500: "#ef4444",
      600: "#dc2626",
      700: "#b91c1c",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },
};

// Validation Rules
export const VALIDATION_RULES = {
  email: {
    required: "Email is required",
    pattern: "Please enter a valid email address",
  },
  password: {
    required: "Password is required",
    minLength: "Password must be at least 6 characters",
    pattern: "Password must contain at least one letter and one number",
  },
  name: {
    required: "Name is required",
    minLength: "Name must be at least 2 characters",
  },
  phone: {
    pattern: "Please enter a valid phone number",
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_PROFILE: "user_profile",
  THEME: "theme",
  LANGUAGE: "language",
  NOTIFICATIONS: "notifications",
  DASHBOARD_LAYOUT: "dashboard_layout",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Session expired. Please login again.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
};

export default {
  APP_CONFIG,
  FEATURE_FLAGS,
  API_ENDPOINTS,
  THEME_CONFIG,
  VALIDATION_RULES,
  STORAGE_KEYS,
  ERROR_MESSAGES,
};

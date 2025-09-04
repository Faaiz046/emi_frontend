export const PERSIST_STORE_NAME = 'emi-store'

export const APP_NAME = 'EMI Frontend'
export const APP_VERSION = '1.0.0'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
export const API_TIMEOUT = 10000

export const AUTH_TOKEN_KEY = 'auth_token'
export const REFRESH_TOKEN_KEY = 'refresh_token'

export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

export const LAYOUT_TYPES = {
  CLASSIC: 'classic',
  MODERN: 'modern',
  STACKED_SIDE: 'stacked-side',
  DECKED: 'decked',
  SIMPLE: 'simple',
  COMPACT: 'compact',
  FLUID: 'fluid'
}

export const ROUTES = {
  DASHBOARD: '/dashboard',
  COMPANY: '/company',
  USERS: '/users',
  BRANCHES: '/branches',
  ROLES: '/roles',
  BRANDS: '/brands',
  CATEGORIES: '/categories',
  PRODUCTS: '/products',
  ANALYTICS: '/analytics',
  SETTINGS: '/settings'
}

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_LIMIT: 100
}

export const PROCESS_TYPE = {
  DAILY: 'Daily',
  WEEKLY: 'Weekly',
  MONTHLY: 'Monthly'
} 
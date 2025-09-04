// Application constants
export const APP_CONSTANTS = {
  // API
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  API_TIMEOUT: 10000,
  
  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    SIDEBAR_COLOR: 'sidebar_color',
    NAVIGATION_ITEMS: 'navigation_items',
    LAYOUT_TYPE: 'layout_type',
  },
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  
  // Animation
  ANIMATION_DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  
  // Breakpoints
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  
  // Colors
  COLORS: {
    PRIMARY: 'blue',
    SUCCESS: 'green',
    WARNING: 'yellow',
    ERROR: 'red',
    INFO: 'cyan',
  },
  
  // Status
  STATUS: {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
  },
};

// Route constants
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
  SETTINGS: '/settings',
  SIDEBAR_COLORS: '/sidebar-colors',
  SPINNER_SHOWCASE: '/spinner-showcase',
};

// Component variants
export const COMPONENT_VARIANTS = {
  BUTTON: {
    DEFAULT: 'default',
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info',
    OUTLINE: 'outline',
    GHOST: 'ghost',
    LINK: 'link',
    DESTRUCTIVE: 'destructive',
  },
  
  SPINNER: {
    DEFAULT: 'default',
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
    INFO: 'info',
    LIGHT: 'light',
    DARK: 'dark',
    RAINBOW: 'rainbow',
    GRADIENT: 'gradient',
    DOTS: 'dots',
    DASHED: 'dashed',
  },
  
  SIZE: {
    XS: 'xs',
    SM: 'sm',
    MD: 'md',
    LG: 'lg',
    XL: 'xl',
    '2XL': '2xl',
    '3XL': '3xl',
  },
  
  SPEED: {
    SLOW: 'slow',
    NORMAL: 'normal',
    FAST: 'fast',
    PULSE: 'pulse',
    BOUNCE: 'bounce',
  },
};

// Layout constants
export const LAYOUT_CONSTANTS = {
  SIDEBAR: {
    WIDTH: '280px',
    COLLAPSED_WIDTH: '64px',
    MIN_WIDTH: '200px',
    MAX_WIDTH: '400px',
  },
  
  NAVBAR: {
    HEIGHT: '64px',
    MIN_HEIGHT: '48px',
    MAX_HEIGHT: '80px',
  },
  
  CONTENT: {
    PADDING: '24px',
    MAX_WIDTH: '1200px',
    MIN_HEIGHT: 'calc(100vh - 64px)',
  },
};

// Validation constants
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true,
  },
  
  EMAIL: {
    MAX_LENGTH: 254,
  },
  
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
  
  PHONE: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 15,
  },
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
  PASSWORD_TOO_WEAK: 'Password must contain uppercase, lowercase, number, and special character',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
};

// Success messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully',
  CREATED: 'Item created successfully',
  UPDATED: 'Item updated successfully',
  DELETED: 'Item deleted successfully',
  LOGGED_IN: 'Logged in successfully',
  LOGGED_OUT: 'Logged out successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
}; 
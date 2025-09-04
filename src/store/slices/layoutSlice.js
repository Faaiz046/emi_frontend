import { createSlice } from '@reduxjs/toolkit';

// Layout types
export const LAYOUT_TYPES = {
  CLASSIC: 'classic',
  MODERN: 'modern',
  STACKED_SIDE: 'stackedSide',
  DECKED: 'decked',
  SIMPLE: 'simple',
  COMPACT: 'compact',
  FLUID: 'fluid',
};

// Navigation types
export const NAV_TYPES = {
  SIDE: 'side',
  TOP: 'top',
  BOTH: 'both',
  NONE: 'none',
};

// Direction types
export const DIRECTION_TYPES = {
  LTR: 'ltr',
  RTL: 'rtl',
};

// Helper function to load navigation from localStorage
const loadNavigationFromStorage = () => {
  try {
    const savedNavigation = localStorage.getItem('navigationItems');
    if (savedNavigation) {
      return JSON.parse(savedNavigation);
    }
  } catch (error) {
    console.warn('Failed to load navigation from localStorage:', error);
  }
  return null;
};

// Helper function to load sidebar color from localStorage
const loadSidebarColorFromStorage = () => {
  try {
    const savedColor = localStorage.getItem('sidebarColor');
    if (savedColor) {
      return savedColor;
    }
  } catch (error) {
    console.warn('Failed to load sidebar color from localStorage:', error);
  }
  return 'blue';
};

// Initial state
const initialState = {
  // Layout configuration
  layout: {
    type: LAYOUT_TYPES.MODERN,
    sidebar: {
      isOpen: true,
      isCollapsed: false,
      width: '280px',
      collapsedWidth: '64px',
    },
    navbar: {
      isVisible: true,
      height: '64px',
      isSticky: true,
    },
    content: {
      padding: '24px',
      maxWidth: '1200px',
    },
  },
  
  // Navigation configuration
  navigation: {
    type: NAV_TYPES.SIDE,
    items: loadNavigationFromStorage() || [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: 'HomeIcon',
        path: '/dashboard',
        badge: null,
        type: 'item',
      },
      {
        id: 'management',
        label: 'Management',
        icon: 'BuildingOfficeIcon',
        type: 'menu',
        isOpen: false,
        items: [
          {
            id: 'company',
            label: 'Company',
            icon: 'BuildingOfficeIcon',
            path: '/company',
            badge: null,
            type: 'item',
          },
          {
            id: 'users',
            label: 'Users',
            icon: 'UsersIcon',
            path: '/users',
            badge: null,
            type: 'item',
          },
          {
            id: 'branches',
            label: 'Branches',
            icon: 'BuildingStorefrontIcon',
            path: '/branches',
            badge: null,
            type: 'item',
          },
          {
            id: 'roles',
            label: 'Roles',
            icon: 'ShieldCheckIcon',
            path: '/roles',
            badge: null,
            type: 'item',
          },
        ],
      },
      {
        id: 'lease',
        label: 'Lease',
        icon: 'BuildingOfficeIcon',
        type: 'menu',
        isOpen: false,
        items: [
          {
            id: 'lease-accounts',
            label: 'Accounts',
            icon: 'BuildingOfficeIcon',
            path: '/lease/accounts',
            badge: null,
            type: 'item',
          },
        ],
      },
      {
        id: 'catalog',
        label: 'Catalog',
        icon: 'CubeIcon',
        type: 'menu',
        isOpen: false,
        items: [
          {
            id: 'brands',
            label: 'Brands',
            icon: 'TagIcon',
            path: '/brands',
            badge: null,
            type: 'item',
          },
          {
            id: 'categories',
            label: 'Categories',
            icon: 'Squares2X2Icon',
            path: '/categories',
            badge: null,
            type: 'item',
          },
          {
            id: 'products',
            label: 'Products',
            icon: 'CubeIcon',
            path: '/products',
            badge: null,
            type: 'item',
          },
          {
            id: 'accounts',
            label: 'Accounts',
            icon: 'Squares2X2Icon',
            path: '/accounts',
            badge: null,
            type: 'item',
          },
        ],
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: 'ChartBarIcon',
        path: '/analytics',
        badge: null,
        type: 'item',
      },
      {
        id: 'sidebar-colors',
        label: 'Sidebar Colors',
        icon: 'CogIcon',
        path: '/sidebar-colors',
        badge: null,
        type: 'item',
      },
      {
        id: 'spinner-showcase',
        label: 'Spinner Showcase',
        icon: 'ArrowPathIcon',
        path: '/spinner-showcase',
        badge: null,
        type: 'item',
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'CogIcon',
        path: '/settings',
        badge: null,
        type: 'item',
      },
      {
        id: 'pos',
        label: 'POS System',
        icon: 'BuildingStorefrontIcon',
        type: 'menu',
        isOpen: false,
        items: [
          {
            id: 'pos-sales',
            label: 'Sales',
            icon: 'CubeIcon',
            path: '/pos/sales',
            badge: null,
            type: 'item',
          },
          {
            id: 'pos-inventory',
            label: 'Inventory',
            icon: 'CubeIcon',
            path: '/pos/inventory',
            badge: null,
            type: 'item',
          },
          {
            id: 'pos-transactions',
            label: 'Transactions',
            icon: 'CubeIcon',
            path: '/pos/transactions',
            badge: null,
            type: 'item',
          },
        ],
      },
      {
        id: 'tailor',
        label: 'Tailor Management',
        icon: 'UserCircleIcon',
        type: 'menu',
        isOpen: false,
        items: [
          {
            id: 'tailor-orders',
            label: 'Orders',
            icon: 'CubeIcon',
            path: '/tailor/orders',
            badge: null,
            type: 'item',
          },
          {
            id: 'tailor-measurements',
            label: 'Measurements',
            icon: 'CubeIcon',
            path: '/tailor/measurements',
            badge: null,
            type: 'item',
          },
          {
            id: 'tailor-fabric',
            label: 'Fabric Inventory',
            icon: 'CubeIcon',
            path: '/tailor/fabric-inventory',
            badge: null,
            type: 'item',
          },
        ],
      },
      {
        id: 'appointments',
        label: 'Appointments',
        icon: 'CalendarIcon',
        type: 'menu',
        isOpen: false,
        items: [
          {
            id: 'appointments-calendar',
            label: 'Calendar',
            icon: 'CubeIcon',
            path: '/appointments/calendar',
            badge: null,
            type: 'item',
          },
          {
            id: 'appointments-bookings',
            label: 'Bookings',
            icon: 'CubeIcon',
            path: '/appointments/bookings',
            badge: null,
            type: 'item',
          },
          {
            id: 'appointments-customers',
            label: 'Customers',
            icon: 'CubeIcon',
            path: '/appointments/customers',
            badge: null,
            type: 'item',
          },
        ],
      },
    ],
  },
  
  // Direction and language
  direction: DIRECTION_TYPES.LTR,
  language: 'en',
  
  // Theme and appearance
  theme: {
    mode: 'light',
    primaryColor: 'blue',
    borderRadius: '8px',
    fontFamily: 'Inter',
  },
  
  // Sidebar color
  sidebarColor: loadSidebarColorFromStorage(),
  
  // Responsive settings
  responsive: {
    breakpoint: 'lg',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
  },
  
  // Quick actions
  quickActions: {
    isVisible: false,
    position: 'bottom-right',
  },
  
  // Breadcrumbs
  breadcrumbs: {
    isVisible: true,
    items: [],
  },
  
  // Footer
  footer: {
    isVisible: true,
    content: '© 2024 EMI Frontend. All rights reserved.',
  },
};

// Layout slice
const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    // Layout type actions
    setLayoutType: (state, action) => {
      state.layout.type = action.payload;
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.layout.sidebar.isOpen = !state.layout.sidebar.isOpen;
    },
    
    openSidebar: (state) => {
      state.layout.sidebar.isOpen = true;
    },
    
    closeSidebar: (state) => {
      state.layout.sidebar.isOpen = false;
    },
    
    toggleSidebarCollapse: (state) => {
      state.layout.sidebar.isCollapsed = !state.layout.sidebar.isCollapsed;
    },
    
    setSidebarWidth: (state, action) => {
      state.layout.sidebar.width = action.payload;
    },
    
    setSidebarCollapsedWidth: (state, action) => {
      state.layout.sidebar.collapsedWidth = action.payload;
    },

    // Menu actions
    toggleMenu: (state, action) => {
      const menuId = action.payload;
      const findAndToggleMenu = (items) => {
        items.forEach(item => {
          if (item.id === menuId && item.type === 'menu') {
            item.isOpen = !item.isOpen;
          } else if (item.type === 'menu' && item.items) {
            findAndToggleMenu(item.items);
          }
        });
      };
      findAndToggleMenu(state.navigation.items);
    },

    openMenu: (state, action) => {
      const menuId = action.payload;
      const findAndOpenMenu = (items) => {
        items.forEach(item => {
          if (item.id === menuId && item.type === 'menu') {
            item.isOpen = true;
          } else if (item.type === 'menu' && item.items) {
            findAndOpenMenu(item.items);
          }
        });
      };
      findAndOpenMenu(state.navigation.items);
    },

    closeMenu: (state, action) => {
      const menuId = action.payload;
      const findAndCloseMenu = (items) => {
        items.forEach(item => {
          if (item.id === menuId && item.type === 'menu') {
            item.isOpen = false;
          } else if (item.type === 'menu' && item.items) {
            findAndCloseMenu(item.items);
          }
        });
      };
      findAndCloseMenu(state.navigation.items);
    },

    closeAllMenus: (state) => {
      const closeAllMenusRecursive = (items) => {
        items.forEach(item => {
          if (item.type === 'menu') {
            item.isOpen = false;
            if (item.items) {
              closeAllMenusRecursive(item.items);
            }
          }
        });
      };
      closeAllMenusRecursive(state.navigation.items);
    },
    
    // Navbar actions
    toggleNavbar: (state) => {
      state.layout.navbar.isVisible = !state.layout.navbar.isVisible;
    },
    
    setNavbarHeight: (state, action) => {
      state.layout.navbar.height = action.payload;
    },
    
    setNavbarSticky: (state, action) => {
      state.layout.navbar.isSticky = action.payload;
    },
    
    // Content actions
    setContentPadding: (state, action) => {
      state.layout.content.padding = action.payload;
    },
    
    setContentMaxWidth: (state, action) => {
      state.layout.content.maxWidth = action.payload;
    },
    
    // Navigation actions
    setNavigationType: (state, action) => {
      state.navigation.type = action.payload;
    },
    
    setNavigationItems: (state, action) => {
      state.navigation.items = action.payload;
    },
    
    addNavigationItem: (state, action) => {
      state.navigation.items.push(action.payload);
    },
    
    removeNavigationItem: (state, action) => {
      state.navigation.items = state.navigation.items.filter(
        item => item.id !== action.payload
      );
    },
    
    updateNavigationItem: (state, action) => {
      const { id, updates } = action.payload;
      const updateItem = (items) => {
        items.forEach(item => {
          if (item.id === id) {
            Object.assign(item, updates);
          } else if (item.type === 'menu' && item.items) {
            updateItem(item.items);
          }
        });
      };
      updateItem(state.navigation.items);
    },
    
    // Direction actions
    setDirection: (state, action) => {
      state.direction = action.payload;
    },
    
    // Language actions
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    
    // Theme actions
    setThemeMode: (state, action) => {
      state.theme.mode = action.payload;
    },
    
    setPrimaryColor: (state, action) => {
      state.theme.primaryColor = action.payload;
    },
    
    setBorderRadius: (state, action) => {
      state.theme.borderRadius = action.payload;
    },
    
    setFontFamily: (state, action) => {
      state.theme.fontFamily = action.payload;
    },
    
    // Sidebar color actions
    setSidebarColor: (state, action) => {
      state.sidebarColor = action.payload;
    },
    
    // Responsive actions
    setResponsiveBreakpoint: (state, action) => {
      state.responsive.breakpoint = action.payload;
    },
    
    setResponsiveState: (state, action) => {
      state.responsive = { ...state.responsive, ...action.payload };
    },
    
    // Quick actions
    toggleQuickActions: (state) => {
      state.quickActions.isVisible = !state.quickActions.isVisible;
    },
    
    setQuickActionsPosition: (state, action) => {
      state.quickActions.position = action.payload;
    },
    
    // Breadcrumbs actions
    toggleBreadcrumbs: (state) => {
      state.breadcrumbs.isVisible = !state.breadcrumbs.isVisible;
    },
    
    setBreadcrumbsItems: (state, action) => {
      state.breadcrumbs.items = action.payload;
    },
    
    // Footer actions
    toggleFooter: (state) => {
      state.footer.isVisible = !state.footer.isVisible;
    },
    
    setFooterContent: (state, action) => {
      state.footer.content = action.payload;
    },
  },
});

export const {
  setLayoutType,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  toggleSidebarCollapse,
  setSidebarWidth,
  setSidebarCollapsedWidth,
  toggleMenu,
  openMenu,
  closeMenu,
  closeAllMenus,
  toggleNavbar,
  setNavbarHeight,
  setNavbarSticky,
  setContentPadding,
  setContentMaxWidth,
  setNavigationType,
  setNavigationItems,
  addNavigationItem,
  removeNavigationItem,
  updateNavigationItem,
  setDirection,
  setLanguage,
  setThemeMode,
  setPrimaryColor,
  setBorderRadius,
  setFontFamily,
  setSidebarColor,
  setResponsiveBreakpoint,
  setResponsiveState,
  toggleQuickActions,
  setQuickActionsPosition,
  toggleBreadcrumbs,
  setBreadcrumbsItems,
  toggleFooter,
  setFooterContent,
} = layoutSlice.actions;

// Selectors
export const selectLayout = (state) => state.layout;
export const selectLayoutType = (state) => state.layout.layout.type;
export const selectSidebar = (state) => state.layout.layout.sidebar;
export const selectNavbar = (state) => state.layout.layout.navbar;
export const selectContent = (state) => state.layout.layout.content;
export const selectNavigation = (state) => state.layout.navigation;
export const selectDirection = (state) => state.layout.direction;
export const selectLanguage = (state) => state.layout.language;
export const selectTheme = (state) => state.layout.theme;
export const selectSidebarColor = (state) => state.layout.sidebarColor;
export const selectResponsive = (state) => state.layout.responsive;
export const selectQuickActions = (state) => state.layout.quickActions;
export const selectBreadcrumbs = (state) => state.layout.breadcrumbs;
export const selectFooter = (state) => state.layout.footer;

export default layoutSlice.reducer; 
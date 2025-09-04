import React from 'react';
import { useAppDispatch } from '../../../store/hooks';
import { setNavigationItems } from '../../../store/slices/layoutSlice';
import { Button } from '../../../shared/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const NavigationRefreshButton = () => {
  const dispatch = useAppDispatch();

  // Updated navigation items with Sidebar Colors
  const updatedNavigationItems = [
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
  ];

  const handleRefreshNavigation = () => {
    // Update the navigation items in Redux
    dispatch(setNavigationItems(updatedNavigationItems));
    
    // Also save to localStorage for persistence
    localStorage.setItem('navigationItems', JSON.stringify(updatedNavigationItems));
    
    // Force a page reload to ensure the sidebar updates
    window.location.reload();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowPathIcon className="w-5 h-5" />
          Navigation Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Update Navigation Menu</h3>
            <p className="text-sm text-gray-600 mb-4">
              Click the button below to refresh the navigation configuration and add the new "Sidebar Colors" menu item to your sidebar.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What this will do:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Add "Sidebar Colors" menu item to the sidebar</li>
              <li>• Update the navigation configuration in Redux</li>
              <li>• Save the updated configuration to localStorage</li>
              <li>• Refresh the page to apply changes</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleRefreshNavigation}
            className="w-full"
            variant="primary"
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            Refresh Navigation Menu
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NavigationRefreshButton; 
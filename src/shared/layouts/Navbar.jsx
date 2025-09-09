import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { 
  selectNavbar, 
  toggleSidebar,
  setThemeMode,
  DIRECTION_TYPES 
} from '../../store/slices/layoutSlice';
import { logoutUser, selectUser } from '../../store/slices/authSlice';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import LayoutSwitcher from '../components/LayoutSwitcher';
import { useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ArrowPathIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const navbar = useAppSelector(selectNavbar);
  const user = useAppSelector(selectUser);
  const direction = useAppSelector((state) => state.layout.direction);
  const theme = useAppSelector((state) => state.layout.theme);
  const location = useLocation();
  const currentPath = location.pathname;
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);



  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isUserMenuOpen) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isUserMenuOpen]);

  const getPageTitle = () => {
    const pathTitles = {
      '/dashboard': 'Dashboard',
      '/company': 'Company Management',
      '/users': 'User Management',
      '/branches': 'Branch Management',
      '/roles': 'Role Management',
      '/brands': 'Brand Management',
      '/categories': 'Category Management',
      '/products': 'Product Management',
      '/analytics': 'Analytics',
      '/settings': 'Settings',
      'lease/bank': 'Bank Accounts',
    };
    return pathTitles[currentPath] || 'Dashboard';
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      // window.location.href = '/login';
      // navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme.mode === 'light' ? 'dark' : 'light';
    dispatch(setThemeMode(newTheme));
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  const getNavbarClasses = () => {
    const baseClasses = 'sticky top-0 z-40 bg-white border-b border-gray-200 transition-all duration-300';
    
    if (navbar.isSticky) {
      return `${baseClasses} shadow-sm`;
    }
    
    return baseClasses;
  };

  return (
    <header className={getNavbarClasses()}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch(toggleSidebar())}
            className="lg:hidden"
          >
            <Bars3Icon className="w-5 h-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-gray-900">
            {getPageTitle()}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Layout Switcher */}
          <LayoutSwitcher />
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {theme.mode === 'light' ? (
              <MoonIcon className="w-5 h-5" />
            ) : (
              <SunIcon className="w-5 h-5" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 relative"
          >
            <BellIcon className="w-5 h-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-4 h-4 text-xs"
            >
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <div className="relative user-menu">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 p-2"
              onClick={toggleUserMenu}
            >
              <UserCircleIcon className="w-6 h-6" />
              <span className="hidden md:block text-sm font-medium">
                {user?.name || user?.email || 'User'}
              </span>
            </Button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <a
                  href="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeUserMenu}
                >
                  <UserCircleIcon className="w-4 h-4 mr-3" />
                  Profile
                </a>
                <a
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={closeUserMenu}
                >
                  <CogIcon className="w-4 h-4 mr-3" />
                  Settings
                </a>
                <button
                  onClick={() => {
                    closeUserMenu();
                    handleLogout();
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 
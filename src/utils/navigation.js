import { useNavigate, useLocation } from 'react-router-dom';

// Custom hook for navigation
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return {
    navigate,
    currentPath: location.pathname,
    isActivePath: (path) => location.pathname === path
  };
};

// Legacy functions for backward compatibility (can be removed later)
export const navigateTo = (path) => {
  // This function is deprecated - use useNavigation hook instead
  console.warn('navigateTo is deprecated. Use useNavigation hook instead.');
  window.location.href = path;
};

export const handleNavigationClick = (e, path) => {
  // This function is deprecated - use useNavigation hook instead
  console.warn('handleNavigationClick is deprecated. Use useNavigation hook instead.');
  e.preventDefault();
  window.location.href = path;
};

export const getCurrentPath = () => {
  // This function is deprecated - use useNavigation hook instead
  console.warn('getCurrentPath is deprecated. Use useNavigation hook instead.');
  return window.location.pathname;
};

export const isActivePath = (path) => {
  // This function is deprecated - use useNavigation hook instead
  console.warn('isActivePath is deprecated. Use useNavigation hook instead.');
  return window.location.pathname === path;
}; 
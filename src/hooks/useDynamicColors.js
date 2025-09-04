import { useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { selectSidebarColor } from '../store/slices/layoutSlice';
import { getColorScheme, getComponentColors, getCSSVariables } from '../utils/colorSystem';

export const useDynamicColors = () => {
  const selectedColor = useAppSelector(selectSidebarColor);
  
  // Apply CSS variables to document root
  useEffect(() => {
    const cssVariables = getCSSVariables(selectedColor);
    const root = document.documentElement;
    
    Object.entries(cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Cleanup function
    return () => {
      Object.keys(cssVariables).forEach((property) => {
        root.style.removeProperty(property);
      });
    };
  }, [selectedColor]);
  
  // Get color scheme for current selected color
  const colorScheme = getColorScheme(selectedColor);
  
  // Helper functions to get component colors
  const getColors = {
    sidebar: () => getComponentColors(selectedColor, 'sidebar'),
    primary: () => getComponentColors(selectedColor, 'primary'),
    button: () => getComponentColors(selectedColor, 'button'),
    accent: () => getComponentColors(selectedColor, 'accent'),
    border: () => getComponentColors(selectedColor, 'border'),
    gradient: () => getComponentColors(selectedColor, 'gradient'),
  };
  
  return {
    selectedColor,
    colorScheme,
    getColors,
    // Convenience methods
    sidebarGradient: getColors.sidebar(),
    primaryColor: getColors.primary(),
    buttonClasses: getColors.button(),
    accentText: getColors.accent(),
    borderColor: getColors.border(),
    gradientClass: getColors.gradient(),
  };
}; 
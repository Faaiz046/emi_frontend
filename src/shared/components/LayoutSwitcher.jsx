import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  selectLayoutType, 
  selectSidebar,
  setLayoutType,
  toggleSidebar,
  toggleSidebarCollapse,
  LAYOUT_TYPES 
} from '../../store/slices/layoutSlice';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import {
  ViewColumnsIcon,
  Squares2X2Icon,
  RectangleStackIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  Cog6ToothIcon,
  SwatchIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';

const LayoutSwitcher = () => {
  const dispatch = useAppDispatch();
  const layoutType = useAppSelector(selectLayoutType);
  const sidebar = useAppSelector(selectSidebar);
  const [isOpen, setIsOpen] = useState(false);

  const layoutOptions = [
    {
      id: LAYOUT_TYPES.CLASSIC,
      name: 'Classic',
      icon: ViewColumnsIcon,
      description: 'Traditional sidebar',
    },
    {
      id: LAYOUT_TYPES.MODERN,
      name: 'Modern',
      icon: Squares2X2Icon,
      description: 'Contemporary design',
    },
    {
      id: LAYOUT_TYPES.STACKED_SIDE,
      name: 'Stacked',
      icon: RectangleStackIcon,
      description: 'Full-height sidebar',
    },
    {
      id: LAYOUT_TYPES.DECKED,
      name: 'Decked',
      icon: ArrowsPointingOutIcon,
      description: 'Card-based layout',
    },
    {
      id: LAYOUT_TYPES.SIMPLE,
      name: 'Simple',
      icon: ArrowsPointingInIcon,
      description: 'Minimalist design',
    },
    {
      id: LAYOUT_TYPES.COMPACT,
      name: 'Compact',
      icon: Cog6ToothIcon,
      description: 'Space-efficient',
    },
    {
      id: LAYOUT_TYPES.FLUID,
      name: 'Fluid',
      icon: SwatchIcon,
      description: 'Adaptive layout',
    },
  ];

  const currentLayout = layoutOptions.find(l => l.id === layoutType);
  const IconComponent = currentLayout?.icon || ViewColumnsIcon;

  const handleLayoutChange = (newLayoutType) => {
    dispatch(setLayoutType(newLayoutType));
    setIsOpen(false);
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleSidebarCollapse = () => {
    dispatch(toggleSidebarCollapse());
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <IconComponent className="w-4 h-4" />
        <span className="hidden sm:inline">{currentLayout?.name}</span>
        <ChevronDownIcon className="w-3 h-3" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
          {/* Layout Options */}
          <div className="px-3 py-2 border-b border-gray-100">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Layout Type
            </h3>
            <div className="space-y-1">
              {layoutOptions.map((layout) => {
                const LayoutIcon = layout.icon;
                const isActive = layoutType === layout.id;
                
                return (
                  <button
                    key={layout.id}
                    onClick={() => handleLayoutChange(layout.id)}
                    className={`w-full flex items-center space-x-3 px-2 py-1.5 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <LayoutIcon className="w-4 h-4" />
                    <div className="flex-1 text-left">
                      <div className="font-medium">{layout.name}</div>
                      <div className="text-xs text-gray-500">{layout.description}</div>
                    </div>
                    {isActive && (
                      <Badge variant="primary" size="sm">
                        Active
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Controls */}
          <div className="px-3 py-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Quick Controls
            </h3>
            <div className="space-y-1">
              <button
                onClick={handleSidebarToggle}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
              >
                <span>Sidebar</span>
                <Badge variant="secondary" size="sm">
                  {sidebar.isOpen ? 'Visible' : 'Hidden'}
                </Badge>
              </button>
              
              <button
                onClick={handleSidebarCollapse}
                disabled={!sidebar.isOpen}
                className="w-full flex items-center justify-between px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Collapse</span>
                <Badge variant="secondary" size="sm">
                  {sidebar.isCollapsed ? 'Collapsed' : 'Expanded'}
                </Badge>
              </button>
            </div>
          </div>

          {/* Current Status */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              Current: <span className="font-medium">{currentLayout?.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutSwitcher; 
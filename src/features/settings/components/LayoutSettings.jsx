import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  selectLayoutType, 
  selectSidebar, 
  selectNavbar,
  setLayoutType,
  toggleSidebar,
  toggleSidebarCollapse,
  setNavbarSticky,
  LAYOUT_TYPES 
} from '../../../store/slices/layoutSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import {
  ViewColumnsIcon,
  Bars3Icon,
  Squares2X2Icon,
  RectangleStackIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  Cog6ToothIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline';

const LayoutSettings = () => {
  const dispatch = useAppDispatch();
  const layoutType = useAppSelector(selectLayoutType);
  const sidebar = useAppSelector(selectSidebar);
  const navbar = useAppSelector(selectNavbar);

  const layoutOptions = [
    {
      id: LAYOUT_TYPES.CLASSIC,
      name: 'Classic',
      description: 'Traditional sidebar layout with fixed navigation',
      icon: ViewColumnsIcon,
      features: ['Fixed sidebar', 'Traditional navigation', 'Stable layout'],
    },
    {
      id: LAYOUT_TYPES.MODERN,
      name: 'Modern',
      description: 'Contemporary design with flexible sidebar',
      icon: Squares2X2Icon,
      features: ['Flexible sidebar', 'Modern design', 'Responsive layout'],
    },
    {
      id: LAYOUT_TYPES.STACKED_SIDE,
      name: 'Stacked Side',
      description: 'Full-height sidebar with stacked content',
      icon: RectangleStackIcon,
      features: ['Full-height sidebar', 'Stacked content', 'Maximal space'],
    },
    {
      id: LAYOUT_TYPES.DECKED,
      name: 'Decked',
      description: 'Card-based layout with decked navigation',
      icon: ArrowsPointingOutIcon,
      features: ['Card-based layout', 'Decked navigation', 'Visual hierarchy'],
    },
    {
      id: LAYOUT_TYPES.SIMPLE,
      name: 'Simple',
      description: 'Minimalist layout with essential features',
      icon: ArrowsPointingInIcon,
      features: ['Minimalist design', 'Essential features', 'Clean interface'],
    },
    {
      id: LAYOUT_TYPES.COMPACT,
      name: 'Compact',
      description: 'Space-efficient layout for dense information',
      icon: Cog6ToothIcon,
      features: ['Space-efficient', 'Dense information', 'Compact navigation'],
    },
    {
      id: LAYOUT_TYPES.FLUID,
      name: 'Fluid',
      description: 'Adaptive layout that flows with content',
      icon: SwatchIcon,
      features: ['Adaptive layout', 'Content-driven', 'Flexible design'],
    },
  ];

  const handleLayoutChange = (newLayoutType) => {
    dispatch(setLayoutType(newLayoutType));
  };

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };

  const handleSidebarCollapse = () => {
    dispatch(toggleSidebarCollapse());
  };

  const handleNavbarSticky = () => {
    dispatch(setNavbarSticky(!navbar.isSticky));
  };

  return (
    <div className="space-y-6">
      {/* Layout Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ViewColumnsIcon className="w-5 h-5" />
            <span>Layout Type</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {layoutOptions.map((layout) => {
              const IconComponent = layout.icon;
              const isActive = layoutType === layout.id;
              
              return (
                <div
                  key={layout.id}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleLayoutChange(layout.id)}
                >
                  {isActive && (
                    <Badge variant="primary" className="absolute top-2 right-2">
                      Active
                    </Badge>
                  )}
                  
                  <div className="flex items-center space-x-3 mb-3">
                    <IconComponent className="w-6 h-6 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{layout.name}</h3>
                      <p className="text-sm text-gray-500">{layout.description}</p>
                    </div>
                  </div>
                  
                  <ul className="space-y-1">
                    {layout.features.map((feature, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sidebar Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bars3Icon className="w-5 h-5" />
            <span>Sidebar Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Sidebar Visibility</h4>
                  <p className="text-sm text-gray-500">Show or hide the sidebar</p>
                </div>
                <Button
                  variant={sidebar.isOpen ? "default" : "outline"}
                  size="sm"
                  onClick={handleSidebarToggle}
                >
                  {sidebar.isOpen ? 'Visible' : 'Hidden'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Sidebar Collapse</h4>
                  <p className="text-sm text-gray-500">Collapse sidebar to icons only</p>
                </div>
                <Button
                  variant={sidebar.isCollapsed ? "default" : "outline"}
                  size="sm"
                  onClick={handleSidebarCollapse}
                  disabled={!sidebar.isOpen}
                >
                  {sidebar.isCollapsed ? 'Collapsed' : 'Expanded'}
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Navbar Sticky</h4>
                  <p className="text-sm text-gray-500">Keep navbar fixed at top</p>
                </div>
                <Button
                  variant={navbar.isSticky ? "default" : "outline"}
                  size="sm"
                  onClick={handleNavbarSticky}
                >
                  {navbar.isSticky ? 'Sticky' : 'Scroll'}
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Current Layout</h4>
                  <p className="text-sm text-gray-500">Active layout type</p>
                </div>
                <Badge variant="secondary">
                  {layoutOptions.find(l => l.id === layoutType)?.name || layoutType}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Layout Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Layout Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-4">
              Current layout: <strong>{layoutOptions.find(l => l.id === layoutType)?.name}</strong>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium mb-2">Sidebar Status:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Open: {sidebar.isOpen ? 'Yes' : 'No'}</li>
                  <li>• Collapsed: {sidebar.isCollapsed ? 'Yes' : 'No'}</li>
                  <li>• Width: {sidebar.isCollapsed ? sidebar.collapsedWidth : sidebar.width}</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Navbar Status:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Visible: {navbar.isVisible ? 'Yes' : 'No'}</li>
                  <li>• Sticky: {navbar.isSticky ? 'Yes' : 'No'}</li>
                  <li>• Height: {navbar.height}</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LayoutSettings; 
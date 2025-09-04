import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { 
  selectTheme,
  selectDirection,
  setThemeMode,
  setPrimaryColor,
  setDirection,
  DIRECTION_TYPES 
} from '../../../store/slices/layoutSlice';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import LayoutSettings from '../components/LayoutSettings';
import SidebarColorPicker from '../components/SidebarColorPicker';
import NavigationRefreshButton from '../components/NavigationRefreshButton';

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);
  const direction = useAppSelector(selectDirection);

  const handleThemeToggle = () => {
    const newTheme = theme.mode === 'light' ? 'dark' : 'light';
    dispatch(setThemeMode(newTheme));
  };

  const handleDirectionToggle = () => {
    const newDirection = direction === DIRECTION_TYPES.LTR ? DIRECTION_TYPES.RTL : DIRECTION_TYPES.LTR;
    dispatch(setDirection(newDirection));
  };

  const handlePrimaryColorChange = (color) => {
    dispatch(setPrimaryColor(color));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Theme Mode</h3>
                <p className="text-sm text-gray-500">Switch between light and dark themes</p>
              </div>
              <Button onClick={handleThemeToggle} variant="outline">
                {theme.mode === 'light' ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Text Direction</h3>
                <p className="text-sm text-gray-500">Change text direction (LTR/RTL)</p>
              </div>
              <Button onClick={handleDirectionToggle} variant="outline">
                {direction === DIRECTION_TYPES.LTR ? 'RTL' : 'LTR'}
              </Button>
            </div>

            <div>
              <h3 className="font-medium mb-2">Primary Color</h3>
              <div className="flex space-x-2">
                {['blue', 'green', 'purple', 'red', 'orange'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handlePrimaryColorChange(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      theme.primaryColor === color ? 'border-gray-900' : 'border-gray-300'
                    } bg-${color}-500`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Layout</CardTitle>
          </CardHeader>
          <CardContent>
            <LayoutSettings />
          </CardContent>
        </Card>
      </div>

      {/* Navigation Configuration */}
      <NavigationRefreshButton />

      {/* Sidebar Color Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sidebar Customization</CardTitle>
        </CardHeader>
        <CardContent>
          <SidebarColorPicker />
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage; 
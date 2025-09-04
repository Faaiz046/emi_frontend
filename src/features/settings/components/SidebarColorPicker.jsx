import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectSidebarColor, setSidebarColor } from '../../../store/slices/layoutSlice';
import { colorSchemes } from '../../../utils/colorSystem';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';

const SidebarColorPicker = () => {
  const dispatch = useAppDispatch();
  const currentSidebarColor = useAppSelector(selectSidebarColor);
  
  // Ensure the current color exists in our schemes, fallback to blue if not
  const validCurrentColor = colorSchemes[currentSidebarColor] ? currentSidebarColor : 'blue';
  const [selectedColor, setSelectedColor] = useState(validCurrentColor);

  const categories = {
    Single: 'Single Colors',
    Gradient: 'Gradient Combinations',
    Dark: 'Dark Themes',
    Premium: 'Premium Colors',
    Creative: 'Creative Combinations'
  };

  const handleColorSelect = (colorKey) => {
    setSelectedColor(colorKey);
  };

  const handleApplyColor = () => {
    dispatch(setSidebarColor(selectedColor));
    // Save to localStorage for persistence
    localStorage.setItem('sidebarColor', selectedColor);
  };

  const handleResetToDefault = () => {
    setSelectedColor('blue');
    dispatch(setSidebarColor('blue'));
    localStorage.setItem('sidebarColor', 'blue');
  };

  // Get the current color data with fallback
  const getCurrentColorData = () => {
    return colorSchemes[selectedColor] || colorSchemes.blue;
  };

  const renderColorCard = (colorKey, colorData) => (
    <div
      key={colorKey}
      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-lg border-2 ${
        selectedColor === colorKey ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
      }`}
      onClick={() => handleColorSelect(colorKey)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{colorData.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {colorData.category}
          </Badge>
        </div>
        
        <div className="mb-3">
          <div className={`w-full h-16 rounded-lg bg-gradient-to-r ${colorData.gradient} shadow-md`}></div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3">{colorData.description}</p>
        
        <div className="flex items-center justify-between">
          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
            {colorData.gradient}
          </code>
          
          <Button
            size="sm"
            variant={selectedColor === colorKey ? "default" : "outline"}
            onClick={() => handleColorSelect(colorKey)}
          >
            {selectedColor === colorKey ? 'Selected' : 'Select'}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sidebar Color</h2>
          <p className="text-gray-600">Choose a color scheme for your sidebar</p>
        </div>
        
        <Button
          onClick={() => window.open('/sidebar-colors', '_blank')}
          variant="outline"
        >
          View All Colors
        </Button>
      </div>

      {/* Selected Color Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Current Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className={`w-20 h-20 rounded-lg bg-gradient-to-r ${getCurrentColorData().gradient} shadow-lg`}></div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900">{getCurrentColorData().name}</h4>
              <p className="text-gray-600">{getCurrentColorData().description}</p>
              <code className="text-sm bg-gray-100 px-3 py-1 rounded border mt-2 inline-block">
                {getCurrentColorData().gradient}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Color Categories */}
      {Object.entries(categories).map(([categoryKey, categoryName]) => (
        <Card key={categoryKey}>
          <CardHeader>
            <CardTitle>{categoryName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Object.entries(colorSchemes)
                .filter(([_, colorData]) => colorData.category === categoryKey)
                .map(([colorKey, colorData]) => renderColorCard(colorKey, colorData))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Apply Button */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={handleResetToDefault}>
          Reset to Default
        </Button>
        <Button 
          variant="primary"
          onClick={handleApplyColor}
          disabled={selectedColor === validCurrentColor}
        >
          {selectedColor === validCurrentColor ? 'Current Color' : 'Apply Color'}
        </Button>
      </div>
    </div>
  );
};

export default SidebarColorPicker; 
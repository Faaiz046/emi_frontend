import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { selectSidebarColor, setSidebarColor } from '../../../store/slices/layoutSlice';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';

const ColorShowcase = () => {
  const dispatch = useAppDispatch();
  const currentSidebarColor = useAppSelector(selectSidebarColor);
  const [selectedColor, setSelectedColor] = useState(currentSidebarColor || 'blue');

  const colorSchemes = {
    // Single Colors
    blue: {
      name: 'Blue',
      gradient: 'from-blue-500 to-blue-600',
      description: 'Professional and trustworthy',
      category: 'Single'
    },
    indigo: {
      name: 'Indigo',
      gradient: 'from-indigo-500 to-indigo-600',
      description: 'Modern and sophisticated',
      category: 'Single'
    },
    purple: {
      name: 'Purple',
      gradient: 'from-purple-500 to-purple-600',
      description: 'Creative and luxurious',
      category: 'Single'
    },
    emerald: {
      name: 'Emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      description: 'Fresh and natural',
      category: 'Single'
    },
    teal: {
      name: 'Teal',
      gradient: 'from-teal-500 to-teal-600',
      description: 'Calm and balanced',
      category: 'Single'
    },
    rose: {
      name: 'Rose',
      gradient: 'from-rose-500 to-rose-600',
      description: 'Warm and inviting',
      category: 'Single'
    },
    amber: {
      name: 'Amber',
      gradient: 'from-amber-500 to-amber-600',
      description: 'Energetic and optimistic',
      category: 'Single'
    },
    slate: {
      name: 'Slate',
      gradient: 'from-slate-600 to-slate-700',
      description: 'Neutral and professional',
      category: 'Single'
    },

    // Gradient Combinations
    blueToPurple: {
      name: 'Blue to Purple',
      gradient: 'from-blue-500 to-purple-600',
      description: 'Modern tech feel',
      category: 'Gradient'
    },
    indigoToPink: {
      name: 'Indigo to Pink',
      gradient: 'from-indigo-500 to-pink-600',
      description: 'Creative and vibrant',
      category: 'Gradient'
    },
    emeraldToTeal: {
      name: 'Emerald to Teal',
      gradient: 'from-emerald-500 to-teal-600',
      description: 'Nature inspired',
      category: 'Gradient'
    },
    roseToOrange: {
      name: 'Rose to Orange',
      gradient: 'from-rose-500 to-orange-500',
      description: 'Warm and energetic',
      category: 'Gradient'
    },
    violetToPurple: {
      name: 'Violet to Purple',
      gradient: 'from-violet-500 to-purple-600',
      description: 'Royal and elegant',
      category: 'Gradient'
    },
    cyanToBlue: {
      name: 'Cyan to Blue',
      gradient: 'from-cyan-500 to-blue-600',
      description: 'Ocean inspired',
      category: 'Gradient'
    },
    greenToEmerald: {
      name: 'Green to Emerald',
      gradient: 'from-green-500 to-emerald-600',
      description: 'Fresh and natural',
      category: 'Gradient'
    },
    yellowToOrange: {
      name: 'Yellow to Orange',
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Sunny and bright',
      category: 'Gradient'
    },

    // Dark Themes
    darkBlue: {
      name: 'Dark Blue',
      gradient: 'from-blue-800 to-blue-900',
      description: 'Deep and professional',
      category: 'Dark'
    },
    darkPurple: {
      name: 'Dark Purple',
      gradient: 'from-purple-800 to-purple-900',
      description: 'Mysterious and elegant',
      category: 'Dark'
    },
    darkSlate: {
      name: 'Dark Slate',
      gradient: 'from-slate-800 to-slate-900',
      description: 'Minimal and clean',
      category: 'Dark'
    },
    darkGray: {
      name: 'Dark Gray',
      gradient: 'from-gray-800 to-gray-900',
      description: 'Neutral and modern',
      category: 'Dark'
    },

    // Premium Combinations
    goldToAmber: {
      name: 'Gold to Amber',
      gradient: 'from-yellow-400 to-amber-500',
      description: 'Premium and luxurious',
      category: 'Premium'
    },
    silverToGray: {
      name: 'Silver to Gray',
      gradient: 'from-gray-300 to-gray-400',
      description: 'Elegant and refined',
      category: 'Premium'
    },
    copperToOrange: {
      name: 'Copper to Orange',
      gradient: 'from-orange-400 to-red-500',
      description: 'Warm and inviting',
      category: 'Premium'
    },

    // Creative Combinations
    sunset: {
      name: 'Sunset',
      gradient: 'from-orange-400 via-pink-500 to-purple-600',
      description: 'Dramatic and artistic',
      category: 'Creative'
    },
    ocean: {
      name: 'Ocean',
      gradient: 'from-cyan-400 via-blue-500 to-indigo-600',
      description: 'Calm and deep',
      category: 'Creative'
    },
    forest: {
      name: 'Forest',
      gradient: 'from-green-400 via-emerald-500 to-teal-600',
      description: 'Natural and peaceful',
      category: 'Creative'
    },
    fire: {
      name: 'Fire',
      gradient: 'from-red-400 via-orange-500 to-yellow-500',
      description: 'Energetic and powerful',
      category: 'Creative'
    }
  };

  const categories = {
    Single: 'Single Colors',
    Gradient: 'Gradient Combinations',
    Dark: 'Dark Themes',
    Premium: 'Premium Colors',
    Creative: 'Creative Combinations'
  };

  const handleColorSelect = (colorKey) => {
    setSelectedColor(colorKey);
    dispatch(setSidebarColor(colorKey));
    
    // Save to localStorage for persistence
    localStorage.setItem('sidebarColor', colorKey);
    
    console.log(`Selected color: ${colorKey} - Applied to sidebar!`);
  };

  const renderColorCard = (colorKey, colorData) => (
    <Card
      key={colorKey}
      className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
        selectedColor === colorKey ? 'ring-2 ring-blue-500 ring-offset-2' : ''
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
            variant={selectedColor === colorKey ? "primary" : "secondary"}
            onClick={() => handleColorSelect(colorKey)}
          >
            {selectedColor === colorKey ? 'Selected' : 'Select'}
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sidebar Color Showcase</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore different color combinations for your sidebar. <strong>Click on any color to see it applied to your sidebar in real-time!</strong>
          Each color scheme is designed to match different moods and use cases.
        </p>
      </div>

      {/* Color Categories */}
      {Object.entries(categories).map(([categoryKey, categoryName]) => (
        <div key={categoryKey} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">{categoryName}</h2>
            <Badge variant="outline" className="text-sm">
              {Object.values(colorSchemes).filter(c => c.category === categoryKey).length} options
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(colorSchemes)
              .filter(([_, colorData]) => colorData.category === categoryKey)
              .map(([colorKey, colorData]) => renderColorCard(colorKey, colorData))}
          </div>
        </div>
      ))}

      {/* Selected Color Preview */}
      <div className="mt-12 p-6 bg-gray-50 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Selected Color Preview</h3>
        <div className="flex items-center space-x-4">
          <div className={`w-20 h-20 rounded-lg bg-gradient-to-r ${colorSchemes[selectedColor].gradient} shadow-lg`}></div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900">{colorSchemes[selectedColor].name}</h4>
            <p className="text-gray-600">{colorSchemes[selectedColor].description}</p>
            <code className="text-sm bg-white px-3 py-1 rounded border mt-2 inline-block">
              {colorSchemes[selectedColor].gradient}
            </code>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-green-900 mb-2">✨ Real-Time Color Application</h3>
        <p className="text-green-800 mb-4">
          Colors are applied to your sidebar immediately when you click on them! Here's what happens:
        </p>
        <ul className="list-disc list-inside space-y-2 text-green-800">
          <li><strong>Instant Application:</strong> Click any color to see it applied to your sidebar right away</li>
          <li><strong>Automatic Persistence:</strong> Your selected color is saved and will persist across page reloads</li>
          <li><strong>Live Preview:</strong> The sidebar updates in real-time as you browse different colors</li>
          <li><strong>Multiple Options:</strong> Choose from 28 different color schemes across 5 categories</li>
        </ul>
        
        <div className="mt-4 p-3 bg-green-100 rounded-lg">
          <p className="text-green-900 text-sm font-medium">
            💡 <strong>Tip:</strong> You can also change sidebar colors from the Settings page for quick access!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ColorShowcase; 
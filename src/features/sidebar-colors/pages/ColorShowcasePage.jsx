import React from 'react';
import ColorShowcase from '../components/ColorShowcase';

const ColorShowcasePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ColorShowcase />
      </div>
    </div>
  );
};

export default ColorShowcasePage; 
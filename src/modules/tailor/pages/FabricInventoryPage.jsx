import React from 'react';
import { Squares2X2Icon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const FabricInventoryPage = () => {
  const fabrics = [
    { id: 1, name: 'Silk', color: 'White', quantity: 25, unit: 'yards', price: 15.99, supplier: 'Premium Fabrics Inc.' },
    { id: 2, name: 'Cotton', color: 'Blue', quantity: 50, unit: 'yards', price: 8.99, supplier: 'Textile World' },
    { id: 3, name: 'Wool', color: 'Gray', quantity: 30, unit: 'yards', price: 22.99, supplier: 'Natural Fibers Co.' },
    { id: 4, name: 'Linen', color: 'Beige', quantity: 15, unit: 'yards', price: 12.99, supplier: 'Eco Textiles' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fabric Inventory</h2>
          <p className="text-gray-600">Manage fabric stock and suppliers</p>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center">
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Fabric
        </button>
      </div>

      {/* Fabric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fabrics.map((fabric) => (
          <div key={fabric.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Squares2X2Icon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-gray-500">${fabric.price}</span>
                <div className="text-xs text-gray-400">per {fabric.unit}</div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{fabric.name}</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Color:</span>
                <span className="font-medium">{fabric.color}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity:</span>
                <span className="font-medium">{fabric.quantity} {fabric.unit}</span>
              </div>
              <div className="flex justify-between">
                <span>Supplier:</span>
                <span className="font-medium">{fabric.supplier}</span>
              </div>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                <PencilIcon className="w-4 h-4 inline mr-1" />
                Edit
              </button>
              <button className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm">
                <TrashIcon className="w-4 h-4 inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FabricInventoryPage;

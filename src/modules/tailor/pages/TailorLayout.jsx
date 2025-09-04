import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  ClipboardDocumentListIcon, 
  DocumentTextIcon, 
  Squares2X2Icon 
} from '@heroicons/react/24/outline';

const TailorLayout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Orders', href: '/tailor/orders', icon: ClipboardDocumentListIcon },
    { name: 'Measurements', href: '/tailor/measurements', icon: DocumentTextIcon },
    { name: 'Fabric Inventory', href: '/tailor/fabric-inventory', icon: Squares2X2Icon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tailor Management</h1>
              <p className="text-sm text-gray-600">Manage custom orders, measurements, and fabric inventory</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                Custom Orders
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </div>
    </div>
  );
};

export default TailorLayout;

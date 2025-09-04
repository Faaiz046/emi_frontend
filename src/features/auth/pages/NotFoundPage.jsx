import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon, ArrowLeftIcon, HomeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-yellow-100">
            <ExclamationTriangleIcon className="h-12 w-12 text-yellow-600" />
          </div>
          
          {/* 404 Number */}
          <div className="mt-4">
            <span className="text-9xl font-bold text-gray-200">404</span>
          </div>
          
          {/* Title */}
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          
          {/* Description */}
          <p className="mt-2 text-sm text-gray-600">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate(-1)}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2 text-gray-400 group-hover:text-gray-500" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2 text-indigo-500 group-hover:text-indigo-400" />
            Go to Dashboard
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Links</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/users')}
              className="p-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              Users
            </button>
            <button
              onClick={() => navigate('/products')}
              className="p-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => navigate('/pos/sales')}
              className="p-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              POS System
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="p-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              Settings
            </button>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <MagnifyingGlassIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Can't find what you're looking for?
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Try using the search function or check the navigation menu 
                  to find the page you need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

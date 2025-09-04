import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldExclamationIcon, ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
            <ShieldExclamationIcon className="h-12 w-12 text-red-600" />
          </div>
          
          {/* Title */}
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Access Denied
          </h2>
          
          {/* Description */}
          <p className="mt-2 text-sm text-gray-600">
            Sorry, you don't have permission to access this page. 
            Please contact your administrator if you believe this is an error.
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

        {/* Additional Info */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <ShieldExclamationIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Need Access?
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  If you need access to this page, please contact your system administrator 
                  or request the appropriate permissions for your role.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

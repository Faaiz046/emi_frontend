import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectBreadcrumbs } from '../../store/slices/layoutSlice';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const Breadcrumbs = () => {
  const breadcrumbs = useAppSelector(selectBreadcrumbs);

  if (!breadcrumbs.isVisible || breadcrumbs.items.length === 0) {
    return null;
  }

  return (
    <nav className="px-6 py-3 bg-white border-b border-gray-200">
      <ol className="flex items-center space-x-2 text-sm text-gray-600">
        <li>
          <a href="/" className="flex items-center hover:text-gray-900">
            <HomeIcon className="w-4 h-4" />
          </a>
        </li>
        
        {breadcrumbs.items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-2" />
            {index === breadcrumbs.items.length - 1 ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <a href={item.path} className="hover:text-gray-900">
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs; 
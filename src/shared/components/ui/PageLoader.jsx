import React from 'react';
import { Spinner } from './Spinner';

const PageLoader = ({ message = 'Loading page...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 p-8">
      <Spinner size="lg" />
      <p className="mt-4 text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default PageLoader;

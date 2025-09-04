import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectFooter } from '../../store/slices/layoutSlice';

const Footer = () => {
  const footer = useAppSelector(selectFooter);

  if (!footer.isVisible) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {footer.content}
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <a href="/privacy" className="hover:text-gray-900">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-gray-900">
            Terms of Service
          </a>
          <a href="/support" className="hover:text-gray-900">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
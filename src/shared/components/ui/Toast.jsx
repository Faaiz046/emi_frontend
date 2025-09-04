import React, { useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../../lib/utils';
import { 
  CheckCircleIcon, 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const toastVariants = cva(
  "flex items-start w-full max-w-sm p-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out",
  {
    variants: {
      type: {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

const iconVariants = cva(
  "flex-shrink-0 w-5 h-5",
  {
    variants: {
      type: {
        success: "text-green-400",
        error: "text-red-400",
        warning: "text-yellow-400",
        info: "text-blue-400",
      },
    },
    defaultVariants: {
      type: "info",
    },
  }
);

const Toast = ({ 
  id, 
  type = 'info', 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={iconVariants({ type })} />;
      case 'error':
        return <XCircleIcon className={iconVariants({ type })} />;
      case 'warning':
        return <ExclamationCircleIcon className={iconVariants({ type })} />;
      case 'info':
      default:
        return <InformationCircleIcon className={iconVariants({ type })} />;
    }
  };

  return (
    <div className={toastVariants({ type })}>
      <div className="flex-shrink-0 mr-3 mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="text-sm font-medium mb-1">
            {title}
          </h4>
        )}
        {message && (
          <p className="text-sm">
            {message}
          </p>
        )}
      </div>
      
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast; 
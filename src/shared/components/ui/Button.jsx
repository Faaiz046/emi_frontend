import React from 'react';
import { cva } from 'class-variance-authority';
import { useDynamicColors } from '../../../hooks/useDynamicColors';
import { 
  ArrowRightIcon, 
  CheckIcon, 
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  CogIcon
} from '@heroicons/react/24/outline';

// Button variants configuration
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "text-white",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 hover:bg-gray-50 hover:text-gray-900",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "underline-offset-4 hover:underline text-blue-600",
        success: "bg-green-600 text-white hover:bg-green-700",
        warning: "bg-yellow-600 text-white hover:bg-yellow-700",
        info: "bg-blue-600 text-white hover:bg-blue-700",
        primary: "text-white",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        xl: "h-12 px-10 rounded-lg text-base",
        icon: "h-10 w-10",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      loading: {
        true: "opacity-75 cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
      loading: false,
    },
  }
);

// Icon mapping for common icons
const ICON_MAP = {
  arrow: ArrowRightIcon,
  check: CheckIcon,
  close: XMarkIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  search: MagnifyingGlassIcon,
  heart: HeartIcon,
  star: StarIcon,
  bell: BellIcon,
  settings: CogIcon,
};

// Loading spinner component
const LoadingSpinner = () => (
  <svg
    className="animate-spin -ml-1 mr-2 h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Helper function to get icon component
const getIconComponent = (icon) => {
  if (typeof icon === 'string') {
    return ICON_MAP[icon];
  }
  return icon;
};

// Helper function to get dynamic button classes
const getDynamicButtonClasses = (variant, size, fullWidth, loading, className, getColors) => {
  const effectiveVariant = variant || 'default';
  
  const baseClasses = buttonVariants({
    variant: effectiveVariant,
    size,
    fullWidth,
    loading,
    className,
  });
  
  // Apply dynamic colors for primary and default variants
  if (effectiveVariant === 'primary' || effectiveVariant === 'default') {
    const buttonColor = getColors.button();
    const cleanBaseClasses = baseClasses
      .replace(/bg-\w+-\d+/g, '')
      .replace(/hover:bg-\w+-\d+/g, '');
    return `${cleanBaseClasses} ${buttonColor}`;
  }
  
  return baseClasses;
};

const Button = React.forwardRef(({
  className,
  variant,
  size,
  fullWidth,
  loading = false,
  disabled,
  children,
  leftIcon,
  rightIcon,
  icon,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;
  const { getColors } = useDynamicColors();
  
  // Get icon components
  const LeftIconComponent = getIconComponent(leftIcon);
  const RightIconComponent = getIconComponent(rightIcon);
  const IconComponent = getIconComponent(icon);
  
  // Get button classes
  const buttonClasses = getDynamicButtonClasses(
    variant, size, fullWidth, loading, className, getColors
  );

  return (
    <button
      className={buttonClasses}
      ref={ref}
      disabled={isDisabled}
      {...props}
    >
      {loading && <LoadingSpinner />}
      
      {!loading && LeftIconComponent && (
        <LeftIconComponent className="mr-2 h-4 w-4" />
      )}
      
      {!loading && IconComponent && size === 'icon' ? (
        <IconComponent className="h-4 w-4" />
      ) : (
        children
      )}
      
      {!loading && RightIconComponent && (
        <RightIconComponent className="ml-2 h-4 w-4" />
      )}
    </button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants }; 
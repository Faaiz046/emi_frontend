import React from 'react';
import { cva } from 'class-variance-authority';
import {
  XMarkIcon,
  StarIcon,
  HeartIcon,
  BellIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        success: "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning: "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        error: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        purple: "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200",
        pink: "border-transparent bg-pink-100 text-pink-800 hover:bg-pink-200",
        gray: "border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
        xl: "px-4 py-1.5 text-base",
      },
      rounded: {
        default: "rounded-full",
        sm: "rounded-md",
        lg: "rounded-lg",
        none: "rounded-none",
      },
      interactive: {
        true: "cursor-pointer",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "default",
      interactive: false,
    },
  }
);

// Icon mapping for common badge icons
const iconMap = {
  star: StarIcon,
  heart: HeartIcon,
  bell: BellIcon,
  check: CheckIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
  arrow: ArrowRightIcon,
};

const Badge = React.forwardRef(({
  className,
  variant,
  size,
  rounded,
  interactive,
  children,
  leftIcon,
  rightIcon,
  removable,
  onRemove,
  ...props
}, ref) => {
  const handleRemove = (e) => {
    e.stopPropagation();
    onRemove?.(e);
  };

  // Handle icon props (string or component)
  const LeftIconComponent = typeof leftIcon === 'string' ? iconMap[leftIcon] : leftIcon;
  const RightIconComponent = typeof rightIcon === 'string' ? iconMap[rightIcon] : rightIcon;

  return (
    <div
      ref={ref}
      className={badgeVariants({
        variant,
        size,
        rounded,
        interactive,
        className,
      })}
      {...props}
    >
      {LeftIconComponent && (
        <LeftIconComponent className="mr-1 h-3 w-3" />
      )}
      {children}
      {RightIconComponent && !removable && (
        <RightIconComponent className="ml-1 h-3 w-3" />
      )}
      {removable && (
        <button
          type="button"
          onClick={handleRemove}
          className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full text-current hover:bg-current hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2"
        >
          <XMarkIcon className="h-3 w-3" />
        </button>
      )}
    </div>
  );
});

Badge.displayName = "Badge";

export { Badge, badgeVariants }; 
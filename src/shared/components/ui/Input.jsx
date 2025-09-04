import React from 'react';
import { cn } from '../../../lib/utils';
import { inputVariants, labelVariants } from './inputVariants';
import {
  MagnifyingGlassIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

// Icon mapping for common input icons
const iconMap = {
  search: MagnifyingGlassIcon,
  email: EnvelopeIcon,
  password: LockClosedIcon,
  user: UserIcon,
  phone: PhoneIcon,
  location: MapPinIcon,
  calendar: CalendarIcon,
  card: CreditCardIcon,
};

const Input = React.forwardRef(({
  className,
  variant,
  size,
  fullWidth,
  type = "text",
  leftIcon,
  rightIcon,
  error,
  success,
  warning,
  showPasswordToggle,
  label,
  required,
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  // Determine variant based on props
  let finalVariant = variant;
  if (error) finalVariant = "error";
  if (success) finalVariant = "success";
  if (warning) finalVariant = "warning";

  // Handle password toggle
  const inputType = type === "password" && showPassword ? "text" : type;
  
  // Handle icon props (string or component)
  const LeftIconComponent = typeof leftIcon === 'string' ? iconMap[leftIcon] : leftIcon;
  const RightIconComponent = typeof rightIcon === 'string' ? iconMap[rightIcon] : rightIcon;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className={labelVariants({ size, required })}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {LeftIconComponent && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <LeftIconComponent className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          type={inputType}
          className={inputVariants({
            variant: finalVariant,
            size,
            fullWidth,
            className: cn(
              className,
              LeftIconComponent && "pl-10",
              (RightIconComponent || (showPasswordToggle && type === "password")) && "pr-10"
            ),
          })}
          ref={ref}
          required={required}
          {...props}
        />
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-4 w-4" />
            ) : (
              <EyeIcon className="h-4 w-4" />
            )}
          </button>
        )}
        {RightIconComponent && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <RightIconComponent className="h-4 w-4" />
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {success && (
        <p className="mt-1 text-sm text-green-600">{success}</p>
      )}
      {warning && (
        <p className="mt-1 text-sm text-yellow-600">{warning}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input; 
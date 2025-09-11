import React from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "../../../lib/utils";
import {
  selectVariants,
  selectLabelVariants,
  selectIconVariants,
} from "./selectVariants";

const Select = React.forwardRef(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      error,
      success,
      warning,
      label,
      required,
      id,
      placeholder = "Select an option...",
      options = [],
      value,
      onChange,
      disabled,
      loading = false,
      emptyMessage = "No options available",
      searchable = false,
      multiple = false,
      clearable = false,
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    // Generate unique ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

    // Determine variant based on props
    let finalVariant = variant;
    if (error) finalVariant = "error";
    if (success) finalVariant = "success";
    if (warning) finalVariant = "warning";

    // Handle multiple selection
    const handleChange = (e) => {
      if (multiple) {
        const selectedOptions = Array.from(
          e.target.selectedOptions,
          (option) => option.value
        );
        onChange?.(selectedOptions, e);
      } else {
        onChange?.(e.target.value, e);
      }
    };

    // Get display value for single select
    const getDisplayValue = () => {
      if (multiple) return "";
      if (!value) return "";
      const option = options.find((opt) => opt.value === value);
      return option ? option.label : value;
    };

    // Check if value is selected for multiple select
    const isSelected = (optionValue) => {
      if (multiple) {
        return Array.isArray(value) && value.includes(optionValue);
      }
      return value === optionValue;
    };

    // Handle clear action
    const handleClear = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (multiple) {
        onChange?.([], e);
      } else {
        onChange?.("", e);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className={selectLabelVariants({ size, required })}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {typeof leftIcon === "string" ? (
                <span className="text-sm">{leftIcon}</span>
              ) : (
                React.cloneElement(leftIcon, { className: "h-4 w-4" })
              )}
            </div>
          )}

          <select
            id={selectId}
            className={selectVariants({
              variant: finalVariant,
              size,
              fullWidth,
              className: cn(
                className,
                leftIcon && "pl-10",
                (rightIcon || clearable) && "pr-10"
              ),
            })}
            ref={ref}
            required={required}
            disabled={disabled || loading}
            multiple={multiple}
            value={multiple ? undefined : value}
            onChange={handleChange}
            {...props}
          >
            {!multiple && (
              <option value="" disabled={required}>
                {placeholder}
              </option>
            )}

            {loading ? (
              <option value="" disabled>
                Loading...
              </option>
            ) : options.length === 0 ? (
              <option value="" disabled>
                {emptyMessage}
              </option>
            ) : (
              options.map((option, index) => {
                // Handle different option formats
                const optionValue =
                  typeof option === "string" ? option : option.value;
                const optionLabel =
                  typeof option === "string" ? option : option.label;
                const optionDisabled =
                  typeof option === "object" ? option.disabled : false;

                return (
                  <option
                    key={optionValue || index}
                    value={optionValue}
                    disabled={optionDisabled}
                    selected={isSelected(optionValue)}
                  >
                    {optionLabel}
                  </option>
                );
              })
            )}
          </select>

          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {clearable && value && !loading && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                tabIndex={-1}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            {rightIcon ? (
              <div
                className={selectIconVariants({ variant: finalVariant, size })}
              >
                {typeof rightIcon === "string" ? (
                  <span className="text-sm">{rightIcon}</span>
                ) : (
                  React.cloneElement(rightIcon, { className: "h-4 w-4" })
                )}
              </div>
            ) : (
              <ChevronDownIcon
                className={selectIconVariants({ variant: finalVariant, size })}
              />
            )}
          </div>
        </div>

        {/* Status messages */}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-1 text-sm text-green-600">{success}</p>}
        {warning && <p className="mt-1 text-sm text-yellow-600">{warning}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;

import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../../lib/utils";
import {
  customSelectVariants,
  customSelectTriggerVariants,
  customSelectContentVariants,
  customSelectViewportVariants,
  customSelectItemVariants,
  customSelectLabelVariants,
  customSelectSearchVariants,
  customSelectIconVariants,
} from "./customSelectVariants";
import "./CustomSelect.css";

const CustomSelect = React.forwardRef(
  (
    {
      variant = "default",
      size = "default",
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
      searchable = true,
      multiple = false,
      clearable = true,
      leftIcon,
      rightIcon,
      maxHeight = 300,
      searchPlaceholder = "Search...",
      noResultsMessage = "No results found",
      className: customClassName,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const triggerRef = useRef(null);
    const contentRef = useRef(null);
    const searchRef = useRef(null);
    const itemRefs = useRef([]);

    // Store latest values to avoid stale closures
    const latestValues = useRef({ value, multiple, onChange });
    latestValues.current = { value, multiple, onChange };

    // Generate unique ID if not provided
    const selectId =
      id || `custom-select-${Math.random().toString(36).substr(2, 9)}`;

    // Determine variant based on props
    let finalVariant = variant;
    if (error) finalVariant = "error";
    if (success) finalVariant = "success";
    if (warning) finalVariant = "warning";

    // Normalize options to consistent format
    const normalizedOptions = useMemo(() => {
      return options.map((option, index) => {
        if (typeof option === "string") {
          return { value: option, label: option, disabled: false, index };
        }
        return {
          value: option.value,
          label: option.label,
          disabled: option.disabled || false,
          index,
        };
      });
    }, [options]);

    // Filter options based on search term
    const filteredOptions = useMemo(() => {
      if (!searchable || !searchTerm) return normalizedOptions;

      const term = searchTerm.toLowerCase();
      return normalizedOptions.filter((option) =>
        option.label.toLowerCase().includes(term)
      );
    }, [normalizedOptions, searchTerm, searchable]);

    // Get display value
    const getDisplayValue = useCallback(() => {
      if (multiple) {
        if (!value || value.length === 0) return placeholder;
        if (value.length === 1) {
          const option = normalizedOptions.find(
            (opt) => opt.value === value[0]
          );
          return option ? option.label : value[0];
        }
        return `${value.length} selected`;
      }

      if (!value) return placeholder;
      const option = normalizedOptions.find((opt) => opt.value === value);
      return option ? option.label : value;
    }, [value, placeholder, normalizedOptions, multiple]);

    // Check if option is selected
    const isSelected = useCallback(
      (optionValue) => {
        if (multiple) {
          return Array.isArray(value) && value.includes(optionValue);
        }
        return value === optionValue;
      },
      [value, multiple]
    );

    // Handle option selection - using regular function to avoid useCallback issues
    const handleSelect = (option) => {
      const {
        value: currentValue,
        multiple: isMultiple,
        onChange: onChangeFn,
      } = latestValues.current;

      if (option.disabled) {
        return;
      }

      if (isMultiple) {
        const arrayValue = Array.isArray(currentValue) ? currentValue : [];
        const newValue = arrayValue.includes(option.value)
          ? arrayValue.filter((v) => v !== option.value)
          : [...arrayValue, option.value];
        onChangeFn?.(newValue);
      } else {
        onChangeFn?.(option.value);
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };

    // Handle clear action
    const handleClear = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { multiple: isMultiple, onChange: onChangeFn } =
        latestValues.current;

      if (isMultiple) {
        onChangeFn?.([]);
      } else {
        onChangeFn?.("");
      }
      setSearchTerm("");
    };

    // Handle keyboard navigation
    const handleKeyDown = useCallback(
      (e) => {
        if (!isOpen) {
          if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
            e.preventDefault();
            setIsOpen(true);
            if (searchable) {
              setTimeout(() => searchRef.current?.focus(), 0);
            }
          }
          return;
        }

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setFocusedIndex((prev) =>
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setFocusedIndex((prev) =>
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
            break;
          case "Enter":
            e.preventDefault();
            if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
              handleSelect(filteredOptions[focusedIndex]);
            }
            break;
          case "Escape":
            e.preventDefault();
            setIsOpen(false);
            setSearchTerm("");
            setFocusedIndex(-1);
            triggerRef.current?.focus();
            break;
          case "Tab":
            setIsOpen(false);
            setSearchTerm("");
            setFocusedIndex(-1);
            break;
        }
      },
      [isOpen, filteredOptions, focusedIndex, searchable]
    );

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        // Add a small delay to allow option clicks to process first
        setTimeout(() => {
          if (
            triggerRef.current &&
            !triggerRef.current.contains(event.target) &&
            contentRef.current &&
            !contentRef.current.contains(event.target)
          ) {
            setIsOpen(false);
            setSearchTerm("");
            setFocusedIndex(-1);
          }
        }, 10);
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    // Focus management
    useEffect(() => {
      if (isOpen && searchable) {
        searchRef.current?.focus();
      }
    }, [isOpen, searchable]);

    // Scroll focused item into view
    useEffect(() => {
      if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
        itemRefs.current[focusedIndex].scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }, [focusedIndex]);

    // Reset search when dropdown closes
    useEffect(() => {
      if (!isOpen) {
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    }, [isOpen]);

    return (
      <div className={cn(customSelectVariants({ size }), customClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className={customSelectLabelVariants({ size, required })}
          >
            {label}
          </label>
        )}

        <div className="custom-select-container relative w-full">
          {/* Trigger Button */}
          <button
            ref={(el) => {
              triggerRef.current = el;
              if (ref) {
                if (typeof ref === "function") {
                  ref(el);
                } else {
                  ref.current = el;
                }
              }
            }}
            type="button"
            id={selectId}
            className={cn(
              "custom-select-trigger",
              customSelectTriggerVariants({
                variant: finalVariant,
                size,
              })
            )}
            disabled={disabled || loading}
            onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-labelledby={label ? `${selectId}-label` : undefined}
            {...props}
          >
            <div className="flex items-center flex-1 min-w-0">
              {leftIcon && (
                <div className="mr-2 text-gray-400">
                  {typeof leftIcon === "string" ? (
                    <span className="text-sm">{leftIcon}</span>
                  ) : (
                    React.cloneElement(leftIcon, { className: "h-4 w-4" })
                  )}
                </div>
              )}

              <span
                className={cn(
                  "truncate",
                  !value || (multiple && value.length === 0)
                    ? "text-gray-400"
                    : ""
                )}
              >
                {getDisplayValue()}
              </span>
            </div>

            <div className="flex items-center space-x-1 ml-2">
              {clearable && value && !loading && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              )}

              {rightIcon ? (
                <div className="text-gray-400">
                  {typeof rightIcon === "string" ? (
                    <span className="text-sm">{rightIcon}</span>
                  ) : (
                    React.cloneElement(rightIcon, { className: "h-4 w-4" })
                  )}
                </div>
              ) : (
                <ChevronDownIcon
                  className={customSelectIconVariants({ open: isOpen })}
                />
              )}
            </div>
          </button>

          {/* Dropdown Content */}
          {isOpen && (
            <div
              ref={contentRef}
              className={cn(
                "custom-select-dropdown",
                customSelectContentVariants()
              )}
              style={{
                maxHeight: `${maxHeight}px`,
              }}
            >
              {/* Search Input */}
              {searchable && (
                <div className="p-2 border-b border-gray-200">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                        customSelectSearchVariants({ size })
                      )}
                      onKeyDown={handleKeyDown}
                    />
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className={customSelectViewportVariants({ size })}>
                {loading ? (
                  <div className="flex items-center justify-center py-4 text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Loading...
                  </div>
                ) : filteredOptions.length === 0 ? (
                  <div className="flex items-center justify-center py-4 text-gray-500">
                    {searchTerm ? noResultsMessage : emptyMessage}
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      ref={(el) => (itemRefs.current[index] = el)}
                      className={customSelectItemVariants({
                        selected: isSelected(option.value),
                      })}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(option);
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelect(option);
                      }}
                      onMouseEnter={() => setFocusedIndex(index)}
                      role="option"
                      aria-selected={isSelected(option.value)}
                      data-disabled={option.disabled}
                    >
                      <div className="flex items-center w-full">
                        {multiple && (
                          <input
                            type="checkbox"
                            checked={isSelected(option.value)}
                            onChange={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleSelect(option);
                            }}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            tabIndex={-1}
                          />
                        )}
                        <span
                          className={cn(
                            "flex-1 truncate",
                            option.disabled ? "text-gray-400" : ""
                          )}
                        >
                          {option.label}
                        </span>
                        {isSelected(option.value) && !multiple && (
                          <svg
                            className="h-4 w-4 text-blue-600 ml-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status messages */}
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-1 text-sm text-green-600">{success}</p>}
        {warning && <p className="mt-1 text-sm text-yellow-600">{warning}</p>}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export default CustomSelect;

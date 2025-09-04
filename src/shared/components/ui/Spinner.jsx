import React from "react";
import { cva } from "class-variance-authority";
import { useDynamicColors } from "../../../hooks/useDynamicColors";

const spinnerVariants = cva("animate-spin rounded-full", {
  variants: {
    size: {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
      "2xl": "w-16 h-16",
      "3xl": "w-20 h-20",
    },
    variant: {
      default: "border-b-2 border-blue-600",
      primary: "border-b-2 border-blue-600",
      secondary: "border-b-2 border-gray-600",
      success: "border-b-2 border-green-600",
      warning: "border-b-2 border-yellow-600",
      error: "border-b-2 border-red-600",
      info: "border-b-2 border-cyan-600",
      light: "border-b-2 border-white",
      dark: "border-b-2 border-gray-300",
      // Multi-color variants
      rainbow:
        "border-2 border-transparent bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 bg-clip-border",
      gradient:
        "border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-border",
      // Dotted variants
      dots: "border-2 border-dotted border-blue-600",
      dashed: "border-2 border-dashed border-blue-600",
    },
    speed: {
      slow: "animate-spin",
      normal: "animate-spin",
      fast: "animate-spin",
      pulse: "animate-pulse",
      bounce: "animate-bounce",
    },
    style: {
      solid: "",
      outline: "border-2 border-transparent border-t-current",
      ring: "ring-2 ring-blue-600 ring-offset-2",
      dots: "border-2 border-dotted border-blue-600",
    },
    layout: {
      inline: "flex items-center gap-2",
      centered: "flex flex-col items-center justify-center gap-2",
      fullscreen: "min-h-screen flex items-center justify-center",
      simple: "flex items-center justify-center py-8",
    },
  },
  defaultVariants: {
    size: "lg",
    variant: "default",
    speed: "normal",
    style: "solid",
    layout: "simple",
  },
});

const Spinner = React.forwardRef(
  (
    {
      className,
      size,
      variant = "default",
      speed,
      style,
      layout,
      text,
      textColor = "text-gray-600",
      textSize = "sm",
      containerClassName = "",
      showText = true,
      progress,
      showPercentage = false,
      count,
      delay = 100,
      ...props
    },
    ref
  ) => {
    const { accentText } = useDynamicColors();

    // Get spinner classes
    const getSpinnerClasses = () => {
      const baseClasses = spinnerVariants({
        size,
        variant,
        speed,
        style,
        layout,
        className,
      });
      const effectiveVariant = variant || "default";
      // Apply dynamic colors for primary and default variants automatically
      if (effectiveVariant === "primary" || effectiveVariant === "default") {
        const dynamicColor = accentText.replace("text-", "border-");
        // Remove any existing border color classes and apply dynamic color
        const cleanClasses = baseClasses.replace(/border-\w+-\d+/g, "");
        return `${cleanClasses} ${dynamicColor}`;
      }

      return baseClasses;
    };

    // Progress spinner
    if (progress !== undefined) {
      const percentage = Math.min(Math.max(progress, 0), 100);
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            <div
              className={getSpinnerClasses()}
              style={
                variant === "primary" || variant === "default"
                  ? { borderBottomColor: `var(--color-primary-600)` }
                  : {}
              }
            />
            {showPercentage && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">
                  {percentage}%
                </span>
              </div>
            )}
          </div>
          {text && (
            <span className="mt-2 text-sm text-gray-600 font-medium">
              {text}
            </span>
          )}
        </div>
      );
    }

    // Multi-spinner
    if (count && count > 1) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="flex space-x-1">
            {Array.from({ length: count }).map((_, index) => (
              <div
                key={index}
                className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"
                style={{
                  animationDelay: `${index * delay}ms`,
                  borderBottomColor:
                    variant === "primary" || variant === "default"
                      ? `var(--color-primary-600)`
                      : undefined,
                }}
              />
            ))}
          </div>
          {text && <span className="ml-3 text-gray-600">{text}</span>}
        </div>
      );
    }

    // Regular spinner - simplified approach
    const getAnimationClass = () => {
      switch (speed) {
        case "slow":
          return "animate-spin";
        case "fast":
          return "animate-spin";
        case "pulse":
          return "animate-pulse";
        case "bounce":
          return "animate-bounce";
        default:
          return "animate-spin";
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case "xs":
          return "w-3 h-3";
        case "sm":
          return "w-4 h-4";
        case "md":
          return "w-6 h-6";
        case "lg":
          return "w-8 h-8";
        case "xl":
          return "w-12 h-12";
        case "2xl":
          return "w-16 h-16";
        case "3xl":
          return "w-20 h-20";
        default:
          return "w-8 h-8";
      }
    };

    return (
      <div
        className="flex items-center justify-center py-8"
        ref={ref}
        {...props}
      >
        <div
          className={`${getAnimationClass()} ${getSizeClasses()} rounded-full border-b-2 border-blue-600`}
          style={
            variant === "primary" || variant === "default"
              ? { borderBottomColor: `var(--color-primary-600)` }
              : {}
          }
        />
        {text && showText && (
          <span className={`ml-3 ${textColor} text-${textSize} font-medium`}>
            {text}
          </span>
        )}
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
export { spinnerVariants };

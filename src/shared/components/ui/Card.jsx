import React from 'react';
import { cva, cn } from '../../../lib/utils';

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200",
        elevated: "bg-white border-gray-200 shadow-lg",
        outlined: "bg-transparent border-gray-300",
        ghost: "bg-transparent border-transparent",
        primary: "bg-blue-50 border-blue-200",
        secondary: "bg-gray-50 border-gray-200",
        success: "bg-green-50 border-green-200",
        warning: "bg-yellow-50 border-yellow-200",
        error: "bg-red-50 border-red-200",
      },
      size: {
        sm: "p-3",
        default: "p-6",
        lg: "p-8",
        xl: "p-10",
      },
      hover: {
        true: "transition-all duration-200 hover:shadow-md hover:-translate-y-1",
        false: "",
      },
      interactive: {
        true: "cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-1 active:translate-y-0",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: false,
      interactive: false,
    },
  }
);

const Card = React.forwardRef(({
  className,
  variant,
  size,
  hover,
  interactive,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cardVariants({
      variant,
      size,
      hover,
      interactive,
      className,
    })}
    {...props}
  >
    {children}
  </div>
));

const CardHeader = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  >
    {children}
  </div>
));

const CardTitle = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h3>
));

const CardDescription = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </p>
));

const CardContent = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

const CardFooter = React.forwardRef(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
}; 
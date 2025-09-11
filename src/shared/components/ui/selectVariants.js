import { cva } from "class-variance-authority";

export const selectVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
  {
    variants: {
      variant: {
        default: "border-[#a9a9a9] focus:border-blue-500 focus:ring-blue-500",
        error: "border-red-500 focus:border-red-500 focus:ring-red-500",
        success: "border-green-500 focus:border-green-500 focus:ring-green-500",
        warning:
          "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500",
        ghost: "border-transparent bg-transparent",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-9 px-2.5 text-sm",
        default: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
        xl: "h-14 px-6 text-lg",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: true,
    },
  }
);

export const selectLabelVariants = cva(
  "block text-sm font-medium text-gray-700 mb-1",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      required: false,
    },
  }
);

export const selectIconVariants = cva(
  "absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none",
  {
    variants: {
      variant: {
        default: "text-gray-400",
        error: "text-red-500",
        success: "text-green-500",
        warning: "text-yellow-500",
        ghost: "text-gray-300",
      },
      size: {
        sm: "h-3 w-3",
        md: "h-3.5 w-3.5",
        default: "h-4 w-4",
        lg: "h-5 w-5",
        xl: "h-6 w-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

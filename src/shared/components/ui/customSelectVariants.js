import { cva } from "class-variance-authority";

export const customSelectVariants = cva("relative w-full", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      default: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const customSelectTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-[#a9a9a9] hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500",
        error:
          "border-red-500 hover:border-red-600 focus:border-red-500 focus:ring-red-500",
        success:
          "border-green-500 hover:border-green-600 focus:border-green-500 focus:ring-green-500",
        warning:
          "border-yellow-500 hover:border-yellow-600 focus:border-yellow-500 focus:ring-yellow-500",
        ghost: "border-transparent bg-transparent hover:bg-gray-50",
      },
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-9 px-2.5 text-sm",
        default: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
        xl: "h-14 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export const customSelectContentVariants = cva(
  "absolute z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-white text-gray-900 shadow-lg animate-in fade-in-0 zoom-in-95 border-gray-200",
  {
    variants: {
      position: {
        popper:
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        item: "",
      },
    },
    defaultVariants: {
      position: "popper",
    },
  }
);

export const customSelectViewportVariants = cva("p-1", {
  variants: {
    size: {
      sm: "max-h-32",
      md: "max-h-48",
      default: "max-h-64",
      lg: "max-h-80",
      xl: "max-h-96",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export const customSelectItemVariants = cva(
  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-50 transition-colors",
  {
    variants: {
      selected: {
        true: "bg-blue-50 text-blue-900 font-medium",
        false: "",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);

export const customSelectLabelVariants = cva(
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

export const customSelectSearchVariants = cva(
  "w-full px-3 py-2 text-sm border-0 outline-none bg-transparent placeholder:text-gray-400 focus:outline-none",
  {
    variants: {
      size: {
        sm: "text-xs py-1",
        md: "text-sm py-1.5",
        default: "text-sm py-2",
        lg: "text-base py-2",
        xl: "text-lg py-3",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export const customSelectIconVariants = cva(
  "h-4 w-4 opacity-50 transition-transform duration-200",
  {
    variants: {
      open: {
        true: "rotate-180",
        false: "",
      },
    },
    defaultVariants: {
      open: false,
    },
  }
);

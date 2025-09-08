import React from "react";
import { cva, cn } from "../../../lib/utils";

const tableVariants = cva("w-full border-collapse table-auto", {
  variants: {
    variant: {
      default: "border border-gray-200",
      striped: "border border-gray-200",
      bordered: "border border-gray-200",
      simple: "",
    },
    size: {
      sm: "text-sm",
      default: "text-sm",
      lg: "text-base",
    },
    hover: {
      true: "",
      false: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    hover: false,
  },
});

const Table = React.forwardRef(
  ({ className, variant, size, hover, children, ...props }, ref) => (
    <div className="w- overflow-auto relative overflow-x-auto">
      <table
        ref={ref}
        className={tableVariants({
          variant,
          size,
          hover,
          className,
        })}
        {...props}
      >
        {children}
      </table>
    </div>
  )
);

const TableHeader = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <thead ref={ref} className={cn("bg-gray-50", className)} {...props}>
      {children}
    </thead>
  )
);

const TableBody = React.forwardRef(({ className, children, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-200 bg-white", className)}
    {...props}
  >
    {children}
  </tbody>
));

const TableFooter = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn("bg-gray-50 font-medium", className)}
      {...props}
    >
      {children}
    </tfoot>
  )
);

const TableRow = React.forwardRef(
  ({ className, children, variant, hover, ...props }, ref) => {
    const rowClasses = cn(
      "border-b border-gray-200 transition-colors",
      hover && "hover:bg-gray-50",
      variant === "striped" && "even:bg-gray-50",
      className
    );

    return (
      <tr ref={ref} className={rowClasses} {...props}>
        {children}
      </tr>
    );
  }
);

const TableHead = React.forwardRef(
  ({ className, children, align = "left", ...props }, ref) => {
    const alignClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    return (
      <th
        ref={ref}
        className={cn(
          "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </th>
    );
  }
);

const TableCell = React.forwardRef(
  ({ className, children, align = "left", ...props }, ref) => {
    const alignClasses = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };

    return (
      <td
        ref={ref}
        className={cn(
          "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
          alignClasses[align],
          className
        )}
        {...props}
      >
        {children}
      </td>
    );
  }
);

const TableCaption = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-gray-500", className)}
      {...props}
    >
      {children}
    </caption>
  )
);

Table.displayName = "Table";
TableHeader.displayName = "TableHeader";
TableBody.displayName = "TableBody";
TableFooter.displayName = "TableFooter";
TableRow.displayName = "TableRow";
TableHead.displayName = "TableHead";
TableCell.displayName = "TableCell";
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  tableVariants,
};

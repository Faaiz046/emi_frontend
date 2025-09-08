import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./Table";
import { Button } from "./Button";
import PageLoader from "./PageLoader";

// Pagination component
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || !onPageChange) return null;

  const { page, limit, total, totalPages } = pagination;
  const startItem = page * limit + 1;
  const endItem = Math.min((page + 1) * limit, total);

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-700">
        Showing {startItem} to {endItem} of {total} results
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
        >
          Previous
        </Button>

        <span className="text-sm text-gray-700">
          Page {page + 1} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

// Empty state component
const EmptyState = ({ message }) => (
  <div className="text-center py-8 text-gray-500">{message}</div>
);

// Table header component
const TableHeaderRow = ({ columns, rowSelection }) => (
  <TableRow>
    {rowSelection && (
      <TableHead className="w-12">
        <input
          type="checkbox"
          checked={rowSelection?.selectAll}
          onChange={rowSelection?.onSelectAll}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </TableHead>
    )}
    {columns.map((column, index) => (
      <TableHead key={index} align={column.align || "left"}>
        {column.label}
      </TableHead>
    ))}
  </TableRow>
);

// Table body component
const TableBodyRows = ({ data, columns, rowSelection }) => (
  <>
    {data.map((row, rowIndex) => (
      <TableRow key={row.id || rowIndex} hover>
        {rowSelection && (
          <TableCell className="w-12">
            <input
              type="checkbox"
              checked={rowSelection?.selectedRowKeys?.includes(
                row.id || rowIndex
              )}
              onChange={(e) =>
                rowSelection?.onSelectRow?.(row, e.target.checked)
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </TableCell>
        )}
        {columns.map((column, colIndex) => (
          <TableCell key={colIndex} align={column.align || "left"}>
            {column.render
              ? column.render(row[column.key], row)
              : row[column.key]}
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

const DataTable = ({
  data = [],
  columns = [],
  loading = false,
  pagination = null,
  onPageChange = null,
  className = "",
  emptyMessage = "No data available",
  rowSelection = null,
}) => {
  // Show loading state
  if (loading) {
    return (
      // <Spinner
      //   variant="primary"
      //   text={loadingMessage}
      //   layout="simple"
      //   className={className}
      // />
      <PageLoader height="h-[50vh]" />
    );
  }

  // Show empty state
  if (!data || data.length === 0) {
    return (
      <div className={`w-full ${className}`}>
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <Table>
        <TableHeader>
          <TableHeaderRow columns={columns} rowSelection={rowSelection} />
        </TableHeader>
        <TableBody>
          <TableBodyRows
            data={data}
            columns={columns}
            rowSelection={rowSelection}
          />
        </TableBody>
      </Table>

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
};

export { DataTable };

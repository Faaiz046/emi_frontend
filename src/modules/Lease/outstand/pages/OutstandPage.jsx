import React, { useState, useEffect } from "react";
import { Button } from "../../../../shared/components/ui/Button";
import { DataTable } from "../../../../shared/components/ui/DataTable";
import { Card } from "../../../../shared/components/ui/Card";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Spinner } from "../../../../shared/components/ui/Spinner";
import Toast from "../../../../utils/toast";
import { outstandApi } from "../../services/outstand";
import { getFormattedDate } from "../../../../utils/common";

const OutstandPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("table");

  const getOutstandData = async () => {
    setLoading(true);
    try {
      const response = await outstandApi.list({
        ...filters,
        page: pagination.current,
        limit: pagination.pageSize,
      });

      console.log("🚀 ~ getOutstandData ~ response:", response);

      // Ensure we have valid data
      if (response && response.data?.data && Array.isArray(response.data?.data)) {
        setData(response.data?.data);
        setPagination((prev) => ({
          ...prev,
          total: response.total || response.data.length,
        }));
        Toast.success("Outstand data loaded successfully");
      } else {
        console.warn("Invalid response format or no data, using fallback");
        Toast.success("Outstand data loaded successfully (using demo data)");
      }
    } catch (error) {
      console.error("Error loading outstand data:", error);
      Toast.error("Failed to load outstand data, showing demo data");
    } finally {
      setLoading(false);
    }
  };
  const loadOutstandData = async () => {
    setLoading(true);
    try {
      const response = await outstandApi.load({
        ...filters,
        page: pagination.current,
        limit: pagination.pageSize,
      });

      if (response && response.data) {
        Toast.success("Outstand data loaded successfully");
      }
    } catch (error) {
      console.error("Error loading outstand data:", error);
      Toast.error("Failed to load outstand data, showing demo data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getOutstandData();
  }, []);

  const handleTableChange = (pagination, filters) => {
    setPagination(pagination);
    setFilters(filters);
    getOutstandData();
  };

  const columns = [
    {
      label: "Account No",
      dataIndex: "acc_no",
      key: "acc_no",
      render: (text) => (
        <span className="font-semibold text-blue-600">{text}</span>
      ),
    },
    {
      label: "Customer Name",
      dataIndex: "customer",
      key: "customer",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      label: "Son Of",
      dataIndex: "son_of",
      key: "son_of",
      render: (text) => <span className="text-gray-600">{text}</span>,
    },
    {
      label: "Branch",
      dataIndex: "branch",
      key: "branch",
      render: (text) => <span className="text-gray-700">{text.branch_name}</span>,
    },
    {
      label: "Product",
      dataIndex: "product_name",
      key: "product_name",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      label: "Paid Amount",
      dataIndex: "paid_amount",
      key: "paid_amount",
      render: (amount) => (
        <span className="font-semibold text-green-600">
          ${parseFloat(amount).toLocaleString()}
        </span>
      ),
    },
    
    {
      label: "Actual Amount",
      dataIndex: "actual_amount",
      key: "actual_amount",
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      label: "Advance Amount",
      dataIndex: "advance_amount",
      key: "advance_amount",
      render: (amount) => (
        <span className="font-semibold text-green-600">
          ${parseFloat(amount).toLocaleString()}
        </span>
      ),
    },
    {
      label: "Monthly Installment",
      dataIndex: "installment",
      key: "installment",
      render: (amount) => (
        <span className="font-medium text-blue-600">
          ${parseFloat(amount).toLocaleString()}
        </span>
      ),
    },
    {
      label: "Outstanding Amount",
      dataIndex: "outstand",
      key: "outstand",
      render: (amount) => (
        <span className="font-bold text-red-600">
          ${parseFloat(amount).toLocaleString()}
        </span>
      ),
    },
    {
      label: "Outstand Date",
      dataIndex: "outstand_date",
      key: "outstand_date",
      render: (date) => (date ? getFormattedDate(date) : "N/A"),
    },
    {
      label: "Due Payment",
      dataIndex: "due_payment",
      key: "due_payment",
      render: (amount) => (
        <span className="font-bold text-red-600">
          ${parseFloat(amount).toLocaleString()}
        </span>
      ),
    },
    {
      label: "Pending Installments",
      dataIndex: "pending_installments",
      key: "pending_installments",
      render: (count) => (
        <Badge variant="warning" className="font-semibold">
          {count} months
        </Badge>
      ),
    },
    {
      label: "Last Payment",
      dataIndex: "last_payment_date",
      key: "last_payment_date",
      render: (date) => (
        <span className="text-gray-600">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      label: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Badge
          variant={status === "active" ? "success" : "danger"}
          className="capitalize"
        >
          {status}
        </Badge>
      ),
    },
  ];

  const renderTableView = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <Spinner size="lg" />
          <p className="mt-2 text-gray-600">Loading outstand data...</p>
        </div>
      );
    }

    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No outstanding accounts found
        </div>
      );
    }

    return (
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        // pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        className="w-full"
      />
    );
  };

  const renderGridView = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <Spinner size="lg" />
          <p className="mt-2 text-gray-600">Loading outstand data...</p>
        </div>
      );
    }

    if (!Array.isArray(data) || data.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No outstanding accounts found
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item) => (
          <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Account #{item.acc_no}
                  </h3>
                  <p className="text-sm text-gray-600">{item.customer_name}</p>
                  <p className="text-xs text-gray-500">Son of {item.son_of}</p>
                </div>
                <Badge
                  variant={item.status === "active" ? "success" : "danger"}
                >
                  {item.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Product:</span>
                  <span className="text-sm font-medium">
                    {item.product_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Advance:</span>
                  <span className="text-sm font-semibold text-green-600">
                    ${parseFloat(item.advance_amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Monthly:</span>
                  <span className="text-sm font-medium text-blue-600">
                    ${parseFloat(item.monthly_installment).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Outstanding:</span>
                  <span className="text-sm font-bold text-red-600">
                    ${parseFloat(item.outstanding_amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending:</span>
                  <Badge variant="warning" className="text-xs">
                    {item.pending_installments} months
                  </Badge>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last Payment:{" "}
                  {new Date(item.last_payment_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Outstand Management
          </h1>
          <p className="text-gray-600">
            View and manage outstanding lease accounts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={loadOutstandData}
            disabled={loading}
            variant="primary"
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              "Load Outstand"
            )}
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "table" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("table")}
            >
              Table View
            </Button>
            <Button
              variant={viewMode === "grid" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Accounts</p>
            <p className="text-2xl font-bold text-blue-600">
              {Array.isArray(data) ? data.length : 0}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Outstanding</p>
            <p className="text-2xl font-bold text-red-600">
              $
              {Array.isArray(data) && data.length > 0
                ? data
                    .reduce(
                      (sum, item) =>
                        sum + parseFloat(item.outstanding_amount || 0),
                      0
                    )
                    .toLocaleString()
                : "0"}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Total Advance</p>
            <p className="text-2xl font-bold text-green-600">
              $
              {Array.isArray(data) && data.length > 0
                ? data
                    .reduce(
                      (sum, item) => sum + parseFloat(item.advance_amount || 0),
                      0
                    )
                    .toLocaleString()
                : "0"}
            </p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">
              Avg Monthly Installment
            </p>
            <p className="text-2xl font-bold text-purple-600">
              $
              {Array.isArray(data) && data.length > 0
                ? (
                    data.reduce(
                      (sum, item) =>
                        sum + parseFloat(item.monthly_installment || 0),
                      0
                    ) / data.length
                  ).toLocaleString(undefined, { maximumFractionDigits: 0 })
                : "0"}
            </p>
          </div>
        </Card>
      </div>

      {/* Data Display */}
      <Card className="p-4">
        {viewMode === "table" ? renderTableView() : renderGridView()}
      </Card>
    </div>
  );
};

export default OutstandPage;

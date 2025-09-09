import React, { useState, useEffect } from "react";
import { Button } from "../../../../shared/components/ui/Button";
import { DataTable } from "../../../../shared/components/ui/DataTable";
import { Card } from "../../../../shared/components/ui/Card";
import { Badge } from "../../../../shared/components/ui/Badge";
import { Spinner } from "../../../../shared/components/ui/Spinner";
import Select from "../../../../shared/components/ui/Select";
import Toast from "../../../../utils/toast";
import { outstandApi } from "../../services/outstand";
import { userApi } from "../../../../services/user/api";
import { getFormattedDate } from "../../../../utils/common";
import {
  UsersIcon,
  BanknotesIcon,
  ArrowUpCircleIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

import PageLoader from "../../../../shared/components/ui/PageLoader";
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
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const getUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await userApi.getAll({ limit: 1000 });
      if (response && response.data && Array.isArray(response.data)) {
        const userOptions = response.data.map((user) => ({
          value: user.id,
          label: `${user.name} (${user.email})`,
        }));
        setUsers(userOptions);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      Toast.error("Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  const getOutstandData = async () => {
    setLoading(true);
    try {
      const response = await outstandApi.list({
        ...filters,
        page: pagination.current,
        limit: pagination.pageSize,
      });

      // Ensure we have valid data
      if (
        response &&
        response.data?.data &&
        Array.isArray(response.data?.data)
      ) {
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
  const clearOutstandData = async () => {
    setLoading(true);
    try {
      const response = await outstandApi.clear({ days: 0 });

      if (response && response.data) {
        Toast.success("Outstand data cleared successfully");
      }
    } catch (error) {
      console.error("Error clear outstand data:", error);
      Toast.error("Failed to clear outstand data, showing demo data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getOutstandData();
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTableChange = (pagination, filters) => {
    setPagination(pagination);
    setFilters(filters);
    getOutstandData();
  };

  const handleRowSelect = (row, checked) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, row.id || row]);
    } else {
      setSelectedRows((prev) => prev.filter((id) => id !== (row.id || row)));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allRowIds = data.map((row) => row.id || row);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
  };
  const assignRecoverOfficer = async () => {
    try {
      setLoading(true);
      const res = await outstandApi.assign_recovery_officer({
        payment_ids: selectedRows,
        recovery_officer_id: selectedUser,
      });

      const responseData = res?.data || res;

      if (responseData && responseData.updated_count > 0) {
        // Update the data state with the new recovery officer information
        setData((prevData) =>
          prevData.map((item) => {
            // Check if this item's ID is in the assigned payment_ids
            if (responseData.payment_ids.includes(item.id)) {
              return {
                ...item,
                recovery_officer_id: responseData.recovery_officer,
              };
            }
            return item;
          })
        );

        // Clear selections after successful assignment
        setSelectedRows([]);
        setSelectedUser("");

        Toast.success(
          `Successfully assigned ${responseData.updated_count} account(s) to ${responseData.recovery_officer.name}`
        );
      } else {
        Toast.warning("No accounts were updated");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to assign recovery officer";
      Toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const columns = [
    {
      label: "Outstand Date",
      dataIndex: "outstand_date",
      key: "outstand_date",
      render: (text) => (
        <span className=" text-gray-700">{getFormattedDate(text)}</span>
      ),
    },
    {
      label: "Recovery Officer",
      dataIndex: "recovery_officer_id",
      key: "recovery_officer_id",
      render: (text) => <span className="text-gray-700">{text?.name}</span>,
    },
    {
      label: "Account No",
      dataIndex: "acc_no",
      key: "acc_no",
      render: (text) => <span className=" text-gray-700">{text}</span>,
    },
    {
      label: "Customer Name",
      dataIndex: "customer",
      key: "customer",
      render: (text) => <span className=" text-gray-700">{text}</span>,
    },

    // {
    //   label: "Branch",
    //   dataIndex: "branch_name",
    //   key: "branch_name",
    //   render: (text) => <span className="text-gray-700">{text}</span>,
    // },
    // {
    //   label: "Product",
    //   dataIndex: "product_name",
    //   key: "product_name",
    //   render: (text) => <span className="text-gray-700">{text}</span>,
    // },
    // {
    //   label: "Paid Amount",
    //   dataIndex: "paid_amount",
    //   key: "paid_amount",
    //   render: (amount) => (
    //     <span className="font-semibold text-green-600">
    //       ${parseFloat(amount).toLocaleString()}
    //     </span>
    //   ),
    // },

    // {
    //   label: "Actual Amount",
    //   dataIndex: "actual_amount",
    //   key: "actual_amount",
    //   render: (text) => <span className="text-gray-700">{text}</span>,
    // },
    // {
    //   label: "Advance Amount",
    //   dataIndex: "advance_amount",
    //   key: "advance_amount",
    //   render: (amount) => (
    //     <span className="font-semibold text-green-600">
    //       ${parseFloat(amount).toLocaleString()}
    //     </span>
    //   ),
    // },
    {
      label: "Installment",
      dataIndex: "installment",
      key: "installment",
      render: (amount) => <span className=" text-gray-700">{amount}</span>,
    },
    {
      label: "Outstanding Amount",
      dataIndex: "due_payment",
      key: "due_payment",
      render: (amount) => (
        <span
          className="
       text-gray-700"
        >
          {amount}
        </span>
      ),
    },
    // {
    //   label: "Outstand Date",
    //   dataIndex: "outstand_date",
    //   key: "outstand_date",
    //   render: (date) => (date ? getFormattedDate(date) : "N/A"),
    // },
    // {
    //   label: "Due Payment",
    //   dataIndex: "due_payment",
    //   key: "due_payment",
    //   render: (amount) => (
    //     <span className="font-bold text-red-600">
    //       ${parseFloat(amount).toLocaleString()}
    //     </span>
    //   ),
    // },
    // {
    //   label: "Pending Installments",
    //   dataIndex: "pending_installments",
    //   key: "pending_installments",
    //   render: (count) => (
    //     <Badge variant="warning" className="font-semibold">
    //       {count} months
    //     </Badge>
    //   ),
    // },
    // {
    //   label: "Last Payment",
    //   dataIndex: "last_payment_date",
    //   key: "last_payment_date",
    //   render: (date) => (
    //     <span className="text-gray-600">
    //       {new Date(date).toLocaleDateString()}
    //     </span>
    //   ),
    // },
    // {
    //   label: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status) => (
    //     <Badge
    //       variant={status === "active" ? "success" : "danger"}
    //       className="capitalize"
    //     >
    //       {status}
    //     </Badge>
    //   ),
    // },
    {
      label: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (amount) => (
        <span className=" text-gray-700">{amount}</span>
      ),
    },
    {
      label: "Fine",
      dataIndex: "fine",
      key: "fine",
      render: (amount) => (
        <span className=" text-gray-700">{amount}</span>
      ),
    },
  ];

  const renderTableView = () => {
    if (loading) {
      return (
        // <div className="text-center py-8">
        //   <Spinner size="lg" />
        //   <p className="mt-2 text-gray-600">Loading outstand data...</p>
        // </div>
        <PageLoader height="h-screen" />
      );
    }

    // if (!Array.isArray(data) || data.length === 0) {
    //   return (
    //     <div className="text-center py-8 text-gray-500">
    //       No outstanding accounts found
    //     </div>
    //   );
    // }

    return (
      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        // pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        // className="w-full"
        rowSelection={{
          selectedRowKeys: selectedRows,
          onSelectRow: handleRowSelect,
          selectAll: selectedRows.length === data.length && data.length > 0,
          onSelectAll: handleSelectAll,
        }}
      />
    );
  };

  const renderGridView = () => {
    if (loading) {
      return <PageLoader height="h-screen" />;
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
          <Button
            onClick={clearOutstandData}
            disabled={loading}
            variant="destructive"
            className="min-w-[120px]"
          >
            {loading ? (
              <>
                <Spinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              "Clear"
            )}
          </Button>
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
              "Assign"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Accounts</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(data) ? data.length : 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
              <BanknotesIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {Array.isArray(data) && data.length > 0
                  ? data
                      .reduce(
                        (sum, item) => sum + parseFloat(item.outstand || 0),
                        0
                      )
                      .toLocaleString()
                  : "0"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
              <ArrowUpCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Advance</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {Array.isArray(data) && data.length > 0
                  ? data
                      .reduce(
                        (sum, item) =>
                          sum + parseFloat(item.advance_amount || 0),
                        0
                      )
                      .toLocaleString()
                  : "0"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Monthly Installment</p>
              <p className="text-2xl font-bold text-gray-900">
                $
                {Array.isArray(data) && data.length > 0
                  ? data
                      .reduce(
                        (sum, item) => sum + parseFloat(item.installment || 0),
                        0
                      )
                      .toLocaleString(undefined, { maximumFractionDigits: 0 })
                  : "0"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <Select
              label="Select User"
              placeholder="Choose a user to assign..."
              options={users}
              value={selectedUser}
              onChange={handleUserSelect}
              loading={usersLoading}
              className="max-w-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Selected: {selectedRows.length} rows
            </span>
            {selectedUser && selectedRows.length > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={assignRecoverOfficer}
              >
                Assign Selected
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Data Display */}
      <Card className="p-4">
        {viewMode === "table" ? renderTableView() : renderGridView()}
      </Card>
    </div>
  );
};

export default OutstandPage;

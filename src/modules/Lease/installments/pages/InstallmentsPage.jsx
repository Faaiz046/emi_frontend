import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../../../shared/components/ui/Card";
import { Button } from "../../../../shared/components/ui/Button";
import { DataTable } from "../../../../shared/components/ui/DataTable";
import { InstallmentList, InstallmentForm } from "../components";
import { installmentApi } from "../services/installment";
import { leaseAccountApi } from "../../services";
import toast from "../../../../utils/toast";
import {
  getFormattedDate,
  formatCurrency,
  getDate,
} from "../../../../utils/common";
import { RiLoader3Fill } from "react-icons/ri";
import DateSelect from "../../../../shared/components/ui/DateSelect";
const InstallmentsPage = () => {
  const { account_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  console.log("🚀 ~ InstallmentsPage ~ data:", data);
  const currentDate = new Date();

  // Helper function to format date as YYYY-MM-DD
  const formatDateForStorage = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const initialFilters = {
    // start_date:
    //   new Date(
    //     currentDate.getFullYear(),
    //     currentDate.getMonth(),
    //     currentDate.getDate(),
    //     0,
    //     0,
    //     0,
    //     0
    //   )
    //     .toISOString()
    //     .slice(0, 23) + "Z",
    // end_date: new Date().toISOString().slice(0, 23) + "Z",
    start_date: formatDateForStorage(currentDate),
    end_date: formatDateForStorage(currentDate),
  };
  const [filtersDate, setFiltersDate] = useState(initialFilters);
  const [viewMode, setViewMode] = useState("grid"); // 'table' or 'grid'
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [account, setAccount] = useState(null);
  const [showInstallmentForm, setShowInstallmentForm] = useState(false);

  // If account_id is provided, load account details
  useEffect(() => {
    if (account_id) {
      loadAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account_id]);

  // Load all installments
  useEffect(() => {
    if (!account_id) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersDate]);

  const loadAccount = async () => {
    try {
      setLoading(true);
      const res = await leaseAccountApi.getLeaseAccountById({ id: account_id });
      const accountData = res?.data || res;
      setAccount(accountData);
    } catch (error) {
      toast.error(error?.message || "Failed to load account details");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Convert YYYY-MM-DD strings to ISO timestamps without timezone issues
      const convertToISO = (dateString) => {
        if (!dateString) return "";
        const [year, month, day] = dateString.split("-").map(Number);
        const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
        return {
          start: startOfDay.toISOString(),
          end: endOfDay.toISOString(),
        };
      };

      const startDateISO = convertToISO(filtersDate.start_date);
      const endDateISO = convertToISO(filtersDate.end_date);

      const res = await installmentApi.installmentList({
        start_date: startDateISO.start,
        end_date: endDateISO.end,
      });
      const rows = res?.records || [];
      setData(rows);
    } catch (error) {
      console.log("🚀 ~ fetchData ~ error:", error);
      toast.error(error?.message || "Failed to fetch installments");
    } finally {
      setLoading(false);
    }
  };

  const handleInstallmentSuccess = () => {
    // Refresh the data after successful installment creation/update
    if (account_id) {
      // If viewing account-specific installments, refresh that list
    } else {
      fetchData();
    }
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "account_id", label: "Account ID" },
    {
      key: "install_date",
      label: "Install Date",
      render: (v) => getFormattedDate(v),
    },
    {
      key: "pre_balance",
      label: "Previous Balance",
      render: (v) => formatCurrency(v),
    },
    {
      key: "install_charge",
      label: "Charge",
      render: (v) => formatCurrency(v),
    },
    { key: "fine", label: "Fine", render: (v) => formatCurrency(v) },
    { key: "discount", label: "Discount", render: (v) => formatCurrency(v) },
    { key: "balance", label: "Balance", render: (v) => formatCurrency(v) },
    { key: "payment_method", label: "Payment Method" },
  ];

  const columns2 = [
    {
      key: "install_date",
      label: "Install Date",
      render: (v) => getFormattedDate(v),
    },
    {
      key: "recv_no",
      label: "Recv No",
      render: (v) => v,
    },
    {
      key: "pre_balance",
      label: "Pre Balance",
      render: (v) => formatCurrency(v),
    },
    {
      key: "install_charge",
      label: "Install Charge",
      render: (v) => formatCurrency(v),
    },
    { key: "balance", label: "Balance", render: (v) => formatCurrency(v) },
    { key: "recovery", label: "Recovery", render: (v) => formatCurrency(v) },
    { key: "fine", label: "Fine", render: (v) => formatCurrency(v) },
    { key: "fine_type", label: "Fine Type" },
  ];

  const DetailItem = ({ label, value, className }) => (
    <div className={`p-4 space-x-3 bg-white   flex-1 ${className}`}>
      <span className="text-sm font-bold text-gray-900 tracking-wide uppercase">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-700 mt-1">
        {value ?? "N/A"}
      </span>
    </div>
  );

  const renderTableView = () => (
    <Card>
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        pagination={false}
        onRowClick={(installment) => setSelectedInstallment(installment)}
      />
    </Card>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Grid - Installments List */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Installments List
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {data.length} installments
            </p>
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full overflow-hidden">
                <RiLoader3Fill className="animate-spin w-10 h-10 text-blue-600" />
              </div>
            ) : data.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No installments found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {data.map((installment) => (
                  <div
                    key={installment.id}
                    className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedInstallment?.id === installment.id
                        ? "bg-blue-50 border-r-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedInstallment(installment)}
                  >
                    <div className="font-medium text-gray-900">
                      #{installment.id}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      Account: {installment?.advance?.acc_no || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {installment?.advance?.process?.customer_name} •{" "}
                      {installment.payment_method || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Right Side - Installment Details */}
      <div className="lg:col-span-3">
        <div>
          {selectedInstallment ? (
            <Card>
              {/* Header */}
              <div className="bg-white p-1 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      Installment #
                      {selectedInstallment.recv_no || selectedInstallment.id}
                    </h2>
                    <div className="flex items-center gap-4 text-base text-gray-600 mb-2 ">
                      <span className="font-bold">
                        {selectedInstallment?.advance?.process?.customer_name ||
                          "N/A"}
                      </span>
                      <span className="space-x-1">
                        <span className="font-bold">Account:</span>
                        <span>
                          {selectedInstallment?.advance?.acc_no || "N/A"}
                        </span>
                      </span>
                      <span className="space-x-1">
                        <span className="font-bold">Date:</span>
                        <span>
                          {" "}
                          {getDate(selectedInstallment.install_date)}
                        </span>
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedInstallment.outstanding > 0
                            ? "bg-red-100 text-red-700  text"
                            : "bg-green-100 text-green-700 "
                        }`}
                      >
                        {selectedInstallment.outstanding > 0
                          ? "Outstanding"
                          : "Paid"}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-900">
                        {selectedInstallment.payment_method || "N/A"}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      navigate(
                        `/lease/accounts/${selectedInstallment.account_id}/installments`
                      )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    View Account
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4">
                <DetailItem
                  label="Model"
                  value={selectedInstallment.advance?.process?.product?.name}
                />
                <DetailItem
                  label="Brand"
                  value={
                    selectedInstallment.advance?.process?.product?.brand?.name
                  }
                />
                <DetailItem
                  label="Product"
                  value={
                    selectedInstallment.advance?.process?.product?.category
                      ?.name
                  }
                />
                <DetailItem
                  label="Officer"
                  value={selectedInstallment.officer?.name ?? "Not Assigned"}
                />

                <DetailItem
                  label="Pre Balance"
                  value={selectedInstallment.pre_balance}
                  className="font-bold "
                />
                <DetailItem
                  label="Install Charge"
                  value={selectedInstallment.install_charge}
                  className="font-bold"
                />
                <DetailItem label="Fine" value={selectedInstallment.fine} />
                <DetailItem
                  label="Fine Type"
                  value={selectedInstallment.fine_type}
                />
                <DetailItem
                  label="Discount"
                  value={selectedInstallment.discount}
                />
                <DetailItem
                  label="Balance"
                  value={formatCurrency(selectedInstallment.balance || 0)}
                  className="font-bold"
                />

                <DetailItem
                  label="Account No"
                  value={selectedInstallment.advance?.acc_no}
                  className="font-bold"
                />
                <DetailItem
                  label="Account Date"
                  value={getDate(selectedInstallment.advance?.account_date)}
                />
                <DetailItem
                  label="Process Type"
                  value={selectedInstallment.advance?.process_type}
                />
                <DetailItem
                  label="Total Received"
                  value={selectedInstallment.advance?.total_received}
                  className="font-bold"
                />
                <DetailItem
                  label="Pending Advance"
                  value={selectedInstallment.advance?.pending_advance}
                  className="font-bold"
                />
                <DetailItem
                  label="Remaining Balance"
                  value={selectedInstallment.advance?.remaining_balance}
                  className="font-bold"
                />
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Select an Installment
                </h3>
                <p className="text-gray-600">
                  Choose an installment from the list to view its details
                </p>
              </div>
            </Card>
          )}
        </div>
       <div className="mt-3">
       <DataTable
          data={data}
          columns={columns2}
          loading={loading}
          pagination={false}
          onRowClick={(installment) => setSelectedInstallment(installment)}
        />
       </div>
      </div>
    </div>
  );

  // If account_id is provided, show account-specific installments
  if (account_id) {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading account details...</div>
        </div>
      );
    }

    if (!account) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Account not found</div>
        </div>
      );
    }

    const accountBalance = parseFloat(
      account.leaseAdvance?.remaining_balance || 0
    );

    return (
      <div className="container mx-auto px-4 py-6">
        {/* Account Header */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Account #{account.acc_no}
              </h2>
              <p className="text-gray-600">{account.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Product</p>
              <p className="font-medium">{account.product?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Remaining Balance</p>
              <p className="text-xl font-bold text-red-600">
                ${accountBalance.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Installments List */}
        <InstallmentList
          accountId={account_id}
          accountBalance={accountBalance}
        />
      </div>
    );
  }

  // Show general installments page with grid view
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Installments Management</h2>
        <div className="flex items-center gap-3">
          {/* Add Installment Button */}
          <Button
            onClick={() => setShowInstallmentForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Installment
          </Button>

          {/* View Toggle Buttons */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`w-44 h-10 flex items-center justify-center text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M3 14h18M3 18h18M3 6h18"
                />
              </svg>
              Table View
            </button>

            <button
              onClick={() => setViewMode("grid")}
              className={`w-44 h-10 flex items-center justify-center text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              Grid View
            </button>
          </div>
          <div className="relative">
            <DateSelect
              value={filtersDate.start_date}
              onChange={(e) => {
                const selectedDate = e.target.value;
                if (selectedDate) {
                  // Store the date in YYYY-MM-DD format to avoid timezone issues
                  setFiltersDate({
                    start_date: selectedDate,
                    end_date: selectedDate,
                  });
                } else {
                  setFiltersDate({
                    start_date: "",
                    end_date: "",
                  });
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Render the appropriate view */}
      {viewMode === "table" ? renderTableView() : renderGridView()}

      {/* Installment Form Modal */}
      <InstallmentForm
        isOpen={showInstallmentForm}
        onClose={() => setShowInstallmentForm(false)}
        onSuccess={handleInstallmentSuccess}
        preBalance={0}
      />
    </div>
  );
};

export default InstallmentsPage;

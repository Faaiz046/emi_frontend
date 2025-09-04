import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../../../shared/components/ui/Card";
import { Button } from "../../../../shared/components/ui/Button";
import { DataTable } from "../../../../shared/components/ui/DataTable";
import { InstallmentList, InstallmentForm } from "../components";
import { installmentApi } from "../services/installment";
import { leaseAccountApi } from "../../services";
import toast from "../../../../utils/toast";
import { getFormattedDate, formatCurrency } from "../../../../utils/common";

const InstallmentsPage = () => {
  const { account_id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    payment_method: "",
  });
  const [viewMode, setViewMode] = useState("grid"); // 'table' or 'grid'
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [account, setAccount] = useState(null);
  const [showInstallmentForm, setShowInstallmentForm] = useState(false);

  // If account_id is provided, load account details
  useEffect(() => {
    if (account_id) {
      loadAccount();
    }
  }, [account_id]);

  // Load all installments
  useEffect(() => {
    if (!account_id) {
      fetchData();
    }
  }, [
    pagination.page,
    pagination.limit,
    filters.search,
    filters.status,
    filters.payment_method,
  ]);

  const loadAccount = async () => {
    try {
      setLoading(true);
      const res = await leaseAccountApi.getById({ id: account_id });
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
      const res = await installmentApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        status: filters.status,
        payment_method: filters.payment_method,
      });

      const rows = res?.data || res?.rows || res?.list || [];
      const pg = res?.pagination || {
        page: res?.page ?? pagination.page,
        limit: res?.limit ?? pagination.limit,
        total: res?.total ?? rows.length,
        totalPages:
          res?.totalPages ??
          Math.max(
            1,
            Math.ceil(
              (res?.total ?? rows.length) / (res?.limit ?? pagination.limit)
            )
          ),
      };
      setData(rows);
      setPagination(pg);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch installments");
    } finally {
      setLoading(false);
    }
  };

  const handleInstallmentSuccess = () => {
    // Refresh the data after successful installment creation/update
    if (account_id) {
      // If viewing account-specific installments, refresh that list
      // The InstallmentList component will handle its own refresh
    } else {
      // If viewing all installments, refresh the main list
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
    {
      key: "outstanding",
      label: "Outstanding",
      render: (v) => formatCurrency(v),
    },
    { key: "payment_method", label: "Payment Method" },
    { key: "sms_sent", label: "SMS Sent", render: (v) => (v ? "Yes" : "No") },
  ];

  const renderTableView = () => (
    <Card>
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        onLimitChange={(limit) =>
          setPagination((prev) => ({ ...prev, limit, page: 0 }))
        }
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
              <div className="p-4 text-center text-gray-500">
                Loading installments...
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
                      Account: {installment.account_id || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {getFormattedDate(installment.install_date)} •{" "}
                      {installment.payment_method || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatCurrency(installment.outstanding || 0)} outstanding
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
        {selectedInstallment ? (
          <Card className="overflow-hidden">
            {/* Header with enhanced gradient background */}
            <div className="bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 p-4 text-white relative overflow-hidden shadow-2xl">
              {/* Enhanced decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 rounded-full -translate-y-12 translate-x-12 blur-sm"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-white/15 to-white/5 rounded-full translate-y-8 -translate-x-8 blur-sm"></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/10 rounded-full blur-md animate-pulse"></div>

              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 opacity-30">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px)`,
                    backgroundSize: "60px 60px",
                  }}
                ></div>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Main header content */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-white/25 to-white/15 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg">
                        <svg
                          className="w-6 h-6 text-white"
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
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-3xl font-black bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent">
                            #{selectedInstallment.id}
                          </h2>
                          <div className="px-2 py-0.5 bg-green-500/20 border border-green-400/30 rounded-full">
                            <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">
                              {selectedInstallment.outstanding > 0
                                ? "Outstanding"
                                : "Paid"}
                            </span>
                          </div>
                        </div>
                        <p className="text-green-100 text-base font-medium">
                          Account: {selectedInstallment.account_id || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced badges */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-white/25 to-white/15 rounded-lg border border-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <span className="text-white text-xs font-semibold">
                          {selectedInstallment.payment_method || "N/A"}
                        </span>
                      </div>
                      <div className="px-3 py-1.5 bg-gradient-to-r from-white/20 to-white/10 rounded-lg border border-white/15 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <span className="text-white text-xs font-semibold">
                          {getFormattedDate(selectedInstallment.install_date)}
                        </span>
                      </div>
                      <div className="px-3 py-1.5 bg-gradient-to-r from-white/15 to-white/5 rounded-lg border border-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <span className="text-white text-xs font-semibold">
                          {selectedInstallment.sms_sent ? "SMS Sent" : "No SMS"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          navigate(
                            `/lease/accounts/${selectedInstallment.account_id}/installments`
                          )
                        }
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 !text-white hover:from-indigo-600 hover:to-blue-500 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 font-semibold px-3 py-2 rounded-lg text-sm"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        View Account
                      </Button>
                    </div>

                    {/* Quick stats */}
                    <div className="text-right">
                      <div className="text-xs text-green-200 uppercase tracking-wider mb-0.5">
                        Installment Status
                      </div>
                      <div className="text-xs text-white font-medium">
                        {selectedInstallment.outstanding > 0
                          ? "Outstanding"
                          : "Fully Paid"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Financial Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Financial Details
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100 hover:border-green-200 transition-colors">
                      <label className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                        Previous Balance
                      </label>
                      <p className="text-green-900 text-base font-medium mt-1">
                        {formatCurrency(selectedInstallment.pre_balance || 0)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                      <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        Installment Charge
                      </label>
                      <p className="text-blue-900 text-base font-medium mt-1">
                        {formatCurrency(
                          selectedInstallment.install_charge || 0
                        )}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg border border-red-100 hover:border-red-200 transition-colors">
                      <label className="text-xs font-semibold text-red-700 uppercase tracking-wide">
                        Fine Amount
                      </label>
                      <p className="text-red-900 text-base font-medium mt-1">
                        {formatCurrency(selectedInstallment.fine || 0)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <svg
                        className="w-4 h-4 text-indigo-600"
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
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Payment Details
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors">
                      <label className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                        Payment Method
                      </label>
                      <p className="text-indigo-900 text-base font-medium mt-1">
                        {selectedInstallment.payment_method || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors">
                      <label className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                        Discount
                      </label>
                      <p className="text-purple-900 text-base font-medium mt-1">
                        {formatCurrency(selectedInstallment.discount || 0)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-lg border border-amber-100 hover:border-amber-200 transition-colors">
                      <label className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                        SMS Sent
                      </label>
                      <p className="text-amber-900 text-base font-medium mt-1">
                        {selectedInstallment.sms_sent ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-rose-100 rounded-lg">
                      <svg
                        className="w-4 h-4 text-rose-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Summary</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-lg border border-rose-100 hover:border-rose-200 transition-colors">
                      <label className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                        Total Balance
                      </label>
                      <p className="text-rose-900 text-base font-medium mt-1">
                        {formatCurrency(selectedInstallment.balance || 0)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-lg border border-rose-100 hover:border-rose-200 transition-colors">
                      <label className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                        Outstanding Amount
                      </label>
                      <p className="text-rose-900 text-base font-medium mt-1">
                        {formatCurrency(selectedInstallment.outstanding || 0)}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-lg border border-rose-100 hover:border-rose-200 transition-colors">
                      <label className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                        Fine Type
                      </label>
                      <p className="text-rose-900 text-base font-medium mt-1">
                        {selectedInstallment.fine_type || "Fixed"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {selectedInstallment.notes && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-gray-100 rounded-lg">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">Notes</h3>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700">{selectedInstallment.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-green-600"
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
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Select an Installment
              </h3>
              <p className="text-gray-600 text-lg">
                Choose an installment from the list to view its details
              </p>
              <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 inline-block">
                <p className="text-sm text-gray-500">
                  👈 Click on any installment in the sidebar
                </p>
              </div>
            </div>
          </Card>
        )}
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
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-4 h-4 inline mr-2"
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
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "grid"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-4 h-4 inline mr-2"
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

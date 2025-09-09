import React, { useEffect, useState } from "react";
import { leaseAccountApi } from "../../services";
import { Button } from "../../../../shared/components/ui/Button";
import Input from "../../../../shared/components/ui/Input";
import { DataTable } from "../../../../shared/components/ui/DataTable";
import toast from "../../../../utils/toast";
import { getFormattedDate, formatCurrency } from "../../../../utils/common";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../../shared/components/ui/Card";
import SelectInput from "../../../../shared/components/ui/SelectInput";

const AccountsListPage = () => {
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
    branch_id: "",
    status: "",
  });
  const [viewMode, setViewMode] = useState("grid"); // 'table' or 'grid'
  const [selectedAccount, setSelectedAccount] = useState(null);
  console.log("🚀 ~ AccountsListPage ~ selectedAccount:", selectedAccount);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await leaseAccountApi.list({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        branch_id: filters.branch_id,
        status: filters.status,
      });

      // Expecting response like { data: [], pagination: { page, limit, total, totalPages } }
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
      toast.error(error?.message || "Failed to fetch accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.page,
    pagination.limit,
    filters.search,
    filters.branch_id,
    filters.status,
  ]);

  const columns = [
    { key: "acc_no", label: "Acc No" },
    { key: "customer_name", label: "Customer" },
    { key: "product_name", label: "Product" },
    { key: "process_type", label: "Type" },
    { key: "cash_price", label: "Cash", render: (v) => formatCurrency(v) },
    {
      key: "installment_price",
      label: "Installments",
      render: (v) => formatCurrency(v),
    },
    { key: "advance", label: "Advance", render: (v) => formatCurrency(v) },
    {
      key: "monthly_installment",
      label: "Monthly",
      render: (v) => formatCurrency(v),
    },
    { key: "duration", label: "Months" },
    {
      key: "process_date",
      label: "Process Date",
      render: (v) => getFormattedDate(v),
    },
  ];

  const renderTableView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search accounts..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        <Input
          placeholder="Branch ID"
          value={filters.branch_id}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, branch_id: e.target.value }))
          }
        />
        {/* <select
          className="border rounded px-3 py-2"
          value={filters.status}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, status: e.target.value }))
          }
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select> */}
        <SelectInput
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          value={filters.status}
          valueProp="value"
          labelProp="label"
          placeholder="Select Status"
        />
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left Grid - Accounts List */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Accounts List
            </h3>
            <p className="text-sm text-gray-600 mt-1">{data.length} accounts</p>
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading accounts...
              </div>
            ) : data.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No accounts found
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {data.map((account) => (
                  <div
                    key={account.id || account.acc_no}
                    className={`p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedAccount?.id === account.id ||
                      selectedAccount?.acc_no === account.acc_no
                        ? "bg-blue-50 border-r-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => setSelectedAccount(account)}
                  >
                    <div className="font-medium text-gray-900">
                      {account.acc_no || "N/A"}
                    </div>
                    <div className="text-sm text-gray-600 truncate">
                      {account.customer_name || "N/A"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {account.process_type || "N/A"} •{" "}
                      {account.product?.name || "N/A"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Right Side - Account Details */}
      <div className="lg:col-span-3">
        {selectedAccount ? (
          <Card className="overflow-hidden">
            {/* Header with enhanced gradient background */}
            <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-4 text-white relative overflow-hidden shadow-2xl">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-3xl font-black bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            #{selectedAccount.acc_no || "N/A"}
                          </h2>
                          <div className="px-2 py-0.5 bg-green-500/20 border border-green-400/30 rounded-full">
                            <span className="text-green-300 text-xs font-semibold uppercase tracking-wider">
                              Active
                            </span>
                          </div>
                        </div>
                        <p className="text-blue-100 text-base font-medium">
                          {selectedAccount.customer_name || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Enhanced badges */}
                    <div className="flex items-center gap-2 mt-3">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-white/25 to-white/15 rounded-lg border border-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <span className="text-white text-xs font-semibold">
                          {selectedAccount.process_type || "N/A"}
                        </span>
                      </div>
                      <div className="px-3 py-1.5 bg-gradient-to-r from-white/20 to-white/10 rounded-lg border border-white/15 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <span className="text-white text-xs font-semibold">
                          {selectedAccount.product?.name || "N/A"}
                        </span>
                      </div>
                      <div className="px-3 py-1.5 bg-gradient-to-r from-white/15 to-white/5 rounded-lg border border-white/10 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <span className="text-white text-xs font-semibold">
                          {selectedAccount?.product?.category?.name || "N/A"}
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
                            `/lease/accounts/${
                              selectedAccount.id || selectedAccount.acc_no
                            }/installments`
                          )
                        }
                        className="bg-gradient-to-r from-green-500 to-emerald-600 !text-white hover:from-emerald-600 hover:to-green-500 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 font-semibold px-3 py-2 rounded-lg text-sm"
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
                            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        Installments
                      </Button>
                      <Button
                        onClick={() =>
                          navigate(
                            `/lease/accounts/edit/${
                              selectedAccount.id || selectedAccount.acc_no
                            }`
                          )
                        }
                        className="bg-gradient-to-r from-white to-gray-100 !text-blue-700 hover:from-gray-100 hover:to-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 font-semibold px-4 py-2 rounded-lg"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit Account
                      </Button>
                    </div>

                    {/* Quick stats */}
                    <div className="text-right">
                      <div className="text-xs text-blue-200 uppercase tracking-wider mb-0.5">
                        Account Status
                      </div>
                      <div className="text-xs text-white font-medium">
                        Created:{" "}
                        {selectedAccount.process_date
                          ? getFormattedDate(selectedAccount.process_date)
                          : "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Basic Information */}
                {/* <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Basic Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Process Type
                      </label>
                      <p className="text-gray-900 text-base font-medium mt-1">
                        {selectedAccount.process_type || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                      <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Process Date
                      </label>
                      <p className="text-gray-900 text-base font-medium mt-1">
                        {selectedAccount.process_date
                          ? getFormattedDate(selectedAccount.process_date)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div> */}

                {/* Product Information */}
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
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Product Information
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors">
                      <label className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                        Product Name
                      </label>
                      <p className="text-indigo-900 text-base font-medium mt-1">
                        {selectedAccount.product?.name || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors">
                      <label className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                        Brand
                      </label>
                      <p className="text-indigo-900 text-base font-medium mt-1">
                        {selectedAccount?.product?.brand?.name || "N/A"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors">
                      <label className="text-xs font-semibold text-indigo-700 uppercase tracking-wide">
                        Category
                      </label>
                      <p className="text-indigo-900 text-base font-medium mt-1">
                        {selectedAccount?.product?.category?.name || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Details - Column 1 */}
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
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors">
                      <label className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                        Installment Price
                      </label>
                      <p className="text-blue-900 text-base font-medium mt-1">
                        {selectedAccount.installment_price
                          ? formatCurrency(selectedAccount.installment_price)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-3 rounded-lg border border-orange-100 hover:border-orange-200 transition-colors">
                      <label className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                        Monthly Installment
                      </label>
                      <p className="text-orange-900 text-base font-medium mt-1">
                        {selectedAccount.monthly_installment
                          ? formatCurrency(selectedAccount.monthly_installment)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg border border-teal-100 hover:border-teal-200 transition-colors">
                      <label className="text-xs font-semibold text-teal-700 uppercase tracking-wide">
                        Duration
                      </label>
                      <p className="text-teal-900 text-base font-medium mt-1">
                        {selectedAccount.duration || "N/A"} months
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Details - Column 2 */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                      <svg
                        className="w-4 h-4 text-purple-600"
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
                      Advance & Balance
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-100 hover:border-purple-200 transition-colors">
                      <label className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                        Advance
                      </label>
                      <p className="text-purple-900 text-base font-medium mt-1">
                        {selectedAccount.advance
                          ? formatCurrency(selectedAccount.advance)
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-lg border border-rose-100 hover:border-rose-200 transition-colors">
                      <label className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                        Pending Advance
                      </label>
                      <p className="text-rose-900 text-base font-medium mt-1">
                        {selectedAccount?.leaseAdvance?.pending_advance
                          ? formatCurrency(
                              selectedAccount.leaseAdvance.pending_advance
                            )
                          : "N/A"}
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-3 rounded-lg border border-rose-100 hover:border-rose-200 transition-colors">
                      <label className="text-xs font-semibold text-rose-700 uppercase tracking-wide">
                        Remaining Balance
                      </label>
                      <p className="text-rose-900 text-base font-medium mt-1">
                        {selectedAccount.installment_price &&
                        selectedAccount?.advance
                          ? formatCurrency(
                              selectedAccount.installment_price -
                                selectedAccount?.advance
                            )
                          : selectedAccount.installment_price &&
                            !selectedAccount?.advance
                          ? formatCurrency(selectedAccount.installment_price)
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Officer Information Row */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-amber-100 rounded-lg">
                    <svg
                      className="w-4 h-4 text-amber-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Officer Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-lg border border-amber-100 hover:border-amber-200 transition-colors">
                    <label className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                      Inquiry Officer
                    </label>
                    <p className="text-amber-900 text-base font-medium mt-1">
                      {selectedAccount.leaseAdvance?.inquiryOfficer?.name ||
                        "N/A"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-3 rounded-lg border border-amber-100 hover:border-amber-200 transition-colors">
                    <label className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                      Marketing Officer
                    </label>
                    <p className="text-amber-900 text-base font-medium mt-1">
                      {selectedAccount.leaseAdvance?.marketingOfficer?.name ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Details - Commented Out */}
              {/* <div className="mt-6">
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
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Additional Details
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="text-center py-4 text-gray-500">
                    <p className="text-sm">Additional fields will appear here</p>
                  </div>
                </div>
              </div> */}
            </div>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="p-12 text-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-blue-600"
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
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Select an Account
              </h3>
              <p className="text-gray-600 text-lg">
                Choose an account from the list to view its details
              </p>
              <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200 inline-block">
                <p className="text-sm text-gray-500">
                  👈 Click on any account in the sidebar
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lease Accounts</h2>
        <div className="flex items-center gap-3">
          {/* View Toggle Buttons */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-blue-600 text-white"
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
                  ? "bg-blue-600 text-white"
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
          <Button onClick={() => navigate("/lease/accounts/create")}>
            Create Account
          </Button>
        </div>
      </div>

      {/* Render the appropriate view */}
      {viewMode === "table" ? renderTableView() : renderGridView()}
    </div>
  );
};

export default AccountsListPage;

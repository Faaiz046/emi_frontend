import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../../../../shared/components/ui/Button";
import Input from "../../../../shared/components/ui/Input";
import { Select, CustomSelect } from "../../../../shared/components";
import { Modal } from "../../../../shared/components/ui/Modal";
import toast from "../../../../utils/toast";
import { installmentApi } from "../services/installment";
import { leaseAccountApi } from "../../services";
import { Spinner } from "../../../../shared/components";
import { userApi } from "../../../../services/user/api";
import Toast from "../../../../utils/toast";
import { RiLoader3Fill } from "react-icons/ri";
import { apiClient } from "../../../../services/api-client/api";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../../../../shared/components/ui/DataTable";
import {
  formatCurrency,
  formatDateForStorage,
  getFormattedDate,
} from "../../../../utils/common";

const InstallmentForm = ({
  isOpen,
  onClose,
  installment = null,
  accountId,
  onSuccess,
  preBalance = 0,
  account_number,
}) => {
  const currentDate = new Date();
  const [formData, setFormData] = useState({
    recv_no: "",
    install_date: formatDateForStorage(currentDate),
    model: "",
    account_id: accountId || "",
    account_date: "",
    advance: "",
    customer_name: "",
    son_of: "",
    pre_balance: preBalance.toString(),
    account_type: "",
    pending: "",
    install_charge: "",
    monthly_installment: "",
    outstanding: "",
    fine: "0",
    fine_type: "fixed", // fixed or percentage
    officer: "",
    discount: "0",
    balance: "",
    sms_sent: false,
    auto_print: false,
    payment_method: "cash", // cash, bank, check, online
    bank_account_id: "",
    notes: "",
    installments: [],
  });

  const columns = [
    {
      key: "install_date",
      label: "Install Date",
      render: (v) => getFormattedDate(v, "DD-MMM-YYYY"),
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
    {
      key: "officer",
      label: "Recovery",
      render: (v) => v?.name,
    },
    { key: "fine", label: "Fine", render: (v) => formatCurrency(v) },
    { key: "fine_type", label: "Fine Type" },
  ];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [accountDetails, setAccountDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (account_number) {
      setFormData({
        ...formData,
        acc_no: account_number || "",
      });
      fetchAccountDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account_number]);
  useEffect(() => {
    if (installment) {
      setFormData({
        recv_no: installment.recv_no || "",
        install_date: installment.install_date
          ? new Date(installment.install_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        model: installment.model || "",
        account_id: "",
        acc_no: installment.acc_no || "",
        account_date: installment.account_date
          ? new Date(installment.account_date).toISOString().split("T")[0]
          : "",
        advance: installment.advance?.toString() || "",
        customer_name: installment.customer_name || "",
        son_of: installment.son_of || "",
        pre_balance:
          installment.pre_balance?.toString() || preBalance.toString(),
        account_type: installment.account_type || "",
        pending: installment.pending?.toString() || "",
        install_charge: installment.install_charge?.toString() || "",
        monthly_installment: installment.monthly_installment?.toString() || "",
        outstanding: installment.outstanding?.toString() || "",
        fine: installment.fine?.toString() || "0",
        fine_type: installment.fine_type || "fixed",
        recovery_officer: installment.recovery_officer || "",
        discount: installment.discount?.toString() || "0",
        balance: installment.balance?.toString() || "",
        sms_sent: installment.sms_sent || false,
        auto_print: installment.auto_print || false,
        payment_method: installment.payment_method || "cash",
        bank_account_id: installment.bank_account_id?.toString() || "",
        notes: installment.notes || "",
        installments: installment.installments || [],
      });
    } else {
      setFormData({
        recv_no: "",
        install_date: new Date().toISOString().split("T")[0],
        model: "",
        account_id: accountId || "",
        acc_no: "",
        account_date: "",
        advance: "",
        customer_name: "",
        son_of: "",
        pre_balance: preBalance.toString(),
        account_type: "",
        pending: "",
        install_charge: "",
        monthly_installment: "",
        outstanding: "",
        fine: "0",
        fine_type: "fixed",
        recovery_officer: "",
        discount: "0",
        balance: "",
        sms_sent: false,
        auto_print: false,
        payment_method: "cash",
        bank_account_id: "",
        notes: "",
        officer_id: "",
        installments: [],
      });
    }
  }, [installment, accountId, preBalance]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    // setUsersLoading(true);
    try {
      const response = await userApi.getAllUsersList({ limit: 1000 });
      if (response && response.data && Array.isArray(response.data)) {
        const userOptions = response.data.map((user) => ({
          value: user.id,
          label: `${user.name}`,
        }));
        setUsers(userOptions);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      Toast.error("Failed to load users");
    } finally {
      // setUsersLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAccountIdKeyPress = async (e) => {
    if (e.key === "Enter" && formData.acc_no) {
      e.preventDefault();
      await fetchAccountDetails();
    }
  };

  const fetchAccountDetails = async () => {
    // if (!formData.acc_no || !account_number) return;

    try {
      setLoading(true);
      setError(null);
      const res = await leaseAccountApi.accountDetails({
        acc_no: formData.acc_no || account_number,
      });
      console.log("🚀 ~ fetchAccountDetails ~ res:", res);
      const accountData = res?.data || res;

      if (accountData) {
        setAccountDetails(accountData);
        // Update form fields with account details
        setFormData((prev) => ({
          ...prev,

          acc_no: accountData?.process?.acc_no || "",
          account_id: accountData.id || "",
          customer_name: accountData?.process?.customer_name || "",
          son_of: accountData?.process?.son_of || "",
          account_date: accountData?.process?.process_date
            ? new Date(accountData?.process?.process_date)
                .toISOString()
                .split("T")[0]
            : "",
          advance: accountData?.process?.advance?.toString() || "",
          monthly_installment:
            accountData?.process?.monthly_installment?.toString() || "",
          pre_balance: parseFloat(
            accountData?.remaining_balance || 0
          ).toString(),
          account_type: accountData?.process?.process_type || "",
          model: accountData?.process?.product?.name || "",
          install_charge: accountData?.process?.monthly_installment || 0,
          recovery_officer:
            accountData?.outStandPayment?.recovery_officer_id || "",
          outstand: accountData?.outStandPayment?.outstand || 0,
          officer_id: accountData?.outStandPayment?.recovery_officer_id || "",
          installments: accountData?.installments || [],
        }));
        toast.success(`Account #${accountData.acc_no} loaded successfully`);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Account not found or failed to load";
      setError(errorMessage);
      toast.error(errorMessage);
      setAccountDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateBalance = useCallback(() => {
    const preBalance = parseFloat(formData.pre_balance) || 0;
    const installCharge = parseFloat(formData.install_charge) || 0;
    const discount = parseFloat(formData.discount) || 0;
    const balance = preBalance - installCharge - discount;
    setFormData((prev) => ({
      ...prev,
      balance: balance.toString(),
    }));
  }, [formData.pre_balance, formData.install_charge, formData.discount]);

  useEffect(() => {
    calculateBalance();
  }, [
    calculateBalance,
    formData.pre_balance,
    formData.install_charge,
    formData.fine,
    formData.discount,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.install_charge || parseFloat(formData.install_charge) <= 0) {
      toast.error("Installment charge is required and must be greater than 0");
      return;
    }

    if (!formData.account_id) {
      toast.error("Account ID is required");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const payload = {
        ...formData,
        account_id: parseInt(formData.account_id),
        advance: parseFloat(formData.advance) || 0,
        pre_balance: parseFloat(formData.pre_balance),
        pending: parseFloat(formData.pending_advance) || 0,
        install_charge: parseFloat(formData.install_charge),
        monthly_installment: parseFloat(formData.monthly_installment) || 0,
        fine: parseFloat(formData.fine),
        discount: parseFloat(formData.discount),
        balance: parseFloat(formData.balance),
        outstanding: parseFloat(formData.outstanding),
        bank_account_id: formData.bank_account_id
          ? parseInt(formData.bank_account_id)
          : null,
      };

      if (installment) {
        await installmentApi.updateInstallment(installment.id, payload);
        setIsLoading(false);
        toast.success("Installment updated successfully");
      } else {
        await installmentApi.createInstallment(payload);
        toast.success("Installment created successfully");
      }
      setIsLoading(false);
      onSuccess();
      onClose();
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save installment";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      recv_no: "",
      install_date: new Date().toISOString().split("T")[0],
      model: "",
      account_id: accountId || "",
      account_date: "",
      advance: "",
      customer_name: "",
      son_of: "",
      pre_balance: preBalance.toString(),
      account_type: "",
      pending: "",
      install_charge: "",
      monthly_installment: "",
      outstanding: "",
      fine: "0",
      fine_type: "fixed",
      recovery_officer: "",
      discount: "0",
      balance: "",
      sms_sent: false,
      auto_print: false,
      payment_method: "cash",
      bank_account_id: "",
      notes: "",
    });
    setAccountDetails(null);
    setError(null);
    onClose();
  };
  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: banks_drd } = useQuery({
    queryKey: ["banks_drd"],
    queryFn: () => apiClient.get("/bank_accounts/drd").then((res) => res.data),
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={installment ? "Edit Installment" : "Add New Installment"}
      size="xxl"
      onSubmit={handleSubmit}
      loading={isLoading}
    >
      <div className="space-y-3">
        {/* Account Lookup Section - Compact */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="bg-red-100 px-3 py-1 rounded text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="bg-blue-50 p-2 rounded border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Account Lookup
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Account Number"
              name="acc_no"
              value={formData.acc_no}
              onChange={handleInputChange}
              onKeyPress={handleAccountIdKeyPress}
              placeholder="Type account number and press Enter"
              required
              className="text-sm"
            />
            <Input
              label="Receipt Date"
              name="install_date"
              type="date"
              value={formData.install_date}
              onChange={handleInputChange}
              required
              className="text-sm"
            />
          </div>
        </div>

        {/* Account Information Display - Very Compact */}
        {accountDetails && !loading ? (
          <>
            <div className="bg-gray-50 p-2 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Account Information
              </h3>
              <div className="grid grid-cols-5 gap-1">
                <div className="bg-white p-1 rounded border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">Acc No</div>
                  <div className="text-xs font-semibold text-gray-900">
                    {formData.acc_no || "N/A"}
                  </div>
                </div>
                <div className="bg-white p-1 rounded border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">Customer</div>
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {formData.customer_name || "N/A"}
                  </div>
                </div>
                <div className="bg-white p-1 rounded border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">SO</div>
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {formData.son_of || "N/A"}
                  </div>
                </div>
                <div className="bg-white p-1 rounded border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">Product</div>
                  <div className="text-xs font-semibold text-gray-900 truncate">
                    {formData.model || "N/A"}
                  </div>
                </div>
                <div className="bg-white p-1 rounded border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">Acc Date</div>
                  <div className="text-xs font-semibold text-gray-900">
                    {formData.account_date || "N/A"}
                  </div>
                </div>
                <div className="bg-white p-1 rounded border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">Advance</div>
                  <div className="text-xs font-semibold text-blue-600">
                    ${parseFloat(formData.advance || 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-1 rounded border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">Pre Balance</div>
                  <div className="text-xs font-semibold text-red-600">
                    ${parseFloat(formData.pre_balance || 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-1 rounded border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">Type</div>
                  <div className="text-xs font-semibold text-gray-900">
                    {formData.account_type || "N/A"}
                  </div>
                </div>
                <div className="bg-white p-1 rounded border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">Pending</div>
                  <div className="text-xs font-semibold text-orange-600">
                    ${parseFloat(formData.pending || 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-1 rounded border border-gray-200 text-center">
                  <div className="text-xs text-gray-500 mb-1">Monthly</div>
                  <div className="text-xs font-semibold text-green-600">
                    $
                    {parseFloat(
                      formData.monthly_installment || 0
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Installment Details - Compact Grid */}
            <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">
                Installment Details
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <Input
                  label="Install Charge"
                  name="install_charge"
                  type="number"
                  step="1"
                  value={formData.install_charge}
                  onChange={handleInputChange}
                  placeholder="Charge"
                  required
                  size="md"
                />
                <Input
                  label="Fine Amount"
                  name="fine"
                  type="number"
                  step="0.01"
                  value={formData.fine}
                  onChange={handleInputChange}
                  placeholder="Fine"
                  size="md"
                />
                <Select
                  label="Fine Type"
                  name="fine_type"
                  value={formData.fine_type}
                  onChange={(value) =>
                    handleInputChange({ target: { name: "fine_type", value } })
                  }
                  options={[
                    { value: "fixed", label: "Fixed" },
                    { value: "percentage", label: "Percentage" },
                  ]}
                  size="md"
                />
                <Input
                  label="Discount"
                  name="discount"
                  type="number"
                  step="0.01"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="Discount"
                  size="md"
                />
                <Select
                  label="Payment Method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={(value) =>
                    handleInputChange({
                      target: { name: "payment_method", value },
                    })
                  }
                  options={[
                    { value: "cash", label: "Cash" },
                    { value: "bank", label: "Bank" },
                    { value: "check", label: "Check" },
                    { value: "online", label: "Online" },
                  ]}
                  size="md"
                />

                {formData.payment_method === "bank" && (
                  <Select
                    label="Bank Account"
                    name="bank_account"
                    value={formData.account_type}
                    onChange={(value) =>
                      handleInputChange({
                        target: { name: "account_type", value },
                      })
                    }
                    options={banks_drd.map((bank) => ({
                      value: bank.id,
                      label: bank.account_title,
                    }))}
                    size="md"
                  />
                )}
                <Select
                  label="Recovery Officer"
                  placeholder="Select a Recovery Officer"
                  options={users}
                  value={formData.officer_id}
                  onChange={(value) =>
                    handleInputChange({
                      target: { name: "officer_id", value },
                    })
                  }
                  loading={loading}
                  className="max-w-md"
                />
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                    placeholder="Enter notes..."
                  />
                </div>
              </div>
            </div>

            {/* Calculated Results - Compact */}
            <div className="bg-green-50 p-2 rounded border border-green-200">
              <h3 className="text-sm font-semibold text-green-800 mb-2">
                Calculated Results
              </h3>
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-white p-2 rounded border text-center">
                  <div className="text-xs text-green-700 mb-1">Outstanding</div>
                  <div className="text-sm font-semibold text-green-900">
                    ${parseFloat(formData?.outstand || 0).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white p-2 rounded border text-center">
                  <div className="text-xs text-green-700 mb-1">Balance</div>
                  <div className="text-sm font-semibold text-green-900">
                    ${parseFloat(formData.balance || 0).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                Installments
              </h3>
              <DataTable
                data={formData?.installments}
                columns={columns}
                loading={loading}
                pagination={false}
                // onPageChange={(page) =>
                //   setPagination((prev) => ({ ...prev, page }))
                // }
              />
            </div>
          </>
        ) : loading ? (
          <div className="flex items-center justify-center py-8 h-full min-h-[250px]">
            <RiLoader3Fill className="animate-spin w-12 h-12 text-blue-600" />
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default InstallmentForm;

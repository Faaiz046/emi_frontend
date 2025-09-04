import React, { useState, useEffect } from "react";
import { Button } from "../../../../shared/components/ui/Button";
import Input from "../../../../shared/components/ui/Input";
import { Modal } from "../../../../shared/components/ui/Modal";
import toast from "../../../../utils/toast";
import { installmentApi } from "../services/installment";
import { leaseAccountApi } from "../../services";

const InstallmentForm = ({
  isOpen,
  onClose,
  installment = null,
  accountId,
  onSuccess,
  preBalance = 0,
}) => {
  const [formData, setFormData] = useState({
    recv_no: "",
    recv_date: new Date().toISOString().split("T")[0],
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
    recovery_officer: "",
    discount: "0",
    balance: "",
    sms_sent: false,
    auto_print: false,
    payment_method: "cash", // cash, bank, check, online
    bank_account_id: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [accountDetails, setAccountDetails] = useState(null);

  useEffect(() => {
    if (installment) {
      setFormData({
        recv_no: installment.recv_no || "",
        recv_date: installment.recv_date
          ? new Date(installment.recv_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        model: installment.model || "",
        account_id: installment.account_id || accountId || "",
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
      });
    } else {
      setFormData({
        recv_no: "",
        recv_date: new Date().toISOString().split("T")[0],
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
      });
    }
  }, [installment, accountId, preBalance]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // You can implement user loading logic here
      // For now, using a mock array
      setUsers([
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ]);
    } catch (error) {
      console.error("Failed to load users:", error);
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
    if (!formData.acc_no) return;

    try {
      setLoading(true);
      const res = await leaseAccountApi.accountDetails({
        acc_no: formData.acc_no,
      });
      const accountData = res?.data || res;

      if (accountData) {
        setAccountDetails(accountData);
        // Update form fields with account details
        setFormData((prev) => ({
          ...prev,
          customer_name: accountData.customer_name || "",
          son_of: accountData.son_of || "",
          account_date: accountData.process_date
            ? new Date(accountData.process_date).toISOString().split("T")[0]
            : "",
          advance: accountData.advance?.toString() || "",
          monthly_installment:
            accountData.monthly_installment?.toString() || "",
          pre_balance: parseFloat(
            accountData.leaseAdvance?.remaining_balance || 0
          ).toString(),
          account_type: accountData.process_type || "",
          model: accountData.product?.name || "",
        }));
        toast.success(`Account #${accountData.acc_no} loaded successfully`);
      }
    } catch (error) {
      toast.error("Account not found or failed to load");
      setAccountDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateBalance = () => {
    const preBalance = parseFloat(formData.pre_balance) || 0;
    const installCharge = parseFloat(formData.install_charge) || 0;
    const fine = parseFloat(formData.fine) || 0;
    const discount = parseFloat(formData.discount) || 0;

    const balance = preBalance + installCharge + fine - discount;
    const outstanding = Math.max(0, balance);

    setFormData((prev) => ({
      ...prev,
      balance: balance.toString(),
      outstanding: outstanding.toString(),
    }));
  };

  useEffect(() => {
    calculateBalance();
  }, [
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
      setLoading(true);

      const payload = {
        ...formData,
        account_id: parseInt(formData.account_id),
        advance: parseFloat(formData.advance) || 0,
        pre_balance: parseFloat(formData.pre_balance),
        pending: parseFloat(formData.pending) || 0,
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
        await installmentApi.update(installment.id, payload);
        toast.success("Installment updated successfully");
      } else {
        await installmentApi.create(payload);
        toast.success("Installment created successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error?.message || "Failed to save installment");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      recv_no: "",
      recv_date: new Date().toISOString().split("T")[0],
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
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={installment ? "Edit Installment" : "Add New Installment"}
      size="xl"
      onSubmit={handleSubmit}
    >
      <div className="space-y-3">
        {/* Account Lookup Section - Compact */}
        <div className="bg-blue-50 p-2 rounded border border-blue-200">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Account Lookup
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Account Number *"
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
              name="recv_date"
              type="date"
              value={formData.recv_date}
              onChange={handleInputChange}
              required
              className="text-sm"
            />
          </div>
          {accountDetails && (
            <div className="mt-2 p-1 bg-green-50 border border-green-200 rounded text-xs">
              <span className="text-green-800">
                <strong>Account #{accountDetails.acc_no}</strong> loaded
                successfully
              </span>
            </div>
          )}
        </div>

        {/* Account Information Display - Very Compact */}
        {accountDetails && (
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
        )}

        {/* Installment Details - Compact Grid */}
        <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-800 mb-2">
            Installment Details
          </h3>
          <div className="grid grid-cols-4 gap-2">
            <Input
              label="Install Charge *"
              name="install_charge"
              type="number"
              step="0.01"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fine Type
              </label>
              <select
                name="fine_type"
                value={formData.fine_type}
                onChange={handleInputChange}
                className="w-full px-2 py-2 h-9 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              >
                <option value="fixed">Fixed</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Method
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleInputChange}
                className="w-full px-2 py-2 h-9 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              >
                <option value="cash">Cash</option>
                <option value="bank">Bank</option>
                <option value="check">Check</option>
                <option value="online">Online</option>
              </select>
            </div>
            {formData.payment_method === "bank" && (
              <Input
                label="Bank Account"
                name="bank_account_id"
                type="number"
                value={formData.bank_account_id}
                onChange={handleInputChange}
                placeholder="Bank account"
                className="text-sm"
                size="md"
              />
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Officer
              </label>
              <select
                name="recovery_officer"
                value={formData.recovery_officer}
                onChange={handleInputChange}
                className="w-full px-2 py-2 h-9 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
              >
                <option value="">Select Officer</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
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
                ${parseFloat(formData.outstanding || 0).toLocaleString()}
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
      </div>
    </Modal>
  );
};

export default InstallmentForm;

import React, { useState, useEffect } from "react";
import { Modal } from "../../../../shared/components/ui/Modal";
import Input from "../../../../shared/components/ui/Input";
import { apiClient } from "../../../../services/api-client/api";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// import { Checkbox } from "../../../../shared/components/ui/Checkbox";
const AddBankAccount = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  size,
  isEdit,
  record,
}) => {
  const [formData, setFormData] = useState({
    account_title: "",
    account_number: "",
    bank_name: "",
    branch_name: "",
    account_type: "",
    currency: "",
    opening_balance: "",
    current_balance: "",
    minimum_balance: "",
    interest_rate: "",
    notes: "",
    id: "",
  });

  useEffect(() => {
    if (isEdit && record) {
      setFormData({
        account_title: record.account_title || "",
        account_number: record.account_number || "",
        bank_name: record.bank_name || "",
        branch_name: record.branch_name || "",
        opening_balance: record.opening_balance || "",
        current_balance: record.current_balance || "",
        minimum_balance: record.minimum_balance || "",
        interest_rate: record.interest_rate || "",
        notes: record.notes || "",
        id: record.id || "",
        is_active: record.is_active || false,
      });
    } else {
      setFormData({
        account_title: "",
        account_number: "",
        bank_name: "",
        branch_name: "",
        opening_balance: "",
        current_balance: "",
        minimum_balance: "",
        interest_rate: "",
        notes: "",
        is_active: false,
      });
    }
  }, [isEdit]);

  const queryClient = useQueryClient();
  const {
    data: banks_drd,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["banks_drd"],
    queryFn: () => apiClient.get("/bank_accounts/drd").then((res) => res.data),
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const { mutate: createBankAccount, isPending } = useMutation({
    mutationFn: () => {
      let url = isEdit ? `/bank_accounts/` : "/bank_accounts/";
      let method = isEdit ? "put" : "post";
      return apiClient[method](url, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank_accounts_list"] });
      onClose();
    },
    onError: (error) => {
      console.error("Error creating bank account:", error);
    },
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={createBankAccount}
      title={title}
      size={size}
      loading={isPending}
    >
      <form id="bank-account-form" className="space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Account Title"
            name="account_title"
            value={formData.account_title}
            onChange={(e) =>
              setFormData({ ...formData, account_title: e.target.value })
            }
            //   value={formData.account_title}
            //   onChange={handleChange}
          />
          <Input
            label="Account Number"
            name="account_number"
            value={formData.account_number}
            onChange={(e) =>
              setFormData({ ...formData, account_number: e.target.value })
            }
            //   value={formData.account_number}
            //   onChange={handleChange}
          />
          <Input
            label="Bank Name"
            name="bank_name"
            value={formData.bank_name}
            onChange={(e) =>
              setFormData({ ...formData, bank_name: e.target.value })
            }
            //   value={formData.bank_name}
            //   onChange={handleChange}
          />
          <Input
            label="Branch Name"
            name="branch_name"
            value={formData.branch_name}
            onChange={(e) =>
              setFormData({ ...formData, branch_name: e.target.value })
            }
            //   value={formData.branch_name}
            //   onChange={handleChange}
          />
          <Input
            label="Account Type"
            name="account_type"
            value={formData.account_type}
            onChange={(e) =>
              setFormData({ ...formData, account_type: e.target.value })
            }
            //   value={formData.account_type}
            //   onChange={handleChange}
          />
          <Input
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={(e) =>
              setFormData({ ...formData, currency: e.target.value })
            }
            //   value={formData.currency}
            //   onChange={handleChange}
          />
          <Input
            label="Opening Balance"
            name="opening_balance"
            value={formData.opening_balance}
            onChange={(e) =>
              setFormData({ ...formData, opening_balance: e.target.value })
            }
            //   value={formData.opening_balance}
            //   onChange={handleChange}
          />
          <Input
            label="Current Balance"
            name="current_balance"
            value={formData.current_balance}
            onChange={(e) =>
              setFormData({ ...formData, current_balance: e.target.value })
            }
            //   value={formData.current_balance}
            //   onChange={handleChange}
          />
          <Input
            label="Minimum Balance"
            name="minimum_balance"
            value={formData.minimum_balance}
            onChange={(e) =>
              setFormData({ ...formData, minimum_balance: e.target.value })
            }
            //   value={formData.minimum_balance}
            //   onChange={handleChange}
          />
          <Input
            label="Interest Rate"
            name="interest_rate"
            value={formData.interest_rate}
            onChange={(e) =>
              setFormData({ ...formData, interest_rate: e.target.value })
            }
            //   value={formData.interest_rate}
            //   onChange={handleChange}
          />
        </div>
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
        </div>
        <div className="">
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            value={formData.notes}
            className="w-full h-24 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
          ></textarea>
        </div>
      </form>
    </Modal>
  );
};

export default AddBankAccount;

import React, { useState } from "react";
import { apiClient } from "../../../../services/api-client/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "../../../../shared/components/ui/DataTable";
import { getFormattedDate } from "../../../../utils/common";
import { Button } from "../../../../shared/components/ui/Button";
import PageHeader from "../../../../shared/components/ui/PageHeader";
import AddBankAccount from "../components/AddBankAccount";
import toast  from "../../../../shared/components/ui/Toast";
const BankPage = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const {
    data: bankAccounts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bank_accounts_list"],
    queryFn: () => apiClient.post("/bank_accounts/list"),
    refetchOnMount: "always",
  });

  const { mutate: deleteBankAccount, isPending } = useMutation({
    mutationFn: (id) => apiClient.delete(`/bank_accounts/${id}`),
    onSuccess: () => {
      setIsDeleting(null);
      queryClient.invalidateQueries({ queryKey: ["bank_accounts_list"] });
      toast.success("Bank account deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete bank account");
    },
  });

  const columns = [
    {
      key: "account_number",
      label: "Account Number",
      render: (value, row) => {
        return <div>{value}</div>;
      },
    },
    {
      key: "account_title",
      label: "Account Title",
      render: (value, row) => {
        return <div>{value}</div>;
      },
    },
    {
      key: "bank_name",
      label: "Bank Name",
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      key: "branch_name",
      label: "Branch Name",
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      key: "opening_balance",
      label: "Opening Balance",
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      key: "current_balance",
      label: "Current Balance",
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      key: "minimum_balance",
      label: "Minimum Balance",
      render: (value) => {
        return <div>{value}</div>;
      },
    },
    {
      key: "is_active",
      label: "Active",
      render: (value) => {
        return <div>{value ? "Yes" : "No"}</div>;
      },
    },

    {
      key: "actions",
      label: "Actions",
      render: (value, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => {
              setIsEdit(true);
              setShowModal(true);
              setSelectedRow(row);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setIsDeleting(row?.id);
              deleteBankAccount(row.id);
            }}
            loading={isDeleting === row?.id && isPending}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Bank Accounts"
        buttonLabel="Add Bank Account"
        onClick={() => {
          setIsEdit(false);
          setShowModal(true);
        }}
      />
      <DataTable
        data={bankAccounts?.data}
        columns={columns}
        loading={isLoading}
        pagination={false}
        onPageChange={() => {}}
      />
      <AddBankAccount
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => {}}
        title={isEdit ? "Edit Bank Account" : "Add Bank Account"}
        size="xl"
        isEdit={isEdit}
        record={selectedRow}
      />
    </div>
  );
};

export default BankPage;

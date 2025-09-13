import React, { useState, useEffect } from "react";
import { Button } from "../../../../shared/components/ui/Button";
import { DataTable } from "../../../../shared/components/ui/DataTable";
import { Card } from "../../../../shared/components/ui/Card";
import { Badge } from "../../../../shared/components/ui/Badge";
import toast from "../../../../utils/toast";
import { installmentApi } from "../services/installment";
import InstallmentForm from "./InstallmentForm";
import { getFormattedDate, formatCurrency } from "../../../../utils/common";

const InstallmentList = ({ accountId, accountBalance = 0 }) => {
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingInstallment, setEditingInstallment] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    if (accountId) {
      fetchInstallments();
    }
  }, [accountId, pagination.page, pagination.limit]);

  const fetchInstallments = async () => {
    try {
      setLoading(true);
      const res = await installmentApi.getByAccountId(accountId, {
        page: pagination.page,
        limit: pagination.limit,
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

      setInstallments(rows);
      setPagination(pg);
    } catch (error) {
      toast.error(error?.message || "Failed to fetch installments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingInstallment(null);
    setShowForm(true);
  };

  const handleEdit = (installment) => {
    setEditingInstallment(installment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this installment?")) {
      try {
        await installmentApi.deleteInstallment(id);
        toast.success("Installment deleted successfully");
        fetchInstallments();
      } catch (error) {
        toast.error(error?.message || "Failed to delete installment");
      }
    }
  };

  const handleMarkAsPaid = async (id) => {
    try {
      await installmentApi.markInstallmentAsPaid(id, { status: "paid" });
      toast.success("Installment marked as paid");
      fetchInstallments();
    } catch (error) {
      toast.error(error?.message || "Failed to mark installment as paid");
    }
  };

  const handleSendSMS = async (id) => {
    try {
      await installmentApi.sendSMS(id);
      toast.success("SMS reminder sent successfully");
      fetchInstallments();
    } catch (error) {
      toast.error(error?.message || "Failed to send SMS");
    }
  };

  const handleFormSuccess = () => {
    fetchInstallments();
  };

  const getPreBalance = (index) => {
    if (index === 0) return accountBalance;
    
    let balance = accountBalance;
    for (let i = 0; i < index; i++) {
      const installment = installments[i];
      if (installment) {
        balance = parseFloat(installment.outstanding || 0);
      }
    }
    return balance;
  };

  const columns = [
    { 
      key: "install_date", 
      label: "Date", 
      render: (value) => getFormattedDate(value) 
    },
    { 
      key: "pre_balance", 
      label: "Previous Balance", 
      render: (value) => formatCurrency(value) 
    },
    { 
      key: "install_charge", 
      label: "Charge", 
      render: (value) => formatCurrency(value) 
    },
    { 
      key: "fine", 
      label: "Fine", 
      render: (value) => value > 0 ? formatCurrency(value) : "-" 
    },
    { 
      key: "discount", 
      label: "Discount", 
      render: (value) => value > 0 ? formatCurrency(value) : "-" 
    },
    { 
      key: "balance", 
      label: "Balance", 
      render: (value) => formatCurrency(value) 
    },
    { 
      key: "outstanding", 
      label: "Outstanding", 
      render: (value) => formatCurrency(value) 
    },
    {
      key: "payment_method",
      label: "Payment Method",
      render: (value) => (
        <Badge variant={value === "cash" ? "default" : "secondary"}>
          {value?.charAt(0).toUpperCase() + value?.slice(1)}
        </Badge>
      ),
    },
    {
      key: "sms_sent",
      label: "SMS",
      render: (value) => (
        <Badge variant={value ? "success" : "warning"}>
          {value ? "Sent" : "Pending"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(row)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleMarkAsPaid(row.id)}
          >
            Mark Paid
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleSendSMS(row.id)}
          >
            SMS
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const totalOutstanding = installments.reduce((sum, item) => {
    return sum + parseFloat(item.outstanding || 0);
  }, 0);

  const totalPaid = installments.reduce((sum, item) => {
    return sum + parseFloat(item.install_charge || 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Outstanding</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalOutstanding)}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalPaid)}
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Installments</h3>
          <p className="text-2xl font-bold text-blue-600">
            {installments.length}
          </p>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Installments</h2>
        <Button onClick={handleCreate}>
          Add Installment
        </Button>
      </div>

      {/* Installments Table */}
      <Card>
        <DataTable
          data={installments}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
          onLimitChange={(limit) => setPagination(prev => ({ ...prev, limit, page: 0 }))}
        />
      </Card>

      {/* Installment Form Modal */}
      <InstallmentForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        installment={editingInstallment}
        accountId={accountId}
        onSuccess={handleFormSuccess}
        preBalance={editingInstallment ? 
          parseFloat(editingInstallment.pre_balance || 0) : 
          getPreBalance(installments.length)
        }
      />
    </div>
  );
};

export default InstallmentList;

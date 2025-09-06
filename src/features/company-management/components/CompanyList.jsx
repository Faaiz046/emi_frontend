import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  fetchCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  setFilters,
  setPagination,
  selectCompanies,
  selectCompanyLoading,
  selectCompanyError,
  selectCompanyPagination,
  selectCompanyFilters,
} from "../../../store/slices/companySlice";
import { injectReducer } from "../../../store";
import companyReducer from "../../../store/slices/companySlice";
import { Button } from "../../../shared/components/ui/Button";
import Input from "../../../shared/components/ui/Input";
import { DataTable } from "../../../shared/components/ui/DataTable";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
} from "../../../shared/components/ui/Modal";
import Toast from "../../../utils/toast";
import { getFormattedDate } from "../../../utils/common";

// Inject reducer at module level
injectReducer("company", companyReducer);

const CompanyList = () => {
  const dispatch = useAppDispatch();
  const companies = useAppSelector(selectCompanies);
  const loading = useAppSelector(selectCompanyLoading);
  const pagination = useAppSelector(selectCompanyPagination);
  const filters = useAppSelector(selectCompanyFilters);

  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    company_name: "",
    address: "",
    phone: "",
    email: "",
    logo: "",
    license_key: "",
    status: "active",
    subscription_plan: "basic",
    subscription_start_date: "",
    subscription_end_date: "",
    max_users: 5,
    features: {},
  });

  useEffect(() => {
    dispatch(
      fetchCompanies({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      })
    );
  }, [dispatch, pagination.page, pagination.limit, filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result;
      if (editingCompany) {
        result = await dispatch(
          updateCompany({ id: editingCompany.id, data: formData })
        ).unwrap();
        if (result) {
          Toast.success("Company updated successfully");
          setShowModal(false);
          setEditingCompany(null);
          resetForm();
        } else {
          Toast.error("Failed to update company");
        }
      } else {
        result = await dispatch(createCompany(formData)).unwrap();
        console.log("🚀 ~ handleSubmit ~ result:", result);
        if (result && result.status === true) {
          Toast.success("Company created successfully");
          setShowModal(false);
          setEditingCompany(null);
          resetForm();
        } else {
          Toast.error("Failed to create company");
        }
      }
      console.log("🚀 ~ handleSubmit ~ result:", result);
    } catch (error) {
      console.error("Error saving company:", error);
      Toast.error(error || "Failed to save company");
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name || "",
      username: company.username || "",
      password: company.password || "",
      company_name: company.company_name || "",
      address: company.address || "",
      phone: company.phone || "",
      email: company.email || "",
      logo: company.logo || "",
      license_key: company.license_key || "",
      status: company.status || "active",
      subscription_plan: company.subscription_plan || "basic",
      subscription_start_date: company.subscription_start_date || "",
      subscription_end_date: company.subscription_end_date || "",
      max_users: company.max_users || 5,
      features: company.features || {},
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      try {
        await dispatch(deleteCompany(id)).unwrap();
        Toast.success("Company deleted successfully");
      } catch (error) {
        console.error("Error deleting company:", error);
        Toast.error("Failed to delete company");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      password: "",
      company_name: "",
      address: "",
      phone: "",
      email: "",
      logo: "",
      license_key: "",
      status: "active",
      subscription_plan: "basic",
      subscription_start_date: "",
      subscription_end_date: "",
      max_users: 5,
      features: {},
    });
  };

  const generateLicenseKey = async () => {
    try {
      // Mock license key generation
      const mockLicenseKey = `LIC-${new Date().getFullYear()}-${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`;
      setFormData((prev) => ({
        ...prev,
        license_key: mockLicenseKey,
      }));
      Toast.success("License key generated successfully");
    } catch (error) {
      console.error("Error generating license key:", error);
      Toast.error("Failed to generate license key");
    }
  };

  // const handleSubscriptionStartDateChange = (dateValue) => {
  //   if (dateValue) {
  //     // Create a date object in user's timezone
  //     const selectedDate = new Date(dateValue + "T00:00:00");
  //     // Set subscription_start_date to beginning of the day (00:00:00) in UTC
  //     const startOfDay = new Date(selectedDate);
  //     // Update form data
  //     setFormData((prev) => ({
  //       ...prev,
  //       subscription_start_date: startOfDay.toISOString(),
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       subscription_start_date: "",
  //     }));
  //   }
  // };

  // const handleSubscriptionEndDateChange = (dateValue) => {
  //   if (dateValue) {
  //     // Create a date object in user's timezone
  //     const selectedDate = new Date(dateValue + "T00:00:00");
  //     // Set subscription_end_date to end of the day (23:59:59) in user's timezone
  //     const endOfDay = new Date(selectedDate);
  //     endOfDay.setHours(23, 59, 59, 999);
  //     // Update form data
  //     setFormData((prev) => ({
  //       ...prev,
  //       subscription_end_date: endOfDay.toISOString(),
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       subscription_end_date: "",
  //     }));
  //   }
  // };

  const columns = [
    { key: "company_name", label: "Company Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "subscription_plan", label: "Plan" },
    {
      key: "subscription_end_date",
      label: "Expiry Date",
      render: (value) => (value ? getFormattedDate(value) : "N/A"),
    },
    { key: "max_users", label: "Max Users" },
    {
      key: "created_at",
      label: "Created",
      render: (value) => getFormattedDate(value),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, company) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(company)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(company.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Company Management</h2>
        <Button onClick={() => setShowModal(true)}>Add Company</Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search companies..."
          value={filters.search}
          onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
        />
        <select
          className="border rounded px-3 py-2"
          value={filters.status}
          onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          className="border rounded px-3 py-2"
          value={filters.subscription_plan}
          onChange={(e) =>
            dispatch(setFilters({ subscription_plan: e.target.value }))
          }
        >
          <option value="">All Plans</option>
          <option value="basic">Basic</option>
          <option value="premium">Premium</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        data={companies}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => dispatch(setPagination({ page }))}
      />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCompany(null);
          resetForm();
        }}
        size="xl"
        loading={loading}
        onSubmit={handleSubmit}
      >
        <ModalHeader>
          <ModalTitle>
            {editingCompany ? "Edit Company" : "Add New Company"}
          </ModalTitle>
        </ModalHeader>
        <ModalContent>
          <form id="company-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Name"
                  leftIcon="user"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  required
                  placeholder="Enter name"
                />
                <Input
                  label="Username"
                  leftIcon="user"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                  required
                  placeholder="Enter username"
                />
                <Input
                  label="Password"
                  type="password"
                  leftIcon="lock"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                  placeholder="Enter password"
                />
                <Input
                  label="Company Name"
                  leftIcon="building"
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company_name: e.target.value,
                    }))
                  }
                  required
                  placeholder="Enter company name"
                />
                <Input
                  label="Email Address"
                  type="email"
                  leftIcon="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  placeholder="Enter company email"
                />
                <Input
                  label="Phone Number"
                  leftIcon="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Enter phone number"
                />
                <Input
                  label="Address"
                  leftIcon="location"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Enter company address"
                />
              </div>
            </div>

            {/* License & Subscription Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                License & Subscription
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    License Key
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.license_key}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          license_key: e.target.value,
                        }))
                      }
                      readOnly
                      placeholder="License key will be generated"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={generateLicenseKey}
                      variant="outline"
                      className="px-4 py-2 whitespace-nowrap"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Subscription Plan
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.subscription_plan}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subscription_plan: e.target.value,
                      }))
                    }
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <Input
                  label="Max Users"
                  type="number"
                  value={formData.max_users}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      max_users: parseInt(e.target.value),
                    }))
                  }
                  placeholder="Enter maximum users"
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subscription Dates Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                Subscription Period
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Start Date & Time"
                  type="datetime-local"
                  leftIcon="calendar"
                  value={formData.subscription_start_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subscription_start_date: e.target.value,
                    }))
                  }
                />
                <Input
                  label="End Date & Time"
                  type="datetime-local"
                  leftIcon="calendar"
                  value={formData.subscription_end_date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subscription_end_date: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </form>
        </ModalContent>
        {/* <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowModal(false)}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="company-form"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
          >
            {loading
              ? "Saving..."
              : editingCompany
              ? "Update Company"
              : "Create Company"}
          </Button>
        </ModalFooter> */}
      </Modal>
    </div>
  );
};

export default CompanyList;

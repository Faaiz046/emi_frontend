import React, { useState, useEffect } from "react";
import { branchApi } from "../../../services/branch/api";
import { Button } from "../../../shared/components/ui/Button";
import { DataTable } from "../../../shared/components/ui/DataTable";
import { Modal } from "../../../shared/components/ui/Modal";
import Input from "../../../shared/components/ui/Input";
import Toast from "../../../utils/toast";
import { getFormattedDate } from "../../../utils/common";
import { PAGINATION } from "../../../constants/app.constant";
import SelectInput from "../../../shared/components/ui/SelectInput";

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    branch_name: "",
    address: "",
    phone: "",
    email: "",
    branch_area: "",
    manager_name: "",
    capacity: 0,
    description: "",
    location_coordinates: "",
    operating_hours: {},
    contact_person: "",
    contact_phone: "",
    is_headquarters: false,
    is_active: true,
  });
  const [filters, setFilters] = useState({
    is_active: true,
  });
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchBranches();
  }, [pagination.page, filters]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await branchApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });
      console.log("🚀 ~ fetchBranches ~ response:", response);
      if (response.status) {
        setBranches(response.data);
        if (response.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: response.pagination.total,
            totalPages: response.pagination.totalPages,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
      Toast.error("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);

      if (editingBranch) {
        const response = await branchApi.update(editingBranch.id, formData);
        if (response.status) {
          // Update the branch in the local state
          setBranches(prevBranches => 
            prevBranches.map(branch => 
              branch.id === response.id 
                ? { ...response.data, company: response.data.company }
                : branch
            )
          );
          Toast.success("Branch updated successfully");
        }
      } else {
        const response = await branchApi.create(formData);
        if (response.status) {
          // Add the new branch to the local state
          setBranches(prevBranches => [response.data, ...prevBranches]);
          // Update pagination if needed
          setPagination(prev => ({
            ...prev,
            total: prev.total + 1,
            totalPages: Math.ceil((prev.total + 1) / prev.limit)
          }));
          Toast.success("Branch created successfully");
        }
      }

      setShowModal(false);
      setEditingBranch(null);
      resetForm();
    } catch (error) {
      console.error("Error saving branch:", error);
      Toast.error(error.message || "Failed to save branch");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      branch_name: branch.branch_name || "",
      address: branch.address || "",
      phone: branch.phone || "",
      email: branch.email || "",
      branch_area: branch.branch_area || "",
      manager_name: branch.manager_name || "",
      capacity: branch.capacity || 0,
      description: branch.description || "",
      location_coordinates: branch.location_coordinates || "",
      operating_hours: branch.operating_hours || {},
      contact_person: branch.contact_person || "",
      contact_phone: branch.contact_phone || "",
      is_headquarters: branch.is_headquarters || false,
      is_active: branch.is_active ?? true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        const response = await branchApi.delete(id);
        if (response.status) {
          // Remove the branch from the local state
          setBranches(prevBranches => prevBranches.filter(branch => branch.id !== id));
          // Update pagination
          setPagination(prev => ({
            ...prev,
            total: prev.total - 1,
            totalPages: Math.ceil((prev.total - 1) / prev.limit)
          }));
          Toast.success("Branch deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting branch:", error);
        Toast.error("Failed to delete branch");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      branch_name: "",
      address: "",
      phone: "",
      email: "",
      branch_area: "",
      manager_name: "",
      capacity: 0,
      description: "",
      location_coordinates: "",
      operating_hours: {},
      contact_person: "",
      contact_phone: "",
      is_headquarters: false,
      is_active: true,
    });
  };

  const columns = [
    { key: "branch_name", label: "Branch Name" },
    { key: "branch_area", label: "Area" },
    { key: "manager_name", label: "Manager" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "capacity", label: "Capacity" },
    {
      key: "is_headquarters",
      label: "Headquarters",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "is_active",
      label: "Status",
      render: (value) => (value ? "Active" : "Inactive"),
    },
    {
      key: "created_at",
      label: "Created",
      render: (value) => getFormattedDate(value),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, branch) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(branch)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(branch.id)}
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
        <h2 className="text-2xl font-bold">Branch Management</h2>
        <Button onClick={() => setShowModal(true)}>Add Branch</Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search branches..."
          value={filters.search}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
        />
        {/* <select
          className="border rounded px-3 py-2"
          value={filters.is_active}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, is_active: e.target.value }))
          }
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select> */}
        <SelectInput
          options={[
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
          ]}
          value={filters.is_active}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, is_active: value }))
          }
          valueProp="value"
          labelProp="label"
          placeholder="Select Status"
        />
        {/* <select
          className="border rounded px-3 py-2"
          value={filters.is_headquarters}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, is_headquarters: e.target.value }))
          }
        >
          <option value="">All Branches</option>
          <option value="true">Headquarters</option>
          <option value="false">Regular Branches</option>
        </select> */}
        <SelectInput
          options={[
            { label: "Headquarters", value: "true" },
            { label: "Regular Branches", value: "false" },
          ]}
          value={filters.is_headquarters}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, is_headquarters: value }))
          }
          valueProp="value"
          labelProp="label"
          placeholder="Select Branches"
        />
        <Input
          placeholder="Filter by area..."
          value={filters.branch_area}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, branch_area: e.target.value }))
          }
        />
      </div>

      {/* Table */}
      <DataTable
        data={branches}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingBranch(null);
            resetForm();
          }}
          onSubmit={handleSubmit}
          title={editingBranch ? "Edit Branch" : "Add Branch"}
          size="xl"
          loading={loading}
        >
          <form id="branch-form" className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Branch Name"
                value={formData.branch_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    branch_name: e.target.value,
                  }))
                }
                required
              />
              <Input
                label="Branch Area"
                value={formData.branch_area}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    branch_area: e.target.value,
                  }))
                }
              />
              <Input
                label="Manager Name"
                value={formData.manager_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    manager_name: e.target.value,
                  }))
                }
              />
              <Input
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              <Input
                label="Contact Person"
                value={formData.contact_person}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact_person: e.target.value,
                  }))
                }
              />
              <Input
                label="Contact Phone"
                value={formData.contact_phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contact_phone: e.target.value,
                  }))
                }
              />
              <Input
                label="Capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    capacity: parseInt(e.target.value),
                  }))
                }
              />
              <Input
                label="Location Coordinates"
                value={formData.location_coordinates}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    location_coordinates: e.target.value,
                  }))
                }
                placeholder="lat,lng"
              />
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_headquarters"
                  checked={formData.is_headquarters}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_headquarters: e.target.checked,
                    }))
                  }
                />
                <label htmlFor="is_headquarters">Headquarters</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                />
                <label htmlFor="is_active">Active</label>
              </div>
              <div className="col-span-2">
                <textarea
                  className="border rounded px-3 py-2 w-full"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows="3"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default BranchList;

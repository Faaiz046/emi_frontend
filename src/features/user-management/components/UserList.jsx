import React, { useState, useEffect } from "react";
import { userApi } from "../../../services/user/api";
import { roleApi } from "../../../services/role/api";
import { branchApi } from "../../../services/branch/api";
import { injectReducer } from "../../../store";
import userReducer from "../../../store/slices/userSlice";
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
import { PAGINATION } from "../../../constants/app.constant";
import PageHeader from "../../../shared/components/ui/PageHeader";
import SelectInput from "../../../shared/components/ui/SelectInput";

// Inject reducer at module level
injectReducer("user", userReducer);

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    branch_ids: [],
    is_active: true,
    is_verified: false,
    profile_picture: "",
    emergency_contact: "",
    emergency_phone: "",
    employee_id: "",
    department: "",
    position: "",
    hire_date: "",
    salary: "",
    notes: "",
    preferences: {},
    role_id: "",
    primary_branch_id: "",
  });
  const [filters, setFilters] = useState({
    search: "",
    role_id: "",
    branch_ids: "",
    primary_branch_id: "",
    is_active: "",
    is_verified: "",
    department: "",
    position: "",
  });
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchBranches();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      if (response?.status) {
        setUsers(response.data.users || response.data);
        if (response.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      Toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await roleApi.getActive();
      if (response?.status) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await branchApi.getActive();
      if (response?.status) {
        setBranches(response.data);
      }
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingUser) {
        const response = await userApi.update(editingUser.id, formData);
        if (response?.status) {
          // Update the user in the local state
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === response?.data?.id ? response.data : user
            )
          );
          Toast.success("User updated successfully");
        }
      } else {
        const response = await userApi.create(formData);
        if (response?.status) {
          // Add the new user to the local state
          setUsers((prevUsers) => [response.data, ...prevUsers]);
          // Update pagination if needed
          setPagination((prev) => ({
            ...prev,
            total: prev.total + 1,
            totalPages: Math.ceil((prev.total + 1) / prev.limit),
          }));
          Toast.success("User created successfully");
        }
      }

      setShowModal(false);
      setEditingUser(null);
      resetForm();
    } catch (error) {
      console.error("Error saving user:", error);
      Toast.error(error.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      username: user.username || "",
      password: "",
      branch_ids: user.branch_ids || [],
      is_active: user.is_active ?? true,
      is_verified: user.is_verified ?? false,
      profile_picture: user.profile_picture || "",
      emergency_contact: user.emergency_contact || "",
      emergency_phone: user.emergency_phone || "",
      employee_id: user.employee_id || "",
      department: user.department || "",
      position: user.position || "",
      hire_date: user.hire_date || "",
      salary: user.salary || "",
      notes: user.notes || "",
      preferences: user.preferences || {},
      role_id: user.role_id || "",
      primary_branch_id: user.primary_branch_id || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await userApi.delete(id);
        if (response?.status) {
          // Remove the user from the local state
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
          // Update pagination
          setPagination((prev) => ({
            ...prev,
            total: prev.total - 1,
            totalPages: Math.ceil((prev.total - 1) / prev.limit),
          }));
          Toast.success("User deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        Toast.error("Failed to delete user");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      username: "",
      password: "",
      branch_ids: [],
      is_active: true,
      is_verified: false,
      profile_picture: "",
      emergency_contact: "",
      emergency_phone: "",
      employee_id: "",
      department: "",
      position: "",
      hire_date: "",
      salary: "",
      notes: "",
      preferences: {},
      role_id: "",
      primary_branch_id: "",
    });
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "username", label: "Username" },
    { key: "department", label: "Department" },
    { key: "position", label: "Position" },
    {
      key: "is_active",
      label: "Status",
      render: (value) => (value ? "Active" : "Inactive"),
    },
    {
      key: "is_verified",
      label: "Verified",
      render: (value) => (value ? "Yes" : "No"),
    },
    {
      key: "last_login",
      label: "Last Login",
      render: (value) => (value ? getFormattedDate(value) : "Never"),
    },
    {
      key: "created_at",
      label: "Created",
      render: (value) => getFormattedDate(value),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, user) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(user)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(user.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleFilter = (e) => {
    const searchText = (e?.target?.value || "").trim().toLowerCase();
    setSearchValue(searchText);
   
    if (searchText) {
      const filtered = (users || []).filter((data) => {
        const search = searchText.toLowerCase();
        return (
          (data?.name || "").toLowerCase().includes(search) ||
          (data?.email || "").toLowerCase().includes(search) ||
          (data?.username || "").toLowerCase().includes(search) ||
          (data?.department || "").toLowerCase().includes(search) ||
          (data?.position || "").toLowerCase().includes(search)
        );
      });
      setFilterData(filtered);
    } else {
      setFilterData([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={() => setShowModal(true)}>
          Add User
        </Button>
      </div> */}
      <PageHeader
        title="User Management"
        buttonLabel="Add User"
        onClick={() => setShowModal(true)}
      />

      {/* Filters */}
      <div className="w-[30%]">
        <Input
          placeholder="Search users..."
          value={searchValue}
          onChange={(e) =>
            handleFilter(e)
          }
        />
      
      </div>

      {/* Table */}
      <DataTable
        data={filterData.length > 0 ? filterData : users}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
      />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
          resetForm();
        }}
        onSubmit={handleSubmit}
        title={editingUser ? "Edit User" : "Add New User"}
        size="xl"
        loading={loading}
      >
        <form id="user-form" className="space-y-6" onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                leftIcon="user"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                placeholder="Enter full name"
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
                placeholder="Enter email address"
              />
              <Input
                label="Username"
                leftIcon="user"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                required
                placeholder="Choose a username"
              />
              {!editingUser && (
                <Input
                  label="Password"
                  type="password"
                  leftIcon="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                  showPasswordToggle={true}
                  placeholder="Enter password"
                />
              )}
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
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* Employment Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Employee ID"
                value={formData.employee_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    employee_id: e.target.value,
                  }))
                }
                placeholder="Enter employee ID"
              />
              <Input
                label="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                placeholder="Enter department"
              />
              <Input
                label="Position"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
                }
                placeholder="Enter position"
              />
              <Input
                label="Salary"
                type="number"
                value={formData.salary}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, salary: e.target.value }))
                }
                placeholder="Enter salary"
              />
              <Input
                label="Hire Date"
                type="date"
                leftIcon="calendar"
                value={formData.hire_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hire_date: new Date(e.target.value).toISOString(), 
                  }))
                }
                
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Role
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.role_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      role_id: e.target.value,
                    }))
                  }
                  required
                >
                  <option value="">Choose a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Emergency Contact Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Emergency Contact"
                value={formData.emergency_contact}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergency_contact: e.target.value,
                  }))
                }
                placeholder="Emergency contact name"
              />
              <Input
                label="Emergency Phone"
                leftIcon="phone"
                value={formData.emergency_phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergency_phone: e.target.value,
                  }))
                }
                placeholder="Emergency phone number"
              />
            </div>
          </div>

          {/* Branch Assignment */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Branch Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Primary Branch
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={formData.primary_branch_id}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      primary_branch_id: e.target.value,
                    }))
                  }
                >
                  <option value="">Choose primary branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branch_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
              Account Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
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
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-gray-700"
                >
                  Active Account
                </label>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="is_verified"
                  checked={formData.is_verified}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_verified: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label
                  htmlFor="is_verified"
                  className="text-sm font-medium text-gray-700"
                >
                  Verified User
                </label>
              </div>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default UserList;

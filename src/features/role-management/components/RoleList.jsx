import React, { useState, useEffect } from 'react';
import { roleApi } from '../../../services/role/api';
import { Button } from '../../../shared/components/ui/Button';
import { DataTable } from '../../../shared/components/ui/DataTable';
import { Modal } from '../../../shared/components/ui/Modal';
import Input from '../../../shared/components/ui/Input';
import Toast from '../../../utils/toast';
import { getFormattedDate } from '../../../utils/common';

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    level: 1,
    permissions: [],
    description: '',
    is_active: true
  });


  // Available permissions
  const availablePermissions = [
    'users.read', 'users.create', 'users.update', 'users.delete',
    'roles.read', 'roles.create', 'roles.update', 'roles.delete',
    'branches.read', 'branches.create', 'branches.update', 'branches.delete',
    'companies.read', 'companies.create', 'companies.update', 'companies.delete',
    'brands.read', 'brands.create', 'brands.update', 'brands.delete',
    'categories.read', 'categories.create', 'categories.update', 'categories.delete',
    'products.read', 'products.create', 'products.update', 'products.delete',
    'reports.read', 'settings.read', 'settings.update'
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await roleApi.getAll();
      
      if (response?.status) {
        setRoles(response.data.roles || response.data);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      Toast.error('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingRole) {
        const response = await roleApi.update(editingRole.id, formData);
        if (response?.status) {
          // Update the role in the local state
          setRoles(prevRoles => 
            prevRoles.map(role => 
              role.id === response?.data?.id 
                ? response.data
                : role
            )
          );
          Toast.success('Role updated successfully');
        }
      } else {
        const response = await roleApi.create(formData);
        if (response?.status) {
          // Add the new role to the local state
          setRoles(prevRoles => [response.data, ...prevRoles]);
          Toast.success('Role created successfully');
        }
      }
      
      setShowModal(false);
      setEditingRole(null);
      resetForm();
    } catch (error) {
      console.error('Error saving role:', error);
      Toast.error(error.message || 'Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      title: role.title || '',
      level: role.level || 1,
      permissions: role.permissions || [],
      description: role.description || '',
      is_active: role.is_active ?? true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        const response = await roleApi.delete(id);
        if (response?.status) {
          // Remove the role from the local state
          setRoles(prevRoles => prevRoles.filter(role => role.id !== id));
          Toast.success('Role deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting role:', error);
        Toast.error('Failed to delete role');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      level: 1,
      permissions: [],
      description: '',
      is_active: true
    });
  };

  const handlePermissionChange = (permission, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permission]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permission)
      }));
    }
  };

  const columns = [
    { key: 'title', label: 'Role Title' },
    { key: 'level', label: 'Level' },
    { key: 'description', label: 'Description' },
    { key: 'permissions', label: 'Permissions Count', 
      render: (value) => Array.isArray(value) ? value.length : 0 },
    { key: 'is_active', label: 'Status', 
      render: (value) => value ? 'Active' : 'Inactive' },
    { key: 'created_at', label: 'Created', 
      render: (value) => getFormattedDate(value) },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, role) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(role)}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(role.id)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Role Management</h2>
        <Button onClick={() => setShowModal(true)}>
          Add Role
        </Button>
      </div>



      {/* Table */}
      <DataTable
        data={roles}
        columns={columns}
        loading={loading}
      />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingRole(null);
          resetForm();
        }}
        onSubmit={handleSubmit}
        title={editingRole ? 'Edit Role' : 'Add Role'}
        size="xl"
        loading={loading}
      >
        <form id="role-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Role Title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
            <Input
              label="Level"
              type="number"
              min="1"
              max="5"
              value={formData.level}
              onChange={(e) => setFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
              required
            />
            <textarea
              className="border rounded px-3 py-2 col-span-2"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows="3"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              />
              <label htmlFor="is_active">Active</label>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
              {availablePermissions.map(permission => (
                <div key={permission} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={permission}
                    checked={formData.permissions.includes(permission)}
                    onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                  />
                  <label htmlFor={permission} className="text-sm">
                    {permission.replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RoleList; 
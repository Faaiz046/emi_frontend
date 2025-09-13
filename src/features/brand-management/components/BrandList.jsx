import React, { useState, useEffect } from 'react';
import { brandApi } from '../../../services/brand/api';
import { Button } from '../../../shared/components/ui/Button';
import { DataTable } from '../../../shared/components/ui/DataTable';
import { Modal } from '../../../shared/components/ui/Modal';
import Input from '../../../shared/components/ui/Input';
import FilePicker from '../../../shared/components/ui/FilePicker';
import Toast from '../../../utils/toast';
import { getFormattedDate } from '../../../utils/common';
import { PAGINATION } from '../../../constants/app.constant';
import SelectInput from '../../../shared/components/ui/SelectInput';
const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    is_active: true
  });
  const [filters, setFilters] = useState({
    search: '',
    is_active: '',
    name: '',
    country: '',
    email: ''
  });
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0
  });

  useEffect(() => {
    fetchBrands();
  }, [pagination.page, filters]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await brandApi.getAllBrands({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });
      
      if (response?.status) {
        setBrands(response.data.brands || response.data);
        if (response.data.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      Toast.error('Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingBrand) {
        const response = await brandApi.updateBrand(editingBrand.id, formData);
        if (response?.status) {
          // Update the brand in the local state
          setBrands(prevBrands => 
            prevBrands.map(brand => 
              brand.id === response?.data?.id 
                ? response.data
                : brand
            )
          );
          Toast.success('Brand updated successfully');
        }
      } else {
        const response = await brandApi.addBrand(formData);
        if (response?.status) {
          // Add the new brand to the local state
          setBrands(prevBrands => [response.data, ...prevBrands]);
          // Update pagination if needed
          setPagination(prev => ({
            ...prev,
            total: prev.total + 1,
            totalPages: Math.ceil((prev.total + 1) / prev.limit)
          }));
          Toast.success('Brand created successfully');
        }
      }
      
      setShowModal(false);
      setEditingBrand(null);
      resetForm();
    } catch (error) {
      console.error('Error saving brand:', error);
      Toast.error('Failed to save brand');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name || '',
      description: brand.description || '',
      logo: brand.logo || '',
      website: brand.website || '',
      email: brand.email || '',
      phone: brand.phone || '',
      address: brand.address || '',
      country: brand.country || '', 
      is_active: brand.is_active ?? true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        const response = await brandApi.deleteBrand(id);
        if (response?.status) {
          // Remove the brand from the local state
          setBrands(prevBrands => prevBrands.filter(brand => brand.id !== id));
          // Update pagination
          setPagination(prev => ({
            ...prev,
            total: prev.total - 1,
            totalPages: Math.ceil((prev.total - 1) / prev.limit)
          }));
          Toast.success('Brand deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting brand:', error);
        Toast.error('Failed to delete brand');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo: '',
      website: '',
      email: '',
      phone: '',
      address: '',
      country: '',
      is_active: true
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        logo: file
      }));
    }
  };

  const columns = [
    {
      key: 'logo',
      label: 'Logo',
      render: (value, row) =>
        value ? (
          <img
            src={value}
            alt={row.name || 'brand logo'}
            className="h-10 w-10 rounded object-cover border"
          />
        ) : (
          '-'
        ),
    },
    { key: 'name', label: 'Brand Name' },
    { key: 'description', label: 'Description' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'country', label: 'Country' },
    { key: 'is_active', label: 'Status', 
      render: (value) => value ? 'Active' : 'Inactive' },
    { key: 'created_at', label: 'Created', 
      render: (value) => getFormattedDate(value) },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, brand) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(brand)}>
            Edit
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(brand.id)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  const handleFilter = (e) => {
    const searchText = (e?.target?.value || "").trim().toLowerCase();
    setSearchValue(searchText);
   
    if (searchText) {
      const filtered = (brands || []).filter((data) => {
        const search = searchText.toLowerCase();
        return (
          (data?.name || "").toLowerCase().includes(search) ||
          (data?.email || "").toLowerCase().includes(search) ||
          (data?.phone || "").toLowerCase().includes(search) ||
          (data?.country || "").toLowerCase().includes(search) 
         
        );
      });
      setFilterData(filtered);
    } else {
      setFilterData([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Brand Management</h2>
        <Button onClick={() => setShowModal(true)}>
          Add Brand
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search brands..."
          value={filters.search}
          // onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          onChange={(e) => handleFilter(e)}
        />
        {/* <select
          className="border rounded px-3 py-2"
          value={filters.is_active}
          onChange={(e) => setFilters(prev => ({ ...prev, is_active: e.target.value }))}
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select> */}
        {/* <SelectInput
          options={[{ label: 'Active', value: 'true' }, { label: 'Inactive', value: 'false' }]}
          value={filters.is_active}
          onChange={(value) => setFilters(prev => ({ ...prev, is_active: value }))}
          valueProp="value"
          labelProp="label"
        />
        <Input
          placeholder="Filter by name..."
          value={filters.name}
          onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
        />
        <Input
          placeholder="Filter by country..."
          value={filters.country}
          onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
        /> */}
      </div>

      {/* Table */}
      <DataTable
        data={filterData.length > 0 ? filterData : brands}
        columns={columns}
        loading={loading}
        pagination={pagination}
        onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
      />

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingBrand(null);
          resetForm();
        }}
        onSubmit={handleSubmit}
        title={editingBrand ? 'Edit Brand' : 'Add Brand'}
        size="xl"
        loading={loading}
      >
        <form id="brand-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Brand Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
            <Input
              label="Website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
            />
            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
            <div className="col-span-2">
              <FilePicker
                label="Logo"
                accept="image/*"
                value={formData.logo}
                onChange={(file) => setFormData(prev => ({ ...prev, logo: file }))}
                onRemove={() => setFormData(prev => ({ ...prev, logo: '' }))}
                description="PNG/JPG/WebP, up to 2MB recommended"
              />
            </div>
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
        </form>
      </Modal>
    </div>
  );
};

export default BrandList; 
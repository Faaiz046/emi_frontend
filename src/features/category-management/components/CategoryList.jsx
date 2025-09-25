import React, { useState, useEffect } from "react";
import { categoryApi } from "../../../services/category/api";
import { Button } from "../../../shared/components/ui/Button";
import { DataTable } from "../../../shared/components/ui/DataTable";
import { Modal } from "../../../shared/components/ui/Modal";
import Input from "../../../shared/components/ui/Input";
import FilePicker from "../../../shared/components/ui/FilePicker";
import Toast from "../../../utils/toast";
import { getFormattedDate } from "../../../utils/common";
import { PAGINATION } from "../../../constants/app.constant";
import { APP_CONFIG } from "../../../config";
import SelectInput from "../../../shared/components/ui/SelectInput";

const CategoryList = () => {
  const buildImageUrl = (path) => {
    if (!path) return "";
    if (typeof path !== "string") return "";
    if (/^https?:\/\//i.test(path)) return path;
    const base = APP_CONFIG.api.baseUrl.replace(/\/api$/, "");
    return `${base}/${path.replace(/^\/+/, "")}`;
  };
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
    category_code: "",
    is_active: true,
  });
  const [filters, setFilters] = useState({
    search: "",
    is_active: "",
    category_code: "",
  });
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, [pagination.page, filters]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAllCategories({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      if (response?.status) {
        setCategories(response.data.categories || response.data);
        if (response.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Toast.error(error?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingCategory) {
        const response = await categoryApi.updateCategory(editingCategory.id, formData);
        if (response?.status) {
          // Update the category in the local state
          setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category.id === response?.data?.id ? response.data : category
            )
          );
          Toast.success("Category updated successfully");
        } else {
          Toast.error(response?.message || "Failed to update category");
        }
      } else {
          const response = await categoryApi.createCategory(formData);
          if (response?.status) {
          // Add the new category to the local state
          setCategories((prevCategories) => [response.data, ...prevCategories]);
          // Update pagination if needed
          setPagination((prev) => ({
            ...prev,
            total: prev.total + 1,
            totalPages: Math.ceil((prev.total + 1) / prev.limit),
          }));
          Toast.success("Category created successfully");
        } else {
          Toast.error(response?.message || "Failed to create category");
        }
      }

      setShowModal(false);
      setEditingCategory(null);
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      Toast.error(error?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      logo: category.logo || "",
      category_code: category.category_code || "",
      is_active: category.is_active ?? true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const response = await categoryApi.deleteCategory(id);
        if (response?.status) {
          // Remove the category from the local state
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category.id !== id)
          );
          // Update pagination
          setPagination((prev) => ({
            ...prev,
            total: prev.total - 1,
            totalPages: Math.ceil((prev.total - 1) / prev.limit),
          }));
          Toast.success("Category deleted successfully");
        } else {
          Toast.error(response?.message || "Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        Toast.error(error?.message || "Failed to delete category");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      logo: "",
      category_code: "",
      is_active: true,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));
    }
  };

  const generateCategoryCode = () => {
    const code = formData.name
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .substring(0, 6);
    setFormData((prev) => ({
      ...prev,
      category_code: code,
    }));
  };

  const columns = [
    {
      key: "logo",
      label: "Logo",
      render: (value, row) =>
        value ? (
          <img
            src={buildImageUrl(value)}
            alt={row.name || "category logo"}
            className="h-10 w-10 rounded object-cover border"
          />
        ) : (
          "-"
        ),
    },
    { key: "name", label: "Category Name" },
    { key: "category_code", label: "Code" },
    { key: "description", label: "Description" },
    {
      key: "is_active",
      label: "Status",
      render: (value) => (value ? "Active" : "Inactive"),
    },
    { key: "products_count", label: "Products", render: (value) => value || 0 },
    {
      key: "created_at",
      label: "Created",
      render: (value) => getFormattedDate(value),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, category) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(category)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(category.id)}
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
      const filtered = (categories || []).filter((data) => {
        const search = searchText.toLowerCase();
        return (
          (data?.name || "").toLowerCase().includes(search) ||
          (data?.category_code || "").toLowerCase().includes(search) ||
          (data?.description || "").toLowerCase().includes(search) ||
          (data?.is_active || "").toLowerCase().includes(search) ||
          (data?.products_count || "").toLowerCase().includes(search) 
         
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
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Button onClick={() => setShowModal(true)}>Add Category</Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search categories..."
          value={filters.search}
          onChange={(e) =>
            // setFilters((prev) => ({ ...prev, search: e.target.value }))
            handleFilter(e)
          }
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
        {/* <Input
          placeholder="Filter by code..."
          value={filters.category_code}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category_code: e.target.value }))
          }
        /> */}
        {/* <SelectInput
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
        /> */}
      </div>

      {/* Table */}
      <DataTable
        data={filterData.length > 0 ? filterData : categories}
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
          setEditingCategory(null);
          resetForm();
        }}
        onSubmit={handleSubmit}
        title={editingCategory ? "Edit Category" : "Add Category"}
        size="xl"
        loading={loading}
      >
        <form id="category-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Category Name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <div className="col-span-2">
              <FilePicker
                label="Logo"
                accept="image/*"
                value={formData.logo}
                onChange={(file) =>
                  setFormData((prev) => ({ ...prev, logo: file }))
                }
                onRemove={() => setFormData((prev) => ({ ...prev, logo: "" }))}
                description="PNG/JPG/WebP, up to 2MB recommended"
              />
            </div>
            <textarea
              className="border rounded px-3 py-2 col-span-2"
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
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryList;

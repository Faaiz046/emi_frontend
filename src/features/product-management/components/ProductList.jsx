import React, { useState, useEffect } from "react";
import { productApi } from "../../../services/product/api";
import { categoryApi } from "../../../services/category/api";
import { brandApi } from "../../../services/brand/api";
import { Button } from "../../../shared/components/ui/Button";
import { DataTable } from "../../../shared/components/ui/DataTable";
import { Modal } from "../../../shared/components/ui/Modal";
import Input from "../../../shared/components/ui/Input";
import FilePicker from "../../../shared/components/ui/FilePicker";
import Toast from "../../../utils/toast";
import { getFormattedDate } from "../../../utils/common";
import { PAGINATION } from "../../../constants/app.constant";
import SelectInput from "../../../shared/components/ui/SelectInput";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filterData, setFilterData] = useState([]);
  const [formData, setFormData] = useState({
    category_id: "",
    brand_id: "",
    name: "",
    model: "",
    in_stock: 0,
    cash_price: "",
    installment_price: "",
    unit_price: "",
    advance: "",
    cost_price: "",
    profit_margin: "",
    incentive: "",
    duration: "",
    monthly_installment: "",
    fine: "",
    notes: "",
    specifications: "",
    warranty_period: "",
    minimum_stock: 0,
    is_active: true,
    images: [],
  });
  const [filters, setFilters] = useState({
    search: "",
    category_id: "",
    brand_id: "",
    is_active: "",
    in_stock_min: "",
    in_stock_max: "",
    price_min: "",
    price_max: "",
  });
  const [pagination, setPagination] = useState({
    page: PAGINATION.DEFAULT_PAGE,
    limit: PAGINATION.DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, [pagination.page, filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      if (response?.status) {
        setProducts(response.data.products || response.data);
        if (response.data.pagination) {
          setPagination((prev) => ({
            ...prev,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      Toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      if (response?.status) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await brandApi.getAll();
      if (response?.status) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (editingProduct) {
        const response = await productApi.update(editingProduct.id, formData);
        if (response?.status) {
          // Update the product in the local state
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === response?.data?.id ? response.data : product
            )
          );
          Toast.success("Product updated successfully");
        }
      } else {
        const response = await productApi.create(formData);
        if (response?.status) {
          // Add the new product to the local state
          setProducts((prevProducts) => [response.data, ...prevProducts]);
          // Update pagination if needed
          setPagination((prev) => ({
            ...prev,
            total: prev.total + 1,
            totalPages: Math.ceil((prev.total + 1) / prev.limit),
          }));
          Toast.success("Product created successfully");
        }
      }

      setShowModal(false);
      setEditingProduct(null);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      Toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      category_id: product.category_id || "",
      brand_id: product.brand_id || "",
      name: product.name || "",
      model: product.model || "",
      in_stock: product.in_stock || 0,
      cash_price: product.cash_price || "",
      installment_price: product.installment_price || "",
      unit_price: product.unit_price || "",
      advance: product.advance || "",
      cost_price: product.cost_price || "",
      profit_margin: product.profit_margin || "",
      incentive: product.incentive || "",
      duration: product.duration || "",
      monthly_installment: product.monthly_installment || "",
      fine: product.fine || "",
      notes: product.notes || "",
      specifications: product.specifications || "",
      warranty_period: product.warranty_period || "",
      minimum_stock: product.minimum_stock || 0,
      is_active: product.is_active ?? true,
      images: product.images || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await productApi.delete(id);
        if (response?.status) {
          // Remove the product from the local state
          setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== id)
          );
          // Update pagination
          setPagination((prev) => ({
            ...prev,
            total: prev.total - 1,
            totalPages: Math.ceil((prev.total - 1) / prev.limit),
          }));
          Toast.success("Product deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        Toast.error("Failed to delete product");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      category_id: "",
      brand_id: "",
      name: "",
      model: "",
      in_stock: 0,
      cash_price: "",
      installment_price: "",
      unit_price: "",
      advance: "",
      cost_price: "",
      profit_margin: "",
      incentive: "",
      duration: "",
      monthly_installment: "",
      fine: "",
      notes: "",
      specifications: "",
      warranty_period: "",
      minimum_stock: 0,
      is_active: true,
      images: [],
    });
  };

  const handleFileChange = (files) => {
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const columns = [
    { key: "name", label: "Product Name" },
    { key: "model", label: "Model" },
    { key: "in_stock", label: "Stock" },
    {
      key: "cash_price",
      label: "Cash Price",
      render: (value) => (value ? `$${parseFloat(value).toFixed(2)}` : "N/A"),
    },
    {
      key: "installment_price",
      label: "Installment Price",
      render: (value) => (value ? `$${parseFloat(value).toFixed(2)}` : "N/A"),
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
      render: (_, product) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => handleEdit(product)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(product.id)}
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
          (data?.model || "").toLowerCase().includes(search) ||
          (data?.in_stock || "").toLowerCase().includes(search) ||
          (data?.cash_price || "").toLowerCase().includes(search) ||
          (data?.installment_price || "").toLowerCase().includes(search)
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
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Product
        </Button>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) =>
              // setFilters((prev) => ({ ...prev, search: e.target.value }))
              handleFilter(e)
            }
            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
          {/* <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={filters.category_id}
            onChange={(e) => setFilters(prev => ({ ...prev, category_id: e.target.value }))}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select> */}
          {/* <SelectInput
            options={categories.map(category => ({ label: category.name, value: category.id }))}
            value={filters.category_id}
            onChange={(value) => setFilters(prev => ({ ...prev, category_id: value }))}
            valueProp="value"
            labelProp="label"
            placeholder="Select Category"
          /> */}
          {/* <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={filters.brand_id}
            onChange={(e) => setFilters(prev => ({ ...prev, brand_id: e.target.value }))}
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select> */}
          {/* <SelectInput
            options={brands.map(brand => ({ label: brand.name, value: brand.id }))}
            value={filters.brand_id}
            onChange={(value) => setFilters(prev => ({ ...prev, brand_id: value }))}
            valueProp="value"
            labelProp="label"
            placeholder="Select Brand"
          /> */}
          {/* <select
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={filters.is_active}
            onChange={(e) => setFilters(prev => ({ ...prev, is_active: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select> */}
          {/* <SelectInput
            options={[
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ]}
            value={filters.is_active}
            onChange={(value) => setFilters(prev => ({ ...prev, is_active: value }))}
            valueProp="value"
            labelProp="label"
            placeholder="Select Status"
          /> */}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
        <DataTable
          data={filterData.length > 0 ? filterData : products}
          columns={columns}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination((prev) => ({ ...prev, page }))}
        />
      </div>

      {/* Enhanced Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
          resetForm();
        }}
        onSubmit={handleSubmit}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="6xl"
        loading={loading}
      >
        <form id="product-form" className="space-y-6" onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                label="Model"
                value={formData.model}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, model: e.target.value }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.category_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category_id: e.target.value,
                  }))
                }
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={formData.brand_id}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, brand_id: e.target.value }))
                }
                required
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock & Inventory Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              Stock & Inventory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Stock Quantity"
                type="number"
                value={formData.in_stock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    in_stock: parseInt(e.target.value),
                  }))
                }
                required
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                label="Minimum Stock"
                type="number"
                value={formData.minimum_stock}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minimum_stock: parseInt(e.target.value),
                  }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              Pricing & Financial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Cash Price"
                type="number"
                step="0.01"
                value={formData.cash_price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cash_price: e.target.value,
                  }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                label="Installment Price"
                type="number"
                step="0.01"
                value={formData.installment_price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    installment_price: e.target.value,
                  }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                label="Unit Price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    unit_price: e.target.value,
                  }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                label="Advance Payment"
                type="number"
                step="0.01"
                value={formData.advance}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, advance: e.target.value }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                label="Cost Price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    cost_price: e.target.value,
                  }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                label="Profit Margin (%)"
                type="number"
                step="0.01"
                value={formData.profit_margin}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    profit_margin: e.target.value,
                  }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Installment Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Installment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Duration (months)"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, duration: e.target.value }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                label="Monthly Installment"
                type="number"
                step="0.01"
                value={formData.monthly_installment}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    monthly_installment: e.target.value,
                  }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                label="Fine Amount"
                type="number"
                step="0.01"
                value={formData.fine}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, fine: e.target.value }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Input
                label="Incentive"
                type="number"
                step="0.01"
                value={formData.incentive}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    incentive: e.target.value,
                  }))
                }
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Additional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Warranty Period"
                value={formData.warranty_period}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    warranty_period: e.target.value,
                  }))
                }
                placeholder="e.g., 1 year, 6 months"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-3">
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
                  Product is Active
                </label>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Additional notes about the product..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Product specifications and technical details..."
                  value={formData.specifications}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      specifications: e.target.value,
                    }))
                  }
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Product Images Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-pink-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Product Images
            </h3>
            <FilePicker
              label="Product Images"
              accept="image/*"
              multiple={true}
              value={formData.images}
              onChange={handleFileChange}
              onRemove={() => setFormData((prev) => ({ ...prev, images: [] }))}
              description="Upload multiple product images (PNG, JPG, GIF). Drag & drop or click to browse."
              className="w-full"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductList;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Input from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { leaseAccountApi } from "../../../services/lease-account";
import toast from "../../../utils/toast";
import { useNavigate } from "react-router-dom";
import { productApi } from "../../../services/product";
import { userApi } from "../../../services/user/api";
import FilePicker from "../../../shared/components/ui/FilePicker";
import { PROCESS_TYPE } from "../../../constants/app.constant";

// Image upload options
const IMAGE_TYPES = [
  { key: "form_pic", label: "Form Picture", description: "Main form image" },
  {
    key: "customer_card_front",
    label: "Customer Card Front",
    description: "Front side of customer ID card",
  },
  {
    key: "customer_card_back",
    label: "Customer Card Back",
    description: "Back side of customer ID card",
  },
  {
    key: "g1_card_front",
    label: "Guarantor 1 Card Front",
    description: "Front side of G1 ID card",
  },
  {
    key: "g1_card_back",
    label: "Guarantor 1 Card Back",
    description: "Back side of G1 ID card",
  },
  {
    key: "g2_card_front",
    label: "Guarantor 2 Card Front",
    description: "Front side of G2 ID card",
  },
  {
    key: "g2_card_back",
    label: "Guarantor 2 Card Back",
    description: "Back side of G2 ID card",
  },
  {
    key: "g3_card_front",
    label: "Guarantor 3 Card Front",
    description: "Front side of G3 ID card",
  },
  {
    key: "g3_card_back",
    label: "Guarantor 3 Card Back",
    description: "Back side of G3 ID card",
  },
  {
    key: "warranty_card_pic",
    label: "Warranty Card",
    description: "Product warranty card image",
  },
  {
    key: "picture_url",
    label: "Additional Picture",
    description: "Any other relevant image",
  },
];

const AccountsPage = () => {
  const { account_id } = useParams(); // Get ID from route parameters
  const navigate = useNavigate();
  console.log("🚀 ~ AccountsPage ~ account_id:", account_id)
  const [loading, setLoading] = useState(false);

  const initialValues = {
    // Product & Financial Information
    product_id: "",
    process_type: "Monthly",
    date: new Date().toISOString().split("T")[0],
    process_date: new Date().toISOString(),
    cust_date: new Date().toISOString(),
    account_date: new Date().toISOString(),
    brand: "",
    category: "",
    cash_price: "",
    installment_price: "",
    advance: "",
    monthly_installment: "",
    duration: "",
    process_fee: "",
    notes: "",

    // Customer Information
    customer_name: "",
    son_of: "",
    nic: "",
    occupation: "",

    // Contact & Address Information
    office_address: "",
    residential_address: "",
    cell_no: "",
    office_phone: "",
    residential_phone: "",

    // Guarantor Information
    g1_name: "",
    g1_son_of: "",
    g1_nic: "",
    g1_occupation: "",
    g1_office_address: "",
    g1_residential_address: "",
    g1_cell: "",
    g1_res_phone: "",
    g2_name: "",
    g2_son_of: "",
    g2_nic: "",
    g2_occupation: "",
    g2_office_address: "",
    g2_residential_address: "",
    g2_cell: "",
    g2_res_phone: "",
    g3_name: "",
    g3_son_of: "",
    g3_nic: "",
    g3_occupation: "",
    g3_office_address: "",
    g3_residential_address: "",
    g3_cell: "",
    g3_res_phone: "",

    // Banking & Documentation
    cheque_number: "",
    cheque_amount: "",
    stamp_paper: false,
    bank_name: "",
    serial_no_1: "",
    serial_no_2: "",
    warranty_card: false,
    custom_fields: "",

    // Account & Processing Details
    total_received: "",
    pending_advance: "",
    remaining_balance: "",
    inquiry_officer_id: "",
    marketing_officer_id: "",
    is_stock_delivered: false,
    remarks: "",

    // General
    is_active: true,
  };

  const [formData, setFormData] = useState(initialValues);
  const [images, setImages] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showGuarantorInfo, setShowGuarantorInfo] = useState(false);
  const [showBankingInfo, setShowBankingInfo] = useState(false);
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);
  const [showImagesSection, setShowImagesSection] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [previewImageType, setPreviewImageType] = useState("");
  const [fileInputKey, setFileInputKey] = useState(0);
  const [customFields, setCustomFields] = useState([]);

  useEffect(() => {
    // Check if we're in edit mode
    if (account_id) {
      loadAccountData(account_id);
    }
  }, [account_id]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await productApi.getSearch();
        const list = res?.data || res || [];
        setProducts(Array.isArray(list) ? list : []);
      } catch (error) {
        toast.error(error?.message || "Failed to load products");
      }
    };

    const loadUsers = async () => {
      try {
        const res = await userApi.getAll({ limit: 1000 }); // Load all users
        const list = res?.data || res || [];
        setUsers(Array.isArray(list) ? list : []);
      } catch (error) {
        toast.error(error?.message || "Failed to load users");
      }
    };

    loadProducts();
    loadUsers();
  }, []);

  const loadAccountData = async (id) => {
    try {
      setLoading(true);
      const res = await leaseAccountApi.getById({id});
      const accountData = res?.data || res;

      if (accountData) {
        // Transform the data to match form structure
        const transformedData = {
          // Product & Financial Information
          product_id: accountData.product_id?.toString() || "",
          process_type: accountData.process_type || "Monthly",
          date: accountData.date
            ? new Date(accountData.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          process_date: accountData.process_date || new Date().toISOString(),
          cust_date: accountData.cust_date || new Date().toISOString(),
          account_date: accountData.account_date || new Date().toISOString(),
          brand: accountData.brand || "",
          category: accountData.category || "",
          cash_price: accountData.cash_price?.toString() || "",
          installment_price: accountData.installment_price?.toString() || "",
          advance: accountData.advance?.toString() || "",
          monthly_installment:
            accountData.monthly_installment?.toString() || "",
          duration: accountData.duration?.toString() || "",
          process_fee: accountData.process_fee?.toString() || "",
          notes: accountData.notes || "",

          // Customer Information
          customer_name: accountData.customer_name || "",
          son_of: accountData.son_of || "",
          nic: accountData.nic || "",
          occupation: accountData.occupation || "",

          // Contact & Address Information
          office_address: accountData.office_address || "",
          residential_address: accountData.residential_address || "",
          cell_no: accountData.cell_no || "",
          office_phone: accountData.office_phone || "",
          residential_phone: accountData.residential_phone || "",

          // Guarantor Information
          g1_name: accountData.g1_name || "",
          g1_son_of: accountData.g1_son_of || "",
          g1_nic: accountData.g1_nic || "",
          g1_occupation: accountData.g1_occupation || "",
          g1_office_address: accountData.g1_office_address || "",
          g1_residential_address: accountData.g1_residential_address || "",
          g1_cell: accountData.g1_cell || "",
          g1_res_phone: accountData.g1_res_phone || "",
          g2_name: accountData.g2_name || "",
          g2_son_of: accountData.g2_son_of || "",
          g2_nic: accountData.g2_nic || "",
          g2_occupation: accountData.g2_occupation || "",
          g2_office_address: accountData.g2_office_address || "",
          g2_residential_address: accountData.g2_residential_address || "",
          g2_cell: accountData.g2_cell || "",
          g2_res_phone: accountData.g2_res_phone || "",
          g3_name: accountData.g3_name || "",
          g3_son_of: accountData.g3_son_of || "",
          g3_nic: accountData.g3_nic || "",
          g3_occupation: accountData.g3_occupation || "",
          g3_office_address: accountData.g3_office_address || "",
          g3_residential_address: accountData.g3_residential_address || "",
          g3_cell: accountData.g3_cell || "",
          g3_res_phone: accountData.g3_res_phone || "",

          // Banking & Documentation
          cheque_number: accountData.cheque_number || "",
          cheque_amount: accountData.cheque_amount?.toString() || "",
          stamp_paper: accountData.stamp_paper || false,
          bank_name: accountData.bank_name || "",
          serial_no_1: accountData.serial_no_1 || "",
          serial_no_2: accountData.serial_no_2 || "",
          warranty_card: accountData.warranty_card || false,
          custom_fields: accountData.custom_fields || "",

          // Account & Processing Details
          total_received: accountData.total_received?.toString() || "",
          pending_advance: accountData.pending_advance?.toString() || "",
          remaining_balance: accountData.remaining_balance?.toString() || "",
          inquiry_officer_id: accountData.inquiry_officer_id?.toString() || "",
          marketing_officer_id:
            accountData.marketing_officer_id?.toString() || "",
          is_stock_delivered: accountData.is_stock_delivered || false,
          remarks: accountData.remarks || "",

          // General
          is_active:
            accountData.is_active !== undefined ? accountData.is_active : true,
        };

        setFormData(transformedData);

        // Handle custom fields if they exist
        if (
          accountData.custom_fields &&
          typeof accountData.custom_fields === "object"
        ) {
          const customFieldsArray = Object.entries(
            accountData.custom_fields
          ).map(([key, value], index) => ({
            id: Date.now() + index,
            label: key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            value: value,
          }));
          setCustomFields(customFieldsArray);
        }

        // Handle images if they exist
        if (accountData.images) {
          setImages(accountData.images);
        }

        toast.success("Account data loaded successfully");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to load account data");
      // If loading fails, redirect back to accounts list
      navigate("/accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      const inputs = e.target.form.querySelectorAll("input, select, textarea");
      const currentIndex = Array.from(inputs).indexOf(e.target);
      const nextInput = inputs[currentIndex + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle product selection and auto-populate fields
    if (name === "product_id") {
      const selectedProduct = products.find((p) => p.id === Number(value));
      if (selectedProduct) {
        console.log("Selected product:", selectedProduct);
        setFormData((prev) => {
          const installmentPrice = selectedProduct.installment_price || "";
          const advance = selectedProduct.advance || "";
          let remainingBalance = "";

          if (installmentPrice && advance) {
            const remaining = Number(installmentPrice) - Number(advance);
            remainingBalance = remaining >= 0 ? remaining.toString() : "0";
          }

          return {
            ...prev,
            product_id: value,
            brand: selectedProduct.brand?.name || "",
            category: selectedProduct.category?.name || "",
            cash_price: selectedProduct.cash_price || "",
            installment_price: installmentPrice,
            advance: advance,
            monthly_installment: selectedProduct.monthly_installment || "",
            duration: selectedProduct.duration || "",
            remaining_balance: remainingBalance,
          };
        });
        return;
      }
    }

    // Handle date synchronization - update all three date fields
    if (name === "date") {
      setFormData((prev) => ({ ...prev, date: value }));
      return;
    }

    // Handle checkbox inputs
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    // Handle regular inputs
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      // Auto-calculate remaining balance when installment_price or advance changes
      if (name === "installment_price" || name === "advance") {
        const installmentPrice =
          name === "installment_price" ? value : prev.installment_price;
        const advance = name === "advance" ? value : prev.advance;

        if (installmentPrice && advance) {
          const remaining = Number(installmentPrice) - Number(advance);
          newData.remaining_balance =
            remaining >= 0 ? remaining.toString() : "0";
        } else {
          newData.remaining_balance = "";
        }
      }

      return newData;
    });
  };

  const onFileChange = (e) => {
    const { name, files } = e.target;
    setImages((prev) => ({
      ...prev,
      [name]: files && files.length > 1 ? Array.from(files) : files[0],
    }));
  };

  const handleSmartImageUpload = (file) => {
    console.log("handleSmartImageUpload called with:", file);
    console.log("selectedImageType:", selectedImageType);

    if (selectedImageType && file) {
      console.log("Processing upload for:", selectedImageType);

      if (selectedImageType === "picture_url") {
        // Handle the special case for picture_url
        console.log("Setting picture_url to:", file.name);
        setFormData((prev) => ({
          ...prev,
          picture_url: file.name,
        }));
      } else {
        // Handle regular image types
        console.log("Setting image for:", selectedImageType);
        setImages((prev) => ({
          ...prev,
          [selectedImageType]: file,
        }));
      }

      console.log("Upload completed successfully");
      setSelectedImageType("");
      // Don't reset selection - keep it so the card shows as uploaded
      // setSelectedImageType('');
    } else {
      console.error("Missing selectedImageType or file:", {
        selectedImageType,
        file,
      });
    }
  };

  const handleImagePreview = (imageType) => {
    let imageToPreview = null;

    if (imageType === "picture_url") {
      imageToPreview = formData.picture_url;
    } else {
      imageToPreview = images[imageType];
    }

    if (imageToPreview) {
      setPreviewImage(imageToPreview);
      setPreviewImageType(imageType);
    }
  };

  const closePreview = () => {
    setPreviewImage(null);
    setPreviewImageType("");
  };

  const handleCardClick = (imageType) => {
    console.log("Card clicked:", imageType);
    console.log("Current selectedImageType:", selectedImageType);
    console.log("Current images:", images);

    const isUploaded =
      imageType === "picture_url"
        ? !!formData.picture_url
        : !!images[imageType];

    console.log("Is uploaded:", isUploaded);

    if (isUploaded) {
      // If image is already uploaded, show preview
      console.log("Showing preview for uploaded image");
      handleImagePreview(imageType);
    } else if (selectedImageType === imageType) {
      // If this card is already selected, trigger file selection again
      console.log("Card already selected, triggering file selection again");
      setFileInputKey((prev) => prev + 1);
      setTimeout(() => {
        const fileInput = document.getElementById("hidden-file-input");
        console.log("File input element:", fileInput);
        if (fileInput) {
          fileInput.click();
        } else {
          console.error("File input not found!");
        }
      }, 100);
    } else {
      // If no image and not selected, trigger file selection
      console.log("Setting selectedImageType and triggering file selection");
      setSelectedImageType(imageType);
      setFileInputKey((prev) => prev + 1);
      setTimeout(() => {
        const fileInput = document.getElementById("hidden-file-input");
        console.log("File input element:", fileInput);
        if (fileInput) {
          fileInput.click();
        } else {
          console.error("File input not found!");
        }
      }, 100);
    }
  };

  // Custom Fields Functions
  const addCustomField = () => {
    setCustomFields((prev) => [
      ...prev,
      { id: Date.now(), label: "", value: "" },
    ]);
  };

  const removeCustomField = (id) => {
    setCustomFields((prev) => prev.filter((field) => field.id !== id));
  };

  const updateCustomField = (id, field, newValue) => {
    setCustomFields((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: newValue } : item
      )
    );
  };

  const formatCustomFieldLabel = (label) => {
    return label.replace(/\s+/g, "_").toLowerCase();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Parse optional JSON custom_fields
      let parsedCustomFields = {};
      if (formData.custom_fields) {
        try {
          parsedCustomFields = JSON.parse(formData.custom_fields);
        } catch (err) {
          parsedCustomFields = {};
        }
      }

      // Prepare payload with numeric conversions
      const payload = {
        ...formData,
        // Convert numeric fields
        product_id:
          formData.product_id !== "" ? Number(formData.product_id) : undefined,
        cash_price:
          formData.cash_price !== "" ? Number(formData.cash_price) : undefined,
        installment_price:
          formData.installment_price !== ""
            ? Number(formData.installment_price)
            : undefined,
        advance: formData.advance !== "" ? Number(formData.advance) : undefined,
        monthly_installment:
          formData.monthly_installment !== ""
            ? Number(formData.monthly_installment)
            : undefined,
        duration:
          formData.duration !== "" ? Number(formData.duration) : undefined,
        process_fee:
          formData.process_fee !== ""
            ? Number(formData.process_fee)
            : undefined,
        cheque_amount:
          formData.cheque_amount !== ""
            ? Number(formData.cheque_amount)
            : undefined,
        total_received:
          formData.total_received !== ""
            ? Number(formData.total_received)
            : undefined,
        pending_advance:
          formData.pending_advance !== ""
            ? Number(formData.pending_advance)
            : undefined,
        remaining_balance:
          formData.remaining_balance !== ""
            ? Number(formData.remaining_balance)
            : undefined,
        inquiry_officer_id:
          formData.inquiry_officer_id !== ""
            ? Number(formData.inquiry_officer_id)
            : undefined,
        marketing_officer_id:
          formData.marketing_officer_id !== ""
            ? Number(formData.marketing_officer_id)
            : undefined,
        // Convert custom fields to JSON format
        custom_fields: customFields.reduce((acc, field) => {
          if (field.label && field.value) {
            acc[formatCustomFieldLabel(field.label)] = field.value;
          }
          return acc;
        }, {}),
        // Add images
        images,
      };
      console.log("🚀 ~ onSubmit ~ payload:", payload);

      if (account_id) {
        // Check if id exists (meaning it's an edit)
        await leaseAccountApi.updateLeaseAccount(account_id, payload);
        toast.success("Lease account updated successfully");
      } else {
        const res = await leaseAccountApi.createLeaseAccount(payload);
        toast.success("Lease account created successfully");
      }

      // Redirect back to accounts list
      navigate("/accounts");
    } catch (error) {
      const action = account_id ? "update" : "create";
      toast.error(error?.message || `Failed to ${action} lease account`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {account_id ? "Edit Lease Account" : "Create Lease Account"}
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading account data...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Customer Name"
                name="customer_name"
                value={formData.customer_name}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <Input
                label="SO"
                name="son_of"
                value={formData.son_of}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <Input
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={onChange}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          {/* Quick Summary - Always Visible */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-3">
                Quick Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Product:</span>
                  <div className="font-medium text-gray-800">
                    {formData.product_id
                      ? products.find(
                          (p) => p.id === Number(formData.product_id)
                        )?.name || "Selected"
                      : "Not Selected"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Installment Price:</span>
                  <div className="font-medium text-gray-800">
                    {formData.installment_price
                      ? `$${formData.installment_price}`
                      : "Not Set"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Advance:</span>
                  <div className="font-medium text-gray-800">
                    {formData.advance ? `$${formData.advance}` : "Not Set"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Remaining Balance:</span>
                  <div className="font-medium text-gray-800">
                    {formData.remaining_balance
                      ? `$${formData.remaining_balance}`
                      : "Not Calculated"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information - Extended */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Process Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="process_type"
                  value={formData.process_type}
                  onChange={onChange}
                  onKeyPress={handleKeyPress}
                  required
                  className="w-full px-3 py-2 border border-[#a9a9a9] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Process Type</option>
                  <option value={PROCESS_TYPE.DAILY}>
                    {PROCESS_TYPE.DAILY}
                  </option>
                  <option value={PROCESS_TYPE.WEEKLY}>
                    {PROCESS_TYPE.WEEKLY}
                  </option>
                  <option value={PROCESS_TYPE.MONTHLY}>
                    {PROCESS_TYPE.MONTHLY}
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product
                </label>
                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={onChange}
                  onKeyPress={handleKeyPress}
                  required
                  className="w-full px-3 py-2 border border-[#a9a9a9] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select a product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.product_name || `Product #${p.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Brand"
                name="brand"
                value={formData.brand}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                disabled
                className="bg-gray-100"
              />
              <Input
                label="Category"
                name="category"
                value={formData.category}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                disabled
                className="bg-gray-100"
              />
              <Input
                label="Installment Price"
                name="installment_price"
                value={formData.installment_price}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <Input
                label="Advance"
                name="advance"
                value={formData.advance}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <Input
                label="Remaining Balance"
                name="remaining_balance"
                value={formData.remaining_balance}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                disabled
                className="bg-gray-100"
              />
              <Input
                label="Monthly Installment"
                name="monthly_installment"
                value={formData.monthly_installment}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <Input
                label="Duration"
                name="duration"
                value={formData.duration}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <Input
                label="Cell No"
                name="cell_no"
                value={formData.cell_no}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <Input
                label="NIC"
                name="nic"
                value={formData.nic}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <Input
                label="Residential Address"
                name="residential_address"
                value={formData.residential_address}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <Input
                label="Office Address"
                name="office_address"
                value={formData.office_address}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <Input
                label="Residential Phone"
                name="residential_phone"
                value={formData.residential_phone}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <Input
                label="Office Phone"
                name="office_phone"
                value={formData.office_phone}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inquiry Officer
                </label>
                <select
                  name="inquiry_officer_id"
                  value={formData.inquiry_officer_id}
                  onChange={onChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 border border-[#a9a9a9] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Inquiry Officer</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.username || `User #${user.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marketing Officer
                </label>
                <select
                  name="marketing_officer_id"
                  value={formData.marketing_officer_id}
                  onChange={onChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 border border-[#a9a9a9] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Select Marketing Officer</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.username || `User #${user.id}`}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Pending Advance"
                name="pending_advance"
                value={formData.pending_advance}
                onChange={onChange}
                onKeyPress={handleKeyPress}
                required
              />
            </div>
          </div>

          {/* Guarantor Information */}
          <div className="space-y-4">
            <div
              className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setShowGuarantorInfo(!showGuarantorInfo)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-indigo-800 transition-all duration-300">
                      Guarantor Information
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">
                      Personal details and contact information
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                  <span className="text-sm font-medium">
                    {showGuarantorInfo ? "Hide" : "Show"} Details
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      showGuarantorInfo ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
            {/* {showGuarantorInfo ? ( */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showGuarantorInfo
                  ? "max-h-[2000px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-4"
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                {/* Guarantor 1 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 border-b border-gray-300 pb-2">
                    Guarantor 1
                  </h4>
                  <Input
                    label="G1 Name"
                    name="g1_name"
                    value={formData.g1_name}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G1 SO"
                    name="g1_son_of"
                    value={formData.g1_son_of}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G1 Cell"
                    name="g1_cell"
                    value={formData.g1_cell}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G1 Res Phone"
                    name="g1_res_phone"
                    value={formData.g1_res_phone}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G1 NIC"
                    name="g1_nic"
                    value={formData.g1_nic}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G1 Occupation"
                    name="g1_occupation"
                    value={formData.g1_occupation}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G1 Office Address"
                    name="g1_office_address"
                    value={formData.g1_office_address}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G1 Residential Address"
                    name="g1_residential_address"
                    value={formData.g1_residential_address}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/* Guarantor 2 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 border-b border-gray-300 pb-2">
                    Guarantor 2
                  </h4>
                  <Input
                    label="G2 Name"
                    name="g2_name"
                    value={formData.g2_name}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G2 SO"
                    name="g2_son_of"
                    value={formData.g2_son_of}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G2 Cell"
                    name="g2_cell"
                    value={formData.g2_cell}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G2 Res Phone"
                    name="g2_res_phone"
                    value={formData.g2_res_phone}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G2 NIC"
                    name="g2_nic"
                    value={formData.g2_nic}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G2 Occupation"
                    name="g2_occupation"
                    value={formData.g2_occupation}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G2 Office Address"
                    name="g2_office_address"
                    value={formData.g2_office_address}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G2 Residential Address"
                    name="g2_residential_address"
                    value={formData.g2_residential_address}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                </div>

                {/* Guarantor 3 */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 border-b border-gray-300 pb-2">
                    Guarantor 3
                  </h4>
                  <Input
                    label="G3 Name"
                    name="g3_name"
                    value={formData.g3_name}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G3 SO"
                    name="g3_son_of"
                    value={formData.g3_son_of}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G3 Cell"
                    name="g3_cell"
                    value={formData.g3_cell}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G3 Res Phone"
                    name="g3_res_phone"
                    value={formData.g3_res_phone}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G3 NIC"
                    name="g3_nic"
                    value={formData.g3_nic}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G3 Occupation"
                    name="g3_occupation"
                    value={formData.g3_occupation}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G3 Office Address"
                    name="g3_office_address"
                    value={formData.g3_office_address}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                  <Input
                    label="G3 Residential Address"
                    name="g3_residential_address"
                    value={formData.g3_residential_address}
                    onChange={onChange}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
            </div>
            {/* ) : null} */}
          </div>

          {/* Banking & Documentation */}
          <div className="space-y-4">
            <div
              className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-200 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setShowBankingInfo(!showBankingInfo)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-emerald-800 transition-all duration-300">
                      Banking & Documentation
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">
                      Financial and legal documentation
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 group-hover:text-green-700 transition-colors duration-300">
                  <span className="text-sm font-medium">
                    {showBankingInfo ? "Hide" : "Show"} Details
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      showBankingInfo ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showBankingInfo
                  ? "max-h-[800px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-4"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <Input
                  label="Cheque Number"
                  name="cheque_number"
                  value={formData.cheque_number}
                  onChange={onChange}
                  onKeyPress={handleKeyPress}
                />
                <Input
                  label="Cheque Amount"
                  name="cheque_amount"
                  value={formData.cheque_amount}
                  onChange={onChange}
                  onKeyPress={handleKeyPress}
                />
                <Input
                  label="Bank Name"
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={onChange}
                  onKeyPress={handleKeyPress}
                />
                <Input
                  label="Serial No 1"
                  name="serial_no_1"
                  value={formData.serial_no_1}
                  onChange={onChange}
                  onKeyPress={handleKeyPress}
                />
                <Input
                  label="Serial No 2"
                  name="serial_no_2"
                  value={formData.serial_no_2}
                  onChange={onChange}
                  onKeyPress={handleKeyPress}
                />
                <label className="inline-flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    name="stamp_paper"
                    checked={formData.stamp_paper}
                    onChange={onChange}
                  />
                  <span>Stamp Paper</span>
                </label>
                <label className="inline-flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    name="warranty_card"
                    checked={formData.warranty_card}
                    onChange={onChange}
                  />
                  <span>Warranty Card</span>
                </label>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <div
              className="bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 border border-purple-200 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-violet-800 transition-all duration-300">
                      Additional Information
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">
                      Notes, remarks and custom fields
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-purple-600 group-hover:text-purple-700 transition-colors duration-300">
                  <span className="text-sm font-medium">
                    {showAdditionalInfo ? "Hide" : "Show"} Details
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      showAdditionalInfo ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showAdditionalInfo
                  ? "max-h-[600px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-4"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="md:col-span-3">
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Custom Fields
                    </label>
                    <button
                      type="button"
                      onClick={addCustomField}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
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
                      Add Custom Field
                    </button>
                  </div>

                  {customFields.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                      <svg
                        className="w-12 h-12 mx-auto mb-2 text-gray-400"
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
                      <p className="text-sm">No custom fields added yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Click "Add Custom Field" to get started
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customFields.map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                        >
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Field Label (e.g., Company Size)"
                              value={field.label}
                              onChange={(e) =>
                                updateCustomField(
                                  field.id,
                                  "label",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Field Value (e.g., 50 employees)"
                              value={field.value}
                              onChange={(e) =>
                                updateCustomField(
                                  field.id,
                                  "value",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeCustomField(field.id)}
                            className="p-2 text-red-600 bg-red-50 border border-red-300 rounded-md hover:bg-red-100 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {customFields.length > 0 && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>Note:</strong> Custom fields will be stored as
                        JSON with formatted keys. For example: "Company Size"
                        becomes "company_size" in the database.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}
          {/* </div> */}

          {/* Images & Attachments */}
          <div className="space-y-4">
            <div
              className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border border-orange-200 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setShowImagesSection(!showImagesSection)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-700 bg-clip-text text-transparent group-hover:from-orange-700 group-hover:to-amber-800 transition-all duration-300">
                      Images & Attachments
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700 transition-colors duration-300">
                      Document and image uploads
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-orange-600 group-hover:text-orange-700 transition-colors duration-300">
                  <span className="text-sm font-medium">
                    {showImagesSection ? "Hide" : "Show"} Uploader
                  </span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      showImagesSection ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showImagesSection
                ? "max-h-[2000px] opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-4"
            }`}
          >
            <div className="space-y-6 pt-4">
              {/* Smart Uploader */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-semibold text-blue-800 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Smart Image Uploader
                  </h4>
                  <span className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-medium">
                    {Object.values(images).filter((img) => img).length +
                      (formData.picture_url ? 1 : 0)}{" "}
                    of {IMAGE_TYPES.length} document types uploaded
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Document Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Document Type{" "}
                      <span className="text-red-500">*</span>
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {IMAGE_TYPES.map((type) => {
                        const isSelected = selectedImageType === type.key;
                        const isUploaded =
                          type.key === "picture_url"
                            ? !!formData.picture_url
                            : !!images[type.key];

                        return (
                          <div
                            key={type.key}
                            onClick={() => handleCardClick(type.key)}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                              isSelected
                                ? "border-blue-500 bg-blue-50 shadow-md"
                                : isUploaded
                                ? "border-green-300 bg-green-50 hover:border-green-400"
                                : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  isSelected
                                    ? "bg-blue-100 text-blue-600"
                                    : isUploaded
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {type.key.includes("card") ? (
                                  <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                    />
                                  </svg>
                                ) : type.key.includes("warranty") ? (
                                  <svg
                                    className="w-5 h-5"
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
                                ) : type.key.includes("form") ? (
                                  <svg
                                    className="w-5 h-5"
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
                                ) : (
                                  <svg
                                    className="w-5 h-5"
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
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`font-medium truncate ${
                                    isSelected
                                      ? "text-blue-900"
                                      : isUploaded
                                      ? "text-green-900"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {type.label}
                                </h4>
                                <p
                                  className={`text-sm truncate ${
                                    isSelected
                                      ? "text-blue-700"
                                      : isUploaded
                                      ? "text-green-700"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {type.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {isSelected && (
                                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                )}
                                {isUploaded && !isSelected && (
                                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg
                                      className="w-3 h-3 text-white"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Hidden File Input */}
                    <input
                      id="hidden-file-input"
                      key={fileInputKey}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        console.log("File input onChange triggered");
                        console.log("Files:", e.target.files);
                        if (e.target.files && e.target.files[0]) {
                          console.log("File selected:", e.target.files[0]);
                          handleSmartImageUpload(e.target.files[0]);
                        } else {
                          console.log("No files selected");
                        }
                      }}
                      className="hidden"
                    />

                    {/* Clear Selection Button */}
                    {selectedImageType &&
                      !(selectedImageType === "picture_url"
                        ? !!formData.picture_url
                        : !!images[selectedImageType]) && (
                        <div className="mt-3 flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setSelectedImageType("")}
                            className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Clear Selection
                          </button>
                          <span className="text-xs text-gray-500">
                            Click to cancel document type selection
                          </span>
                        </div>
                      )}
                  </div>

                  {/* Instructions */}
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>How to use:</strong> Click on any document type
                      card to upload an image. If an image is already uploaded,
                      click on the card to view it. You can change the image
                      from the preview modal using the "Change Image" button.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Preview:{" "}
                      {IMAGE_TYPES.find((t) => t.key === previewImageType)
                        ?.label || "Image"}
                    </h3>
                    <button
                      type="button"
                      onClick={closePreview}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
                    {previewImageType === "picture_url" ? (
                      <div className="text-center py-8">
                        <div className="text-gray-500 mb-2">
                          <svg
                            className="w-16 h-16 mx-auto"
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
                        </div>
                        <p className="text-gray-700 font-medium">
                          {previewImage}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          File uploaded successfully
                        </p>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <img
                          src={
                            typeof previewImage === "string"
                              ? previewImage
                              : URL.createObjectURL(previewImage)
                          }
                          alt={`Preview of ${
                            IMAGE_TYPES.find((t) => t.key === previewImageType)
                              ?.label || "image"
                          }`}
                          className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "block";
                          }}
                        />
                        <div className="hidden text-center py-8">
                          <div className="text-gray-500 mb-2">
                            <svg
                              className="w-16 h-16 mx-auto"
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
                          </div>
                          <p className="text-gray-700 font-medium">
                            Image preview not available
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            The image file may be corrupted or in an unsupported
                            format
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImageType(previewImageType);
                        setFileInputKey((prev) => prev + 1);
                        closePreview();
                        // Trigger file selection after a short delay
                        setTimeout(() => {
                          document.getElementById("hidden-file-input")?.click();
                        }, 100);
                      }}
                      className="px-4 py-2 text-blue-600 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <svg
                        className="w-4 h-4 inline mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={closePreview}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/accounts")}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitting}>
              {account_id ? "Update Lease Account" : "Create Lease Account"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AccountsPage;

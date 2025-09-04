import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { leaseAccountApi } from "../../services";
import toast from "../../../../utils/toast";
import { useNavigate } from "react-router-dom";
import { productApi } from "../../../../services/product";
import { userApi } from "../../../../services/user/api";
import {
  BasicInformationSection,
  QuickSummarySection,
  GuarantorInformationSection,
  BankingDocumentationSection,
  AdditionalInformationSection,
  ImagesAttachmentsSection,
  ImagePreviewModal,
  FormActions,
} from "../components";

// Image upload options - Common configuration
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
  console.log("🚀 ~ AccountsPage ~ account_id:", account_id);
  const [loading, setLoading] = useState(false);

  // Common form state
  const [formData, setFormData] = useState({
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
  });

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

  // Common data loading
  useEffect(() => {
    if (account_id) {
      loadAccountData(account_id);
    }
  }, [account_id]);

  useEffect(() => {
    loadProducts();
    loadUsers();
  }, []);

  // Common functions
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
      const res = await userApi.getAll({ limit: 1000 });
      const list = res?.data || res || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error(error?.message || "Failed to load users");
    }
  };

  const loadAccountData = async (id) => {
    try {
      setLoading(true);
      const res = await leaseAccountApi.getById({id});
      const accountData = res?.data || res;

      if (accountData) {
        const transformedData = {
          product_id: accountData.product?.id?.toString() || "",
          brand: accountData.product?.brand?.name || "",
          category: accountData.product?.category?.name || "",
          process_type: accountData.process_type || "Monthly",
          date: accountData.date
            ? new Date(accountData.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          process_date: accountData.process_date || new Date().toISOString(),
          cust_date:
            accountData.customerInformation?.cust_date ||
            new Date().toISOString(),
          account_date:
            accountData.leaseAdvance?.account_date || new Date().toISOString(),
          cash_price: accountData.cash_price?.toString() || "",
          installment_price: accountData.installment_price?.toString() || "",
          advance: accountData.advance?.toString() || "",
          monthly_installment:
            accountData.monthly_installment?.toString() || "",
          duration: accountData.duration?.toString() || "",
          process_fee: accountData.process_fee?.toString() || "",
          notes: accountData.notes || "",
          customer_name: accountData.customer_name || "",
          son_of: accountData.son_of || "",
          nic: accountData.customerInformation?.nic || "",
          occupation: accountData.customerInformation?.occupation || "",
          office_address: accountData.customerInformation?.office_address || "",
          residential_address:
            accountData.customerInformation?.residential_address || "",
          cell_no: accountData.customerInformation?.cell_no || "",
          office_phone: accountData.customerInformation?.office_phone || "",
          residential_phone:
            accountData.customerInformation?.residential_phone || "",
          g1_name: accountData.customerInformation?.g1_name || "",
          g1_son_of: accountData.customerInformation?.g1_son_of || "",
          g1_nic: accountData.customerInformation?.g1_nic || "",
          g1_occupation: accountData.customerInformation?.g1_occupation || "",
          g1_office_address:
            accountData.customerInformation?.g1_office_address || "",
          g1_residential_address:
            accountData.customerInformation?.g1_residential_address || "",
          g1_cell: accountData.customerInformation?.g1_cell || "",
          g1_res_phone: accountData.customerInformation?.g1_res_phone || "",
          g2_name: accountData.customerInformation?.g2_name || "",
          g2_son_of: accountData.customerInformation?.g2_son_of || "",
          g2_nic: accountData.customerInformation?.g2_nic || "",
          g2_occupation: accountData.customerInformation?.g2_occupation || "",
          g2_office_address:
            accountData.customerInformation?.g2_office_address || "",
          g2_residential_address:
            accountData.customerInformation?.g2_residential_address || "",
          g2_cell: accountData.customerInformation?.g2_cell || "",
          g2_res_phone: accountData.customerInformation?.g2_res_phone || "",
          g3_name: accountData.customerInformation?.g3_name || "",
          g3_son_of: accountData.customerInformation?.g3_son_of || "",
          g3_nic: accountData.customerInformation?.g3_nic || "",
          g3_occupation: accountData.customerInformation?.g3_occupation || "",
          g3_office_address:
            accountData.customerInformation?.g3_office_address || "",
          g3_residential_address:
            accountData.customerInformation?.g3_residential_address || "",
          g3_cell: accountData.customerInformation?.g3_cell || "",
          g3_res_phone: accountData.customerInformation?.g3_res_phone || "",
          cheque_number: accountData.customerInformation?.cheque_number || "",
          cheque_amount:
            accountData.customerInformation?.cheque_amount?.toString() || "",
          stamp_paper: accountData.customerInformation?.stamp_paper || false,
          bank_name: accountData.customerInformation?.bank_name || "",
          serial_no_1: accountData.customerInformation?.serial_no_1 || "",
          serial_no_2: accountData.customerInformation?.serial_no_2 || "",
          warranty_card:
            accountData.customerInformation?.warranty_card || false,
          custom_fields: accountData.customerInformation?.custom_fields || "",
          total_received:
            accountData.leaseAdvance?.total_received?.toString() || "",
          pending_advance:
            accountData.leaseAdvance?.pending_advance?.toString() || "",
          remaining_balance:
            accountData.leaseAdvance?.remaining_balance?.toString() || "",
          inquiry_officer_id:
            accountData.leaseAdvance?.inquiry_officer_id?.toString() || "",
          marketing_officer_id:
            accountData.leaseAdvance?.marketing_officer_id?.toString() || "",
          is_stock_delivered:
            accountData.leaseAdvance?.is_stock_delivered || false,
          remarks: accountData.leaseAdvance?.remarks || "",
          is_active:
            accountData.is_active !== undefined ? accountData.is_active : true,
        };

        setFormData(transformedData);

        if (
          accountData.customerInformation?.custom_fields &&
          typeof accountData.customerInformation.custom_fields === "object"
        ) {
          const customFieldsArray = Object.entries(
            accountData.customerInformation.custom_fields
          ).map(([key, value], index) => ({
            id: Date.now() + index,
            label: key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase()),
            value: value,
          }));
          setCustomFields(customFieldsArray);
        }

        if (accountData.customerInformation) {
          // Extract image fields from customerInformation
          const imageFields = {};
          IMAGE_TYPES.forEach((imgType) => {
            if (accountData.customerInformation[imgType.key]) {
              imageFields[imgType.key] =
                accountData.customerInformation[imgType.key];
            }
          });
          setImages(imageFields);
        }

        toast.success("Account data loaded successfully");
      }
    } catch (error) {
      toast.error(error?.message || "Failed to load account data");
      navigate("/accounts");
    } finally {
      setLoading(false);
    }
  };

  // Common form handlers
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

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

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

  // Image handling functions
  const handleSmartImageUpload = (file) => {
    if (selectedImageType && file) {
      if (selectedImageType === "picture_url") {
        setFormData((prev) => ({ ...prev, picture_url: file.name }));
      } else {
        setImages((prev) => ({ ...prev, [selectedImageType]: file }));
      }
      setSelectedImageType("");
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
    const isUploaded =
      imageType === "picture_url"
        ? !!formData.picture_url
        : !!images[imageType];

    if (isUploaded) {
      handleImagePreview(imageType);
    } else if (selectedImageType === imageType) {
      setFileInputKey((prev) => prev + 1);
      setTimeout(() => {
        document.getElementById("hidden-file-input")?.click();
      }, 100);
    } else {
      setSelectedImageType(imageType);
      setFileInputKey((prev) => prev + 1);
      setTimeout(() => {
        document.getElementById("hidden-file-input")?.click();
      }, 100);
    }
  };

  // Custom field functions
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

  // Form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
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
        custom_fields: customFields.reduce((acc, field) => {
          if (field.label && field.value) {
            acc[formatCustomFieldLabel(field.label)] = field.value;
          }
          return acc;
        }, {}),
        images,
      };

      if (account_id) {
        await leaseAccountApi.update(account_id, payload);
        toast.success("Lease account updated successfully");
      } else {
        await leaseAccountApi.create(payload);
        toast.success("Lease account created successfully");
      }

      navigate("/lease/accounts");
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
          <BasicInformationSection
            formData={formData}
            onChange={onChange}
            onKeyPress={handleKeyPress}
            products={products}
            users={users}
            setFormData={setFormData}
          />

          <QuickSummarySection formData={formData} products={products} />

          <GuarantorInformationSection
            showGuarantorInfo={showGuarantorInfo}
            setShowGuarantorInfo={setShowGuarantorInfo}
            formData={formData}
            onChange={onChange}
            onKeyPress={handleKeyPress}
          />

          <BankingDocumentationSection
            showBankingInfo={showBankingInfo}
            setShowBankingInfo={setShowBankingInfo}
            formData={formData}
            onChange={onChange}
            onKeyPress={handleKeyPress}
          />

          <AdditionalInformationSection
            showAdditionalInfo={showAdditionalInfo}
            setShowAdditionalInfo={setShowAdditionalInfo}
            customFields={customFields}
            addCustomField={addCustomField}
            removeCustomField={removeCustomField}
            updateCustomField={updateCustomField}
          />

          <ImagesAttachmentsSection
            showImagesSection={showImagesSection}
            setShowImagesSection={setShowImagesSection}
            IMAGE_TYPES={IMAGE_TYPES}
            selectedImageType={selectedImageType}
            images={images}
            formData={formData}
            handleCardClick={handleCardClick}
            fileInputKey={fileInputKey}
            setFileInputKey={setFileInputKey}
            handleSmartImageUpload={handleSmartImageUpload}
            setSelectedImageType={setSelectedImageType}
          />

          <FormActions
            account_id={account_id}
            submitting={submitting}
            navigate={navigate}
          />
        </form>
      )}

      <ImagePreviewModal
        previewImage={previewImage}
        previewImageType={previewImageType}
        IMAGE_TYPES={IMAGE_TYPES}
        closePreview={closePreview}
        setSelectedImageType={setSelectedImageType}
        setFileInputKey={setFileInputKey}
      />
    </div>
  );
};

export default AccountsPage;

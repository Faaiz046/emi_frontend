import React from "react";
import Input from "../../../../shared/components/ui/Input";
import { PROCESS_TYPE } from "../../../../constants/app.constant";

const BasicInformationSection = ({
  formData,
  onChange,
  onKeyPress,
  products,
  users,
  setFormData,
}) => {
  // Product selection handler - now self-contained in this component
  const handleProductChange = (e) => {
    const { value } = e.target;
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
    } else {
      // If no product selected, just update the product_id
      onChange(e);
    }
  };

  return (
    <>
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
            onKeyPress={onKeyPress}
            required
          />
          <Input
            label="SO"
            name="son_of"
            value={formData.son_of}
            onChange={onChange}
            onKeyPress={onKeyPress}
            required
          />
          <Input
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
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
              onKeyPress={onKeyPress}
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
              onChange={handleProductChange}
              onKeyPress={onKeyPress}
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
            onKeyPress={onKeyPress}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={onChange}
            onKeyPress={onKeyPress}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="Installment Price"
            name="installment_price"
            value={formData.installment_price}
            onChange={onChange}
            onKeyPress={onKeyPress}
            required
          />
          <Input
            label="Advance"
            name="advance"
            value={formData.advance}
            onChange={onChange}
            onKeyPress={onKeyPress}
            required
          />
          <Input
            label="Remaining Balance"
            name="remaining_balance"
            value={formData.remaining_balance}
            onChange={onChange}
            onKeyPress={onKeyPress}
            disabled
            className="bg-gray-100"
          />
          <Input
            label="Monthly Installment"
            name="monthly_installment"
            value={formData.monthly_installment}
            onChange={onChange}
            onKeyPress={onKeyPress}
            required
          />
          <Input
            label="Duration"
            name="duration"
            value={formData.duration}
            onChange={onChange}
            onKeyPress={onKeyPress}
            required
          />
          <Input
            label="Cell No"
            name="cell_no"
            value={formData.cell_no}
            onChange={onChange}
            onKeyPress={onKeyPress}
            required
          />
          <Input
            label="NIC"
            name="nic"
            value={formData.nic}
            onChange={onChange}
            onKeyPress={onKeyPress}
            required
          />
          <Input
            label="Residential Address"
            name="residential_address"
            value={formData.residential_address}
            onChange={onChange}
            onKeyPress={onKeyPress}
            required
          />
          <Input
            label="Office Address"
            name="office_address"
            value={formData.office_address}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
          <Input
            label="Residential Phone"
            name="residential_phone"
            value={formData.residential_phone}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
          <Input
            label="Office Phone"
            name="office_phone"
            value={formData.office_phone}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Inquiry Officer
            </label>
            <select
              name="inquiry_officer_id"
              value={formData.inquiry_officer_id}
              onChange={onChange}
              onKeyPress={onKeyPress}
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
              onKeyPress={onKeyPress}
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
            onKeyPress={onKeyPress}
          />
        </div>
      </div>
    </>
  );
};

export default BasicInformationSection;

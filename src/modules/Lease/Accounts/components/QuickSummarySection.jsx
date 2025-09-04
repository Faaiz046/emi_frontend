import React from "react";

const QuickSummarySection = ({ formData, products }) => {
  return (
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
  );
};

export default QuickSummarySection;

import React from "react";
import Input from "../../../../shared/components/ui/Input";

const BankingDocumentationSection = ({
  showBankingInfo,
  setShowBankingInfo,
  formData,
  onChange,
  onKeyPress,
}) => {
  return (
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
            onKeyPress={onKeyPress}
          />
          <Input
            label="Cheque Amount"
            name="cheque_amount"
            value={formData.cheque_amount}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
          <Input
            label="Bank Name"
            name="bank_name"
            value={formData.bank_name}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
          <Input
            label="Serial No 1"
            name="serial_no_1"
            value={formData.serial_no_1}
            onChange={onChange}
            onKeyPress={onKeyPress}
          />
          <Input
            label="Serial No 2"
            name="serial_no_2"
            value={formData.serial_no_2}
            onChange={onChange}
            onKeyPress={onKeyPress}
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
  );
};

export default BankingDocumentationSection;

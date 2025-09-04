import React from "react";
import Input from "../../../../shared/components/ui/Input";

const GuarantorInformationSection = ({
  showGuarantorInfo,
  setShowGuarantorInfo,
  formData,
  onChange,
  onKeyPress,
}) => {
  return (
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
              onKeyPress={onKeyPress}
            />
            <Input
              label="G1 SO"
              name="g1_son_of"
              value={formData.g1_son_of}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G1 Cell"
              name="g1_cell"
              value={formData.g1_cell}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G1 Res Phone"
              name="g1_res_phone"
              value={formData.g1_res_phone}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G1 NIC"
              name="g1_nic"
              value={formData.g1_nic}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G1 Occupation"
              name="g1_occupation"
              value={formData.g1_occupation}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G1 Office Address"
              name="g1_office_address"
              value={formData.g1_office_address}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G1 Residential Address"
              name="g1_residential_address"
              value={formData.g1_residential_address}
              onChange={onChange}
              onKeyPress={onKeyPress}
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
              onKeyPress={onKeyPress}
            />
            <Input
              label="G2 SO"
              name="g2_son_of"
              value={formData.g2_son_of}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G2 Cell"
              name="g2_cell"
              value={formData.g2_cell}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G2 Res Phone"
              name="g2_res_phone"
              value={formData.g2_res_phone}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G2 NIC"
              name="g2_nic"
              value={formData.g2_nic}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G2 Occupation"
              name="g2_occupation"
              value={formData.g2_occupation}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G2 Office Address"
              name="g2_office_address"
              value={formData.g2_office_address}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G2 Residential Address"
              name="g2_residential_address"
              value={formData.g2_residential_address}
              onChange={onChange}
              onKeyPress={onKeyPress}
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
              onKeyPress={onKeyPress}
            />
            <Input
              label="G3 SO"
              name="g3_son_of"
              value={formData.g3_son_of}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G3 Cell"
              name="g3_cell"
              value={formData.g3_cell}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G3 Res Phone"
              name="g3_res_phone"
              value={formData.g3_res_phone}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G3 NIC"
              name="g3_nic"
              value={formData.g3_nic}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G3 Occupation"
              name="g3_occupation"
              value={formData.g3_occupation}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G3 Office Address"
              name="g3_office_address"
              value={formData.g3_office_address}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
            <Input
              label="G3 Residential Address"
              name="g3_residential_address"
              value={formData.g3_residential_address}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuarantorInformationSection;

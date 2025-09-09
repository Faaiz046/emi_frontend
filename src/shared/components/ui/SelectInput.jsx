// SelectInput.jsx
import React from "react";
import { Dropdown } from "primereact/dropdown";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

const SelectInput = ({
  label,
  options = [],
  value,
  onChange,
  valueProp = "value",
  labelProp = "label",
  disabled = false,
  required = false,
  className = "",
  showClear = false,
  placeholder = "Select an option",
}) => {
  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <Dropdown
        value={value}
        options={options}
        optionLabel={labelProp}
        optionValue={valueProp}
        onChange={(e) => onChange(e.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        showClear={showClear}
        filter={options && options.length > 0}
        filterPlaceholder="Search..."
        filterMatchMode="contains"
        className="w-full border !border-[#a9a9a9] rounded-md shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 [&_.p-dropdown-label]:text-sm [&_.p-dropdown-label]:font-medium [&_.p-dropdown-label]:text-gray-800"
        pt={{
          filterInput: {
            className: "px-2 py-1 border border-[#3F00FF]",
          },
          panel: {
            className: "rounded-md border border-gray-200 shadow-lg",
          },
          item: {
            className: "hover:bg-blue-200",
          },
        }}
      />
    </div>
  );
};

export default SelectInput;

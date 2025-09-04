import React from "react";

const AdditionalInformationSection = ({
  showAdditionalInfo,
  setShowAdditionalInfo,
  customFields,
  addCustomField,
  removeCustomField,
  updateCustomField,
}) => {
  // Custom field management functions
  const handleAddCustomField = () => {
    if (addCustomField) {
      addCustomField();
    }
  };

  const handleRemoveCustomField = (id) => {
    if (removeCustomField) {
      removeCustomField(id);
    }
  };

  const handleUpdateCustomField = (id, field, newValue) => {
    if (updateCustomField) {
      updateCustomField(id, field, newValue);
    }
  };

  return (
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
                onClick={handleAddCustomField}
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
                          handleUpdateCustomField(
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
                          handleUpdateCustomField(
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
                      onClick={() => handleRemoveCustomField(field.id)}
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
  );
};

export default AdditionalInformationSection;

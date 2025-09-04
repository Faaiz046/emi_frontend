import React from "react";

const ImagesAttachmentsSection = ({
  showImagesSection,
  setShowImagesSection,
  IMAGE_TYPES,
  selectedImageType,
  images,
  formData,
  handleCardClick,
  fileInputKey,
  setFileInputKey,
  handleSmartImageUpload,
  setSelectedImageType,
}) => {
  // Handle file input change
  const handleFileInputChange = (e) => {
    console.log("File input onChange triggered");
    console.log("Files:", e.target.files);
    if (e.target.files && e.target.files[0]) {
      console.log("File selected:", e.target.files[0]);
      if (handleSmartImageUpload) {
        handleSmartImageUpload(e.target.files[0]);
      }
    } else {
      console.log("No files selected");
    }
  };

  // Handle clear selection
  const handleClearSelection = () => {
    if (setSelectedImageType) {
      setSelectedImageType("");
    }
  };

  return (
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
                  onChange={handleFileInputChange}
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
                        onClick={handleClearSelection}
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
      </div>
    </div>
  );
};

export default ImagesAttachmentsSection;

import React from "react";

const ImagePreviewModal = ({
  previewImage,
  previewImageType,
  IMAGE_TYPES,
  closePreview,
  setSelectedImageType,
  setFileInputKey,
}) => {
  if (!previewImage) return null;

  // Handle change image functionality
  const handleChangeImage = () => {
    if (setSelectedImageType && setFileInputKey) {
      setSelectedImageType(previewImageType);
      setFileInputKey((prev) => prev + 1);
      closePreview();
      // Trigger file selection after a short delay
      setTimeout(() => {
        document.getElementById("hidden-file-input")?.click();
      }, 100);
    }
  };

  return (
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
            onClick={handleChangeImage}
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
  );
};

export default ImagePreviewModal;

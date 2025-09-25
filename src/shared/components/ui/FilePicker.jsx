import React, { useRef, useState } from 'react';

const FilePicker = ({
  label = 'Upload File',
  accept = '*',
  multiple = false,
  value = null,
  onChange,
  onRemove,
  description = '',
  className = '',
  preview = true,
}) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    
    // Validate files before processing
    const validFiles = Array.from(files).filter(file => {
      if (!file || !(file instanceof File)) {
        console.warn('Invalid file object:', file);
        return false;
      }
      
      if (file.size === 0) {
        console.warn('File has no content:', file.name);
        return false;
      }
      
      if (!file.type) {
        console.warn('File has no type:', file.name);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) {
      console.warn('No valid files found');
      return;
    }
    
    if (multiple) {
      onChange && onChange(validFiles);
    } else {
      onChange && onChange(validFiles[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const renderPreview = () => {
    if (!preview) return null;
    
    const renderImage = (fileOrUrl, idx = 0) => {
      let src;
      
      try {
        if (typeof fileOrUrl === 'string') {
          // If it's already a URL string, use it directly
          src = fileOrUrl;
        } else if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
          // Validate that it's a valid file/blob before creating object URL
          if (fileOrUrl.size > 0 && fileOrUrl.type) {
            try {
              src = URL.createObjectURL(fileOrUrl);
            } catch (error) {
              console.error('Error creating object URL:', error);
              return null;
            }
          } else {
            console.warn('Invalid file object:', fileOrUrl);
            return null;
          }
        } else {
          console.warn('Invalid fileOrUrl type:', typeof fileOrUrl, fileOrUrl);
          return null;
        }
      } catch (error) {
        console.error('Error processing file:', error);
        return null;
      }

      if (!src) return null;

      return (
        <img
          key={idx}
          src={src}
          alt="preview"
          className="h-16 w-16 rounded object-cover border"
          onLoad={() => { 
            if (typeof fileOrUrl !== 'string' && src) {
              try {
                URL.revokeObjectURL(src);
              } catch (error) {
                console.warn('Error revoking object URL:', error);
              }
            }
          }}
          onError={() => {
            console.warn('Failed to load image preview:', src);
            if (typeof fileOrUrl !== 'string' && src) {
              try {
                URL.revokeObjectURL(src);
              } catch (error) {
                console.warn('Error revoking object URL:', error);
              }
            }
          }}
        />
      );
    };

    if (Array.isArray(value) && value.length > 0) {
      return (
        <div className="flex gap-3 flex-wrap mt-3">
          {value.map((v, i) => renderImage(v, i)).filter(Boolean)}
        </div>
      );
    }

    if (value) {
      const rendered = renderImage(value);
      return rendered ? <div className="mt-3">{rendered}</div> : null;
    }
    return null;
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2">{label}</label>
      )}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        // onClick={() => inputRef.current && inputRef.current.click()}
        role="button"
        tabIndex={0}
      >
        <div className="flex flex-col items-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
          <p className="mt-2 text-sm text-gray-700">
            <span className="font-medium">Click to upload</span> or drag and drop
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>

      {renderPreview()}

      {(value && onRemove) && (
        <button
          type="button"
          className="mt-3 text-sm text-red-600 hover:underline"
          onClick={() => onRemove()}
        >
          Remove
        </button>
      )}
    </div>
  );
};

export default FilePicker;



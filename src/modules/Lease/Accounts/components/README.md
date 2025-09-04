# Lease Accounts Components

This directory contains the separated components for the `AccountsPage.jsx` file. The main page has been refactored into smaller, more manageable components for better maintainability and reusability.

## Component Structure

### 1. BasicInformationSection
- **File**: `BasicInformationSection.jsx`
- **Purpose**: Handles customer and basic product information with embedded product selection logic
- **Props**:
  - `formData`: Form state object
  - `onChange`: Form change handler
  - `onKeyPress`: Keyboard event handler
  - `products`: Array of available products
  - `users`: Array of available users
  - `handleProductChange`: Function to handle product selection and auto-population

### 2. QuickSummarySection
- **File**: `QuickSummarySection.jsx`
- **Purpose**: Displays a summary of key financial information
- **Props**:
  - `formData`: Form state object
  - `products`: Array of available products

### 3. GuarantorInformationSection
- **File**: `GuarantorInformationSection.jsx`
- **Purpose**: Manages guarantor details with collapsible functionality
- **Props**:
  - `showGuarantorInfo`: Boolean to control visibility
  - `setShowGuarantorInfo`: Function to toggle visibility
  - `formData`: Form state object
  - `onChange`: Form change handler
  - `onKeyPress`: Keyboard event handler

### 4. BankingDocumentationSection
- **File**: `BankingDocumentationSection.jsx`
- **Purpose**: Handles banking and documentation fields with collapsible functionality
- **Props**:
  - `showBankingInfo`: Boolean to control visibility
  - `setShowBankingInfo`: Function to toggle visibility
  - `formData`: Form state object
  - `onChange`: Form change handler
  - `onKeyPress`: Keyboard event handler

### 5. AdditionalInformationSection
- **File**: `AdditionalInformationSection.jsx`
- **Purpose**: Manages custom fields and additional information with embedded custom field logic
- **Props**:
  - `showAdditionalInfo`: Boolean to control visibility
  - `setShowAdditionalInfo`: Function to toggle visibility
  - `customFields`: Array of custom field objects
  - `addCustomField`: Function to add new custom field
  - `removeCustomField`: Function to remove custom field
  - `updateCustomField`: Function to update custom field

### 6. ImagesAttachmentsSection
- **File**: `ImagesAttachmentsSection.jsx`
- **Purpose**: Handles image uploads and document attachments with embedded image handling logic
- **Props**:
  - `showImagesSection`: Boolean to control visibility
  - `setShowImagesSection`: Function to toggle visibility
  - `IMAGE_TYPES`: Array of image type configurations
  - `selectedImageType`: Currently selected image type
  - `images`: Object containing uploaded images
  - `formData`: Form state object
  - `handleCardClick`: Function to handle image card clicks
  - `fileInputKey`: Key for file input element
  - `setFileInputKey`: Function to update file input key
  - `handleSmartImageUpload`: Function to handle file uploads
  - `setSelectedImageType`: Function to set selected image type

### 7. ImagePreviewModal
- **File**: `ImagePreviewModal.jsx`
- **Purpose**: Modal component for previewing uploaded images with embedded change image logic
- **Props**:
  - `previewImage`: Image to preview
  - `previewImageType`: Type of image being previewed
  - `IMAGE_TYPES`: Array of image type configurations
  - `closePreview`: Function to close the modal
  - `setSelectedImageType`: Function to set selected image type
  - `setFileInputKey`: Function to update file input key

### 8. FormActions
- **File**: `FormActions.jsx`
- **Purpose**: Renders form action buttons (submit/cancel)
- **Props**:
  - `account_id`: Current account ID (for edit mode)
  - `submitting`: Boolean indicating form submission state
  - `navigate`: Navigation function

## Code Organization

### Main Page (`AccountsPage.jsx`)
The main page now contains only:
- **Common State**: Form data, loading states, UI states
- **Common Functions**: Data loading, form submission, basic form handling
- **Configuration**: Constants like `IMAGE_TYPES`
- **Component Orchestration**: Passing props and managing component interactions

### Component Files
Each component now contains:
- **Component Logic**: Functions specific to that component's functionality
- **Event Handlers**: Local event handling with fallback to parent functions
- **UI Rendering**: The component's visual representation
- **Props Interface**: Clear definition of what data and functions it needs

## Usage

All components are exported from the `index.js` file and can be imported in the main `AccountsPage.jsx`:

```jsx
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
```

## Benefits of This Structure

1. **Maintainability**: Each component has a single responsibility and its own logic
2. **Reusability**: Components can be reused in other parts of the application
3. **Testing**: Easier to write unit tests for individual components
4. **Code Organization**: Better separation of concerns
5. **Performance**: Components can be optimized individually
6. **Team Development**: Multiple developers can work on different components simultaneously
7. **Logic Encapsulation**: Component-specific logic is contained within the component
8. **Clear Interfaces**: Each component has a well-defined props interface

## State Management

The main state is managed in the parent `AccountsPage.jsx` component and passed down as props to child components. Component-specific logic is embedded within each component, while common logic remains in the parent.

## Styling

All components use Tailwind CSS classes and maintain the same visual design as the original page. The collapsible sections use smooth transitions and animations for better user experience.

## Migration Notes

- **Product Selection Logic**: Now embedded in `BasicInformationSection`
- **Custom Field Management**: Now embedded in `AdditionalInformationSection`
- **Image Handling**: Now embedded in `ImagesAttachmentsSection` and `ImagePreviewModal`
- **Form Validation**: Remains in the main page for consistency
- **API Calls**: Remains in the main page for centralized data management

# Outstand Management

## Overview
The Outstand feature in the Lease module provides comprehensive management of outstanding lease accounts. It displays accounts with pending installments, outstanding balances, and provides insights into the financial health of lease portfolios.

## Features

### 1. **Outstand Listing Page**
- **Route**: `/lease/outstand`
- **Permission**: `outstand:read`
- **Component**: `OutstandPage`

### 2. **Key Functionality**
- **Load Outstand Button**: Fetches current outstanding account data
- **Dual View Modes**: Table view and Grid view for different data presentation
- **Summary Cards**: Quick overview of key metrics
- **Responsive Design**: Works on all device sizes

### 3. **Data Display**
- Account Number
- Customer Information (Name, Son Of)
- Product Details
- Financial Information (Advance, Monthly Installment, Outstanding Amount)
- Payment Status (Pending Installments, Last Payment Date)
- Account Status

### 4. **Summary Metrics**
- Total Accounts
- Total Outstanding Amount
- Total Advance Amount
- Average Monthly Installment

## API Integration

### Service File
- **Location**: `src/modules/Lease/services/outstand.js`
- **Base URL**: `/outstand`

### Available Endpoints
- `GET /outstand` - List all outstanding accounts
- `GET /outstand/:id` - Get specific outstanding account
- `GET /outstand/account/:accountNo` - Get by account number
- `GET /outstand/customer/:customerId` - Get by customer
- `GET /outstand/branch/:branchId` - Get by branch
- `GET /outstand/summary` - Get summary statistics
- `GET /outstand/overdue` - Get overdue accounts
- `GET /outstand/export` - Export data

## Usage

### 1. **Accessing the Feature**
Navigate to the Lease menu and click on "Outstand"

### 2. **Loading Data**
Click the "Load Outstand" button to fetch current outstanding account data

### 3. **View Modes**
- **Table View**: Detailed tabular data with sorting and pagination
- **Grid View**: Card-based layout for better visual overview

### 4. **Data Refresh**
The page automatically loads data on mount and can be manually refreshed using the Load button

## Technical Details

### Components
- `OutstandPage.jsx` - Main page component
- `index.jsx` - Page export file

### State Management
- Uses React hooks for local state management
- Manages loading states, pagination, and view modes
- Handles API responses and error states

### Error Handling
- Graceful fallback to demo data if API is unavailable
- User-friendly error messages via toast notifications
- Console logging for debugging

## Future Enhancements

### Planned Features
- Advanced filtering and search capabilities
- Export functionality (PDF, Excel)
- Detailed account drill-down
- Payment history integration
- Overdue account highlighting
- Automated notifications for overdue accounts

### Integration Points
- Connect with existing lease account system
- Integrate with payment processing
- Link to customer management
- Connect with reporting system

## Dependencies

### UI Components
- `Button` - Action buttons
- `DataTable` - Tabular data display
- `Card` - Content containers
- `Badge` - Status indicators
- `Spinner` - Loading indicators

### Utilities
- `toast` - User notifications
- `outstandApi` - API service layer

## Permissions

### Required Permissions
- `outstand:read` - View outstanding accounts
- `outstand:create` - Create new records (future)
- `outstand:update` - Update records (future)
- `outstand:delete` - Delete records (future)

## File Structure

```
src/modules/Lease/outstand/
├── components/
│   └── index.js
├── pages/
│   ├── OutstandPage.jsx
│   └── index.jsx
├── services/
│   └── outstand.js
└── README.md
```

## Notes

- Currently uses demo data as fallback when API is unavailable
- Designed to be easily extensible for future features
- Follows the established module pattern used throughout the application
- Includes comprehensive error handling and user feedback

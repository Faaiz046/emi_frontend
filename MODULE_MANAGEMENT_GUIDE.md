# Module Management Guide

This guide explains how to manage and extend the new modular architecture in your EMI Frontend application.

## 🏗️ Architecture Overview

Your application now follows a modular structure with the following modules:

```
src/
├── modules/
│   ├── installment/     # Lease account management
│   ├── pos/            # Point of Sale system
│   ├── tailor/         # Tailor management
│   ├── appointment/    # Appointment scheduling
│   └── common/         # Shared features (users, companies, etc.)
├── core/
│   ├── auth/           # Authentication & permissions
│   └── router/         # Centralized routing
└── features/           # Legacy feature components
```

## 🚀 How to Use the New Modules

### 1. **POS System** (`/pos/*`)
- **Sales**: `/pos/sales` - Product catalog and shopping cart
- **Inventory**: `/pos/inventory` - Stock management
- **Transactions**: `/pos/transactions` - Sales history

### 2. **Tailor Management** (`/tailor/*`)
- **Orders**: `/tailor/orders` - Custom order tracking
- **Measurements**: `/tailor/measurements` - Customer measurements
- **Fabric Inventory**: `/tailor/fabric-inventory` - Material management

### 3. **Appointment System** (`/appointments/*`)
- **Calendar**: `/appointments/calendar` - Daily schedule view
- **Bookings**: `/appointments/bookings` - Appointment management
- **Customers**: `/appointments/customers` - Customer directory

### 4. **Installment Management** (`/accounts/*`)
- **List**: `/accounts` - All lease accounts
- **Create**: `/accounts/create` - New account
- **Edit**: `/accounts/edit/:id` - Modify existing account

## 🔧 How to Add New Modules

### Step 1: Create Module Structure
```bash
mkdir -p src/modules/your-module/{pages,components,services,types}
```

### Step 2: Create Route Configuration
```javascript
// src/modules/your-module/routes.js
import { lazy } from 'react';
import { ProtectedRoute } from '../../core/auth/ProtectedRoute';

const YourMainPage = lazy(() => import('./pages/YourMainPage'));
const YourDetailPage = lazy(() => import('./pages/YourDetailPage'));

export const yourModuleRoutes = [
  {
    path: '/your-module',
    element: (
      <ProtectedRoute requiredPermissions={['your-module:access']}>
        <YourMainPage />
      </ProtectedRoute>
    ),
    children: [
      { path: '', element: <YourMainPage /> },
      { path: ':id', element: <YourDetailPage /> }
    ]
  }
];
```

### Step 3: Add to Main Router
```javascript
// src/core/router/index.jsx
import { yourModuleRoutes } from '../../modules/your-module/routes';

export const router = createBrowserRouter([
  // ... existing routes
  {
    path: '/',
    element: <Layout />,
    children: [
      // ... existing routes
      ...yourModuleRoutes,  // Add your module routes
    ]
  }
]);
```

### Step 4: Add Navigation
```javascript
// src/store/slices/layoutSlice.js
{
  id: 'your-module',
  label: 'Your Module',
  icon: 'YourIcon',
  type: 'menu',
  isOpen: false,
  items: [
    {
      id: 'your-main',
      label: 'Main Page',
      icon: 'YourIcon',
      path: '/your-module',
      badge: null,
      type: 'item',
    }
  ],
}
```

## 🛡️ Permission Management

### Using ProtectedRoute
```javascript
<ProtectedRoute requiredPermissions={['module:read', 'module:write']}>
  <YourComponent />
</ProtectedRoute>
```

### Permission Levels
- `module:read` - View only
- `module:write` - Create/Edit
- `module:delete` - Delete operations
- `module:admin` - Full access

## 📱 Responsive Design

All modules include:
- Mobile-first responsive design
- Consistent UI components
- Tailwind CSS styling
- Interactive hover states
- Loading states and error handling

## 🔄 State Management

### Redux Store Structure
```javascript
// Each module can have its own slice
const yourModuleSlice = createSlice({
  name: 'yourModule',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  reducers: {
    // Your reducers here
  }
});
```

### API Integration
```javascript
// src/modules/your-module/services/api.js
export const yourModuleApi = {
  getItems: () => apiClient.get('/your-module'),
  createItem: (data) => apiClient.post('/your-module', data),
  updateItem: (id, data) => apiClient.put(`/your-module/${id}`, data),
  deleteItem: (id) => apiClient.delete(`/your-module/${id}`)
};
```

## 🎨 Customization

### Theme Colors
Each module can have its own color scheme:
- POS: Blue theme
- Tailor: Purple theme  
- Appointments: Indigo theme
- Installment: Green theme

### Layout Options
- Consistent header/navigation structure
- Customizable content areas
- Responsive grid systems
- Modal dialogs and forms

## 🧪 Testing

### Component Testing
```javascript
// Test your module components
import { render, screen } from '@testing-library/react';
import YourComponent from './YourComponent';

test('renders module correctly', () => {
  render(<YourComponent />);
  expect(screen.getByText('Your Module')).toBeInTheDocument();
});
```

### Route Testing
```javascript
// Test module routes
import { MemoryRouter } from 'react-router-dom';

test('navigates to module route', () => {
  render(
    <MemoryRouter initialEntries={['/your-module']}>
      <YourModule />
    </MemoryRouter>
  );
});
```

## 🚀 Performance Optimization

### Lazy Loading
All module components are lazy-loaded:
```javascript
const YourComponent = lazy(() => import('./YourComponent'));
```

### Code Splitting
Modules are automatically code-split for better performance.

### Bundle Analysis
Use `npm run build --analyze` to analyze bundle size.

## 🔍 Debugging

### Development Tools
- React Developer Tools
- Redux DevTools
- Network tab for API calls
- Console logging

### Common Issues
1. **Route not found**: Check route configuration in `core/router/index.jsx`
2. **Permission denied**: Verify user permissions in Redux store
3. **Component not loading**: Check lazy import paths
4. **Navigation broken**: Verify `useNavigation` hook usage

## 📚 Best Practices

1. **Consistent Naming**: Use kebab-case for routes, PascalCase for components
2. **Error Boundaries**: Wrap modules in error boundaries
3. **Loading States**: Always show loading indicators
4. **Form Validation**: Use consistent validation patterns
5. **API Error Handling**: Handle errors gracefully
6. **Accessibility**: Include ARIA labels and keyboard navigation
7. **Mobile First**: Design for mobile devices first

## 🔮 Future Enhancements

### Planned Features
- [ ] Module-specific dashboards
- [ ] Advanced permission system
- [ ] Module configuration panel
- [ ] Plugin architecture
- [ ] Micro-frontend support

### Integration Points
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Dark mode themes
- [ ] PWA capabilities

## 📞 Support

For questions or issues:
1. Check this documentation
2. Review existing module implementations
3. Check console for errors
4. Verify route configurations
5. Test with different user permissions

---

**Happy coding! 🎉**

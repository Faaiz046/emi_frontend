import { lazy } from 'react';
import ProtectedRoute from '../../core/auth/ProtectedRoute';

// Lazy load components
const POSLayout = lazy(() => import('./pages/POSLayout'));
const SalesPage = lazy(() => import('./pages/SalesPage'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const TransactionsPage = lazy(() => import('./pages/TransactionsPage'));

export const posRoutes = [
  {
    path: '/pos',
    element: (
      <ProtectedRoute requiredPermissions={['pos:access']}>
        <POSLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'sales', element: <SalesPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      { path: '', element: <SalesPage /> } // Default to sales
    ]
  }
];

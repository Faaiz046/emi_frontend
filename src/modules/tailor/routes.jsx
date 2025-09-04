import { lazy } from 'react';
import ProtectedRoute from '../../core/auth/ProtectedRoute';

// Lazy load components
const TailorLayout = lazy(() => import('./pages/TailorLayout'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const MeasurementsPage = lazy(() => import('./pages/MeasurementsPage'));
const FabricInventoryPage = lazy(() => import('./pages/FabricInventoryPage'));

export const tailorRoutes = [
  {
    path: '/tailor',
    element: (
      <ProtectedRoute requiredPermissions={['tailor:access']}>
        <TailorLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'orders', element: <OrdersPage /> },
      { path: 'measurements', element: <MeasurementsPage /> },
      { path: 'fabric-inventory', element: <FabricInventoryPage /> },
      { path: '', element: <OrdersPage /> } // Default to orders
    ]
  }
];

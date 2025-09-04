import { lazy } from 'react';
import ProtectedRoute from '../../core/auth/ProtectedRoute';

// Lazy load components
const AppointmentLayout = lazy(() => import('./pages/AppointmentLayout'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const CustomerManagementPage = lazy(() => import('./pages/CustomerManagementPage'));

export const appointmentRoutes = [
  {
    path: '/appointments',
    element: (
      <ProtectedRoute requiredPermissions={['appointments:access']}>
        <AppointmentLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'customers', element: <CustomerManagementPage /> },
      { path: '', element: <CalendarPage /> } // Default to calendar
    ]
  }
];

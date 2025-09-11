import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Layout from '../../shared/layouts/Layout';
import LoginPage from '../../features/auth/pages/LoginPage';
import UnauthorizedPage from '../../features/auth/pages/UnauthorizedPage';
import NotFoundPage from '../../features/auth/pages/NotFoundPage';

// Import modular routes
import { commonRoutes } from '../../modules/common/routes.jsx';
import { posRoutes } from '../../modules/pos/routes.jsx';
import { tailorRoutes } from '../../modules/tailor/routes.jsx';
import { appointmentRoutes } from '../../modules/appointment/routes.jsx';
import { leaseRoutes } from '../../modules/Lease/routes.jsx';
import { useAppSelector } from "../../store/hooks"; 
import { selectIsAuthenticated } from "../../store/slices/authSlice";
// Create the router configuration


const PrivateRoute = ({ element }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/unauthorized',
    element: <PrivateRoute element={<UnauthorizedPage />} />
  },
  {
    path: '/',
    element: <PrivateRoute element={<Layout />} />,
    children: [
      // Default route redirects to dashboard
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      
      // Common routes (existing features)
      ...commonRoutes,
      


      // Lease management routes
      ...leaseRoutes,
      
      // POS system routes
      ...posRoutes,
      
      // Tailor management routes
      ...tailorRoutes,
      
      // Appointment management routes
      ...appointmentRoutes,
      
      // Catch-all route
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);

// Router provider component
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;

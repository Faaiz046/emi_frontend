import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { selectIsAuthenticated, selectUser, selectIsInitialized } from '../../store/slices/authSlice';
import { Spinner } from '../../shared/components/ui/Spinner';

const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  fallback = '/unauthorized' 
}) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const isInitialized = useAppSelector(selectIsInitialized);
  const location = useLocation();

  // // Show loading spinner while auth is initializing
  // if (!isInitialized) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <Spinner size="lg" />
  //     </div>
  //   );
  // }

  // // Redirect to login if not authenticated
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  // // Check permissions if required
  // if (requiredPermissions.length > 0) {
  //   // For now, allow all authenticated users to access protected routes
  //   // TODO: Implement proper permission checking when user permissions are available
  //   const userPermissions = user?.permissions || ['admin']; // Default to admin for now
  //   const hasPermission = requiredPermissions.some(permission => 
  //     userPermissions.includes(permission)
  //   );
    
  //   if (!hasPermission) {
  //     return <Navigate to={fallback} replace />;
  //   }
  // }

  return children;
};

export default ProtectedRoute;

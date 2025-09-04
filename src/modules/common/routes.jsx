import { lazy } from 'react';
import ProtectedRoute from '../../core/auth/ProtectedRoute';

// Lazy load components
const DashboardPage = lazy(() => import('../../features/dashboard/pages/DashboardPage'));
const CompanyList = lazy(() => import('../../features/company-management/components/CompanyList'));
const UserList = lazy(() => import('../../features/user-management/components/UserList'));
const BranchList = lazy(() => import('../../features/branch-management/components/BranchList'));
const RoleList = lazy(() => import('../../features/role-management/components/RoleList'));
const BrandList = lazy(() => import('../../features/brand-management/components/BrandList'));
const CategoryList = lazy(() => import('../../features/category-management/components/CategoryList'));
const ProductList = lazy(() => import('../../features/product-management/components/ProductList'));
const SettingsPage = lazy(() => import('../../features/settings/pages/SettingsPage'));

export const commonRoutes = [
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute requiredPermissions={['dashboard:access']}>
        <DashboardPage />
      </ProtectedRoute>
    )
  },
  {
    path: '/company',
    element: (
      <ProtectedRoute requiredPermissions={['company:read']}>
        <CompanyList />
      </ProtectedRoute>
    )
  },
  {
    path: '/users',
    element: (
      <ProtectedRoute requiredPermissions={['users:read']}>
        <UserList />
      </ProtectedRoute>
    )
  },
  {
    path: '/branches',
    element: (
      <ProtectedRoute requiredPermissions={['branches:read']}>
        <BranchList />
      </ProtectedRoute>
    )
  },
  {
    path: '/roles',
    element: (
      <ProtectedRoute requiredPermissions={['roles:read']}>
        <RoleList />
      </ProtectedRoute>
    )
  },
  {
    path: '/brands',
    element: (
      <ProtectedRoute requiredPermissions={['brands:read']}>
        <BrandList />
      </ProtectedRoute>
    )
  },
  {
    path: '/categories',
    element: (
      <ProtectedRoute requiredPermissions={['categories:read']}>
        <CategoryList />
      </ProtectedRoute>
    )
  },
  {
    path: '/products',
    element: (
      <ProtectedRoute requiredPermissions={['products:read']}>
        <ProductList />
      </ProtectedRoute>
    )
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute requiredPermissions={['settings:access']}>
        <SettingsPage />
      </ProtectedRoute>
    )
  }
];

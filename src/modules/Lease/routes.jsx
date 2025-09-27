import { lazy } from 'react';
import ProtectedRoute from '../../core/auth/ProtectedRoute';

// Lazy load components
const LeaseAccounts = lazy(() => import('./Accounts/pages'));
const AddUpdateLeaseAccount = lazy(() => import('./Accounts/pages/AccountsPage'));
const InstallmentsPage = lazy(() => import('./installments/pages/InstallmentsPage'));
const OutstandPage = lazy(() => import('./outstand/pages'));
const BankPage = lazy(() => import('./Bank/Pages/BankPage'));
const AccountDetai = lazy(() => import('./Accounts/pages/AccountDetail'));
// const AccountDetails = lazy(() => import('./pages/AccountDetails'));

export const leaseRoutes = [
  {
    path: '/lease/accounts',
    element: (
      <ProtectedRoute requiredPermissions={['accounts:read']}>
        <LeaseAccounts />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lease/accounts/create',
    element: (
      <ProtectedRoute requiredPermissions={['accounts:create']}>
        <AddUpdateLeaseAccount />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lease/accounts/edit/:account_id',
    element: (
      <ProtectedRoute requiredPermissions={['accounts:update']}>
        <AddUpdateLeaseAccount />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lease/installments',
    element: (
      <ProtectedRoute requiredPermissions={['installments:read']}>
        <InstallmentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lease/accounts/:account_id/installments',
    element: (
      <ProtectedRoute requiredPermissions={['installments:read']}>
        <AccountDetai />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lease/outstand',
    element: (
      <ProtectedRoute requiredPermissions={['outstand:read']}>
        <OutstandPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/lease/bank',
    element: (
      <ProtectedRoute requiredPermissions={['bank:read']}>
        <BankPage />
      </ProtectedRoute>
    ),
  },
  //   { path: '/lease/accounts/:account_id', element: <AccountDetails /> }
];

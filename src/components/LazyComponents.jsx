import React, { lazy, Suspense } from "react";
import Layout from "../shared/layouts/Layout";
import { PageLoader } from "../shared/components/ui/PageLoader";
// Lazy load all CRUD components
const DashboardPage = lazy(() =>
  import("../features/dashboard/pages/DashboardPage")
);
const CompanyList = lazy(() =>
  import("../features/company-management/components/CompanyList")
);
const UserList = lazy(() =>
  import("../features/user-management/components/UserList")
);
const BranchList = lazy(() =>
  import("../features/branch-management/components/BranchList")
);
const RoleList = lazy(() =>
  import("../features/role-management/components/RoleList")
);
const BrandList = lazy(() =>
  import("../features/brand-management/components/BrandList")
);
const CategoryList = lazy(() =>
  import("../features/category-management/components/CategoryList")
);
const ProductList = lazy(() =>
  import("../features/product-management/components/ProductList")
);
const AccountsPage = lazy(() =>
  import("../features/accounts/pages/AccountsPage")
);
const AccountsListPage = lazy(() => import("../features/accounts/pages"));
const ColorShowcasePage = lazy(() =>
  import("../features/sidebar-colors/pages/ColorShowcasePage")
);
const SpinnerShowcase = lazy(() =>
  import("../shared/components/ui/SpinnerShowcase")
);
const SettingsPage = lazy(() =>
  import("../features/settings/pages/SettingsPage")
);

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Higher-Order Component to wrap components with Suspense and Layout
const lazyWrapper = (Component) => {
  return () => (
    <Suspense fallback={<PageLoader variant="lazy" />}>
      <Layout>
        <Component />
      </Layout>
    </Suspense>
  );
};

// Create lazy components using the HOC
export const Dashboard = lazyWrapper(DashboardPage);
export const Companies = lazyWrapper(CompanyList);
export const Users = lazyWrapper(UserList);
export const Branches = lazyWrapper(BranchList);
export const Roles = lazyWrapper(RoleList);
export const Brands = lazyWrapper(BrandList);
export const Categories = lazyWrapper(CategoryList);
export const Products = lazyWrapper(ProductList);
export const AddUpdateLeaseAccounts = lazyWrapper(AccountsPage);
export const LeaseAccounts = lazyWrapper(AccountsListPage);
export const ColorShowcase = lazyWrapper(ColorShowcasePage);
export const Spinner = lazyWrapper(SpinnerShowcase);

// Placeholder components for future pages
export const Analytics = lazyWrapper(() => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
    <p className="text-gray-600">Analytics dashboard coming soon...</p>
  </div>
));

export const Settings = lazyWrapper(SettingsPage);

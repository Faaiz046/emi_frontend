import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../shared/layouts/Layout";
import {
  Dashboard,
  Companies,
  Users,
  Branches,
  Roles,
  Brands,
  Categories,
  Products,
  AddUpdateLeaseAccounts,
  LeaseAccounts,
  Analytics,
  Settings,
  ColorShowcase,
  Spinner,
} from "./LazyComponents";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Management routes */}
        <Route path="/company" element={<Companies />} />
        <Route path="/users" element={<Users />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/roles" element={<Roles />} />
        
        {/* Catalog routes */}
        <Route path="/brands" element={<Brands />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/products" element={<Products />} />
        <Route path="/accounts" element={<LeaseAccounts />} />
        <Route path="/accounts/create" element={<AddUpdateLeaseAccounts />} />
        
        {/* Dynamic routes with parameters */}
        <Route path="/accounts/edit/:account_id" element={<AddUpdateLeaseAccounts />} />
        <Route path="/user/:user_id" element={<Users />} />
        <Route path="/user/:user_id/:username" element={<Users />} />
        <Route path="/account/:account_id" element={<AddUpdateLeaseAccounts />} />
        
        {/* Other routes */}
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/sidebar-colors" element={<ColorShowcase />} />
        <Route path="/spinner-showcase" element={<Spinner />} />
        
        {/* Catch-all route - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;

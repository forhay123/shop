"use client";

import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import ResponsiveNavbar from "@/components/ResponsiveNavbar";
import ThemeToggle from "@/components/ThemeToggle";

import EmailVerification from "./pages/auth/EmailVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import CheckoutPage from "@/pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "@/pages/OrdersPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import DashboardPage from "@/pages/DashboardPage"; // user
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminInventoryPage from "@/pages/admin/AdminInventoryPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import UsersPage from "@/pages/admin/UsersPage";
import AdminFinancialsPage from "@/pages/admin/AdminFinancialsPage";
import AdminReviewsPage from "@/pages/admin/AdminReviewsPage"; // ✅ NEW - Import AdminReviewsPage

const queryClient = new QueryClient();

// ----------------- Dashboard Redirect Component -----------------
function DashboardRedirect() {
  const role = localStorage.getItem("role");

  // ✅ UPDATED: Redirects 'read_admin' to the admin dashboard as well.
  if (role === "admin" || role === "read_admin") return <Navigate to="/admin-dashboard" replace />;
  if (role === "user") return <Navigate to="/dashboard" replace />;

  return <Navigate to="/login" replace />;
}

// ----------------- Layout Component -----------------
function Layout() {
  const location = useLocation();
  const hideNavbar = ["/", "/login", "/register"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideNavbar && <ResponsiveNavbar />}
      <main className="pt-20 px-4 flex-1">
        <Routes>
          {/* 🌐 Public routes */}
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* 🔒 User routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="user">
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* 🔒 Admin routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute role="admin">
                <AdminProductsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="admin">
                <AdminOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute role="admin">
                <AdminInventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/financials"
            element={
              <ProtectedRoute role="admin">
                <AdminFinancialsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminReviewsPage /> {/* ✅ NEW - Admin Reviews Route */}
              </ProtectedRoute>
            }
          />

          {/* 🔒 Common routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          {/* ❌ Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

// ----------------- App Component -----------------
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster position="top-right" richColors closeButton />
        <AuthProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Router>
              <ThemeToggle />
              <Routes>
                {/* 🔑 Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<EmailVerification />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* 🏠 Home page */}
                <Route path="/" element={<HomePage />} />

                {/* 🚀 Role-based redirect (after login button etc.) */}
                <Route path="/redirect" element={<DashboardRedirect />} />

                {/* 🌐 Layout */}
                <Route path="/*" element={<Layout />} />
              </Routes>
            </Router>
          </div>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap-icons/font/bootstrap-icons.css";

import { UserProvider, useUser } from "./context/UserContext";
import { InvoiceProvider } from "./context/InvoiceContext";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/User/Dashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import CreateInvoice from "./components/User/CreateInvoice";
import AllInvoices from "./components/Admin/AllInvoices";
import MyInvoices from "./components/User/MyInvoices";
import EditInvoice from "./components/User/EditInvoices";
import EditInvoiceModal from "./components/User/EditModal";
import Profile from "./components/User/Profile";
import Leads from "./components/User/MyLeads";
import ManageUsers from "./components/Admin/ManageUsers";
import Reports from "./components/Admin/Reports";
import Navbar from "./components/User/Navbar";
import AdminNavbar from "./components/Admin/AdminNavbar";
import AdminSettings from "./components/Admin/AdminSettings";

const FullPageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

function AppContent() {
  const { user, setUser, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        if (!["/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname)) {
          navigate("/login");
        }
      } else {
        if (["/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname)) {
          navigate(user.role === "admin" ? "/dashboard" : "/dashboard");
        }
      }
    }
  }, [user, loading, location.pathname, navigate]);

  const handleLogin = (userData) => {
    setUser(userData);
    navigate(userData.role === "admin" ? "/dashboard" : "/dashboard");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (loading) return <FullPageLoader />;
    if (!user) return <Navigate to="/login" replace />;
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/dashboard" replace />;
    return children;
  };

  const showNavbar = !["/login", "/register", "/forgot-password", "/reset-password"].includes(location.pathname);

  return (
    <InvoiceProvider>
      <div className="app-layout">
        {showNavbar && user && (
          <>
            {user.role === "admin" ? (
              <AdminNavbar handleLogout={handleLogout} />
            ) : (
              <Navbar userRole={user.role} handleLogout={handleLogout} />
            )}
          </>
        )}

        <div className={`main-content ${showNavbar ? "" : "full-width"}`}>
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {user?.role === "admin" ? <AdminDashboard /> : <Dashboard />}
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/create"
              element={
                <ProtectedRoute requiredRole="sales">
                  <CreateInvoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/all"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AllInvoices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/invoices/my"
              element={
                <ProtectedRoute requiredRole="sales">
                  <MyInvoices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-invoice/:id"
              element={
                <ProtectedRoute requiredRole="sales">
                  <EditInvoice />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/invoices/edit/:id"
              element={
                <ProtectedRoute requiredRole="admin">
                  <EditInvoiceModal />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leads"
              element={
                <ProtectedRoute>
                  <Leads />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </InvoiceProvider>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

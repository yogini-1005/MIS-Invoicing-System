import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useInvoices } from "../../context/InvoiceContext";
import InvoiceSummaryTable from "./InvoiceSummaryTable";
import "./Dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("month");

  const {
    invoices,
    isLoading: invoiceLoading,
    error: invoiceError,
    refreshInvoices,
  } = useInvoices();

  useEffect(() => {
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        alert("Not logged in");
        setLoading(false);
      });

    refreshInvoices();
  }, [refreshInvoices]);

  if (loading) return <LoadingSpinner />;
  if (!user) return <SessionExpired />;

  const userRole = user?.role;
  const loggedInName = user?.full_name?.toLowerCase() || "";

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Welcome, {user.full_name || "User"} 👋
            </h1>
            <p className="dashboard-subtitle">
              Role:{" "}
              <strong>
                {userRole === "admin" ? "Administrator" : "Sales Team"}
              </strong>
            </p>
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h3 className="section-title">📄 Recent Invoices</h3>
            <div className="section-actions">
              <Link to="/invoices/create" className="btn btn-success me-2">
                + Create Invoice
              </Link>
            </div>
          </div>

          <div className="mb-3">
            <button
              onClick={() => setFilter("all")}
              className={`btn btn-success ${filter === "all" ? "active" : ""}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("month")}
              className={`btn btn-success ${
                filter === "month" ? "active" : ""
              }`}
            >
              This Month
            </button>
          </div>

          {invoiceLoading ? (
            <p>Loading invoices...</p>
          ) : invoiceError ? (
            <p className="text-danger">{invoiceError}</p>
          ) : invoices.length === 0 ? (
            <p>No invoices found</p>
          ) : (
            <InvoiceSummaryTable
              invoices={invoices}
              filter={filter}
              loggedInName={loggedInName}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const LoadingSpinner = () => (
  <div className="loading-screen">
    <div className="spinner"></div>
    <p>Loading your dashboard...</p>
  </div>
);

const SessionExpired = () => (
  <div className="session-modal">
    <div className="session-content">
      <h2>Session Expired</h2>
      <p>Please login again to continue</p>
      <Link to="/login" className="login-button">
        Login
      </Link>
    </div>
  </div>
);

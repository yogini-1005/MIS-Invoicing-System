import React from "react";
import { Link } from "react-router-dom";
import "./AdminNavbar.css"; // Reuse the same styling

export default function AdminNavbar({ handleLogout }) {
  return (
    <div className="navbar-container">
      <div className="sidebar">

        {/* Brand */}
        <div className="brand-section">
          <Link to="/dashboard" className="logo-link">
            <h1>Admin Panel</h1>
          </Link>
        </div>

        {/* User Info */}
        <div className="user-section">
          <div className="user-greeting">Hi, Admin!</div>
          <div className="user-role">admin</div>
        </div>

        {/* Navigation */}
        <nav className="main-nav">

          {/* Home Section */}
          <div className="nav-section">
            <h3 className="nav-section-title">Home</h3>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </div>

          {/* Invoices Section */}
          <div className="nav-section">
            <h3 className="nav-section-title">Invoices</h3>
            <Link to="/invoices/all" className="nav-link">
              All Invoices
            </Link>
          </div>

          {/* Management Section */}
          <div className="nav-section">
            <h3 className="nav-section-title">Management</h3>
            <Link to="/users" className="nav-link">
              Manage Users
            </Link>
            <Link to="/reports" className="nav-link">
              Reports
            </Link>
          </div>

          {/* Settings Section */}
          <div className="nav-section">
            <h3 className="nav-section-title">Settings</h3>
            <Link to="/settings" className="nav-link">
              Admin Settings
            </Link>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="bottom-section">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

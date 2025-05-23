import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, userRole, handleLogout }) => {
  return (
    <div className="navbar-container">
      <div className="sidebar">
        <div className="brand-section">
          <Link to="/dashboard" className="logo-link">
            <h1>MIS System</h1>
          </Link>
        </div>

        <div className="user-section">
          <div className="user-greeting">Hi, {user?.full_name || "User"}!</div>
          <div className="user-role">{userRole}</div>
        </div>

        <nav className="main-nav">
          {/* Common items for all roles */}
          <div className="nav-section">
            <h3 className="nav-section-title">Home</h3>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          </div>

          <div className="nav-section">
            <h3 className="nav-section-title">Invoices</h3>
            <Link to="/invoices/create" className="nav-link">
              Create Invoice
            </Link>
            {userRole === "sales" && (
              <Link to="/invoices/my" className="nav-link">
                My Invoices
              </Link>
            )}
            {userRole === "admin" && (
              <Link to="/invoices/all" className="nav-link">
                All Invoices
              </Link>
            )}
          </div>

          {/* Role-specific sections */}
          {userRole === "sales" && (
            <div className="nav-section">
              <h3 className="nav-section-title">My Leads</h3>
              <Link to="/leads" className="nav-link">
                View Leads
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
            </div>
          )}

          {userRole === "admin" && (
            <>
              <div className="nav-section">
                <h3 className="nav-section-title">Management</h3>
                <Link to="/users" className="nav-link">
                  Manage Users
                </Link>
                <Link to="/reports" className="nav-link">
                  Reports
                </Link>
              </div>
            </>
          )}
        </nav>

        <div className="bottom-section">
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

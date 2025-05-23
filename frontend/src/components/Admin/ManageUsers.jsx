import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Trash, PencilSquare } from "react-bootstrap-icons";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingDelete, setLoadingDelete] = useState({});
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/users", {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const deleteUser = async (userId) => {
    if (!userId) {
      toast.error("Invalid user ID");
      return;
    }

    setLoadingDelete((prev) => ({ ...prev, [userId]: true }));
    try {
      await axios.delete(`/api/users/${userId}`, { withCredentials: true });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to delete user";
      toast.error(errorMessage);
      if (error.response?.data?.error === "Cannot delete your own account") {
        setTimeout(() => navigate("/login"), 2000);
      }
    } finally {
      setLoadingDelete((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const filteredUsers = users.filter((user) =>
    [user.full_name, user.email, user.role].some((field) =>
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const roleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin": return "admin";
      case "editor": return "editor";
      default: return "user";
    }
  };

  return (
    <div className="my-invoices-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="invoice-content-container">
        <div className="invoice-header">
          <h2 className="mb-4 text-primary fw-bold">👥 Manage Users</h2>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, email or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            disabled={isLoading}
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm("")}
              title="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-danger">
            {typeof error === 'string' ? error : "An error occurred"}
            <button
              className="btn btn-sm btn-outline-danger ms-2"
              onClick={fetchUsers}
            >
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner-border text-primary"></div>
            <span className="ms-2">Loading users...</span>
          </div>
        ) : (
          <div className="table-responsive mt-4">
            <table className="invoice-table table table-hover">
              <thead className="table-header">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="invoice-row">
                      <td>{user.full_name || "N/A"}</td>
                      <td>{user.email || "N/A"}</td>
                      <td>
                        <span className={`status-badge ${roleBadgeColor(user.role)}`}>
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <div className="d-flex">
                          <button
                            onClick={() => deleteUser(user._id)}
                            disabled={loadingDelete[user._id]}
                            className="btn btn-sm btn-outline-danger"
                            title={loadingDelete[user._id] ? "Deleting..." : "Delete"}
                          >
                            {loadingDelete[user._id] ? (
                              <span className="spinner-border spinner-border-sm" role="status" />
                            ) : (
                              <Trash size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="no-invoices text-center py-4">
                      {searchTerm ? "No matching users found" : "No users available"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
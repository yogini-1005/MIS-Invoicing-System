import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { jsPDF } from "jspdf";
import { Trash, Download, ArrowClockwise, Funnel } from "react-bootstrap-icons";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AllInvoices.css";

const AllInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);

  useEffect(() => {
    fetchInvoices();
    const interval = setInterval(fetchInvoices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchInvoices = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get("/api/invoices/all", {
        withCredentials: true,
      });
      setInvoices(response.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      toast.error(err.response?.data?.error || "Failed to load invoices");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleDelete = async (invoiceId) => {
    if (!invoiceId) {
      toast.error("Invalid invoice ID");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (!confirmDelete) return;

    setLoadingDelete(true);
    try {
      await axios.delete(`/api/invoices/${invoiceId}`, {
        withCredentials: true,
      });
      toast.success("Invoice deleted successfully");
      setInvoices(invoices.filter((inv) => inv._id !== invoiceId));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err.response?.data?.error || "Failed to delete invoice");
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleStatusChange = async (invoiceId, newStatus) => {
    if (!invoiceId) {
      toast.error("Invalid invoice ID");
      return;
    }

    try {
      await axios.patch(
        `/api/invoices/${invoiceId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );

      setInvoices(
        invoices.map((inv) =>
          inv._id === invoiceId ? { ...inv, status: newStatus } : inv
        )
      );
      window.dispatchEvent(
        new CustomEvent("invoice-updated", {
          detail: { invoiceId },
        })
      );

      toast.success("Status updated successfully");
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to update status"
      );
    }
  };

  const downloadInvoice = (invoice) => {
    try {
      const doc = new jsPDF();
      doc.text(`Invoice for ${invoice.customer_name || "Customer"}`, 10, 10);
      doc.text(`Email: ${invoice.customer_email || "N/A"}`, 10, 20);
      doc.text(
        `Amount: $${(parseFloat(invoice.amount) || 0).toFixed(2)}`,
        10,
        30
      );
      doc.text(`Description: ${invoice.description || "N/A"}`, 10, 40);
      doc.text(`Status: ${invoice.status || "Pending"}`, 10, 50);
      doc.save(`Invoice_${invoice.customer_name || "Invoice"}.pdf`);
      toast.info("Invoice download started!");
    } catch (err) {
      toast.error("Failed to generate PDF");
      console.error("PDF generation error:", err);
    }
  };

  const exportToCSV = () => {
    if (!invoices || invoices.length === 0) {
      toast.warn("No invoices to export.");
      return;
    }

    const headers = [
      "Customer Name",
      "Email",
      "Amount",
      "Description",
      "Status",
      "Created By",
      "Date",
    ];
    const rows = invoices.map((inv) => [
      `"${inv.customer_name || ""}"`,
      `"${inv.customer_email || ""}"`,
      `"${(parseFloat(inv.amount) || 0).toFixed(2)}"`,
      `"${inv.description?.replace(/"/g, '""') || ""}"`,
      `"${inv.status || "Pending"}"`,
      `"${inv.created_by?.full_name || "System"}"`,
      `"${new Date(inv.createdAt).toLocaleDateString()}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "all_invoices.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Invoices exported to CSV!");
  };

  // Filter invoices based on status and search term
  const filteredInvoices = invoices
    .filter((invoice) =>
      statusFilter === "all"
        ? true
        : (invoice.status || "pending") === statusFilter
    )
    .filter(
      (invoice) =>
        invoice.customer_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.customer_email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.created_by?.full_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

  // Get current invoices for pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredInvoices.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredInvoices.length / recordsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const statusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "paid":
        return "paid";
      case "pending":
        return "pending";
      case "overdue":
        return "overdue";
      case "cancelled":
        return "cancelled";
      default:
        return "pending";
    }
  };

  return (
    <div className="my-invoices-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="invoice-content-container">
        <div className="invoice-header">
          <h2 className="mb-4 text-primary fw-bold">📋 Invoice Management</h2>
          <div className="button-group">
            <button
              className="btn btn-primary"
              onClick={exportToCSV}
              disabled={loading || invoices.length === 0}
            >
              Export CSV
            </button>
            <button
              onClick={fetchInvoices}
              disabled={refreshing}
              className="btn btn-primary"
            >
              {refreshing ? (
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                />
              ) : (
                <ArrowClockwise className="me-1" size={16} />
              )}
              Refresh
            </button>
          </div>
        </div>

        <div className="filters-container d-flex justify-content-evenly align-items-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              disabled={loading}
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

          <div className="d-flex justify-content-around align-items-center status-filter">
            <Funnel className="filter-icon" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select"
              disabled={loading}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-border text-primary"></div>
            <span className="ms-2">Loading invoices...</span>
          </div>
        ) : (
          <>
            <div className="table-responsive mt-4">
              <table className="invoice-table table table-hover">
                <thead className="table-header">
                  <tr>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Created By</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {currentRecords.length > 0 ? (
                    currentRecords.map((invoice) => (
                      <tr key={invoice._id} className="invoice-row">
                        <td>
                          <div className="fw-medium">
                            {invoice.customer_name || "N/A"}
                          </div>
                          <div className="text-muted small">
                            {invoice.customer_email || ""}
                          </div>
                        </td>
                        <td className="amount-cell">
                          ${(parseFloat(invoice.amount) || 0).toFixed(2)}
                        </td>
                        <td>
                          <div
                            className="text-truncate"
                            style={{ maxWidth: "200px" }}
                            title={invoice.description}
                          >
                            {invoice.description || "N/A"}
                          </div>
                        </td>
                        <td>
                          <select
                            value={invoice.status || "pending"}
                            onChange={(e) =>
                              handleStatusChange(invoice._id, e.target.value)
                            }
                            className={`form-select form-select-sm status-select ${statusClass(
                              invoice.status
                            )}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>{invoice.created_by?.full_name || "System"}</td>
                        <td>
                          {invoice.createdAt
                            ? new Date(invoice.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="actions-cell">
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => handleDelete(invoice._id)}
                              disabled={loadingDelete}
                              className="btn btn-sm btn-outline-danger"
                              title={loadingDelete ? "Deleting..." : "Delete"}
                            >
                              {loadingDelete ? (
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                />
                              ) : (
                                <Trash size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => downloadInvoice(invoice)}
                              className="btn btn-sm btn-outline-primary"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr key="no-invoices">
                      <td colSpan="7" className="no-invoices text-center py-4">
                        {invoices.length === 0
                          ? "No invoices found"
                          : "No invoices match the selected filters"}
                        {invoices.length === 0 && (
                          <button
                            onClick={fetchInvoices}
                            className="btn btn-primary mt-3"
                          >
                            Try Again
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredInvoices.length > recordsPerPage && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <li
                        key={number}
                        className={`page-item ${
                          currentPage === number ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(number)}
                        >
                          {number}
                        </button>
                      </li>
                    )
                  )}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}

            <div className="text-muted text-center mt-2">
              Showing {currentRecords.length} of {filteredInvoices.length}{" "}
              invoices
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllInvoices;

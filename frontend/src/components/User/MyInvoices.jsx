import React, { useEffect, useState } from "react";
import { useInvoices } from "../../context/InvoiceContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { jsPDF } from "jspdf";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MyInvoices.css";
import { PencilSquare, Trash, Download } from "react-bootstrap-icons";

const MyInvoices = () => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();
  const { invoices, isLoading, error, refreshInvoices } = useInvoices();

  // Filtered invoices based on search term
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_email
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      invoice.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Refresh invoices initially and every 30s
  useEffect(() => {
    refreshInvoices();
    const interval = setInterval(refreshInvoices, 30000);
    return () => clearInterval(interval);
  }, [refreshInvoices]);

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Validate current page when filtered invoices change
  useEffect(() => {
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalPages === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [filteredInvoices, itemsPerPage, currentPage]);

  const deleteInvoice = async (id) => {
    if (!id) {
      toast.error("Invalid invoice ID");
      return;
    }
    setLoadingDelete(true);
    try {
      await axios.delete(`/api/invoices/${id}`, { withCredentials: true });
      await refreshInvoices();
      toast.success("Invoice deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete invoice.");
      console.error("Delete error:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  const editInvoice = (id) => {
    if (!id) {
      toast.error("Invalid invoice ID");
      return;
    }
    navigate(`/edit-invoice/${id}`);
  };

  const downloadInvoice = (invoice) => {
    try {
      const doc = new jsPDF();
      doc.text(`Invoice for ${invoice.customer_name || "Customer"}`, 10, 10);
      doc.text(`Email: ${invoice.customer_email || "N/A"}`, 10, 20);
      doc.text(
        `Amount: ₹${(parseFloat(invoice.amount) || 0).toFixed(2)}`,
        10,
        30
      );
      doc.text(`Description: ${invoice.description || "N/A"}`, 10, 40);
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
      "Customer Email",
      "Amount",
      "Description",
      "Status",
      "Date",
    ];
    const rows = invoices.map((inv) => [
      `"${inv.customer_name || ""}"`,
      `"${inv.customer_email || ""}"`,
      `"${(parseFloat(inv.amount) || 0).toFixed(2)}"`,
      `"${inv.description?.replace(/"/g, '""') || ""}"`,
      `"${inv.status || "Pending"}"`,
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate page numbers with ellipsis for large number of pages
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftBound = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1);

      if (leftBound > 1) {
        pages.push(1);
        if (leftBound > 2) {
          pages.push("...");
        }
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pages.push(i);
      }

      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    const handleInvoiceUpdate = () => refreshInvoices();

    window.addEventListener("invoice-updated", handleInvoiceUpdate);

    return () => {
      window.removeEventListener("invoice-updated", handleInvoiceUpdate);
    };
  }, [refreshInvoices]);

  // Update refresh interval to 10 seconds
  useEffect(() => {
    refreshInvoices();
    const interval = setInterval(refreshInvoices, 10000);
    return () => clearInterval(interval);
  }, [refreshInvoices]);

  return (
    <div className="my-invoices-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="invoice-content-container">
        <div className="invoice-header">
          <h2 className="mb-4 text-success fw-bold">🧾 My Invoices</h2>
          <div className="button-group">
            <button
              className="btn btn-success"
              onClick={() => navigate("/invoices/create")}
              aria-label="Create Invoice"
            >
              + Create Invoice
            </button>
            <button
              className="btn btn-success"
              onClick={exportToCSV}
              disabled={isLoading || invoices.length === 0}
              aria-label="Export invoices to CSV"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, email or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            disabled={isLoading}
            aria-label="Search invoices"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => setSearchTerm("")}
              title="Clear search"
              aria-label="Clear search input"
            >
              ×
            </button>
          )}
        </div>

        {error && (
          <div className="alert alert-danger" role="alert">
            {typeof error === "string" ? error : "An error occurred"}
          </div>
        )}

        {isLoading ? (
          <div className="loading-spinner" role="status" aria-live="polite">
            <div className="spinner-border text-primary"></div>
            <span className="ms-2">Loading invoices...</span>
          </div>
        ) : (
          <>
            <InvoiceTable
              invoices={paginatedInvoices}
              onEdit={editInvoice}
              onDelete={deleteInvoice}
              onDownload={downloadInvoice}
              loadingDelete={loadingDelete}
            />

            {totalPages > 1 && (
              <div className="pagination-controls">
                {/* Pagination buttons */}
                {getPageNumbers().map((page, index) => (
                  <button
                    key={`page-${page}-${index}`} // Fixed key
                    className={`btn ${
                      page === currentPage
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    } ${page === "..." ? "disabled" : ""}`}
                    onClick={() => typeof page === "number" && goToPage(page)}
                    disabled={page === "..." || page === currentPage}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}

            <div className="pagination-info">
              Showing {paginatedInvoices.length} of {filteredInvoices.length}{" "}
              invoices
              {filteredInvoices.length > itemsPerPage && (
                <span className="page-indicator"></span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const InvoiceTable = ({
  invoices,
  onEdit,
  onDelete,
  onDownload,
  loadingDelete,
}) => {
  return (
    <div className="table-responsive mt-4">
      <table className="invoice-table table table-hover">
        <thead className="table-header">{/* ... [Same as before] ... */}</thead>
        <tbody className="table-body">
          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <InvoiceRow
                key={invoice._id} // Simplified key (assuming _id always exists)
                invoice={invoice}
                onEdit={onEdit}
                onDelete={onDelete}
                onDownload={onDownload}
                loadingDelete={loadingDelete}
              />
            ))
          ) : (
            <tr key="no-invoices">
              {" "}
              {/* Added key here */}
              <td colSpan="7" className="no-invoices text-center py-4">
                No invoices found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Th = ({ children }) => <th className="table-th">{children}</th>;

const InvoiceRow = ({
  invoice,
  onEdit,
  onDelete,
  onDownload,
  loadingDelete,
}) => {
  const statusClass = (status) => {
    switch ((status || "").toLowerCase()) {
      case "paid":
        return "paid";
      case "pending":
        return "pending";
      case "overdue":
        return "overdue";
      case "draft":
        return "draft";
      default:
        return "pending";
    }
  };

  return (
    <tr className="invoice-row" key={invoice._id}>
      <td>{invoice.customer_name || "N/A"}</td>
      <td>{invoice.customer_email || "N/A"}</td>
      <td className="amount-cell">
        ₹{(parseFloat(invoice.amount) || 0).toFixed(2)}
      </td>
      <td>{invoice.description || "N/A"}</td>
      <td>
        <span className={`status-badge ${statusClass(invoice.status)}`}>
          {invoice.status || "Pending"}
        </span>
      </td>
      <td>
        {invoice.createdAt
          ? new Date(invoice.createdAt).toLocaleDateString()
          : "N/A"}
      </td>
      <td className="actions-cell">
        <div className="d-flex gap-2">
          <button
            onClick={() => onEdit(invoice._id || invoice.id)}
            className="btn btn-sm btn-outline-primary"
            title="Edit"
            aria-label={`Edit invoice for ${
              invoice.customer_name || "customer"
            }`}
          >
            <PencilSquare size={16} />
          </button>
          <button
            onClick={() => onDelete(invoice._id || invoice.id)}
            disabled={loadingDelete}
            className="btn btn-sm btn-outline-danger"
            title={loadingDelete ? "Deleting..." : "Delete"}
            aria-label={`Delete invoice for ${
              invoice.customer_name || "customer"
            }`}
          >
            {loadingDelete ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              />
            ) : (
              <Trash size={16} />
            )}
          </button>
          <button
            onClick={() => onDownload(invoice)}
            className="btn btn-sm btn-outline-success"
            title="Download Invoice"
            aria-label={`Download invoice PDF for ${
              invoice.customer_name || "customer"
            }`}
          >
            <Download size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default MyInvoices;

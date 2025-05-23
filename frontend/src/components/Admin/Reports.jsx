import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { EyeFill, Funnel } from "react-bootstrap-icons";
import { Modal, Button } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Reports.css";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const fetchReports = async () => {
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockReports = [
        { id: 1, title: "January Sales", date: "2025-01-31", status: "Paid" },
        { id: 2, title: "February Sales", date: "2025-02-28", status: "Pending" },
        { id: 3, title: "User Activity", date: "2025-03-10", status: "Paid" },
        { id: 4, title: "System Usage", date: "2025-04-15", status: "Overdue" },
      ];
      setReports(mockReports);
    } catch {
      setError("Failed to load reports");
      toast.error("Failed to load reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const matchesStatus =
      filterStatus === "All" || report.status === filterStatus;
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.date.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Paid":
        return "paid";
      case "Pending":
        return "pending";
      case "Overdue":
        return "overdue";
      case "Cancelled":
        return "cancelled";
      default:
        return "";
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  return (
    <div className="my-invoices-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="invoice-content-container">
        <div className="invoice-header">
          <h2 className="mb-4 text-primary fw-bold">📊 Reports</h2>
        </div>

        <div className="filters-container d-flex justify-content-evenly align-items-center">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by title or date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              aria-label="Search reports by title or date"
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

          <div className="d-flex justify-content-around align-items-center status-filter">
            <Funnel className="filter-icon" size={16} />
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              aria-label="Filter reports by status"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && (
          <div
            className="alert alert-danger d-flex align-items-center justify-content-between"
            role="alert"
          >
            <span>{error}</span>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={fetchReports}
            >
              Retry
            </button>
          </div>
        )}

        <div className="table-responsive mt-3">
          <table className="invoice-table table table-hover" aria-label="Reports Table">
            <thead className="table-header text-center">
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Title</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody className="table-body text-center">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <tr key={report.id} className="invoice-row">
                    <td>{report.id}</td>
                    <td>{report.title}</td>
                    <td>{report.date}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary"
                        title={`View report ${report.title}`}
                        aria-label={`View report ${report.title}`}
                        onClick={() => handleViewReport(report)}
                      >
                        <EyeFill size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-invoices text-center py-4">
                    {searchTerm || filterStatus !== "All"
                      ? "No reports found for this filter."
                      : "No reports available."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Report Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport ? (
            <>
              <p><strong>ID:</strong> {selectedReport.id}</p>
              <p><strong>Title:</strong> {selectedReport.title}</p>
              <p><strong>Date:</strong> {selectedReport.date}</p>
              <p><strong>Status:</strong> {selectedReport.status}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Reports;

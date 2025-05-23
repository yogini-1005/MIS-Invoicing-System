import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./EditInvoice.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  useEffect(() => {
    if (!isValidObjectId(id)) {
      setError("Invalid invoice ID format.");
      setLoading(false);
      navigate("/invoices/my", {
        replace: true,
        state: { error: "Invalid invoice ID" },
      });
      return;
    }

    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`/api/invoices/${id}`, {
          withCredentials: true,
        });

        if (res.data.error) {
          throw new Error(res.data.error);
        }

        setInvoice(res.data);
        setError("");
      } catch (err) {
        const message =
          err.response?.data?.error || "Failed to load invoice";
        setError(message);
        if (err.response?.status === 404) {
          navigate("/invoices/my", {
            replace: true,
            state: { error: "Invoice not found" },
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setUpdating(true);
  try {
    const url = `/api/invoices/${id}`;
    console.log("Making PUT request to:", url); // Add this line
    await axios.put(url, invoice, {
      withCredentials: true,
    });
    toast.success("Invoice updated successfully!");
    setTimeout(() => navigate("/invoices/my"), 2000);
  } catch (err) {
    console.error("Update error:", err); // More detailed error logging
    const message =
      err.response?.data?.error || "Failed to update invoice";
    setError(message);
    toast.error(message);
  } finally {
    setUpdating(false);
  }
};

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="loading-message">Loading...</div>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="shadow-lg p-5 rounded-4 bg-white"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <h2 className="mb-4 text-center text-success fw-bold">
          🧾 Edit Invoice
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="invoice-form" noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Customer Name</label>
            <input
              type="text"
              name="customer_name"
              value={invoice?.customer_name || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter customer name"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Customer Email</label>
            <input
              type="email"
              name="customer_email"
              value={invoice?.customer_email || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Amount</label>
            <input
              type="number"
              name="amount"
              value={invoice?.amount || ""}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              value={invoice?.description || ""}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Write a short description"
              required
            />
          </div>

          <button
            type="submit"
            disabled={updating}
            className="btn btn-success w-100 rounded-pill"
          >
            {updating ? "Updating..." : "Update Invoice"}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default EditInvoice;

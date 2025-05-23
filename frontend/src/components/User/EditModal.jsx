import React, { useState, useEffect } from "react";

const EditInvoiceModal = ({ invoice, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    amount: 0,
    description: "",
    status: "pending",
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        customer_name: invoice.customer_name || "",
        customer_email: invoice.customer_email || "",
        amount: invoice.amount || 0,
        description: invoice.description || "",
        status: invoice.status || "pending",
      });
    }
  }, [invoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...invoice, ...formData });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content p-4 bg-white rounded shadow-lg max-w-md mx-auto">
        <h3 className="mb-4 font-bold text-lg">Edit Invoice</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            placeholder="Customer Name"
            required
            className="input-field"
          />
          <input
            name="customer_email"
            type="email"
            value={formData.customer_email}
            onChange={handleChange}
            placeholder="Customer Email"
            required
            className="input-field"
          />
          <input
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Amount"
            required
            className="input-field"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            rows="3"
            required
            className="input-field"
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInvoiceModal;

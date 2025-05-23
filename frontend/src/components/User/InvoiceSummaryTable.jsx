import React from "react";
import "./InvoiceSummaryTable.css";

const InvoiceSummaryTable = ({
  invoices,
  filter = "all",
  loggedInName = "",
}) => {
  const today = new Date();

  // Filter invoices based on filter type
  const filtered = invoices.filter((inv) => {
    if (filter === "my") {
      // filter by logged in user's name in customer_name (case insensitive)
      return inv.customer_name.toLowerCase().includes(loggedInName.toLowerCase());
    } else if (filter === "month") {
      const date = new Date(inv.createdAt);
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }
    return true; // all invoices
  });

  const totalAmount = filtered.reduce((sum, inv) => sum + (inv.amount || 0), 0);

  return (
    <>
      <div className="invoice-summary-stats">
        <p>
          <strong>Invoices:</strong> {filtered.length}
        </p>
        <p>
          <strong>Total:</strong> ₹
          {totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
      <div className="invoice-card-grid">
        {filtered.map((invoice) => {
          // Create a more reliable key if _id might be missing
          const uniqueKey = invoice._id || 
                           `${invoice.customer_email}-${invoice.createdAt}-${invoice.amount}`;
          
          return (
            <div className="invoice-card" key={uniqueKey}>
              <div className="invoice-header">
                <h4>{invoice.customer_name}</h4>
                <span className="invoice-amount">
                  ₹{invoice.amount?.toFixed(2)}
                </span>
              </div>
              <div className="invoice-body">
                <p>
                  <strong>Email:</strong> {invoice.customer_email}
                </p>
                <p>
                  <strong>Description:</strong> {invoice.description}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(invoice.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`status-badge ${
                      invoice.status?.toLowerCase() || "pending"
                    }`}
                  >
                    {invoice.status || "Pending"}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default InvoiceSummaryTable;
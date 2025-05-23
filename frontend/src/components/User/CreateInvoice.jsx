import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useInvoices } from '../../context/InvoiceContext';

const CreateInvoice = () => {
  const { refreshInvoices } = useInvoices();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    amount: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (message.type === 'success') {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const validateField = (name, value) => {
    switch (name) {
      case 'customerName':
        return !value.trim() ? 'Customer name is required' : '';
      case 'customerEmail':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
        return '';
      case 'amount':
        if (!value) return 'Amount is required';
        if (isNaN(value) || parseFloat(value) <= 0) return 'Amount must be a positive number';
        return '';
      case 'description':
        return !value.trim() ? 'Description is required' : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      customerName: validateField('customerName', formData.customerName),
      customerEmail: validateField('customerEmail', formData.customerEmail),
      amount: validateField('amount', formData.amount),
      description: validateField('description', formData.description)
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      await axios.post('/api/invoices', {
        customer_name: formData.customerName,
        customer_email: formData.customerEmail,
        amount: parseFloat(formData.amount),
        description: formData.description
      }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });

      setMessage({ text: 'Invoice created successfully!', type: 'success' });
      setFormData({
        customerName: '',
        customerEmail: '',
        amount: '',
        description: ''
      });

      await refreshInvoices();

    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create invoice. Please try again.';
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="shadow-lg p-5 rounded-4 bg-white" style={{ width: '100%', maxWidth: '500px' }}>
        <h2 className="mb-4 text-center text-success fw-bold">🧾 New Invoice</h2>

        {message.text && (
          <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label className="form-label fw-semibold">Customer Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
              placeholder="Enter customer name"
              required
            />
            {errors.customerName && <div className="invalid-feedback">{errors.customerName}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Customer Email</label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${errors.customerEmail ? 'is-invalid' : ''}`}
              placeholder="example@email.com"
              required
            />
            {errors.customerEmail && <div className="invalid-feedback">{errors.customerEmail}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
            {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              rows="3"
              placeholder="Write a short description"
              required
            />
            {errors.description && <div className="invalid-feedback">{errors.description}</div>}
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-pill" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Invoice'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoice;

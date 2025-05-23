import mongoose from 'mongoose';
import validator from 'validator';
import Invoice from '../models/Invoice.js';

// Create Invoice
export const createInvoice = async (req, res) => {
  const { customer_name, customer_email, amount, description } = req.body;

  if (!customer_name?.trim() || !customer_email?.trim() || !amount || !description?.trim()) {
    return res.status(400).json({
      error: 'All fields are required',
      received: req.body
    });
  }

  if (!validator.isEmail(customer_email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const newInvoice = new Invoice({
      customer_name: customer_name.trim(),
      customer_email: customer_email.trim().toLowerCase(),
      amount: parseFloat(amount),
      description: description.trim(),
      user: userId
    });

    const savedInvoice = await newInvoice.save();
    return res.status(201).json(savedInvoice);
  } catch (err) {
    console.error('Detailed error:', err);
    return res.status(500).json({
      error: 'Server error',
      message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Fetch All Invoices of Authenticated User
export const getMyInvoices = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const invoices = await Invoice.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
};

// Get Single Invoice by ID
export const getInvoiceById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id || req.user?.id;

  if (!id) {
    return res.status(400).json({
      error: 'Invoice ID is required',
      details: 'No ID was provided in the request URL'
    });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: 'Invalid invoice ID format',
      details: 'ID must be a 24-character hex string',
      received: id,
      example: '507f1f77bcf86cd799439011'
    });
  }

  try {
    const invoice = await Invoice.findOne({ 
      _id: id, 
      user: userId 
    }).populate('user', 'full_name email');

    if (!invoice) {
      return res.status(404).json({
        error: 'Invoice not found',
        details: `No invoice found with ID ${id} for current user`,
        suggestion: 'Check if the invoice exists and belongs to you'
      });
    }

    res.status(200).json(invoice);
  } catch (err) {
    console.error(`Error fetching invoice ${id}:`, err);

    if (err.name === 'CastError') {
      return res.status(400).json({
        error: 'Database ID format error',
        details: 'The provided ID could not be cast to ObjectId',
        received: id
      });
    }

    res.status(500).json({
      error: 'Server error while fetching invoice',
      details: process.env.NODE_ENV === 'development' ? {
        message: err.message,
        stack: err.stack
      } : undefined
    });
  }
};

// Update Invoice
export const updateInvoice = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ 
        error: 'Invoice not found or not owned by you' 
      });
    }

    res.status(200).json(invoice);
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(500).json({ 
      error: 'Failed to update invoice',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Delete Invoice
export const deleteInvoice = async (req, res) => {
  const invoiceId = req.params.id;

  if (!invoiceId || !mongoose.Types.ObjectId.isValid(invoiceId)) {
    return res.status(400).json({ error: 'Invalid invoice ID' });
  }

  try {
    const userId = req.user?._id || req.user?.id;
    const invoice = await Invoice.findOneAndDelete({ _id: invoiceId, user: userId });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error('Error deleting invoice:', err);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
};

// Update Invoice Status (Admin Only)
export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'cancelled', 'overdue'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update status' });
    }

    const invoice = await Invoice.findByIdAndUpdate(id, { status }, { new: true });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Server error updating status' });
  }
};

// Get All Invoices (Admin Only)
export const getAllInvoices = async (req, res) => {
  console.log('User making request:', req.user);

  if (!req.user || req.user.role !== 'admin') {
    console.log('Unauthorized access attempt:', req.user);
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  try {
    const invoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .populate('user', 'full_name email');

    res.status(200).json(invoices);
  } catch (err) {
    console.error('Error fetching all invoices:', err);
    res.status(500).json({ 
      error: 'Failed to fetch invoices',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

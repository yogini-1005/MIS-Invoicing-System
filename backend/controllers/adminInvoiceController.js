import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';

// Note: no 'exports.' here, just export functions directly

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .populate('user', 'full_name email');
    res.status(200).json(invoices);
  } catch (err) {
    console.error('Error fetching all invoices:', err);
    res.status(500).json({
      error: 'Failed to fetch invoices',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

export const updateAnyInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const allowedFields = [
      'customer_name',
      'customer_email',
      'amount',
      'description',
      'status',
    ];
    const updates = {};
    for (const key of allowedFields) {
      if (updateFields[key] !== undefined) updates[key] = updateFields[key];
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate('user', 'full_name email');

    if (!updatedInvoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json(updatedInvoice);
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(500).json({
      error: 'Failed to update invoice',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'cancelled', 'overdue'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Invalid status value',
        validStatuses,
      });
    }

    const invoice = await Invoice.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user', 'full_name email');

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Server error updating status',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

export const getAnyInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate(
      'user',
      'full_name email'
    );

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (err) {
    console.error('Error fetching invoice:', err);
    res.status(500).json({
      error: 'Failed to fetch invoice',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

export const deleteAnyInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error('Error deleting invoice:', err);
    res.status(500).json({
      error: 'Failed to delete invoice',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
};

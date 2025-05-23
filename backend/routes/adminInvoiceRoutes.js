import express from 'express';
import { requireLogin, requireAdmin } from '../middlewares/authMiddleware.js';
import * as adminInvoiceController from '../controllers/adminInvoiceController.js'; // ✅ Correct

const router = express.Router();

// Admin-only routes
router.get('/all', requireLogin, requireAdmin, adminInvoiceController.getAllInvoices);
router.patch('/:id/status', requireLogin, requireAdmin, adminInvoiceController.updateInvoiceStatus);
router.get('/:id', requireLogin, requireAdmin, adminInvoiceController.getAnyInvoice);
router.delete('/:id', requireLogin, requireAdmin, adminInvoiceController.deleteAnyInvoice);
router.put('/:id', requireLogin, requireAdmin, adminInvoiceController.updateAnyInvoice);

export default router;

import express from 'express';
import { requireLogin, requireAdmin } from '../middlewares/authMiddleware.js';
import * as invoiceController from '../controllers/invoiceController.js'; // <-- Correct way

const router = express.Router();

router.post('/', requireLogin, invoiceController.createInvoice);
router.get('/my', requireLogin, invoiceController.getMyInvoices);
router.get('/all', requireLogin, requireAdmin, invoiceController.getAllInvoices);
router.get('/:id', requireLogin, invoiceController.getInvoiceById);
router.put('/:id', requireLogin, invoiceController.updateInvoice);
router.delete('/:id', requireLogin, invoiceController.deleteInvoice);
router.patch('/:id/status', requireLogin, invoiceController.updateInvoiceStatus);

export default router;

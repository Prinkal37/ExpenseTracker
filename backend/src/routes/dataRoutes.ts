import express from 'express';
import authenticateToken from '../middleware/authMiddleware';
import { createDebit, createCredit, createDebt, createReceivable,updateDebtOrReceivable } from '../controllers/dataController';

const router = express.Router();

// Routes for creating data
router.post('/Debit', authenticateToken, createDebit);
router.post('/Credit', authenticateToken, createCredit);
router.post('/Debt', authenticateToken, createDebt);
router.post('/Receivable', authenticateToken, createReceivable);
router.post('/UpdateStatus', authenticateToken, updateDebtOrReceivable);

export default router;

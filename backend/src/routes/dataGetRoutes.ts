import express from 'express';
import authenticateToken from '../middleware/authMiddleware';
import {
  getDebits,
  getCredits,
  getDebts,
  getReceivables,
} from '../controllers/dataGetController';

const router = express.Router();

router.get('/debits', authenticateToken, getDebits);
router.get('/credits', authenticateToken, getCredits);
router.get('/debts', authenticateToken, getDebts);
router.get('/receivables', authenticateToken, getReceivables);

export default router;

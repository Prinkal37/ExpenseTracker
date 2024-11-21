// src/routes/totalAmountRoutes.ts
import express from 'express';
import { getTotalAmount, updateTotalAmount } from '../controllers/totalAmountController';
import authenticateToken from '../middleware/authMiddleware';

const router = express.Router();

// Get the total amount for the authenticated user
router.get('/', authenticateToken, getTotalAmount);

// Update the total amount for the authenticated user
router.put('/', authenticateToken, updateTotalAmount);

export default router;

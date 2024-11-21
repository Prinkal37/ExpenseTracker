import express from 'express';
import { getPieChartData } from '../controllers/chartController';
import authenticateToken from '../middleware/authMiddleware'; // Import the authentication middleware

const router = express.Router();

// Use the authenticateToken middleware to protect the route
router.get('/piechart', authenticateToken, getPieChartData);

export default router;

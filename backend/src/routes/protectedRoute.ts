// src/routes/protectedRoute.ts

import express from 'express';
import authenticateToken from "../middleware/authMiddleware";

const router = express.Router();

// Example of a protected route
router.get('/profile', authenticateToken, (req, res) => {
  res.json({ message: 'This is protected data', user: req.user });
});

export default router;

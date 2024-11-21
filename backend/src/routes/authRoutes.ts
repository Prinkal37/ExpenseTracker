// src/routes/authRoutes.ts
import express from 'express';
import { register, login, refreshToken } from '../controllers/authController';

const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', login);

// Route for refreshing the access token
router.post('/refresh', refreshToken);

export default router;

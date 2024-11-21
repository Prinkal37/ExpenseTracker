// src/server.ts
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import protectedRoute from './routes/protectedRoute';
import chartRoutes from './routes/chartRoutes';
import dataRoutes from './routes/dataRoutes';
import totalAmountRoutes from './routes/totalAmountRoutes';  // Import totalAmount routes
import dataGetRoutes from './routes/dataGetRoutes'
import cors from 'cors'

dotenv.config();

const app = express();

// Middleware to parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());
app.use(cors());  

// Use routes
app.use('/api/auth', authRoutes);          // Authentication routes
app.use('/api', protectedRoute);           // Protect any route you want
app.use('/api/charts', chartRoutes);       // Charts-related routes
app.use('/api/data', dataRoutes);          // Data-related routes for Debit, Credit, etc.
app.use('/api/getData',dataGetRoutes);     // Get the Data for debit, credit, debt, receivable
app.use('/api/totalAmount', totalAmountRoutes);  // TotalAmount-related routes

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
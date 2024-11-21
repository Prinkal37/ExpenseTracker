// src/controllers/totalAmountController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get the total amount for the authenticated user
export const getTotalAmount = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(400).json({ message: 'User ID is required.' });
    return;
  }

  try {
    // Fetch the total amount for the user
    const totalAmount = await prisma.totalAmount.findUnique({
      where: { userId },
    });

    if (!totalAmount) {
      res.status(404).json({ message: 'Total amount not found for this user.' });
      return;
    }

    res.status(200).json(totalAmount);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch total amount', error });
  }
};

// Update the total amount for the authenticated user
export const updateTotalAmount = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?.id;
  const { total } = req.body;

  if (!userId) {
    res.status(400).json({ message: 'User ID is required.' });
    return;
  }

  if (total === undefined) {
    res.status(400).json({ message: 'Total amount is required.' });
    return;
  }

  try {
    // Check if total amount exists for the user, then update it
    const existingTotalAmount = await prisma.totalAmount.findUnique({
      where: { userId },
    });

    if (!existingTotalAmount) {
      // If no total amount exists, create a new one
      const newTotalAmount = await prisma.totalAmount.create({
        data: {
          total,
          user: {
            connect: { id: req.user?.id },
          },
        },
      });

      res.status(201).json(newTotalAmount);
    } else {
      // If total amount exists, update it
      const updatedTotalAmount = await prisma.totalAmount.update({
        where: { userId },
        data: { total },
      });

      res.status(200).json(updatedTotalAmount);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update total amount', error });
  }
};

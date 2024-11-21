import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create Debit Entry
export const createDebit = async (req: Request, res: Response): Promise<void> => {
  const { money, description, category } = req.body;

  if (!req.user) {
    res.status(403).json({ message: 'Access denied. User not authenticated' });
    return;
  }

  try {
    // Create the debit entry
    const debit = await prisma.debit.create({
      data: {
        money,
        description,
        category,
        date: new Date(),
        totalAmount: {
          connect: { userId: req.user.id }, // Connect to the user's totalAmount
        },
      },
    });

    // Update the totalAmount: Deduct the money
    await prisma.totalAmount.update({
      where: { userId: req.user.id },
      data: {
        total: {
          decrement: money, // Deduct the money from the totalAmount
        },
      },
    });

    res.status(201).json({ message: 'Debit entry created successfully', debit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating debit entry' });
  }
};

// Create Credit Entry
export const createCredit = async (req: Request, res: Response): Promise<void> => {
  const { money, description, category } = req.body;

  if (!req.user) {
    res.status(403).json({ message: 'Access denied. User not authenticated' });
    return;
  }

  try {
    const credit = await prisma.credit.create({
      data: {
        money,
        description,
        category,
        date: new Date(),
        totalAmount: {
          connect: { userId: req.user.id }, // Connect to the user's totalAmount
        },
      },
    });

    // Update the totalAmount: Add the money
    await prisma.totalAmount.update({
      where: { userId: req.user.id },
      data: {
        total: {
          increment: money, // Add the money to the totalAmount
        },
      },
    });

    res.status(201).json({ message: 'Credit entry created successfully', credit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating credit entry' });
  }
};

// Create Debt Entry
export const createDebt = async (req: Request, res: Response): Promise<void> => {
  const { money, description, status } = req.body;

  if (!req.user) {
    res.status(403).json({ message: 'Access denied. User not authenticated' });
    return;
  }

  try {
    const debt = await prisma.debt.create({
      data: {
        money,
        description,
        status: status || false,
        date: new Date(),
        totalAmount: {
          connect: { userId: req.user.id }, // Connect to the user's totalAmount
        },
      },
    });

    // If the status is true, deduct the money from the totalAmount
    if (debt.status) {
      await prisma.totalAmount.update({
        where: { userId: req.user.id },
        data: {
          total: {
            decrement: money, // Deduct the money from the totalAmount
          },
        },
      });
    }

    res.status(201).json({ message: 'Debt entry created successfully', debt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating debt entry' });
  }
};

// Create Receivable Entry
export const createReceivable = async (req: Request, res: Response): Promise<void> => {
  const { money, description, status } = req.body;

  if (!req.user) {
    res.status(403).json({ message: 'Access denied. User not authenticated' });
    return;
  }

  try {
    const receivable = await prisma.receivable.create({
      data: {
        money,
        description,
        status: status || false,
        date: new Date(),
        totalAmount: {
          connect: { userId: req.user.id }, // Connect to the user's totalAmount
        },
      },
    });

    // If the status is true, add the money to the totalAmount
    if (receivable.status) {
      await prisma.totalAmount.update({
        where: { userId: req.user.id },
        data: {
          total: {
            increment: money, // Add the money to the totalAmount
          },
        },
      });
    }

    res.status(201).json({ message: 'Receivable entry created successfully', receivable });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating receivable entry' });
  }
};

// handle update debt or receivable status
export const updateDebtOrReceivable = async (req: Request, res: Response): Promise<void> => {
  const { status, entryId, entryType } = req.body;

  // Validate the request body
  if (!entryType || !["receivable", "debt"].includes(entryType)) {
    res.status(400).json({ message: "Invalid or missing entryType" });
    return;
  }

  try {
    // Fetch the existing record based on entryType
    const existingEntry =
      entryType === "receivable"
        ? await prisma.receivable.findUnique({ where: { id: entryId } })
        : await prisma.debt.findUnique({ where: { id: entryId } });

    // Check if the entry exists
    if (!existingEntry) {
      res.status(404).json({ message: `${entryType} not found` });
      return;
    }

    // Validate money field
    if (typeof existingEntry.money !== "number") {
      res.status(400).json({ message: "Invalid money value" });
      return;
    }

    // Initialize increment with a default value (0)
    let increment: number = 0;

    // Calculate the increment/decrement value based on entryType
    if (entryType === "debt") {
      // For debts, subtract the amount when marked as paid
      increment = status ? -existingEntry.money : existingEntry.money;
    } else if (entryType === "receivable") {
      // For receivables, add the amount when marked as paid
      increment = status ? existingEntry.money : -existingEntry.money;
    }

    // Update the totalAmount only if the status has changed
    if (existingEntry.status !== status) {
      await prisma.totalAmount.update({
        where: {
          userId: req.user?.id, // Assuming userId is 1, adjust as needed
        },
        data: {
          total: {
            increment, // Adjust the total
          },
        },
      });
    }

    // Update the status of the entry
    const updatedEntry =
      entryType === "receivable"
        ? await prisma.receivable.update({
            where: { id: entryId },
            data: { status },
          })
        : await prisma.debt.update({
            where: { id: entryId },
            data: { status },
          });

    // Send the updated entry as the response
    res.status(200).json({ message: "Status updated successfully", updatedEntry });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Internal server error", error: (error as Error).message });
  }
};



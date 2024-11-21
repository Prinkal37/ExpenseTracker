import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get All Debit Entries
export const getDebits = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;

    if (!userId) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }

    try {
        const debits = await prisma.debit.findMany({
        where: {
            totalAmount: { userId: userId },
            deleted: false, // Exclude deleted entries
        },
        });

        res.status(200).json(debits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching debit entries' });
    }
};

// Get All Credit Entries
export const getCredits = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }

    try {
        const credits = await prisma.credit.findMany({
        where: {
            totalAmount: { userId: userId },
            deleted: false, // Exclude deleted entries
        },
        });

        res.status(200).json(credits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching credit entries' });
    }
};

// Get All Debt Entries
export const getDebts = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }

    try {
        const debts = await prisma.debt.findMany({
        where: {
            totalAmount: { userId: userId },
            deleted: false, // Exclude deleted entries
        },
        });

        res.status(200).json(debts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching debt entries' });
    }
};

// Get All Receivable Entries
export const getReceivables = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(403).json({ message: 'Access denied. User not authenticated' });
        return;
    }

    try {
        const receivables = await prisma.receivable.findMany({
        where: {
            totalAmount: { userId: userId },
            deleted: false, // Exclude deleted entries
        },
        });

        res.status(200).json(receivables);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching receivable entries' });
    }
};

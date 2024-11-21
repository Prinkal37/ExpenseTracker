import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPieChartData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;  // Assuming req.user contains the authenticated user ID

    if (!userId) {
      res.status(400).json({ message: 'User ID not found.' });
      return;
    }

    // Fetch the totalAmountId for the user
    const userTotalAmount = await prisma.totalAmount.findUnique({
      where: { userId },  // Find the TotalAmount record linked to the user
    });

    if (!userTotalAmount) {
      res.status(404).json({ message: 'TotalAmount not found for the user.' });
      return;
    }

    // Fetching debit transactions filtered by totalAmountId
    const debitSummary = await prisma.debit.groupBy({
      where: {
        totalAmountId: userTotalAmount.id, // Use the totalAmountId to filter
      },
      by: ['category'],
      _sum: {
        money: true,
      },
    });

    // Fetching credit transactions filtered by totalAmountId
    const creditSummary = await prisma.credit.groupBy({
      where: {
        totalAmountId: userTotalAmount.id, // Use the totalAmountId to filter
      },
      by: ['category'],
      _sum: {
        money: true,
      },
    });

    // Format the data for the pie chart
    const pieChartData = {
      debit: debitSummary.map((item) => ({
        category: item.category,
        total: item._sum.money ?? 0,  // Handle possible undefined values
      })),
      credit: creditSummary.map((item) => ({
        category: item.category,
        total: item._sum.money ?? 0,  // Handle possible undefined values
      })),
    };

    // Send the response
    res.status(200).json(pieChartData);
  } catch (error) {
    console.error('Error fetching pie chart data:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

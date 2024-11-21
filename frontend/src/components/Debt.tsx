import axios from "axios";
import React, { useEffect, useState } from "react";
import "../App.css";
import TransactionEnv2 from "./TransactionEnv2";

interface Debt {
  id: string; // Unique identifier for each debt entry
  money: number;
  description: string;
  status: boolean;
  date: Date;
  entryType: "debt"; // To pass the entry type dynamically
}

type DebtData = Debt[];

const Debt: React.FC = () => {
  const [totalDebtAmount, setTotalDebtAmount] = useState<number>(0);
  const [debtData, setDebtData] = useState<DebtData>([]);

  // Format the amount to Indian currency style
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
      amount
    );
  };

  // Fetch debt data from the backend
  const fetchDebtData = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Retrieve the token dynamically
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.get(
        "http://localhost:3000/api/getData/debts",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Sort by date (latest first)
      const sortedData = response.data.sort(
        (a: Debt, b: Debt) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setDebtData(sortedData);

      // Calculate the total debt amount
      const totalAmount = sortedData.reduce(
        (sum: number, debt: Debt) => sum + debt.money,
        0
      );
      setTotalDebtAmount(totalAmount);
    } catch (error) {
      console.error("Error fetching debt data:", error);
      alert("Failed to fetch debt data. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchDebtData();

    // Poll the backend every 10 seconds for updates
    const interval = setInterval(() => {
      fetchDebtData();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-slate-500 px-1 h-[15rem]">
      {/* Header showing total debt */}
      <header className="border-b border-gray-600 h-[15%] flex gap-3 items-center text-red-700 px-3 font-medium">
        <div>Debt:</div>
        <div>₹{formatAmount(totalDebtAmount)}</div>
      </header>

      {/* List of debts */}
      <div className="h-[85%] px-1 pb-2 overflow-scroll scroll-container">
        {debtData.length > 0 ? (
          debtData.map((dData) => (
            <TransactionEnv2
              key={dData.id} // Unique key for each transaction
              debtReceive={dData}
              clr={"text-red-700"}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No debts found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Debt;

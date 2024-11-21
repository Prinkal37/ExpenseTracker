import axios from "axios";
import React, { useEffect, useState } from "react";
import "../App.css";
import TransactionEnv2 from "./TransactionEnv2";

interface Receivable {
  id: string; // Unique identifier for each receivable entry
  money: number;
  description: string;
  status: boolean;
  date: Date;
  entryType: "receivable"; // To distinguish entry type for potential reuse
}

type ReceivableData = Receivable[];

const Receivable: React.FC = () => {
  const [totalReceivableAmount, setTotalReceivableAmount] = useState<number>(0);
  const [receivableData, setReceivableData] = useState<ReceivableData>([]);

  // Format the amount to Indian currency style
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
      amount
    );
  };

  // Fetch receivable data from the backend
  const fetchReceivableData = async () => {
    try {
      const token = localStorage.getItem("accessToken"); // Retrieve the token dynamically
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await axios.get(
        "http://localhost:3000/api/getData/receivables",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Sort by date (latest first)
      const sortedData = response.data.sort(
        (a: Receivable, b: Receivable) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setReceivableData(sortedData);

      // Calculate the total receivable amount
      const totalAmount = sortedData.reduce(
        (sum: number, receivable: Receivable) => sum + receivable.money,
        0
      );
      setTotalReceivableAmount(totalAmount);
    } catch (error) {
      console.error("Error fetching receivable data:", error);
      alert("Failed to fetch receivable data. Please try again.");
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchReceivableData();

    // Poll the backend every 10 seconds for updates
    const interval = setInterval(() => {
      fetchReceivableData();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-slate-500 px-1 h-[15rem]">
      {/* Header showing total receivables */}
      <header className="border-b border-gray-600 h-[15%] flex gap-3 items-center text-green-700 px-3 font-medium">
        <div>Receivable:</div>
        <div>₹{formatAmount(totalReceivableAmount)}</div>
      </header>

      {/* List of receivables */}
      <div className="h-[85%] px-1 pb-2 overflow-scroll scroll-container">
        {receivableData.length > 0 ? (
          receivableData.map((rData) => (
            <TransactionEnv2
              key={rData.id} // Unique key for each transaction
              debtReceive={rData}
              clr={"text-green-700"}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No receivables found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Receivable;

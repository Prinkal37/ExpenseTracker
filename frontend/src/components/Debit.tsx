import axios from "axios";
import React, { useEffect, useState } from "react";
import "../App.css";
import TransactionEnv1 from "./TransactionEnv1";

interface Debit {
  money: number;
  description: string;
  date: Date;
}

type DebitData = Debit[];

const Debit: React.FC = () => {
  const [totalDebitedAmount, setTotalDebitedAmount] = useState<number>(0);
  const [debitData, setDebitData] = useState<DebitData>([]);

  // Formatting the amount to Indian style (commas and stuff)
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
      amount
    );
  };

  // Fetching the credits from the backend
  const fetchDebitData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/getData/debits",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
          },
        }
      );

      // Sort by date (latest first)
      const sortedData = response.data.sort(
        (a: Debit, b: Debit) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setDebitData(sortedData);

      // Calculate the total debited amount
      const totalAmount = sortedData.reduce(
        (sum: number, credit: Debit) => sum + credit.money,
        0
      );
      setTotalDebitedAmount(totalAmount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch total amount initially
    fetchDebitData();

    // Poll the backend every 10 seconds for updates
    const interval = setInterval(() => {
      fetchDebitData();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-slate-500 px-1 h-[15rem]">
      <header className="border-b border-gray-600 h-[15%] flex gap-3 items-center text-red-700 px-3 font-medium">
        <div>Debit:</div>
        <div>₹{formatAmount(totalDebitedAmount)}</div>
      </header>
      <div className="h-[85%] px-1 pb-2 overflow-scroll scroll-container">
        {debitData.map((dData, index) => (
          <TransactionEnv1 key={index} creditDebitData={dData} clr={"text-red-700"} />
        ))}
      </div>
    </div>
  );
};

export default Debit;

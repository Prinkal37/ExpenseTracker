import axios from "axios";
import React, { useEffect, useState } from "react";
import "../App.css";
import TransactionEnv1 from "./TransactionEnv1";

interface Credit {
  money: number;
  description: string;
  date: Date;
}

type CreditData = Credit[];

const Credit: React.FC = () => {
  const [totalCreditedAmount, setTotalCreditedAmount] = useState<number>(0);
  const [creditData, setCreditData] = useState<CreditData>([]);

  // Formatting the amount to Indian style (commas and stuff)
  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
      amount
    );
  };

  // Fetching the credits from the backend
  const fetchCreditData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/getData/credits",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Sort by date (latest first)
      const sortedData = response.data.sort(
        (a: Credit, b: Credit) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setCreditData(sortedData);

      // Calculate the total credited amount
      const totalAmount = sortedData.reduce(
        (sum: number, credit: Credit) => sum + credit.money,
        0
      );
      setTotalCreditedAmount(totalAmount);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch total amount initially
    fetchCreditData();

    // Poll the backend every 10 seconds for updates
    const interval = setInterval(() => {
      fetchCreditData();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-slate-500 px-1 h-[15rem]">
      <header className="border-b border-gray-600 h-[15%] flex gap-3 items-center text-green-700 px-3 font-medium">
        <div>Credit:</div>
        <div>₹{formatAmount(totalCreditedAmount)}</div>
      </header>
      <div className="h-[85%] px-1 pb-2 overflow-scroll scroll-container">
        {creditData.map((cData, index) => (
          <TransactionEnv1 key={index} creditDebitData={cData} clr={"text-green-700"}/>
        ))}
      </div>
    </div>
  );
};

export default Credit;

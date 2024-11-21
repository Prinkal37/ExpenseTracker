import React, { useState } from "react";

interface CreditDebit {
  money: number;
  description: string;
  date: string | Date;  // Accept string or Date type for date
}

const TransactionEnv1: React.FC<{ creditDebitData: CreditDebit; clr: string }> = ({
  creditDebitData,
  clr,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescriptionClick = () => {
    setShowFullDescription((prev) => !prev);
  };

  // Parsing the date if it's passed as a string
  const transactionDate = new Date(creditDebitData.date);

  // Formatting date and time
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(transactionDate);

  const formattedTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(transactionDate);

  return (
    <div>
      <div
        className={`border-b border-black rounded-xs ${
          !showFullDescription ? "h-[2rem]" : "h-[4rem]"
        } text-sm flex items-center justify-between gap-2 mt-2 px-2`}
      >
        {/* Money */}
        <div className={`w-[15%] ${clr}`}>{creditDebitData.money}</div>

        {/* Description */}
        <div
          className={`w-[70%] overflow-hidden ${!showFullDescription ? "text-ellipsis whitespace-nowrap" : ""} cursor-pointer`}
          onClick={toggleDescriptionClick}
        >
          {creditDebitData.description}
        </div>

        {/* Date */}
        <div className="w-[20%]">{formattedDate}</div>

        {/* Time */}
        <div>{formattedTime}</div>
      </div>
    </div>
  );
};

export default TransactionEnv1;

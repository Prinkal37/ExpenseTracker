import React, { useState } from "react";
import axios from "axios";

interface RD {
  id: string; // Add unique identifier for the entry
  money: number;
  description: string;
  date: Date;
  status: boolean;
  entryType: "debt" | "receivable"; // Add entry type for backend differentiation
}

const TransactionEnv2: React.FC<{ debtReceive: RD; clr: string }> = ({
  debtReceive,
  clr,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [status, setStatus] = useState(debtReceive.status); // Track status in component state

  const toggleDescriptionClick = () => {
    setShowFullDescription((prev) => !prev);
  };

  // Function to handle updating the status (either "paid" or "unpaid")
  const handleStatusChange = async (newStatus: boolean) => {
    try {
      console.log("Status Change Triggered");

      const response = await axios.post(
        "http://localhost:3000/api/data/UpdateStatus",
        {
          status: newStatus,
          entryId: debtReceive.id, // Include unique ID for the entry
          entryType: clr === "text-red-700" ? "debt" : "receivable",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Update the status if the API call is successful
      if (response.status === 200) {
        console.log("Status updated successfully:", newStatus);
        setStatus(newStatus); // Update the local status
        setStatusMenuOpen(false); // Close the status menu
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="relative">
      <div
        className={`border-b border-black rounded-xs ${
          !showFullDescription ? "h-[2rem]" : "h-[4rem]"
        } text-sm flex items-center justify-between gap-2 mt-2 px-2`}
      >
        {/* Money */}
        <div className={`w-[15%] ${clr}`}>{debtReceive.money}</div>

        {/* Description */}
        <div
          className={`w-[70%] overflow-hidden ${
            !showFullDescription ? "text-ellipsis whitespace-nowrap" : ""
          } cursor-pointer`}
          onClick={toggleDescriptionClick}
        >
          {debtReceive.description}
        </div>

        {/* Status */}
        <div>
          {!status && (
            <div
              className="text-red-500 cursor-pointer w-[3rem]"
              onClick={() => setStatusMenuOpen(true)}
            >
              Unpaid
            </div>
          )}
          {status && <div className="text-green-500 w-[3rem]">Paid</div>}

          {statusMenuOpen && !status && (
            <div className="absolute bg-white border p-2 mt-1 z-10">
              <div>
                <button
                  className="text-green-500 mr-2"
                  onClick={() => handleStatusChange(true)} // Set status to "paid"
                >
                  Done
                </button>
                <button
                  className="text-red-500"
                  onClick={() => setStatusMenuOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Date */}
        <div className="w-[20%]">
          {new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }).format(new Date(debtReceive.date))}
        </div>

        {/* Time */}
        <div>
          {new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }).format(new Date(debtReceive.date))}
        </div>
      </div>
    </div>
  );
};

export default TransactionEnv2;

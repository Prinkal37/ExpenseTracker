import axios from "axios";
import React, { useEffect, useState } from "react";

const TotalAmount: React.FC = () => {
    const [totalAmount, setTotalAmount] = useState<number>(0);

    // Format the amount to Indian currency style
    const formatAmount = (amount: number): string => {
        return new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(amount);
    };

    // Fetch the total amount from the backend
    const fetchTotalAmount = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/totalAmount", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
                },
            })
            setTotalAmount(Number(response.data.total) || 0); // Ensure API returns { totalAmount: number }
        } catch (error) {
            console.error("Failed to fetch total amount:", error);
        }
    };

    useEffect(() => {
        // Fetch total amount initially
        fetchTotalAmount();

        // Poll the backend every 10 seconds for updates
        const interval = setInterval(() => {
            fetchTotalAmount();
        }, 10000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-[2rem] px-4 py-6 border-b border-black flex gap-2 items-center text-lg font-medium">
            <h1>Total Amount:</h1>
            <div className="text-green-700">₹{formatAmount(totalAmount)}</div>
        </div>
    );
};

export default TotalAmount;

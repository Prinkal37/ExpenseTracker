import axios, { AxiosError } from "axios";
import React, { useState } from "react";

interface SendingData {
    total: number;
}

const AddTotalAmount: React.FC = () => {
    const [data, setData] = useState<SendingData>({ total: 0 });
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleAdd = async () => {
        try {
            if (data.total <= 0) {
                setError("Please input a valid total amount");
                return;
            }

            await axios.put('http://localhost:3000/api/totalAmount', 
                data,
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                  }
                }
            );
            setSuccess("Total amount updated successfully!");
            setError('');

            // Clear the success message after 3 seconds
            setTimeout(() => {
                setSuccess('');
                setData({total:0})
            }, 3000);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.log("Error updating the total amount:", axiosError.message);
            setError("Failed to update total amount");
            setSuccess('');

            // Clear the error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    };

    return (
        <div className="py-2">
            <header className="text-xl font-medium px-1">Add/Update Total Amount</header>

            <div className="p-3 flex flex-col gap-3">
                <div className="flex gap-3 px-2 h-9 items-center justify-between">
                    <label htmlFor="total-amount">Amount:</label>
                    ₹
                    <input
                        id="total-amount"
                        type="text"
                        value={data.total}
                        onChange={(e) => {
                            setData({ ...data, total: Number(e.target.value) });
                            if (error) setError('');
                        }}
                        placeholder="₹ XX-XX-XXX"
                        className="border-2 border-gray-500 rounded-md w-[15rem] outline-none px-2 h-8"
                    />
                </div>

                <div className="flex justify-between px-2">
                    <button
                        onClick={handleAdd}
                        className="border border-gray-500 rounded-lg py-1 w-[10rem]"
                        >
                        ADD
                    </button>
                    <button
                        onClick={() => {
                            setData({ total: 0 });
                            setError('');
                            setSuccess('');
                        }}
                        className="border border-gray-500 rounded-lg py-1 w-[10rem]"
                        >
                        Clear
                    </button>
                </div>
                {error && <div className="text-red-500 text-xs">{error}</div>}
                {success && <div className="text-green-600 text-xs">{success}</div>}
            </div>
        </div>
    );
};

export default AddTotalAmount;

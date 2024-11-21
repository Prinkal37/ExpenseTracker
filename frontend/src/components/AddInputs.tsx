import React, { useState } from "react"
import axios from "axios"

interface SendingData1 {
    money: number,
    description: string,
    category: string,
    date: Date
}
interface SendingData2 {
    money: number,
    description: string,
    status: boolean,
    date: Date
}

const AddInputs: React.FC = () =>{
    const [data1, setData1] = useState<SendingData1>({
        money: 0.0,
        description: "",
        category: "Food",
        date: new Date(),
    })

    const [data2, setData2] = useState<SendingData2>({
        money: 0.0,
        description: "",
        status: false,
        date: new Date(),
    })

    const [type, setType] = useState<string>('Credit')
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<string>('')

    const validateData = () => {
        if (type === "Credit" || type === "Debit") {
            return data1.money > 0 && data1.description.trim() !== '';
        }
        return data2.money > 0 && data2.description.trim() !== '';
    };

    const handleData = async () =>{
        try {
            if(type === "Credit" || type === "Debit"){
                if (!validateData()) {
                    setError("Please fill up all the blanks");
                    return;
                }
                await axios.post(`http://localhost:3000/api/data/${type}`, 
                    data1,
                    {
                        headers: {
                          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        }
                    }
                )
                setSuccess("Success");
                setError('');
                
                // Clear the success message after 3 seconds
                setTimeout(() => {
                    setSuccess('');
                    handleClear();
                }, 3000)
            }else{
                console.log(type)
                if (!validateData()) {
                    setError("Please fill up all the blanks");
                    return;
                }

                await axios.post(`http://localhost:3000/api/data/${type}`,
                    data2,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`, 
                      }
                    }
                )
                setSuccess("Success");
                setError('');
                
                // Clear the success message after 3 seconds
                setTimeout(() => {
                    setSuccess('');
                    handleClear();
                }, 3000)
            }
        } catch (error) {
            console.log("Error sending all the data:", error);
            setError("Failed sending the data");
            setSuccess('');

            // Clear the error message after 3 seconds
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }

    const handleClear = () =>{
        setData1({
            money: 0.0,
            description: "",
            category: "Food",
            date: new Date(),
        })

        setData2({
            money: 0.0,
            description: "",
            status: false,
            date: new Date(),
        })
        setError('')
        setSuccess('')
    }

    return(
        <div className="py-2">
            <header className="text-xl font-medium px-1">Add Transaction</header>

            <div className="p-3 flex flex-col gap-3">
                <div className="flex gap-3 px-2 h-9 items-center justify-between">
                    <div>Amount:</div>
                    ₹<input 
                        type="text" 
                        placeholder="₹ XX-XX-XXX" 
                        className="border-2 border-gray-500 rounded-md w-[15rem] outline-none px-2 h-8"
                        value={type === "Credit" || type === "Debit" ? data1.money : data2.money}
                        onChange={(e)=>{
                            if(type === 'Debit' || type === 'Credit'){
                                setData1((prev) => ({ ...prev, money: Number(e.target.value) }))
                            }else{
                                setData2((prev) => ({ ...prev, money: Number(e.target.value) }))
                            }
                        }}
                    />
                </div>
                <div className="flex gap-3 px-2 h-9 items-center">
                    <div>Description:</div>
                    <input 
                        type="text" 
                        placeholder="Enter Description" 
                        className="border-2 border-gray-500 rounded-md w-[20rem] outline-none px-2 h-8"
                        value={type === "Credit" || type === "Debit" ? data1.description : data2.description}
                        onChange={(e)=>{
                            if(type === 'Debit' || type === 'Credit'){
                                setData1((prev) => ({ ...prev, description: e.target.value }))
                            }else{
                                setData2((prev) => ({ ...prev, description: e.target.value}))
                            }
                        }}
                    />
                </div>
                <div className="flex justify-between items-center px-2">
                    <div>Type:</div>
                    <select 
                        name="finance" 
                        className="px-2 py-1 border rounded-lg w-[15rem] h-8"
                        value={type}
                        onChange={(e)=>{
                            setType(e.target.value)
                        }}
                    >
                        <option value="Credit">Credit</option>
                        <option value="Debit">Debit</option>
                        <option value="Debt">Debt</option>
                        <option value="Receivable">Receivable</option>
                    </select>
                </div>
                {type === "Credit" || type === "Debit" ? (
                    <div className="flex justify-between items-center px-2">
                        <div>Category:</div>
                        <select
                            name="transactionCategory"
                            className="px-2 py-1 border rounded-lg w-[15rem] h-8"
                            value={data1.category}
                            onChange={(e) =>
                                setData1((prev) => ({ ...prev, category: e.target.value }))
                            }
                        >
                            <option value="foods">Foods</option>
                            <option value="onlineShopping">Online Shopping</option>
                            <option value="income">Income</option>
                            <option value="transport">Transport</option>
                            <option value="others">Others</option>
                        </select>
                    </div>
                ) : null}

                <div className="flex justify-between px-2">
                    <button onClick={handleData} className="border border-gray-500 rounded-lg py-1 w-[10rem]">ADD</button>
                    <button onClick={handleClear} className="border border-gray-500 rounded-lg py-1 w-[10rem]">Clear</button>
                </div>
            </div>
            {error && <div className="text-red-500 text-xs">{error}</div>}
            {success && <div className="text-green-600 text-xs">{success}</div>}
        </div>
    )
}

export default AddInputs;
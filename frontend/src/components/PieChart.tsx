import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register required elements for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartData {
  debit: { category: string; total: number }[];
  credit: { category: string; total: number }[];
}

const PieChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/charts/piechart",
          {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              }
          }
        );
        const data: ChartData = response.data;
      
        // Prepare data for the chart
        const categories = [...data.debit, ...data.credit];
        const labels = categories.map((item) => item.category);
        const amounts = categories.map((item) => item.total);

        setChartData({
          labels,
          datasets: [
            {
              label: "Total Amounts",
              data: amounts,
              backgroundColor: [
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              hoverBackgroundColor: [
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
            },
          ],
        });
      } catch (error) {
        setError("Failed to fetch chart data.");
        console.error(error);
      }
    };

    fetchChartData();
  }, []);

  if (error) {
    return <p>{error}</p>;
  }

  if (!chartData) {
    return <p>Loading chart...</p>;
  }

  return (
    <div key={JSON.stringify(chartData)} className="w-[100%]">
      <header className="text-xl font-medium px-1">Transaction History</header>
      <div className="w-[80%] mt-2 mx-auto">
        <Pie data={chartData} className="" />
      </div>
    </div>
  );
};

export default PieChart;

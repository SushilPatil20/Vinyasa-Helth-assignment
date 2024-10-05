import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// ---------- Registering necessary components from Chart.js ----------
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const KeywordProgressGraph = ({ keywordData }) => {
  // ---------- Extract keywords and frequencies ----------
  const labels = keywordData.map((data) => data.keyword);
  const frequencies = keywordData.map((data) => data.frequency);

  // Define chart data
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Keyword Frequency",
        data: frequencies,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Defining options for chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Keyword Frequency Chart",
      },
    },
  };

  return (
    <div>
      <h2 className="text-gray-500 text-xl mt-6">Keyword Progress Graph</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default KeywordProgressGraph;

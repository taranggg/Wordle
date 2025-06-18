import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function PerformanceChart({ isDark }) {
  const chartColors = {
    green: "#22c55e",
    yellow: "#facc15",
    gray: "#6b7280",
    textDark: "#ffffff",
    textLight: "#1f2937",
    gridDark: "#334155",
    gridLight: "#e2e8f0",
  };

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Score",
        data: [3, 5, 7, 9, 5, 3, 7],
        backgroundColor: [
          chartColors.gray,
          chartColors.yellow,
          chartColors.green,
          chartColors.green,
          chartColors.yellow,
          chartColors.gray,
          chartColors.green,
        ],
        borderRadius: 6,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: 12,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? "#1e293b" : "#f1f5f9",
        titleColor: isDark ? chartColors.textDark : chartColors.textLight,
        bodyColor: isDark ? chartColors.textDark : chartColors.textLight,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? chartColors.gridDark : chartColors.gridLight,
        },
        ticks: {
          color: isDark ? chartColors.textDark : chartColors.textLight,
        },
      },
      x: {
        grid: {
          display: true,
          color: isDark ? chartColors.gridDark : chartColors.gridLight,
        },
        ticks: {
          color: isDark ? chartColors.textDark : chartColors.textLight,
        },
      },
    },
  };

  return (
    <div
      className={`w-full rounded-2xl p-4 backdrop-blur-md ${
        isDark ? "bg-white/10" : "bg-black/10"
      } border border-white/20`}
      style={{ height: 300 }}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className={`font-semibold text-sm ${
            isDark ? "text-white" : "text-gray-800"
          }`}
        >
          📊 Performance Trend
        </span>
        <span
          className={`text-sm font-bold ${
            isDark ? "text-green-400" : "text-green-600"
          }`}
        >
          +5.2%
        </span>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
}

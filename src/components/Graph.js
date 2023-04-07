import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Habits Completed by Day of the Week",
    },
  },
};

// Replace this with your own data
const habitsCompleted = {
  Sunday: 50,
  Monday: 60,
  Tuesday: 45,
  Wednesday: 70,
  Thursday: 40,
  Friday: 65,
  Saturday: 55,
};

const labels = Object.keys(habitsCompleted);

export const data = {
  labels,
  datasets: [
    {
      label: "Completed Habits",
      data: labels.map((day) => habitsCompleted[day]),
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
  ],
};

function Graph() {
  return <Bar options={options} data={data} />;
}

export default Graph;
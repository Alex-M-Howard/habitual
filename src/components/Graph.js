import React from "react";
import { Box } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Graph({ data, options, graphType }) {
  // Determine which type of chart component to render based on graphType prop
  const chartComponent =
    graphType === "bar" ? (
      <Bar options={options} data={data} />
    ) : (
      <Line options={options} data={data} />
    );

  return (
    // Container for the chart component
    <Box width="100%" height="400px" display="flex" justifyContent="center">
      {chartComponent}
    </Box>
  );
}

export default Graph;

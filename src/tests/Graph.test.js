import React from "react";
import { render, screen } from "@testing-library/react";
import Graph from "@/components/Graph";

const mockData = {
  labels: ["Label1", "Label2"],
  datasets: [
    {
      label: "Sample Data",
      data: [10, 20],
      backgroundColor: ["rgba(75, 192, 192, 0.2)"],
      borderColor: ["rgba(75, 192, 192, 1)"],
      borderWidth: 1,
    },
  ],
};

const mockOptions = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

describe("Graph component", () => {
  it("renders a bar chart when graphType is 'bar'", () => {
    render(<Graph data={mockData} options={mockOptions} graphType="bar" />);
    const canvas = screen.getByRole("img");
    expect(canvas).toBeInTheDocument();
  });

  it("renders a line chart when graphType is 'line'", () => {
    render(<Graph data={mockData} options={mockOptions} graphType="line" />);
    const canvas = screen.getByRole("img");
    expect(canvas).toBeInTheDocument();
  });
});

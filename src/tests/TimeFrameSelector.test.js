import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import TimeFrameSelector from "@/components/TimeFrameSelector";

describe("TimeFrameSelector component", () => {
  const mockHandleChange = jest.fn();

  beforeEach(() => {
    render(
      <TimeFrameSelector
        selectedTimeFrame="mostCompletedHabits30"
        handleChange={mockHandleChange}
      />
    );
  });

  it("renders buttons for each time frame", () => {
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBe(6);
  });

  it("calls handleChange with the correct argument when a button is clicked", () => {
    const timeFrames = [
      "mostCompletedHabits30",
      "mostCompletedHabits60",
      "mostCompletedHabits90",
      "mostCompletedHabits180",
      "mostCompletedHabits365",
      "mostCompletedHabits",
    ];

    timeFrames.forEach((timeFrame, index) => {
      fireEvent.click(screen.getAllByRole("button")[index]);
      expect(mockHandleChange).toHaveBeenNthCalledWith(index + 1, timeFrame);
    });
  });
});

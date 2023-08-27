import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import HabitList from "@/components/HabitList";

const userHabits = [
  { habitId: 1, habitName: "Habit 1" },
  { habitId: 2, habitName: "Habit 2" },
];

const habitLog = [{ habitId: 1 }];

const mockTrackHabit = jest.fn();
const mockHandleRemoveHabit = jest.fn();
const mockHandleClick = jest.fn();
const mockSetEditMode = jest.fn();

describe("HabitList component", () => {
  beforeEach(() => {
    render(
      <HabitList
        userHabits={userHabits}
        trackHabit={mockTrackHabit}
        habitLog={habitLog}
        editMode={false}
        handleRemoveHabit={mockHandleRemoveHabit}
        handleClick={mockHandleClick}
        setEditMode={mockSetEditMode}
      />
    );
  });

  it("renders habit list", () => {
    expect(screen.getByText("Habit 1")).toBeInTheDocument();
    expect(screen.getByText("Habit 2")).toBeInTheDocument();
  });

  it("renders Add habit and Remove Habit buttons", () => {
    expect(screen.getByText("Add habit")).toBeInTheDocument();
    expect(screen.getByText("Remove Habit")).toBeInTheDocument();
  });

  it("calls handleClick when Add habit button is clicked", () => {
    fireEvent.click(screen.getByText("Add habit"));
    expect(mockHandleClick).toHaveBeenCalled();
  });

  it("toggles edit mode when Remove Habit button is clicked", () => {
    fireEvent.click(screen.getByText("Remove Habit"));
    expect(mockSetEditMode).toHaveBeenCalledWith(true);
  });

  it("renders habit switches", () => {
    const switches = screen.getAllByRole("checkbox");
    expect(switches.length).toBe(2);
  });

  it("checks habit switch if habit is tracked", () => {
    const switch1 = screen.getByRole("checkbox", { name: "Habit 1" });
    expect(switch1).toBeChecked();
  });

  it("does not check habit switch if habit is not tracked", () => {
    const switch2 = screen.getByLabelText("Habit 2");
    expect(switch2).not.toBeChecked();
  });
});

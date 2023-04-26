import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NestedList from "@/components/NestedList";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mockStore = configureMockStore();
const store = mockStore({
  user: {
    loggedIn: {
      user: { id: "1", name: "User" },
      token: "mock-token",
    },
  },
});

const axiosMock = new MockAdapter(axios);

const userHabits = [
  { habitId: "1", habitName: "Habit 1" },
  { habitId: "2", habitName: "Habit 2" },
];

const habitCategories = [
  { habitId: "1", habitName: "Habit 1", categoryId: "1" },
  { habitId: "2", habitName: "Habit 2", categoryId: "1" },
  { habitId: "3", habitName: "Habit 3", categoryId: "1" },
];

const categories = [
  { id: "1", name: "Category 1" },
  { id: "2", name: "Category 2" },
];

describe("NestedList", () => {
  beforeEach(async () => {
    axiosMock.onGet("/api/habits/categories").reply(200, {
      categories: categories,
    });

    render(
      <Provider store={store}>
        <NestedList
          userHabits={userHabits}
          habitCategories={habitCategories}
          onHabitSelect={jest.fn()}
          customHabit={""}
          setCustomHabit={jest.fn()}
        />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  afterEach(() => {
    axiosMock.reset();
  });

  it("renders category names", () => {
    categories.forEach((category) => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
    });
  });

  it("renders create new habit option", () => {
    expect(screen.getByText("Create New Habit")).toBeInTheDocument();
  });

  it("expands category on click", async () => {
    const category1Button = screen.getByText(categories[0].name);
    userEvent.click(category1Button);

    const habit3 = await screen.findByText(habitCategories[2].habitName);
    expect(habit3).toBeInTheDocument();
  });

  it("disables habits that are already added", async () => {
    const category1Button = screen.getByText(categories[0].name);
    userEvent.click(category1Button);

    // Wait for the habit element to appear
    await screen.findByText(habitCategories[0].habitName);
    const habit1Button = screen.getByTestId(
      `habit-${habitCategories[0].habitId}`
    );
    expect(habit1Button).toHaveAttribute("aria-disabled", "true");
  });
});

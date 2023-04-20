import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import Habits from "@/pages/habits.js";
import store from "@/tests/userMock.js";
import "@/tests/axiosMock.js";

jest.mock("api/habit_categories", () => {
  fetchHabits: () => Promise.resolve(userHabits);
  fetchCategories: () => Promise.resolve(categories);
  fetchTodayHabitLog: () => Promise.resolve(habitLog);
});

jest.mock
describe("Habits", () => {
  test("renders the component", async () => {
    render(
      <Provider store={store}>
        <Habits />
      </Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Habits')).toBeInTheDocument();
    })
  }, 25000);
})
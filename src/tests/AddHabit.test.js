import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import AddHabit from "@/components/AddHabit";
import configureStore from "redux-mock-store";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { createRouter } from "next/router";

const mockStore = configureStore([]);

const mockRouter = {
  basePath: "",
  pathname: "/",
  route: "/",
  asPath: "/",
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isReady: true,
  isPreview: false,
  isLocaleDomain: false,
};

function RouterWrapper({ children }) {
  return (
    <RouterContext.Provider value={mockRouter}>
      {children}
    </RouterContext.Provider>
  );
}

describe("AddHabit component", () => {
  const userHabits = [];
  const categories = [];
  const mockOnHabitSelect = jest.fn();
  const mockSetCustomHabit = jest.fn();
  const mockSetAddShowing = jest.fn();
  const mockSetUserHabits = jest.fn();
  const mockSetEditMode = jest.fn();

  let store;

  beforeEach(() => {
    store = mockStore({
      user: {
        loggedIn: {
          user: { id: 1 },
          token: "fake_token",
        },
      },
    });

    render(
      <Provider store={store}>
        <RouterWrapper>
          <AddHabit
            userHabits={userHabits}
            categories={categories}
            onHabitSelect={mockOnHabitSelect}
            customHabit=""
            setCustomHabit={mockSetCustomHabit}
            setAddShowing={mockSetAddShowing}
            setUserHabits={mockSetUserHabits}
            setEditMode={mockSetEditMode}
          />
        </RouterWrapper>
      </Provider>
    );
  });

  it("renders Add Habit and Cancel buttons", () => {
    const addHabitButton = screen.getByText("Add Habit");
    const cancelButton = screen.getByText("Cancel");

    expect(addHabitButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it("calls setAddShowing with false when Cancel button is clicked", () => {
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockSetAddShowing).toHaveBeenCalledTimes(1);
    expect(mockSetAddShowing).toHaveBeenCalledWith(false);
  });
});

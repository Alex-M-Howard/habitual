import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import NavBar from "@/components/NavBar.js";
import store from "@/tests/userMock.js";
import { RouterContext } from "next/dist/shared/lib/router-context";
import routerMock from "next-router-mock";

jest.mock("next/router", () => require("next-router-mock"));

const renderNavBar = () =>
  render(
    <Provider store={store}>
      <RouterContext.Provider value={routerMock}>
        <NavBar />
      </RouterContext.Provider>
    </Provider>
  );

describe("NavBar", () => {
  test("renders the component", () => {
    renderNavBar();
  });

  test("renders the logo", () => {
    renderNavBar();
    expect(screen.getByAltText("Habitual")).toBeInTheDocument();
  });

  test("renders the mobile menu button", () => {
    renderNavBar();
    expect(screen.getByLabelText("open drawer")).toBeInTheDocument();
  });

  test("renders the theme toggle button", () => {
    renderNavBar();
    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });
});

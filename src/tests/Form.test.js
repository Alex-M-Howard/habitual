import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Form from "@/components/Form.js";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const renderForm = (props) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <Form {...props} />
    </ThemeProvider>
  );

describe("Form", () => {
  const fields = [
    { name: "username", label: "Username", placeholder: "Enter your username" },
    { name: "password", label: "Password", placeholder: "Enter your password" },
  ];
  const initialValues = { username: "", password: "" };
  const handleSubmit = jest.fn();
  const buttonText = "Submit";

  test("renders the component", () => {
    renderForm({ fields, initialValues, handleSubmit, buttonText });
  });

  test("renders the form fields", () => {
    renderForm({ fields, initialValues, handleSubmit, buttonText });
    fields.forEach((field) => {
      expect(
        screen.getByPlaceholderText(field.placeholder)
      ).toBeInTheDocument();
    });
  });

  test("renders the submit button", () => {
    renderForm({ fields, initialValues, handleSubmit, buttonText });
    expect(screen.getByText(buttonText)).toBeInTheDocument();
  });

  test("calls handleSubmit with form data when the form is submitted", () => {
    renderForm({ fields, initialValues, handleSubmit, buttonText });

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "testpassword" },
    });

    fireEvent.click(screen.getByText(buttonText));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      username: "testuser",
      password: "testpassword",
    });
  });
});

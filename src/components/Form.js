import React from "react";
import { Button, Grid, TextField } from "@mui/material";
import useFields from "@/hooks/useFields"; // Assuming this is a custom hook
import { useTheme } from "@mui/material/styles";

function Form({ fields, initialValues, handleSubmit, buttonText }) {
  // Use the custom hook to manage form fields and values
  const [formData, handleChange] = useFields(initialValues);
  const theme = useTheme();

  // Generate JSX for each form field
  const renderFields = fields.map((field) => {
    return (
      <Grid item key={field.name}>
        <TextField
          className="Form-input"
          name={field.name}
          label={field.label}
          value={formData[field.name]}
          type={field.name === "password" ? "password" : "text"}
          onChange={handleChange}
          placeholder={field.placeholder}
          required
          style={{ width: "350px" }}
          InputProps={{
            style: { color: `${theme.palette.text.main}` },
          }}
          InputLabelProps={{
            style: { color: `${theme.palette.text.main}` },
          }}
        />
      </Grid>
    );
  });

  return (
    <form
      className="Form"
      onSubmit={(e) => {
        e.preventDefault(); // Prevent default form submission
        handleSubmit(formData); // Call the provided handleSubmit function with form data
      }}
      style={{ width: "100vw" }}
    >
      <Grid
        container
        direction="column"
        alignItems="center"
        spacing={2}
        sx={{ mt: 3 }}
      >
        {/* Render each form field */}
        {renderFields}
        <Grid item>
          {/* Render the submit button */}
          <Button variant="outlined" type="submit" sx={{ width: "350px" }}>
            {buttonText}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default Form;

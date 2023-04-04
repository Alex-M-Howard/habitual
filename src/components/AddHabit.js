import React from "react";
import Form from "@/components/Form";
import { Grid, Typography } from "@mui/material";
import NestedList from "@/components/NestedList";

function AddHabit({ habits, categories }) {
  const fields = [{ name: "name", label: "Name" }];

  const initialValues = {
    name: "",
  };

  const handleSubmit = async (formData) => {
    console.log(formData);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h1">Add Habit</Typography>
      <NestedList habits={habits} habitCategories={categories} />
      <Form
        fields={fields}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        buttonText={"Add Habit"}
      />
    </Grid>
  );
}

export default AddHabit;

import React, { useState, useContext } from "react";
import Form from "@/components/Form";
import { Grid, Alert, AlertTitle, Typography } from "@mui/material";

function Profile() {
  let changes = null;
  
  if (!user) {
    return null;
  }

  const fields = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "email", label: "Email" },
  ];

  const initialValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };

  const handleSubmit = async (formData) => {
    if (error) setError(null);
    

    if (res.error) {
      setError(res.error);
    } else {
      changes = true;
    }
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center">
      {error !== null ? (
        <Alert
          sx={{ m: 2, minWidth: "350px", maxWidth: "350px" }}
          severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      ) : null}
      <Typography align="center" variant="h3" sx={{ mt: 5 }}>
        {`${user.username}'s`} Profile
      </Typography>

      <Form
        fields={fields}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        buttonText="Save"
      />
    </Grid>
  );
}


export default Profile;

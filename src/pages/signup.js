import React, {useState} from "react";
import Form from "@/components/Form";
import { Grid, Alert, AlertTitle, Typography } from "@mui/material";
import JoblyApi from "@/API";

function Signup() {
  const [error, setError] = useState(null)

  const fields = [
    { name: 'username', label: 'Username' },
    { name: 'password', label: 'Password' },
    { name: 'firstName', label: 'First Name'},
    {name: 'lastName', label: 'Last Name'},
    {name: 'email', label: 'Email'}
  ]
  
  const initialValues = {
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      email: ''
    }
  
  const handleSubmit = async (formData) => {
    if (error) setError(null);

    let res = await JoblyApi.registerUser(formData)
    
    if (res.error) {
        setError(res.error);
    }
  }

  
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
      <Typography align="center" variant="h3" sx={{mt: 5}}>
        Signup
      </Typography>

      <Form
        fields={fields}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        buttonText="Sign Up"
      />
    </Grid>
  );
}

export default Signup;

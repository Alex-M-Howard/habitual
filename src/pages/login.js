import React, { useState, useContext } from "react";
import Form from "@/components/Form";
import { Grid, Alert, AlertTitle, Typography } from "@mui/material";
import JoblyApi from "@/API";
import {UserContext} from "@/context/UserContext";
import {useRouter} from "next/router";

function Login() {
  const [error, setError] = useState(null);
  const { toggleLoginStatus, loginUser } = useContext(UserContext);
  const router = useRouter();

  const fields = [
    { name: "username", label: "Username" },
    { name: "password", label: "Password" },
  ];

  const initialValues = {
    username: "",
    password: ""
  };

  const handleSubmit = async (formData) => {
    if (error) setError(null);

    let res = await JoblyApi.loginUser(formData);

    if (res.error) {
      setError(res.error);
    } else {
      loginUser(formData.username, res.token);
      router.push('/')
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
        Login
      </Typography>

      <Form
        fields={fields}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        buttonText="Login"
      />
    </Grid>
  );
}

export default Login;

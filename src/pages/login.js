import React, { useState } from "react";
import Form from "@/components/Form";
import { Alert, AlertTitle, Grid, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import useMessageTimer from "@/hooks/useAlerts";

function Login() {
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [hidden, hide] = useMessageTimer(error, 3000);

  const fields = [
    { name: "email", label: "Email" },
    { name: "password", label: "Password" },
  ];

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = async (formData) => {
    if (error) setError(null);

    try {
      const { data } = await axios.post("/api/login", formData);
      dispatch({ type: "LOGIN", payload: data });
      await router.push("/");
    } catch (error) {
      setError("Email/Password is incorrect.");
      hide(1);
    }
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <div
        style={{
          height: "150px",
          overflow: "hidden",
          opacity: hidden ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      >
        <Alert sx={{ m: 2, width: "350px" }} severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </div>
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

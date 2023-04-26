import React, { useState } from "react";
import Form from "@/components/Form";
import { Alert, AlertTitle, Grid, Typography, CircularProgress, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import useMessageTimer from "@/hooks/useAlerts";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

function Login() {
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [hidden, hide] = useMessageTimer(error, 3000);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    try {
      const { data } = await axios.post("/api/login", formData);
      dispatch({ type: "LOGIN", payload: data });
      dispatch({ type: "SAVE_TO_LOCALSTORAGE", payload: data });
      
      await router.push("/habits");
    } catch (error) {
      setLoading(false);

      setError(error.response.data.error.message);
      hide(1);
    }
  };


  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "50vh" }}>
        <CircularProgress color="text" size="75px" />
      </Grid>
    );
  }

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center">
      <div
        style={{
          height: "150px",
          overflow: "hidden",
          opacity: hidden ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}>
        <Alert
          sx={{
            m: 2,
            width: "350px",
            backgroundColor: `${theme.palette.error.main}`,
            color: `${theme.palette.error.secondary}`,
          }}
          severity="error">
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </div>
      <Typography
        align="center"
        variant="h3"
        sx={{ mt: 5, color: `${theme.palette.text.main}` }}>
        Login
      </Typography>

      <Typography
        align="center"
        variant="h6"
        sx={{ mt: 5, color: `${theme.palette.text.main}` }}>
        Try it out:
      </Typography>

      <Button variant='outlined' onClick={() => handleSubmit({email: 'guest@guest.com', password: 'password'})}>
        Login as Guest
      </Button>

      <Form
        fields={fields}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        buttonText="Login"
      />
      <Typography
        align="center"
        variant="subtitle1"
        sx={{ mt: 1, color: `${theme.palette.text.main}` }}>
        New user?{" "}
        <Link
          href="/signup"
          underline="hover"
          color={`${theme.palette.text.main}`}>
          Sign up
        </Link>
      </Typography>
    </Grid>
  );
}

export default Login;

import React, { useState } from "react";
import Form from "@/components/Form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Alert, AlertTitle, Grid, Typography, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import useMessageTimer from "@/hooks/useAlerts";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

function Signup() {
  const [error, setError] = useState(null);
  const [hidden, hide] = useMessageTimer(error, 3000);
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const fields = [
    { name: "firstName", label: "First Name" },
    { name: "lastName", label: "Last Name" },
    { name: "email", label: "Email" },
    { name: "password", label: "Password" },
  ];

  const initialValues = {
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  };

  const handleSubmit = async (formData) => {
    if (error) setError(null);

    setLoading(true);

    try {
      const { data } = await axios.post("/api/signup", formData);
      dispatch({ type: "LOGIN", payload: data });
      dispatch({ type: "SAVE_TO_LOCALSTORAGE", payload: data })
      setLoading(false);
      await router.push("/");
    } catch (error) {
      setLoading(false);
      setError("ERROR");
      hide(1);
    }
  };

  if (loading) {
    console.log("loading...");
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
            backgroundColor: `${theme.palette.error.background}`,
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
        Signup
      </Typography>

      <Form
        fields={fields}
        initialValues={initialValues}
        handleSubmit={handleSubmit}
        buttonText="Sign Up"
      />
      <Typography
        align="center"
        variant="subtitle1"
        sx={{ mt: 1, color: `${theme.palette.text.secondary}` }}>
        Already a user?{" "}
        <Link
          href="/login"
          underline="hover"
          color={`${theme.palette.text.main}`}>
          Login
        </Link>
      </Typography>
    </Grid>
  );
}

export default Signup;

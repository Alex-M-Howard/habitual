import React, { useState } from "react";
import Form from "@/components/Form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { Alert, AlertTitle, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import useMessageTimer from "@/hooks/useAlerts";
import { useTheme } from "@mui/material/styles";

function Signup() {
  const [error, setError] = useState(null);
  const [hidden, hide] = useMessageTimer(error, 3000);
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useTheme();

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

    try {
      const { data } = await axios.post("/api/signup", formData);
      dispatch({ type: "LOGIN", payload: data });
      await router.push("/");
    } catch (error) {
      setError("ERROR");
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
      <Typography align="center" variant="h3" sx={{ mt: 5, color: `${theme.palette.text.main}` }}>
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

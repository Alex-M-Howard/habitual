import React, { useState } from "react";
import Form from "@/components/Form";
import { Alert, AlertTitle, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector, useDispatch } from "react-redux";
import useMessageTimer from "@/hooks/useAlerts";
import axios from "axios";

function Profile() {
  const [error, setError] = useState(null);
  const [hidden, hide] = useMessageTimer(error, 3000);
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const theme = useTheme();
  const dispatch = useDispatch();

  if (!user) return null;

  let changes = null;

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

    if (user.email === 'guest@guest.com') {
      formData.email = 'guest@guest.com';
    }

    try {
      let res = await axios.put(`/api/users/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };
      // TODO - Fix error message to be a success message

      
      dispatch({ type: "LOGIN", payload: { user:updatedUser, token } });
      dispatch({
        type: "SAVE_TO_LOCALSTORAGE",
        payload: { user: updatedUser, token },
      });      

      setError("Profile Updated");
      hide(1);
    } catch (error) {
      setError(error.message);
      hide(1);
    }

    changes = true;
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center">
      <div
        style={{
          height: "100px",
          overflow: "hidden",
          opacity: hidden ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}>
        <Alert
          sx={{
            m: 2,
            width: "350px",
            backgroundColor: `${
              severity === "error"
                ? theme.palette.error.main
                : theme.palette.success.main
            }`,
            color: `${
              severity === "error"
                ? theme.palette.error.secondary
                : theme.palette.success.secondary
            }`,
          }}
          severity="error"
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </div>
      <Typography
        align="center"
        variant="h4"
        sx={{ mt: 5, color: theme.palette.text.main }}>
        {`${user.firstName}'s`} Profile
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

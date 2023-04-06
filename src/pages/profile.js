import React, { useState } from "react";
import Form from "@/components/Form";
import { Alert, AlertTitle, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import useMessageTimer from "@/hooks/useAlerts";
import axios from "axios";

function Profile() {
  const [error, setError] = useState(null);
  const [hidden, hide] = useMessageTimer(error, 3000);
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const theme = useTheme();

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

    try {
      let res = await axios.put(`/api/users/${user.id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // TODO - update user in redux store
      // TODO - update user in local storage
      // TODO - Fix error message to be a success message
      // user.firstName = formData.firstName;
      // user.lastName = formData.lastName;
      // user.email = formData.email;

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
        <Alert
          sx={{
            m: 2,
            width: "350px",
            backgroundColor: `${theme.palette.error.background}`,
          }}
          severity="error"
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </div>
      <Typography align="center" variant="h3" sx={{ mt: 5 }}>
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

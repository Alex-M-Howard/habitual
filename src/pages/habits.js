// External Package Imports
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Grid, CircularProgress, Typography, Button, Alert, AlertTitle } from "@mui/material";
import uuid4 from "uuid4";
import useMessageTimer from "@/hooks/useAlerts";
import { useTheme } from "@mui/material/styles";

// Internal Imports
import AddHabit from "@/components/AddHabit";
import HabitList from "@/components/HabitList";

function Habits() {
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const [userHabits, setUserHabits] = useState(null);
  const [habitLog, setHabitLog] = useState([]);
  const [customHabit, setCustomHabit] = useState("");
  const [categories, setCategories] = useState([]);
  const [addShowing, setAddShowing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState(null);
  const [severity, setSeverity] = useState("success");
  const [hidden, hide] = useMessageTimer(message, 3000);

  const theme = useTheme();

  useEffect(() => {
    async function fetchHabits() {
      const url = `/api/users/${user.id}/habits`;
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(url, { headers });
      return res.data.habits;
    }

    async function fetchCategories() {
      const url = `/api/habit_categories`;
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(url, { headers });
      return res.data.habitCategories;
    }

    async function fetchTodayHabitLog() {
      const url = `/api/users/${user.id}/tracker/today`;
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(url, { headers });
      return res.data.log;
    }

    if (!user) return;

    fetchHabits().then((data) => setUserHabits(data));
    fetchCategories().then((data) => setCategories(data));
    fetchTodayHabitLog().then((data) => setHabitLog(data));
  }, [user]);

  async function removeHabitFromDB(habitId) {
    try{
    let url, data, headers;

    if (habitId > 23) {
      url = `/api/habit_categories/`;
      data = { habitId, categoryId: 10 };
      headers = { Authorization: `Bearer ${token}` };
      await axios.delete(url, { data, headers });
    }

    url = `/api/habits`;
    headers = { Authorization: `Bearer ${token}` };
    data = { habitId };
    await axios.delete(url, { data, headers });
    } catch (err) {
      console.log(err);
    }
  }


  async function removeHabitFromUserHabits(habitId) {
    try {
    let url = `/api/users/${user.id}/habits`;
    let headers = { Authorization: `Bearer ${token}` };
    let data = { habitId };
    await axios.delete(url, { data, headers });
    setUserHabits(userHabits.filter((habit) => habit.habitId !== habitId));
    } catch (err) {
      console.log(err);
    }
  }


  async function trackHabit(action, habitId) {
    if (!user) return null;
    try {
      const url = `/api/users/${user.id}/tracker`;
      const headers = { Authorization: `Bearer ${token}` };
      let data = { habitId };
      let res;
      if (action === "add") {
        res = await axios.post(url, data, { headers });
      }
      else {
        habitLog.forEach((log) => {
          if (log.habitId === habitId) {
            data = { logId: log.id };
          }
        });

        res = await axios.delete(url, { data, headers });
      }
      return res.data;
      
    } catch (err) {
      console.log(err);
      setMessage(err['message']);
      setSeverity("error");
      hide(1);
    }
  }

  
  if (!userHabits) {
      return (
        <Grid container justifyContent="center" alignItems="center" sx={{height: '50vh'}}>
          <CircularProgress color="text" size='75px'/>
        </Grid>
      );
    }

  const handleClick = () => {
    setEditMode(false);
    setAddShowing(true);
  };

  const handleRemoveHabit = async (habitId) => {
    await removeHabitFromUserHabits(habitId);
    await removeHabitFromDB(habitId);
  };

  const handleHabitSelect = (habitName) => {
    setCustomHabit(habitName);
  };

  const renderAddHabit = () => {
    return (
      <AddHabit
        userHabits={userHabits}
        categories={categories}
        onHabitSelect={handleHabitSelect}
        customHabit={customHabit}
        setCustomHabit={setCustomHabit}
        setAddShowing={setAddShowing}
        setUserHabits={setUserHabits}
      />
    );
  };

  if (addShowing) {
    return renderAddHabit();
  } else {
    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 3 }}>
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
            severity={severity}>
            <AlertTitle>Attention</AlertTitle>
            {message}
          </Alert>
        </div>

        <Grid item>
          <Typography variant="h4" sx={{ mt: 3, color: theme.palette.text.main }}>
            Habits
          </Typography>
        </Grid>

        <HabitList
          userHabits={userHabits}
          editMode={editMode}
          setEditMode={setEditMode}
          handleRemoveHabit={handleRemoveHabit}
          handleClick={handleClick}
          trackHabit={trackHabit}
          habitLog={habitLog}
        />
      </Grid>
    );
  }
}

export default Habits;

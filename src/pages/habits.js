// External Package Imports
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, Grid, Typography } from "@mui/material";
import uuid4 from "uuid4";

// Internal Imports
import AddHabit from "@/components/AddHabit";

function Habits() {
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const [userHabits, setUserHabits] = useState([]);
  const [customHabit, setCustomHabit] = useState("");
  const [categories, setCategories] = useState([]);
  const [addShowing, setAddShowing] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

    if (!user) return;
    fetchHabits().then((data) => setUserHabits(data));
    fetchCategories().then((data) => setCategories(data));
  }, [user]);

  function getHabits() {
    return userHabits.map((habit) => {
      return (
        <Grid
          container
          key={uuid4()}
          alignItems="center"
          justifyContent="flex-start"
        >
          {editMode && (
            <Grid item>
              <button
                style={{
                  backgroundColor: "rgba(0,0,0,0)",
                  border: "none",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
                onClick={() => handleRemoveHabit(habit.habitId)}
              >
                X
              </button>
            </Grid>
          )}
          <Grid item>
            <h2>{habit.habitName}</h2>
          </Grid>
        </Grid>
      );
    });
  }

  async function removeHabitFromDB(habitId) {
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
  }

  async function removeHabitFromUserHabits(habitId) {
    let url = `/api/users/${user.id}/habits`;
    let headers = { Authorization: `Bearer ${token}` };
    let data = { habitId };
    await axios.delete(url, { data, headers });
    setUserHabits(userHabits.filter((habit) => habit.habitId !== habitId));
  }

  // async function removeHabitFromCategory(habitId)

  if (!userHabits) return <div>Loading...</div>;

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

  if (addShowing) {
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
  } else {
    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 3 }}
      >
        <Typography variant="h4">Habits</Typography>

        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>
            <Button onClick={handleClick}>Add habit</Button>
          </Grid>
          <Grid item>
            <Button onClick={() => setEditMode(!editMode)}>
              {editMode ? "Done" : "Edit"}
            </Button>
          </Grid>
        </Grid>

        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ width: "100%" }}
        >
          <Grid item></Grid>
          <Grid item xs={6} sm={4}>
            {getHabits()}
          </Grid>
          <Grid item></Grid>
        </Grid>
      </Grid>
    );
  }
}

export default Habits;

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

  useEffect(() => {
    async function getHabits() {
      const url = `/api/users/${user.id}/habits`;
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(url, { headers });
      return res.data.habits;
    }

    async function getCategories() {
      const url = `/api/habit_categories`;
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(url, { headers });
      return res.data.habitCategories;
    }

    if (!user) return;
    getHabits().then((data) => setUserHabits(data));
    getCategories().then((data) => setCategories(data));
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

  if (!userHabits) return <div>Loading...</div>;

  const handleClick = () => {
    setAddShowing(true);
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

        <Button onClick={handleClick}>Add habit</Button>

        {getHabits()}
      </Grid>
    );
  }
}

export default Habits;

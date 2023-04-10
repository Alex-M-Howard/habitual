import React from "react";
import { Button, Grid, Typography, Stack } from "@mui/material";
import NestedList from "@/components/NestedList";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import axios from "axios";
import {useTheme} from "@mui/material/styles";

const OTHER_CATEGORY_ID = 10;

function AddHabit({
  userHabits,
  categories,
  onHabitSelect,
  customHabit,
  setCustomHabit,
  setAddShowing,
  setUserHabits,
  setEditMode,
}) {
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const router = useRouter();
  const fields = [{ name: "name", label: "Name" }];
  const initialValues = {
    name: "",
  };
  const theme = useTheme();

  const addHabitToUser = async (habitId) => {
    const data = { habitId, frequency: 1 };
    const url = `/api/users/${user.id}/habits`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.post(url, data, { headers });
      if (response.status === 200) {
        const habitId = response.data[0].habitId;
        const habitName = customHabit;

        setUserHabits([...userHabits, { habitId, habitName, frequency: 1 }]);
        setAddShowing(false);
      }
    } catch (error) {   
      console.log("Error");
    }
  };

  const addHabitToDB = async (habit) => {
    const data = habit;
    const url = `/api/habits`;
    const headers = { Authorization: `Bearer ${token}` };

    const res = await axios.post(url, data, { headers });

    if (res.status === 200) {
      await addHabitToUser(res.data.habits.id);
      await addHabitToOther(res.data.habits.id);
      setAddShowing(false);
    } else {
      // TODO - Handle error
      console.log("Error");
    }
  };

  const addHabitToOther = async (habitId) => {
    const data = { habitId, categoryId: OTHER_CATEGORY_ID };
    const url = `/api/habit_categories`;
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.post(url, data, { headers });

    if (res.status === 200) return;
    // TODO - Handle error
    console.log("Error");
  };

  const handleAdd = async () => {
    if (customHabit === "") return;

    const habitId = categories.find(
      (category) => category.habitName === customHabit
    )?.habitId;

    if (habitId) {
      await addHabitToUser(habitId);
    } else {
      await addHabitToDB({ name: customHabit });
    }
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 3 }}>
      <NestedList
        userHabits={userHabits}
        habitCategories={categories}
        onHabitSelect={onHabitSelect}
        customHabit={customHabit}
        setCustomHabit={setCustomHabit}
      />
      <Stack spacing={2} sx={{ mt: 2}} direction="row">
        <Button variant="outlined" onClick={handleAdd}>Add Habit</Button>
        <Button variant="outlined" onClick={() => setAddShowing(false)}>Cancel</Button>
      </Stack>
    </Grid>
  );
}

export default AddHabit;

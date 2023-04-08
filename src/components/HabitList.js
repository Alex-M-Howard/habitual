import React, {useState, useEffect} from "react";
import { Grid, Stack, Button, ListItem, List, Switch, ListItemText } from "@mui/material";
import uuid4 from "uuid4";


function HabitList({ userHabits, trackHabit, habitLog, editMode, handleRemoveHabit, handleClick, setEditMode }) {

const isHabitTracked = (habitId) => {
  return habitLog.some((log) => log.habitId === habitId);
};

const initialCheckedState = userHabits
  .filter((habit) => isHabitTracked(habit.habitId))
  .map((habit) => habit.habitId);

const [checked, setChecked] = useState(initialCheckedState);

useEffect(() => {
  setChecked(initialCheckedState);
}, [userHabits, habitLog]);


  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
      trackHabit('add', value);
    } else {
      trackHabit('remove', value);
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

  };

    const getHabits = () => {
      return userHabits.map((habit) => {
        return (
          <Grid
            container
            key={uuid4()}
            alignItems="center"
            justifyContent="flex-start">
            <ListItem style={{ minHeight: "60px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}>
                <ListItemText
                  style={{
                    minWidth: "250px",
                  }}>
                  {habit.habitName}
                </ListItemText>
                {editMode ? (
                  <div style={{ width: "50px" }}>
                    <button
                      style={{
                        backgroundColor: "rgba(0,0,0,0)",
                        border: "none",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                        width: "45px",
                      }}
                      onClick={() => handleRemoveHabit(habit.habitId)}>
                      X
                    </button>
                  </div>
                ) : (
                  <div style={{ width: "50px" }}>
                    <Switch
                      edge="end"
                      onChange={handleToggle(habit.habitId)}
                      checked={checked.indexOf(habit.habitId) !== -1}
                      inputProps={{
                        "aria-labelledby": `switch-list-label-${habit.habitId}`,
                      }}
                    />
                  </div>
                )}
              </div>
            </ListItem>
          </Grid>
        );
      });
    };

  return (
    <Grid container>
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100%" }}>
        <Grid item></Grid>
        <Grid item xs={6} sm={4}>
          <List>{getHabits()}</List>
        </Grid>
        <Grid item></Grid>
      </Grid>
      <Grid container justifyContent="center" alignItems="center" spacing={2}>
        <Grid item>
          <Stack spacing={2} direction="row">
            <Button variant="contained" onClick={handleClick}>
              Add habit
            </Button>
            <Button
              variant="contained"
              onClick={() => setEditMode(!editMode)}
              style={{
                minWidth: "150px", // Set a minimum width for the Remove Habit/Done button
              }}>
              {editMode ? "Done" : "Remove Habit"}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default HabitList;

import React, { useEffect, useState } from "react";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  TextField,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import axios from "axios";
import { useSelector } from "react-redux";
import uuid4 from "uuid4";
import { useTheme, CircularProgress, Grid } from "@mui/material";

function NestedList({
  userHabits,
  habitCategories,
  onHabitSelect,
  customHabit,
  setCustomHabit,
}) {
  const [open, setOpen] = useState({});
  const [categories, setCategories] = useState(null);
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const theme = useTheme();

  useEffect(() => {
    async function getCategories() {
      const url = `/api/habits/categories`;
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const res = await axios.get(url, { headers });
        return res.data.categories;
      } catch (err) {
        console.log("Error fetching categories", err);
      }
    }

    // Fetch categories when the component mounts
    if (!user) return;
    getCategories().then((data) => setCategories(data));
  }, []);

  // Handle expanding/collapsing a category
  const handleClick = (categoryId) => {
    setOpen((state) => ({ ...state, [categoryId]: !state[categoryId] }));
  };

  // Handle clicking on a habit
  const handleHabitClick = (habitId) => {
    setSelectedHabitId(habitId);
    const selectedHabit = habitCategories.find(
      (habit) => habit.habitId === habitId
    );
    if (selectedHabit) {
      onHabitSelect(selectedHabit.habitName);
    }
  };

  // Handle clicking on the "Create New Habit" option
  const handleOtherCategoryClick = () => {
    setSelectedHabitId("other");
    onHabitSelect(""); // Clear any previously selected habit name
  };

  // Render the nested list of categories and habits
  const listCategories = () => {
    return categories.map((category) => {
      const habitList = () => {
        const userHabitIds = userHabits.map((habit) => habit.habitId);
        return habitCategories.map((habit) => {
          if (habit.categoryId === category.id) {
            const isSelected = selectedHabitId === habit.habitId;
            if (userHabitIds.includes(habit.habitId)) {
              return (
                <Collapse
                  in={open[category.id]}
                  timeout="auto"
                  unmountOnExit
                  key={uuid4()}
                >
                  {/* Render disabled habit */}
                </Collapse>
              );
            } else {
              return (
                <Collapse
                  in={open[category.id]}
                  timeout="auto"
                  unmountOnExit
                  key={uuid4()}
                >
                  {/* Render clickable habit */}
                </Collapse>
              );
            }
          }
        });
      };

      return (
        <div key={uuid4()}>
          {/* Render category with expand/collapse button */}
          {habitList()}
        </div>
      );
    });
  };

  // Display a loading spinner while fetching categories
  if (!categories) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ height: "50vh" }}
      >
        <CircularProgress color="text" size="75px" />
      </Grid>
    );
  }

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          id="nested-list-subheader"
          style={{ color: theme.palette.text.main }}
        >
          Habits
        </ListSubheader>
      }
    >
      {listCategories()}
      {/* Render "Create New Habit" button */}
      {/* Render custom habit text field if "other" is selected */}
    </List>
  );
}

export default NestedList;

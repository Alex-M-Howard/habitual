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
import {useTheme, CircularProgress, Grid} from "@mui/material";

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
        console.log('Error fetching categories', err);
      }
    }

    if (!user) return;
    getCategories().then((data) => setCategories(data));
  }, []);

  const handleClick = (categoryId) => {
    setOpen((state) => ({ ...state, [categoryId]: !state[categoryId] }));
  };

  const handleHabitClick = (habitId) => {
    setSelectedHabitId(habitId);
    const selectedHabit = habitCategories.find(
      (habit) => habit.habitId === habitId
    );
    if (selectedHabit) {
      onHabitSelect(selectedHabit.habitName);
    }
  };

  const handleOtherCategoryClick = () => {
    setSelectedHabitId("other");
    onHabitSelect(""); // Clear any previously selected habit name
  };

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
                  key={uuid4()}>
                  <List component="div" disablePadding key={uuid4()}>
                    <ListItemButton
                      sx={{
                        pl: 4,
                        "&:hover": {
                          backgroundColor: theme.palette.text.main,
                           '& .MuiListItemText-primary': {
        color: theme.palette.text.secondary,
      },
                        },
                      }}
                      disabled={true}>
                      <ListItemText
                        primary={habit.habitName}
                        style={{ color: theme.palette.text.main }}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>
              );
            } else {
              return (
                <Collapse
                  in={open[category.id]}
                  timeout="auto"
                  unmountOnExit
                  key={uuid4()}>
                  <List component="div" disablePadding key={uuid4()}>
                    <ListItemButton
                      sx={{
                        pl: 4,
                        backgroundColor: isSelected
                          ? "primary.main"
                          : "transparent",
                        "&:hover": {
                          backgroundColor: "primary.main",
                          "& .MuiListItemText-primary": {
                            color: theme.palette.text.secondary,
                          },
                        },
                      }}
                      onClick={() => handleHabitClick(habit.habitId)}>
                      <ListItemText
                        primary={habit.habitName}
                        style={{ color: theme.palette.text.main }}
                        primaryTypographyProps={{
                          color: isSelected
                            ? theme.palette.text.secondary
                            : "inherit",
                        }}
                      />
                    </ListItemButton>
                  </List>
                </Collapse>
              );
            }
          }
        });
      };

      return (
        <div key={uuid4()}>
          <ListItemButton
            onClick={() => handleClick(category.id)}
            sx={{
              "&:hover": {
                backgroundColor: "primary.main",
                "& .MuiListItemText-primary": {
                  color: theme.palette.text.secondary,
                },
              },
            }}>
            <ListItemText
              primary={category.name}
              style={{ color: theme.palette.text.main }}
            />
            {open[category.id] ? (
              <ExpandLess sx={{ color: theme.palette.text.main }} />
            ) : (
              <ExpandMore sx={{ color: theme.palette.text.main }} />
            )}
          </ListItemButton>
          {habitList()}
        </div>
      );
    });
  };

  if (!categories) {
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
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          component="div"
          id="nested-list-subheader"
          style={{ color: theme.palette.text.main }}>
          Habits
        </ListSubheader>
      }>
      {listCategories()}
      <ListItemButton
        selected={selectedHabitId === "other"}
        onClick={handleOtherCategoryClick}
        sx={{
          backgroundColor:
            selectedHabitId === "other"
              ? theme.palette.primary.main
              : "transparent",
          color:
            selectedHabitId === "other"
              ? theme.palette.text.secondary
              : "inherit",
          "&:hover": {
            backgroundColor: theme.palette.primary.light,
          },
          "&:hover .MuiListItemText-primary": {
            color: theme.palette.text.secondary,
          },
        }}>
        <ListItemText
          primary="Create New Habit"
          style={{
            color:
              selectedHabitId === "other"
                ? theme.palette.text.secondary
                : theme.palette.text.main,
          }}
        />
      </ListItemButton>
      {selectedHabitId === "other" && (
        <TextField
          label="Custom habit"
          variant="outlined"
          size="small"
          value={customHabit}
          placeholder="Enter a custom habit"
          onChange={(e) => setCustomHabit(e.target.value)}
          sx={{ mt: 2, mb: 2, width: "100%" }}
          style={{ color: `${theme.palette.text.main}` }}
          InputLabelProps={{ style: { color: `${theme.palette.text.main}` } }}
          InputProps={{ style: { color: `${theme.palette.text.main}` } }}
        />
      )}
    </List>
  );
}

export default NestedList;

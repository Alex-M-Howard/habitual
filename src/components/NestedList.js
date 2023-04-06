import * as React from "react";
import { useEffect } from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import axios from "axios";
import { useSelector } from "react-redux";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { TextField } from "@mui/material";
import uuid4 from "uuid4";

function NestedList({
  userHabits,
  habitCategories,
  onHabitSelect,
  customHabit,
  setCustomHabit,
}) {
  const [open, setOpen] = React.useState({});
  const [categories, setCategories] = React.useState([]);
  const [selectedHabitId, setSelectedHabitId] = React.useState(null);
  const { user, token } = useSelector((store) => store.user.loggedIn);

  useEffect(() => {
    async function getCategories() {
      const res = await axios({
        method: "GET",
        url: `/api/habits/categories`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data.categories;
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
                <Collapse in={open[category.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding key={uuid4()}>
                    <ListItemButton sx={{ pl: 4 }} disabled={true}>
                      <ListItemText primary={habit.habitName} />
                    </ListItemButton>
                  </List>
                </Collapse>
              );
            } else {
              return (
                <Collapse in={open[category.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding key={uuid4()}>
                    <ListItemButton
                      sx={{
                        pl: 4,
                        backgroundColor: isSelected
                          ? "primary.main"
                          : "transparent",
                      }}
                      onClick={() => handleHabitClick(habit.habitId)}
                    >
                      <ListItemText
                        primary={habit.habitName}
                        primaryTypographyProps={{
                          color: isSelected
                            ? "primary.contrastText"
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
          <ListItemButton onClick={() => handleClick(category.id)}>
            <ListItemText primary={category.name} />
            {open[category.id] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          {habitList()}
        </div>
      );
    });
  };

  return (
    <List
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Habits
        </ListSubheader>
      }
    >
      {listCategories()}
      <ListItemButton
        selected={selectedHabitId === "other"}
        onClick={handleOtherCategoryClick}
      >
        <ListItemText primary="Other" />
      </ListItemButton>
      {selectedHabitId === "other" && (
        <TextField
          label="Custom habit"
          variant="outlined"
          size="small"
          value={customHabit}
          onChange={(e) => setCustomHabit(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />
      )}
    </List>
  );
}

export default NestedList;

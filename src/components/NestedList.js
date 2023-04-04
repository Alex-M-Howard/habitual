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

export default function NestedList({ habits, habitCategories }) {
  const [open, setOpen] = React.useState({});
  const [categories, setCategories] = React.useState([]);
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

  const listCategories = () => {
    return categories.map((category) => {
      const habits = () => {
        return habitCategories.map((habit) => {
          if (habit.categoryId === category.id) {
            return (
              <Collapse in={open[category.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary={habit.habitName} />
                  </ListItemButton>
                </List>
              </Collapse>
            );
          }
        });
      };

      return (
        <div>
          <ListItemButton onClick={() => handleClick(category.id)}>
            <ListItemText primary={category.name} />
            {open[category.id] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          {habits()}
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
    </List>
  );
}

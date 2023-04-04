import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "@mui/material";
import AddHabit from "@/components/AddHabit";

function Habits() {
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const [habits, setHabits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [addShowing, setAddShowing] = useState(false);

  useEffect(() => {
    async function getHabits() {
      const res = await axios({
        method: "GET",
        url: `/api/users/${user.id}/habits`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return res.data.habits;
    }

    async function getCategories() {
      const res = await axios({
        method: "GET",
        url: `/api/habit_categories`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data.habitCategories;
    }

    if (!user) return;
    getHabits().then((data) => setHabits(data));
    getCategories().then((data) => setCategories(data));
  }, [user]);

  function getHabits() {
    return habits.map((habit) => {
      return (
        <div key={habit.id}>
          <h2>{habit.habitName}</h2>
        </div>
      );
    });
  }

  if (!habits) return <div>Loading...</div>;

  const handleClick = () => {
    setAddShowing(true);
  };

  if (addShowing) {
    return <AddHabit habits={habits} categories={categories} />;
  } else {
    return (
      <div>
        <h1>Habits</h1>
        <Button onClick={handleClick}>Add habit</Button>

        {getHabits()}
      </div>
    );
  }
}

export default Habits;

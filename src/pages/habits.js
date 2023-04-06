import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "@mui/material";
import AddHabit from "@/components/AddHabit";
import uuid4 from "uuid4";

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
        <div key={uuid4()}>
          <h2>{habit.habitName}</h2>
        </div>
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

  console.log(userHabits);
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
      <div>
        <h1>Habits</h1>
        <Button onClick={handleClick}>Add habit</Button>

        {getHabits()}
      </div>
    );
  }
}

export default Habits;

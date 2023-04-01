import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Habits() {
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const [habits, setHabits] = useState([]);

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

    if (!user) return;
    getHabits().then((data) => setHabits(data));
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
  console.log(typeof habits)
  if (!habits) return <div>Loading...</div>;

  // Create list of habits
  console.log(habits);
  return (
    <div>
      <h1>Habits</h1>

      {getHabits()}
    </div>
  );
}

export default Habits;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Habits() {
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const [habits, setHabits] = useState([]);

  //TODO Get habit data when mounting component
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

      return res.data;
    }

    if (!user) return;
    getHabits().then((data) => setHabits(data));
  }, [user]);

  // Create list of habits
  console.log(habits);
  return (
    <div>
      <h1>Habits</h1>
    </div>
  );
}

export default Habits;

import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Habits() {
  const { user, token } = useSelector((store) => store.user.loggedIn);

  if (!user) return null;

  async function getHabits() {
    const username = user.email.split("@")[0];
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

  const habits = getHabits();

  return (
    <div>
      <h1>Habits</h1>
    </div>
  );
}

export default Habits;

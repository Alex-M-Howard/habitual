import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Journals() {
  const { user, token } = useSelector((store) => store.user.loggedIn);

  if (!user) return null;

  async function getJournals() {
    const username = user.email.split("@")[0];
    const res = await axios({
      method: "GET",
      url: `/api/users/${user.id}/journal`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  }

  const journals = getJournals();

  return (
    <div>
      <h1>Journals</h1>
    </div>
  );
}

export default Journals;

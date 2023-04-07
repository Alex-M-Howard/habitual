import React, { useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function Insights() {
  const { user, token } = useSelector((store) => store.user.loggedIn);

  useEffect(() => {
    async function fetchTrackerData() {
      const url = `/api/users/${user.id}/tracker`;
      const headers = {"Authorization": `Bearer ${token}`};
      const response = await axios.get(url, {headers});
      
      console.log(response);
    }

    if(!user) return;
    const res = fetchTrackerData();

  }, [user])

  return (
    <h1>hi</h1>
  )
}

export default Insights;

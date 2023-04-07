import React, { useEffect,useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Graph from "@/components/Graph";

function Insights() {
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchTrackerData() {
      const url = `/api/users/${user.id}/tracker`;
      const headers = {"Authorization": `Bearer ${token}`};
      const response = await axios.get(url, {headers});
      
      setData(response)
    }

    if(!user) return;
    const res = fetchTrackerData();

  }, [user])

  // TODO : Day of the week most completed habits
  // TODO : Day of the week least completed habits
  // TODO : Most completed habit
  // TODO : Least completed habit
  // TODO : Most completed category
  // TODO : Least completed category
  // TODO: Longest streak for a habit
  // TODO: Longest streak for a category
  // TODO: Longest streak overall
  // TODO: current streaks for habit
  // TODO: current streaks for category
  


  return (
    <div>
      <Graph data={data} />
    </div>
    )
}

export default Insights;

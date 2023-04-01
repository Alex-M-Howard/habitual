import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function Journals() {
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    async function getJournals() {
        const res = await axios({
        method: "GET",
        url: `/api/users/${user.id}/journal`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return res.data.journals;
    }

    if (!user) return;
    getJournals().then((data) => setJournals(data));
  }, [user]);

  function getJournals() {
    return journals.map((journal) => {
      return (
        <div key={journal.id}>
          <h2>{journal.name}</h2>
          <p>{journal.description}</p>
        </div>
      );
    });
  }

  return (
    <div>
      <h1>Journals</h1>
      {getJournals()}
    </div>
  );
}

export default Journals;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Grid, Typography, IconButton, Button, ButtonGroup } from "@mui/material";
import { Delete } from "@mui/icons-material";
import styles from "@/styles/Journals.module.css";
const {useTheme} = require("@mui/material/styles");

function Journals() {
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const [journals, setJournals] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState("");
  const [collapsedMonths, setCollapsedMonths] = useState({});
  const theme = useTheme();

  useEffect(() => {
    async function getJournals() {
      const url = `/api/users/${user.id}/journal`;
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get(url, { headers });
      return res.data.journals;
    }

    if (!user) return;
    getJournals().then((data) => setJournals(data));
  }, [user]);

  function selectJournal(journal) {
    setSelectedJournal(journal);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  function renderJournalList() {
    const groupedJournals = groupJournalsByMonth(
      journals.sort((a, b) => new Date(b.date) - new Date(a.date))
    );

    return Object.keys(groupedJournals).map((groupKey) => {
      const journalsInGroup = groupedJournals[groupKey];
          return (
            <div key={groupKey}>
              <h3
                onClick={() => toggleMonth(groupKey)}
                style={{ cursor: "pointer", color: theme.palette.text.main }}>
                {collapsedMonths[groupKey] ? "▶" : "▼"} {groupKey}
              </h3>
              {!collapsedMonths[groupKey] &&
                journalsInGroup.map((journal) => (
                  <div
                    key={journal.id}
                    onClick={() => selectJournal(journal)}
                    className={
                      selectedJournal?.id === journal.id
                        ? styles.selectedJournal
                        : ""
                    }
                    style={{ display: 'flex', height: '60px', justifyContent: 'space-between', alignItems: 'center', color: theme.palette.text.main}}
                  >
                    <h4 style={{ color: theme.palette.text.main }}>
                      {formatDate(journal.date)}{" "}
                      <IconButton
                        edge="end"
                        color="inherit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEntry(journal.id);
                        }}
                        style={{ color: theme.palette.accent.alternate}}
                      >
                        <Delete />
                      </IconButton>
                    </h4>
                  </div>
                ))}
            </div>
          );

    });
  }

  function handleEditButtonClick() {
    setIsEditing(true);
    setEditedEntry(selectedJournal.entry);
  }

  async function handleSaveButtonClick() {
    const url = `/api/users/${user.id}/journal`;
    const headers = { Authorization: `Bearer ${token}` };
    const data = { entry: editedEntry, journalId: selectedJournal.id };
    await axios.put(url, data, { headers });

    const updatedJournals = journals.map((journal) =>
      journal.id === selectedJournal.id
        ? { ...selectedJournal, entry: editedEntry }
        : journal
    );
    setJournals(updatedJournals);
    setSelectedJournal({ ...selectedJournal, entry: editedEntry });

    setIsEditing(false);
  }

  async function handleNewEntryButtonClick() {
    if (isEditing) setIsEditing(false);
    
    const existingJournal = journals.find((journal) => {
      const today = new Date();
      const journalDate = new Date(journal.date);
      return today.toDateString() === journalDate.toDateString();
    });

    if (existingJournal) {
      setSelectedJournal(existingJournal);
      setIsEditing(true);
      return;
    }

    const url = `/api/users/${user.id}/journal`;
    const headers = { Authorization: `Bearer ${token}` };
    const data = { entry: "" };
    const res = await axios.post(url, data, { headers });
    const newJournal = res.data.journals;

    setJournals([newJournal, ...journals]);
    setSelectedJournal(newJournal);
    setIsEditing(true);
  }

  async function handleDeleteEntry(journalId) {
    const url = `/api/users/${user.id}/journal`;
    const data = { id: journalId}
  const headers = { Authorization: `Bearer ${token}` };
  await axios.delete(url, { data, headers });

  const updatedJournals = journals.filter(
    (journal) => journal.id !== journalId
  );
  setJournals(updatedJournals);

  if (selectedJournal?.id === journalId) {
    setSelectedJournal(null);
  }
}

  function renderSelectedJournal() {
    if (!selectedJournal) {
      return (
        <div>
          <Button variant="outlined" onClick={handleNewEntryButtonClick}>New Entry</Button>
          <p style={{color: theme.palette.text.main}}>Select a journal from the left pane to view its content.</p>
        </div>
      );
    }

    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <h2 style={{ color: theme.palette.text.main }}>
            {formatDate(selectedJournal.date)}
          </h2>
          <div>
            <ButtonGroup
              variant="outlined"
              aria-label="text button group">
              <Button
                sx={{ width: "125px" }}
              
                onClick={handleNewEntryButtonClick}>
                New Entry
              </Button>
              {isEditing ? (
                <Button
                  sx={{ width: "125px" }}
                  
                  onClick={handleSaveButtonClick}>
                  Save
                </Button>
              ) : (
                <Button
                  sx={{ width: "125px" }}
                  
                  onClick={handleEditButtonClick}>
                  Edit
                </Button>
              )}
            </ButtonGroup>
          </div>
        </div>
        {isEditing ? (
          <textarea
            value={editedEntry}
            onChange={(e) => setEditedEntry(e.target.value)}
            rows="10"
            style={{ width: "100%" }}
          />
        ) : (
          <p style={{ color: theme.palette.text.main }}>{selectedJournal.entry}</p>
        )}
      </div>
    );
  }

  function groupJournalsByMonth(journals) {
    const groups = {};
    journals.forEach((journal) => {
      const date = new Date(journal.date);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const groupKey = `${month} ${year}`;

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(journal);
    });
    return groups;
  }

  function toggleMonth(groupKey) {
    setCollapsedMonths({
      ...collapsedMonths,
      [groupKey]: !collapsedMonths[groupKey],
    });
  }

  return (
    <div>
      <Typography variant="h4" align="center" gutterBottom sx={{mt: 2, color: theme.palette.text.main}}>
        Journals
      </Typography>
      <Grid container justifyContent="center">
        <Grid item xs={10} md={8} lg={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              {renderJournalList()}
            </Grid>
            <Grid item xs={12} md={8}>
              {renderSelectedJournal()}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Journals;

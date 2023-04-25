import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useTheme, Grid, Typography, IconButton, Button, ButtonGroup, CircularProgress, useMediaQuery } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";



function Journals() {

  

  const { user, token } = useSelector((store) => store.user.loggedIn);
  const [journals, setJournals] = useState(null);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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



  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }


  function handleEditButtonClick() {
    setIsEditing(true);
    setEditedEntry(selectedJournal.entry);
  }

  async function handleSaveButtonClick() {
    
    if (editedEntry !== '') {
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
    }
      
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
    setEditedEntry("");
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

function handleDateChange(date) {
  const adapter = new AdapterDayjs();
  const formattedSelectedDate = adapter.date(date).format("YYYY-MM-DD");

  const newSelectedJournal = journals.find((journal) => {
    const formattedJournalDate = new Date(journal.date)
      .toISOString()
      .split("T")[0];
    return formattedSelectedDate === formattedJournalDate;
  });

  if (newSelectedJournal?.id !== selectedJournal?.id) {
    setIsEditing(false);
  }

  setSelectedJournal(newSelectedJournal);
}


  function renderSelectedJournal() {
    if (!selectedJournal) {
      return (
        <Grid container justifyContent="center" alignItems='center' direction="column">
          <Button variant="outlined" onClick={handleNewEntryButtonClick}>
            New Entry
          </Button>
          <p style={{ color: theme.palette.text.main }}>
            Select a date to view a journal entry
          </p>
        </Grid>
      );
    }

    return (
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center">
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center">
          <Typography
            variant="h4"
            align="center"
            style={{ color: theme.palette.text.main }}>
            {formatDate(selectedJournal.date)}
          </Typography>
          <ButtonGroup variant="outlined" aria-label="text button group">
            <Button sx={{ width: "125px" }} onClick={handleNewEntryButtonClick}>
              New Entry
            </Button>
            {isEditing ? (
              <Button sx={{ width: "125px" }} onClick={handleSaveButtonClick}>
                Save
              </Button>
            ) : (
              <Button sx={{ width: "125px" }} onClick={handleEditButtonClick}>
                Edit
              </Button>
            )}
          </ButtonGroup>
        </Grid>
        {isEditing ? (
          <textarea
            value={editedEntry}
            onChange={(e) => setEditedEntry(e.target.value)}
            rows="10"
            style={{ width: isMobile ? "100%" : "50vw", marginTop: "5px" }}
          />
        ) : (
            <p
              style={{
                color: theme.palette.text.main,
                width: isMobile ? "100%" : "50vw",
              }}>
              {selectedJournal.entry}
            </p>
        )}
      </Grid>
    );
  }


  function shouldDisableDate(date) {
    const adapter = new AdapterDayjs();
    return !journals.some((journal) => {
      const journalDate = adapter.date(date).format("YYYY-MM-DD");
      const formattedJournalDate = new Date(journal.date)
        .toISOString()
        .split("T")[0];
      return journalDate === formattedJournalDate;
    });
  }


  function renderCalendar() {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          disableFuture={true}
          shouldDisableDate={shouldDisableDate}
          onChange={handleDateChange}
          sx={{
            color: theme.palette.text.main,
            "& .MuiDayCalendar-weekDayLabel": {
              color: theme.palette.text.main
            },
          }}
        />
      </LocalizationProvider>
    );
  }


if (!journals) {
  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ height: "50vh" }}>
      <CircularProgress color="text" size="75px" />
    </Grid>
  );
}
  
  
    return (
      <Grid container justifyContent="center" direction='column' alignItems='center'>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ mt: 2, color: theme.palette.text.main, width: '100vw' }}>
          Journals
        </Typography>

        <Grid item xs={12} sm={10} md={4}>
          {renderCalendar()}
        </Grid>
        <Grid item xs={12} sm={10} md={4}>
          {renderSelectedJournal()}
        </Grid>
      </Grid>
      
    );
  }
  

export default Journals;

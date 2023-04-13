import React, { useEffect,useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Graph from "@/components/Graph";
import { useTheme, Grid, Box, CircularProgress} from "@mui/material";
import TimeFrameSelector from "@/components/TimeFrameSelector";

function Insights() {
  const { user, token } = useSelector((store) => store.user.loggedIn);
  const [userStats, setUserStats] = useState(null);
  const theme = useTheme();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('mostCompletedHabits30');
  const colors = [
    '#fb5a5a',
    '#fc6d4b',
    '#f8803e',
    '#f29333',
    '#e8a52e',
    '#dcb631',
    '#cdc63d',
    '#bcd550',
    '#a9e467',
    '#92f183',
  ];

  const mapDataToColors = (data, colors) => {
    return data.map((_, index) => colors[index % colors.length]);
  };

   const handleChange = (newValue) => {
     setSelectedTimeFrame(newValue);
   };

  useEffect(() => {
    async function fetchUserStats() {
      const url = `/api/data/${user.id}`;
      const headers = { "Authorization": `Bearer ${token}` };
      const response = await axios.get(url, { headers });
      setUserStats(response.data);
    }

      if (!user) return;
      fetchUserStats();
  }, [user])

  // TODO - Add streaks

  console.log(userStats)

  const renderMostCompletedHabits = () => {
    try {
      const labels = userStats[selectedTimeFrame].map(habit => habit.name);
      const data = userStats[selectedTimeFrame].map(habit => habit.count);

      const minData = Math.max(Math.min(...data) - 25, 0);
      const maxData = Math.max(...data) + 25;


      const newData = {
        labels,
        datasets: [
          {
            label: "Days Completed",
            data: data,
            backgroundColor: mapDataToColors(data, colors.reverse()),
            borderColor: mapDataToColors(data, colors.reverse())
          },
        ],
      };

      const options = {
        scales: {
          y: {
            min: minData,
            max: maxData,
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Top 3 Most Completed Habits",
          },
        },
      };

      

      return (
        <Box width="100%" maxWidth="100vw">
          <Graph data={newData} options={options} graphType={"bar"} />
        </Box>
      );
    } catch (error) {
      console.log(error)
      return null;
    }
  }
  
  const renderHabitsCompletedByDay = () => {
    if (!userStats) return <div>Loading...</div>;
    try {
      const labels = userStats.habitsCompletedByDay.map((day) => day.name);
      const data = userStats.habitsCompletedByDay.map((day) => day.count);
      
      const maxData = Math.max(...data) + 25;

      const newData = {
        labels,
        datasets: [
          {
            label: "Days Completed",
            data: data,
            backgroundColor: mapDataToColors(data, colors),
            borderColor: mapDataToColors(data, colors),
          },
        ],
      };
      
      const options = {
        scales: {
          y: {
            min: 0,
            max: maxData,
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Habits Completed by Day",
          },
        },
      };

      return (
        <Box width="100%" maxWidth="100vw">
          <Graph data={newData} options={options} graphType={"bar"} />
        </Box>
      );

    } catch (error) {
      console.log(error);
      return null;
    }
  }
  
  const renderCategoriesMostCompleted = () => {
    if (!userStats) return <div>Loading...</div>;
    try {
      const labels = userStats.habitCategoryMostCompleted.map(
        (day) => day.name
      );
      const data = userStats.habitCategoryMostCompleted.map((day) => day.count);

      const maxData = Math.max(...data) + 25;

      const newData = {
        labels,
        datasets: [
          {
            label: "Categories with Most Completed Habits",
            data: data,
            backgroundColor: mapDataToColors(data, colors.reverse()),
            borderColor: mapDataToColors(data, colors.reverse()),
          },
        ],
      };

      const options = {
        scales: {
          y: {
            min: 0,
            max: maxData,
          },
        },
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "Categories with Most Habits Completed by Day",
          },
        },
      };

      return (
        <Box width="100%" maxWidth="100vw">
          <Graph data={newData} options={options} graphType={"bar"} />
        </Box>
      );
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  if (!userStats) {
    console.log("loading...");
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
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      alignItems="center"
      spacing={2}
      sx={{ mt: 3, minHeight: "100vh" }}>
      <Grid item xs={12} md={10}>
        <TimeFrameSelector
          selectedTimeFrame={selectedTimeFrame}
          handleChange={handleChange}
        />
        {renderMostCompletedHabits()}
      </Grid>

      <div
        style={{
          width: "50%",
          margin: "5rem 0",
          height: "1px",
          background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.primary.light} 100%)`,
        }}
      />

      <Grid item xs={12} md={10} sx={{ width: "100%" }}>
        {renderHabitsCompletedByDay()}
      </Grid>

      <div
        style={{
          width: "50%",
          margin: "5rem 0",
          height: "1px",
          background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
        }}
      />

      <Grid item xs={12} md={10} sx={{ width: "100%" }}>
        {renderCategoriesMostCompleted()}
      </Grid>

      <div
        style={{
          width: "50%",
          margin: "5rem 0",
          height: "1px",
          background: `linear-gradient(90deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.light} 50%, ${theme.palette.primary.dark} 100%)`,
        }}
      />
    </Grid>
  );
}

export default Insights;

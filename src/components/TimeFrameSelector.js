import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useTheme } from "@mui/material";

// List of available time intervals
const intervals = ["30", "60", "90", "180", "365", "All"];

function TimeFrameSelector({ selectedTimeFrame, handleChange }) {
  const theme = useTheme();

  return (
    <ButtonGroup variant="outlined" fullWidth>
      {/* Map over intervals to render buttons */}
      {intervals.map((timeFrame) => (
        <Button
          key={timeFrame}
          // Determine the button variant based on selectedTimeFrame
          variant={
            selectedTimeFrame === `mostCompletedHabits${timeFrame}`
              ? "contained"
              : "outlined"
          }
          // Handle button click to update selectedTimeFrame
          onClick={() =>
            handleChange(
              timeFrame === "All"
                ? "mostCompletedHabits"
                : `mostCompletedHabits${timeFrame}`
            )
          }
        >
          {/* Display the button label based on the interval */}
          {timeFrame === "All" ? "All Time" : `Last ${timeFrame} Days`}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default TimeFrameSelector;

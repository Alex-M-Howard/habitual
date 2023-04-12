import React from "react";
import { Button, ButtonGroup } from "@mui/material";
import { useTheme } from "@mui/material";

function TimeFrameSelector({ selectedTimeFrame, handleChange }) {
  const theme = useTheme();

  return (
    <ButtonGroup variant="outlined" fullWidth>
      {["30", "60", "90", "180", "365", "All"].map((timeFrame) => (
        <Button
          key={timeFrame}
          variant={selectedTimeFrame === `mostCompletedHabits${timeFrame}` ? "contained" : "outlined"
          }
          onClick={() =>
            handleChange(
              timeFrame === "All"
                ? "mostCompletedHabits"
                : `mostCompletedHabits${timeFrame}`
            )
          }>
          {timeFrame === "All" ? "All Time" : `Last ${timeFrame} Days`}
        </Button>
      ))}
    </ButtonGroup>
  );
}

export default TimeFrameSelector;

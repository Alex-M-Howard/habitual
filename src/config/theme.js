import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00c4ff",
      alternate: "#fff089",
    },
    secondary: {
      main: "#fff089",
      alternate: "#00c4ff",
    },
    error: {
      main: "#CC1236",
    },
    accent: {
      main: "#92f183",
      alternate: "#5E9A54",
    },
    text: {
      main: "#000",
    },
    background: {
      main: "#FFF"
    }
  }
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#004ab9",
      alternate: "#ffa255",
    },
    secondary: {
      main: "#ffa255",
      alternate: "#004ab9",
    },
    error: {
      main: "#CC1236",
    },
    accent: {
      main: "#5E9A54",
      alternate: "#92f183",
    },
    text: {
      main: "#fff",
    },
    background: {
      main: "#0B0B45",
    }
  }
});

export { lightTheme, darkTheme };

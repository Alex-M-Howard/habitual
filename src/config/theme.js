import {createTheme} from "@mui/material/styles";

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
      background: "#FF000033",
    },
    accent: {
      main: "#92f183",
      alternate: "#5E9A54",
    },
    text: {
      main: "#000",
      navbar: "#fb5a5a",
    },
    background: {
      main: "#FFF",
      navbar: "#FFF",
    },
  },
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
      background: "#FF000033",
    },
    accent: {
      main: "#5E9A54",
      alternate: "#92f183",
    },
    text: {
      main: "#FFF",
      navbar: "#fb5a5a",
    },
    background: {
      main: "#7c7c7c",
      navbar: "#7c7c7c",
    },
  },
});

export { lightTheme, darkTheme };

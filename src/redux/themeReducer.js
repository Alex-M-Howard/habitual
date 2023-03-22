import { createTheme } from "@mui/material/styles";

const light = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#00c4ff",
    },
    secondary: {
      main: "#fff089",
    },
    error: {
      main: "#CC1236",
    },
    accent: {
      main: "#92f183",
    },
    text: {
      main: "#000",
    },
    toggle: {
      main: "#FFF",
    },
    background: {
      main: "#FFF",
    },
  },
});

const dark = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#004ab9",
    },
    secondary: {
      main: "#ffa255",
    },
    error: {
      main: "#CC1236",
    },
    accent: {
      main: "#5E9A54",
    },
    text: {
      main: "#000",
    },
    toggle: {
      main: "#000",
    },
    background: {
      main: "#0B0B45",
    },
  },
});

const INITIAL_STATE = { theme: light };


function themeReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_THEME":
      return { ...state, theme: state.theme === light ? dark : light };
      
    default:
      return state;
  }
}

export default themeReducer;

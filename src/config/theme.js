import {createTheme} from "@mui/material/styles";

// Create a theme instance.
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#92f183",
      alternate: "#fff089",
    },
    secondary: {
      main: "#fff089",
      alternate: "#00c4ff",
    },
    error: {
      main: "rgb(248, 215, 218)",
      secondary: "rgb(114,28,36)",
    },
    accent: {
      main: "#92f183",
      alternate: "#5E9A54",
    },
    text: {
      main: "#fb5a5a",
      navbar: "#fb5a5a",
      alternate: "#FFF",
      secondary: "#000",
    },
    background: {
      main: "#FFF",
      navbar: "#FFF",
    },
    success: {
      main: "rgb(227,253,235)",
      secondary: "rgb(60,118,61)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#fb5a5a",
          color: "#FFF",
        },
        outlined: {
          color: "#fb5a5a",
          borderColor: "#fb5a5a",
          ":hover": {
            backgroundColor: "#fb5a5a",
            color: "#FFF",
          },
        },
      },
      defaultProps: {
        color: "primary",
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#5E9A54",
      alternate: "#ffa255",
    },
    secondary: {
      main: "#ffa255",
      alternate: "#004ab9",
    },
    error: {
      main: "rgb(120,60,65)",
      secondary: "#rgb(60,15,20)",
    },
    accent: {
      main: "##92f183",
      alternate: "#92f183",
    },
    text: {
      main: "#fb5a5a",
      navbar: "#fb5a5a",
      alternate: "#FFF",
      secondary: "#000",
    },
    background: {
      main: "rgba(1,1,1,0.9)",
      navbar: "#000",
    },
    success: {
      main: "rgb(75,135,95)",
      secondary: "rgb(30,75,35)",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#92f183",
          color: "#000",
        },
        outlined: {
          color: "#92f183",
          borderColor: "#92f183",
          ":hover": {
            backgroundColor: "#92f183",
            color: "#000",
          },
        },
      },
      defaultProps: {
        color: "primary",
      },
    },
  },
});


export { lightTheme, darkTheme };

// General Imports
import {useState, useEffect} from "react";
import {CacheProvider} from "@emotion/react";
import createEmotionCache from "@/config/createEmotionCache";
import rootReducer from "@/redux/rootReducer.js";
import {Provider, useSelector} from "react-redux";
import {configureStore} from "@reduxjs/toolkit";
import {darkTheme, lightTheme} from "@/config/theme";
import {useScrollTrigger} from "@mui/material";


// MaterialUI Imports
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// Component Imports
import NavBar from "@/components/NavBar";
import {NoSsr} from "@mui/material";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const store = configureStore({
  reducer: rootReducer,
});

function ThemeWrapper({ children }) {
  const [theme, setTheme] = useState( null );

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  } , []);

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme.palette.mode === "light" ? darkTheme : lightTheme
    );
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  }, []);

  useEffect(() => {
    if (theme) {
      let mode = theme.palette.mode;
      localStorage.setItem("theme", mode);
      document.body.style.backgroundColor = theme.palette.background.main;
    }
  }, [theme]);

  if (!theme) {
    return "Loading";
  }

  return (
    <ThemeProvider theme={theme}>
      <NoSsr>
        <NavBar onToggleTheme={toggleTheme} />
      </NoSsr>
      {children}
    </ThemeProvider>
  );
}


export default function MyApp(props) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;

  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
        <CssBaseline/>
        <ThemeWrapper>
          <Component {...pageProps} />
        </ThemeWrapper>
      </Provider>
    </CacheProvider>
  );
}

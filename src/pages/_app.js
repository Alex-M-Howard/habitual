//General Imports
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../config/createEmotionCache";
import rootReducer from "@/redux/rootReducer.js";
import { Provider, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { lightTheme, darkTheme } from "@/config/theme";

//MaterialUI Imports
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

//Component Imports
import NavBar from "@/components/NavBar";


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

 const store = configureStore({
   reducer: rootReducer,
 });

function ThemeWrapper({children}) {
  const colorMode = useSelector(store => store.activeTheme.theme);
  const theme = colorMode === 'light' ? lightTheme : darkTheme;

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}


export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  
  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
        <CssBaseline enableColorScheme={true} />
        <ThemeWrapper>
          <NavBar />
          <Component {...pageProps} />
        </ThemeWrapper>
      </Provider>
    </CacheProvider>
  );
}

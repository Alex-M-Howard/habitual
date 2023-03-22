//General Imports
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "../config/createEmotionCache";
import rootReducer from "@/redux/rootReducer.js";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";


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

 const themeSelector = (state) => state.theme;

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  
  const theme = useSelector(themeSelector());

  return (
    <CacheProvider value={emotionCache}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme={true} />
          <NavBar />
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  );
}

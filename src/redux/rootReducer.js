// rootReducer.js
import {combineReducers} from "redux";

// Attempt to get info from local storage
const user =
  (typeof window !== "undefined" && JSON.parse(localStorage.getItem("user"))) ||
  {};
const theme =
  (typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("theme"))) ||
  "light";

const INITIAL_USER_STATE = {loggedIn: user};
const INITIAL_THEME_STATE = {theme: theme};
console.log(INITIAL_THEME_STATE);

function userReducer(state = INITIAL_USER_STATE, action) {
  console.log(state.theme);
  switch (action.type) {
    case "LOGIN":
      // Save user to local storage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
      return {...state, loggedIn: {...action.payload}};

    case "LOGOUT":
      // Remove user from local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      return {...state, loggedIn: null};

    default:
      return state;
  }
}

function themeReducer(state = INITIAL_THEME_STATE, action) {
  switch (action.type) {
    case "CHANGE_THEME":
      // Save theme to local storage
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", JSON.stringify(action.payload));
      }
      console.log(state);
      return {...state, theme: action.payload};

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

export default rootReducer;

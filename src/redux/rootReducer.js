// rootReducer.js
import { combineReducers } from "redux";

const INITIAL_USER_STATE = { loggedIn: {} };
const INITIAL_THEME_STATE = { theme: "light" };

function userReducer(state = INITIAL_USER_STATE, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, loggedIn: { ...action.payload } };

    case "LOGOUT":
      return { ...state, loggedIn: {} };

    default:
      return state;
  }
}

function themeReducer(state = INITIAL_THEME_STATE, action) {
  switch (action.type) {
    case "CHANGE_THEME":
      return { ...state, theme: action.payload };

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

export default rootReducer;

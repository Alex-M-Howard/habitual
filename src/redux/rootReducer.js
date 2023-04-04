// rootReducer.js
import { combineReducers } from "redux"; // // Attempt to get info from local storage

const INITIAL_USER_STATE = { loggedIn: {} };

function userReducer(state = INITIAL_USER_STATE, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, loggedIn: { ...action.payload } };

    case "SAVE_TO_LOCALSTORAGE":
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
      return state;

    case "REMOVE_FROM_LOCALSTORAGE":
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      return state;

    case "LOGOUT":
      return { ...state, loggedIn: null };

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;

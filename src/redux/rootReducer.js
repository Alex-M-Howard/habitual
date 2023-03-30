// rootReducer.js
import { combineReducers } from "redux"; // // Attempt to get info from local storage

const INITIAL_USER_STATE = { loggedIn: {} };

function userReducer(state = INITIAL_USER_STATE, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, loggedIn: { ...action.payload } };

    case "LOGIN":
      // Save user to local storage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
      return { ...state, loggedIn: { ...action.payload } };

    case "LOGOUT":
      // Remove user from local storage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      return { ...state, loggedIn: null };

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;

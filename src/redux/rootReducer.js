// rootReducer.js
import { lightTheme, darkTheme } from "@/config/theme";

const INITIAL_USER_STATE = { user: {} };
const INITIAL_THEME_STATE = { theme: 'light' };

function userReducer(state = INITIAL_USER_STATE, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: {} };
    default:
      return state;
  }
}

function themeReducer(state = INITIAL_THEME_STATE, action) {
  switch (action.type) {
    case "CHANGE_THEME":
        return { ...state, theme: action.payload}

    default:
      return state;
  }
}

const rootReducer = (state = {}, action) => {
  return {
    user: userReducer(state.user, action),
    activeTheme: themeReducer(state.theme, action),
  };
};

export default rootReducer;

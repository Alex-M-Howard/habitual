const INITIAL_STATE = { user: {} };

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };

    case "LOGOUT":
      return { ...state, user: {} };

    default:
      return state;
  }
}

export default userReducer;

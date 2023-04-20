import configureMockStore from "redux-mock-store";

const mockStore = configureMockStore();
const store = mockStore({
  user: {
    loggedIn: {
      user: {
        id: 1,
        firstName: "Test",
        lastName: "User",
        email: "test@test.com",
      },
    },
    token: "mockToken",
  },
});


export default store;
import { csrfFetch } from "./csrf";

// Action types
const SET_USER = "session/setUser"; // Used to set the user in the session
const REMOVE_USER = "session/removeUser"; // Used to remove the user from the session

// Action creators - these are functions that return actions (objects with a type property and optionally a payload)
const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

// Thunks - these are functions that return other functions. They're used to handle async logic and dispatch actions
// The restoreUser thunk fetches the current session user and dispatches the setUser action with the user as the payload
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// The login thunk sends a POST request to log in the user. It then dispatches the setUser action with the returned user
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// The signup thunk sends a POST request to sign up the user. It then dispatches the setUser action with the returned user
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// The logout thunk sends a DELETE request to log out the user. It then dispatches the removeUser action to remove the user from the session
export const logout = () => async (dispatch) => {
  const response = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(removeUser());
  return response;
};

// Initial state for the session reducer
const initialState = { user: null };

// Reducer - this is a pure function that takes the current state and an action, and returns the new state
const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = Object.assign({}, state);
      newState.user = action.payload; // Sets the user in the session
      return newState;
    case REMOVE_USER:
      newState = Object.assign({}, state);
      newState.user = null; // Removes the user from the session
      return newState;
    default:
      return state; // Returns the current state if no action types match
  }
};

export default sessionReducer;

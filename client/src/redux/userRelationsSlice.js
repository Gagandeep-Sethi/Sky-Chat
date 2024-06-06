import { createSlice } from "@reduxjs/toolkit";

// Function to load data from local storage
const loadFromLocalStorage = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load from local storage", err);
    return undefined;
  }
};

// Function to save data to local storage
const saveToLocalStorage = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (err) {
    console.error("Could not save to local storage", err);
  }
};

const initialState = {
  friends: loadFromLocalStorage("friends") || [],
  blocked: loadFromLocalStorage("blocked") || [],
};

const userRelationsSlice = createSlice({
  name: "userRelations",
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
      saveToLocalStorage("friends", state.friends);
    },
    setBlocked: (state, action) => {
      state.blocked = action.payload;
      saveToLocalStorage("blocked", state.blocked);
    },
  },
});

export const { setFriends, setBlocked } = userRelationsSlice.actions;
export default userRelationsSlice.reducer;

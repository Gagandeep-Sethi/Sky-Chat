import { createSlice } from "@reduxjs/toolkit";

// Load user from local storage if available
const storedUser = localStorage.getItem("user");
const initialState = storedUser
  ? JSON.parse(storedUser)
  : {
      username: "",
      email: "",
      profilePic: "",
    };

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const { username, email, profilePic } = action.payload;
      state.username = username || "";
      state.email = email || "";
      state.profilePic = profilePic || "";

      // Store user data in local storage
      localStorage.setItem(
        "user",
        JSON.stringify({ username, email, profilePic })
      );
    },
    removeUser: (state) => {
      state.username = "";
      state.email = "";
      state.profilePic = "";

      // Remove user data from local storage
      localStorage.removeItem("user");
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    activeComponent: "sidebar", // 'sidebar', 'chat', 'profile'
    profile: "", //own or friend
    selectedChat: {
      username: "",
      profilePic: "",
      FriendId: "",
    },
  },
  reducers: {
    setActiveComponent: (state, action) => {
      state.activeComponent = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
});

export const { setActiveComponent, setSelectedChat, setProfile } =
  uiSlice.actions;

export default uiSlice.reducer;

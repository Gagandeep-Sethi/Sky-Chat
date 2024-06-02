import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    activeComponent: "sidebar", // 'sidebar', 'chat', 'profile'
    selectedChat: null,
  },
  reducers: {
    setActiveComponent: (state, action) => {
      state.activeComponent = action.payload;
    },
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
    },
  },
});

export const { setActiveComponent, setSelectedChat } = uiSlice.actions;

export default uiSlice.reducer;

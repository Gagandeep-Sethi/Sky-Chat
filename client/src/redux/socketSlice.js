const { createSlice } = require("@reduxjs/toolkit");

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineUsers: [],
  },
  reducers: {
    addSocket: (state, action) => {
      state.socket = action.payload;
    },
    removeSocket: (state) => {
      state.socket = null;
    },
    updateOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    emptyOnlineUsers: (state) => {
      state.onlineUsers = null;
    },
  },
});

export const { addSocket, removeSocket, emptyOnlineUsers, updateOnlineUsers } =
  socketSlice.actions;
export default socketSlice.reducer;

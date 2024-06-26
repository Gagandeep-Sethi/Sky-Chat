// import { createSlice } from "@reduxjs/toolkit";

// const socketSlice = createSlice({
//   name: "socket",
//   initialState: {
//     onlineUsers: [],
//   },
//   reducers: {
// updateOnlineUsers: (state, action) => {
//   state.onlineUsers = action.payload;
// },
// emptyOnlineUsers: (state) => {
//   state.onlineUsers = null;
// },
//   },
// });

// export const { emptyOnlineUsers, updateOnlineUsers } = socketSlice.actions;
// export default socketSlice.reducer;
// socketSlice.js
import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
import { Fetch_Uri } from "../utils/constants"; // Update this import path as needed

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineUsers: [],
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    clearSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
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

export const { setSocket, clearSocket, emptyOnlineUsers, updateOnlineUsers } =
  socketSlice.actions;

export const initializeSocket = () => async (dispatch) => {
  const socket = io(Fetch_Uri, {
    withCredentials: true, // To send cookies
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });
  socket.on("getOnlineUsers", (onlineUsers) => {
    console.log(onlineUsers, "onlineusers");
    if (onlineUsers.length > 0) dispatch(updateOnlineUsers(onlineUsers));
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  dispatch(setSocket(socket));
};

export default socketSlice.reducer;

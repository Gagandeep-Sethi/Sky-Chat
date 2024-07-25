import { createSlice } from "@reduxjs/toolkit";
import io from "socket.io-client";
import { Fetch_Uri } from "../utils/constants";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onlineUsers: [],
    currentRoom: null,
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
      state.onlineUsers = [];
    },
    setCurrentRoom: (state, action) => {
      state.currentRoom = action.payload;
    },
  },
});

export const {
  setSocket,
  clearSocket,
  emptyOnlineUsers,
  updateOnlineUsers,
  setCurrentRoom,
} = socketSlice.actions;

export const initializeSocket = () => async (dispatch) => {
  const token = localStorage.getItem("token"); // Retrieving  token from local storage

  const socket = io(Fetch_Uri, {
    auth: {
      token: token, // Send the token as part of the handshake
    },

    // withCredentials: true, // Set this if you need to include credentials
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });
  socket.on("getOnlineUsers", (onlineUsers) => {
    if (onlineUsers.length > 0) dispatch(updateOnlineUsers(onlineUsers));
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  dispatch(setSocket(socket));
};

export const joinRoom = (roomId) => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (socket) {
    socket.emit("joinRoom", roomId);
    dispatch(setCurrentRoom(roomId));
  }
};

export const leaveRoom = (roomId) => (dispatch, getState) => {
  const { socket } = getState().socket;
  if (socket) {
    socket.emit("leaveRoom", roomId);
    dispatch(setCurrentRoom(null));
  }
};

export default socketSlice.reducer;

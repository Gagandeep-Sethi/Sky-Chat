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
// import { createSlice } from "@reduxjs/toolkit";
// import io from "socket.io-client";
// import { Fetch_Uri } from "../utils/constants"; // Update this import path as needed

// const socketSlice = createSlice({
//   name: "socket",
//   initialState: {
//     socket: null,
//     onlineUsers: [],
//   },
//   reducers: {
//     setSocket: (state, action) => {
//       state.socket = action.payload;
//     },
//     clearSocket: (state) => {
//       if (state.socket) {
//         state.socket.disconnect();
//       }
//       state.socket = null;
//     },

//     updateOnlineUsers: (state, action) => {
//       state.onlineUsers = action.payload;
//     },
//     emptyOnlineUsers: (state) => {
//       state.onlineUsers = null;
//     },
//   },
// });

// export const { setSocket, clearSocket, emptyOnlineUsers, updateOnlineUsers } =
//   socketSlice.actions;

// export const initializeSocket = () => async (dispatch) => {
//   const socket = io(Fetch_Uri, {
//     withCredentials: true, // To send cookies
//   });

//   socket.on("connect", () => {
//     console.log("Socket connected:", socket.id);
//   });
//   socket.on("getOnlineUsers", (onlineUsers) => {
//     console.log(onlineUsers, "onlineusers");
//     if (onlineUsers.length > 0) dispatch(updateOnlineUsers(onlineUsers));
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected");
//   });

//   dispatch(setSocket(socket));
// };

// export default socketSlice.reducer;
// socketSlice.js
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
  const socket = io(Fetch_Uri, {
    withCredentials: true,
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

import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import userReducer from "./userSlice";
import userRelationsReducer from "./userRelationsSlice";
import themeReducer from "./themeSlice";
import socketReducer from "./socketSlice";
const Store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
    userRelations: userRelationsReducer,
    theme: themeReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["socket/setSocket", "socket/clearSocket"],
        ignoredPaths: ["socket.socket"],
      },
    }),
});

export default Store;

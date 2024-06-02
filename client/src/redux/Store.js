import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import userReducer from "./userSlice";

const Store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
  },
});

export default Store;

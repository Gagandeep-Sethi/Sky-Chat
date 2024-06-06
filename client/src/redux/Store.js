import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import userReducer from "./userSlice";
import userRelationsReducer from "./userRelationsSlice";
const Store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
    userRelations: userRelationsReducer,
  },
});

export default Store;

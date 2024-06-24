import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./uiSlice";
import userReducer from "./userSlice";
import userRelationsReducer from "./userRelationsSlice";
import themeReducer from "./themeSlice";
const Store = configureStore({
  reducer: {
    ui: uiReducer,
    user: userReducer,
    userRelations: userRelationsReducer,
    theme: themeReducer,
  },
});

export default Store;

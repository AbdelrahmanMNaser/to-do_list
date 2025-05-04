import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userReducer from "./slices/userSlice";
import taskReducer from "./slices/taskSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    tasks : taskReducer
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;

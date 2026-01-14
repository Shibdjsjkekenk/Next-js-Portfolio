import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import allUsersReducer from "./allUsersSlice";
import bannerReducer from "./bannerSlice";
import aboutReducer from "./aboutSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUsersReducer,
    banner: bannerReducer,
    about: aboutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import allUsersReducer from "./allUsersSlice";
import bannerReducer from "./bannerSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUsersReducer,
    banner: bannerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

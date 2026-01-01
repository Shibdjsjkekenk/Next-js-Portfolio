import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import allUsersReducer from "./allUsersSlice"; 

export const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUsersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

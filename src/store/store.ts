import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import allUsersReducer from "./allUsersSlice";
import bannerReducer from "./bannerSlice";
import aboutReducer from "./aboutSlice";
import timelineReducer from "./timelineSlice";
import projectReducer from "./projectSlice";
import experienceReducer from "./experienceSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    allUsers: allUsersReducer,
    banner: bannerReducer,
    about: aboutReducer,
    timeline: timelineReducer,
    projects: projectReducer,
    experience: experienceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

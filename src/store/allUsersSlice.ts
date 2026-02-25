import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AllUser = {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "GENERAL";
  profilePic?: string;
  createdAt: string;
  loginCount?: number;
  logins?: {
    deviceName?: string;
    ipAddress?: string;
    city?: string;
    state?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    loggedInAt?: string;
  }[];
};

type AllUsersState = {
  list: AllUser[];
  loading: boolean;
  fetchedOnce: boolean;
};

const initialState: AllUsersState = {
  list: [],
  loading: true,
  fetchedOnce: false,
};

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    setAllUsers: (state, action: PayloadAction<AllUser[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.fetchedOnce = true;
    },

    setAllUsersLoading: (state) => {
      state.loading = true;
    },

    clearAllUsers: (state) => {
      state.list = [];
      state.loading = false;
      state.fetchedOnce = false;
    },

    removeAllUser: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        user => user._id !== action.payload
      );
    },

    updateAllUser: (state, action: PayloadAction<AllUser>) => {
      const index = state.list.findIndex(
        user => user._id === action.payload._id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const {
  setAllUsers,
  setAllUsersLoading,
  clearAllUsers,
  removeAllUser,
  updateAllUser,
} = allUsersSlice.actions;

export default allUsersSlice.reducer;

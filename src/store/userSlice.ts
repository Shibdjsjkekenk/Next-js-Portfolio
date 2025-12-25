import { createSlice } from "@reduxjs/toolkit";

type User = {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN" | "GENERAL";
};

type UserState = {
  user: User | null;
  loading: boolean;
};

const initialState: UserState = {
  user: null,
  loading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.loading = false;
    },
    setLoading: (state) => {
      state.loading = true;
    },
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;

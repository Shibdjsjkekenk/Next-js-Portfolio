import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export type About = {
  _id: string;
  content: string;        // Rich text HTML
  image?: string;
  resume?: string;
  isActive: boolean;
  createdAt: string;
};

/* ================= STATE ================= */

type AboutState = {
  list: About[];
  loading: boolean;
  fetchedOnce: boolean;      // navigation par dobara fetch na ho
  activeAboutId: string | null; // view / edit modal control
};

/* ================= INITIAL STATE ================= */

const initialState: AboutState = {
  list: [],
  loading: true,
  fetchedOnce: false,
  activeAboutId: null,
};

/* ================= SLICE ================= */

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    setAbouts: (state, action: PayloadAction<About[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.fetchedOnce = true;
    },

    setAboutsLoading: (state) => {
      //  (no unnecessary loading on navigation)
      if (!state.fetchedOnce) {
        state.loading = true;
      }
    },

    clearAbouts: (state) => {
      state.list = [];
      state.loading = false;
      state.fetchedOnce = false;
      state.activeAboutId = null;
    },

    removeAbout: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(a => a._id !== action.payload);
    },

    updateAbout: (state, action: PayloadAction<About>) => {
      const index = state.list.findIndex(a => a._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    addAbout: (state, action: PayloadAction<About>) => {
      state.list.unshift(action.payload);
    },

    /* VIEW / EDIT MODAL ACTIONS */
    setActiveAbout: (state, action: PayloadAction<string | null>) => {
      state.activeAboutId = action.payload;
    },
  },
});

/* ================= EXPORTS ================= */

export const {
  setAbouts,
  setAboutsLoading,
  clearAbouts,
  removeAbout,
  updateAbout,
  addAbout,
  setActiveAbout,
} = aboutSlice.actions;

export default aboutSlice.reducer;

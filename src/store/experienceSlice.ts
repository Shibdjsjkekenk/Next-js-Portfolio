import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export type Experience = {
  _id: string;
  content: string;        // Rich text HTML (editor se aayega)
  order?: number;
  isActive: boolean;
  createdAt: string;
};

/* ================= STATE ================= */

type ExperienceState = {
  list: Experience[];
  loading: boolean;
  fetchedOnce: boolean;          // navigation pe dobara fetch na ho
  activeExperienceId: string | null; // edit / view ke liye
};

/* ================= INITIAL STATE ================= */

const initialState: ExperienceState = {
  list: [],
  loading: true,
  fetchedOnce: false,
  activeExperienceId: null,
};

/* ================= SLICE ================= */

const experienceSlice = createSlice({
  name: "experience",
  initialState,
  reducers: {
    /* SET ALL */
    setExperiences: (state, action: PayloadAction<Experience[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.fetchedOnce = true;
    },

    /* LOADING (navigation-safe) */
    setExperiencesLoading: (state) => {
      if (!state.fetchedOnce) {
        state.loading = true;
      }
    },

    /* CLEAR (logout / reset) */
    clearExperiences: (state) => {
      state.list = [];
      state.loading = false;
      state.fetchedOnce = false;
      state.activeExperienceId = null;
    },

    /* ADD */
    addExperience: (state, action: PayloadAction<Experience>) => {
      state.list.push(action.payload);
    },

    /* UPDATE FULL OBJECT */
    updateExperience: (state, action: PayloadAction<Experience>) => {
      const index = state.list.findIndex(
        e => e._id === action.payload._id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    /* REMOVE */
    removeExperience: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        e => e._id !== action.payload
      );
    },

    /* STATUS TOGGLE */
    updateExperienceStatus: (
      state,
      action: PayloadAction<{ id: string; isActive: boolean }>
    ) => {
      const exp = state.list.find(
        e => e._id === action.payload.id
      );
      if (exp) {
        exp.isActive = action.payload.isActive;
      }
    },

    /* VIEW / EDIT CONTROL */
    setActiveExperience: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.activeExperienceId = action.payload;
    },
  },
});

/* ================= EXPORTS ================= */

export const {
  setExperiences,
  setExperiencesLoading,
  clearExperiences,
  addExperience,
  updateExperience,
  removeExperience,
  updateExperienceStatus,
  setActiveExperience,
} = experienceSlice.actions;

export default experienceSlice.reducer;

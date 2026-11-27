import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types

export type Timeline = {
  _id: string;
  category: string;        // e.g. education, deployment, hobby
  content: string;         // Rich text HTML
  order?: number;
  isActive: boolean;
  createdAt: string;
};

// state

type TimelineState = {
  list: Timeline[];
  loading: boolean;
  fetchedOnce: boolean;        // navigation pe dobara fetch na ho
  activeTimelineId: string | null; // edit / view ke liye
};

// initial state

const initialState: TimelineState = {
  list: [],
  loading: true,
  fetchedOnce: false,
  activeTimelineId: null,
};

// slice

const timelineSlice = createSlice({
  name: "timeline",
  initialState,
  reducers: {
    /* SET ALL */
    setTimelines: (state, action: PayloadAction<Timeline[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.fetchedOnce = true;
    },

    /* LOADING (navigation-safe) */
    setTimelinesLoading: (state) => {
      // unnecessary loading avoid
      if (!state.fetchedOnce) {
        state.loading = true;
      }
    },

    /* CLEAR (logout / reset) */
    clearTimelines: (state) => {
      state.list = [];
      state.loading = false;
      state.fetchedOnce = false;
      state.activeTimelineId = null;
    },

    /* ADD */
    addTimeline: (state, action: PayloadAction<Timeline>) => {
      state.list.push(action.payload);
    },

    /* UPDATE FULL OBJECT */
    updateTimeline: (state, action: PayloadAction<Timeline>) => {
      const index = state.list.findIndex(
        t => t._id === action.payload._id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    /* REMOVE */
    removeTimeline: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        t => t._id !== action.payload
      );
    },

    /* STATUS TOGGLE (optional helper) */
    updateTimelineStatus: (
      state,
      action: PayloadAction<{ id: string; isActive: boolean }>
    ) => {
      const timeline = state.list.find(
        t => t._id === action.payload.id
      );
      if (timeline) {
        timeline.isActive = action.payload.isActive;
      }
    },

    /* VIEW / EDIT CONTROL */
    setActiveTimeline: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.activeTimelineId = action.payload;
    },
  },
});

// export

export const {
  setTimelines,
  setTimelinesLoading,
  clearTimelines,
  addTimeline,
  updateTimeline,
  removeTimeline,
  updateTimelineStatus,
  setActiveTimeline,
} = timelineSlice.actions;

export default timelineSlice.reducer;

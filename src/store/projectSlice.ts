import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* =====================
   Types
===================== */

export type Project = {
  _id: string;
  content: string;          // Rich text HTML (title + description)
  projectImage: string;
  projectLink: string;
  order?: number;
  isActive: boolean;
  createdAt: string;
};

/* =====================
   State
===================== */

type ProjectState = {
  list: Project[];
  loading: boolean;
  fetchedOnce: boolean;        // navigation pe dobara fetch na ho
  activeProjectId: string | null; // edit / view ke liye
};

/* =====================
   Initial State
===================== */

const initialState: ProjectState = {
  list: [],
  loading: true,
  fetchedOnce: false,
  activeProjectId: null,
};

/* =====================
   Slice
===================== */

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    /* SET ALL */
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.fetchedOnce = true;
    },

    /* LOADING (navigation-safe) */
    setProjectsLoading: (state) => {
      // route change pe unnecessary loader avoid
      if (!state.fetchedOnce) {
        state.loading = true;
      }
    },

    /* CLEAR (logout / reset) */
    clearProjects: (state) => {
      state.list = [];
      state.loading = false;
      state.fetchedOnce = false;
      state.activeProjectId = null;
    },

    /* ADD */
    addProject: (state, action: PayloadAction<Project>) => {
      state.list.push(action.payload);
    },

    /* UPDATE FULL OBJECT */
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.list.findIndex(
        p => p._id === action.payload._id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    /* REMOVE */
    removeProject: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        p => p._id !== action.payload
      );
    },

    /* STATUS TOGGLE (helper) */
    updateProjectStatus: (
      state,
      action: PayloadAction<{ id: string; isActive: boolean }>
    ) => {
      const project = state.list.find(
        p => p._id === action.payload.id
      );
      if (project) {
        project.isActive = action.payload.isActive;
      }
    },

    /* VIEW / EDIT CONTROL */
    setActiveProject: (
      state,
      action: PayloadAction<string | null>
    ) => {
      state.activeProjectId = action.payload;
    },
  },
});

/* =====================
   Exports
===================== */

export const {
  setProjects,
  setProjectsLoading,
  clearProjects,
  addProject,
  updateProject,
  removeProject,
  updateProjectStatus,
  setActiveProject,
} = projectSlice.actions;

export default projectSlice.reducer;

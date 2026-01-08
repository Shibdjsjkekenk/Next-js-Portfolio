import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ================= TYPES ================= */

export type Banner = {
  _id: string;
  title: string;
  paragraph: string;
  italicTitle?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
};

/* ================= STATE ================= */

type BannerState = {
  list: Banner[];
  loading: boolean;
  fetchedOnce: boolean;
  activeBannerId: string | null; // 🔥 VIEW MODAL CONTROL
};

/* ================= INITIAL STATE ================= */

const initialState: BannerState = {
  list: [],
  loading: true,
  fetchedOnce: false,
  activeBannerId: null,
};

/* ================= SLICE ================= */

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    setBanners: (state, action: PayloadAction<Banner[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.fetchedOnce = true;
    },

    setBannersLoading: (state) => {
      state.loading = true;
    },

    clearBanners: (state) => {
      state.list = [];
      state.loading = false;
      state.fetchedOnce = false;
      state.activeBannerId = null;
    },

    removeBanner: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(b => b._id !== action.payload);
    },

    updateBanner: (state, action: PayloadAction<Banner>) => {
      const index = state.list.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    addBanner: (state, action: PayloadAction<Banner>) => {
      state.list.unshift(action.payload);
    },

    /* 🔥 VIEW MODAL ACTIONS */
    setActiveBanner: (state, action: PayloadAction<string | null>) => {
      state.activeBannerId = action.payload;
    },
  },
});

export const {
  setBanners,
  setBannersLoading,
  clearBanners,
  removeBanner,
  updateBanner,
  addBanner,
  setActiveBanner,
} = bannerSlice.actions;

export default bannerSlice.reducer;

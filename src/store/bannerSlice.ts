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
};

/* ================= INITIAL STATE ================= */

const initialState: BannerState = {
  list: [],
  loading: true,          // hard refresh pe true
  fetchedOnce: false,
};

/* ================= SLICE ================= */

const bannerSlice = createSlice({
  name: "banner",
  initialState,
  reducers: {
    /* SET ALL BANNERS */
    setBanners: (state, action: PayloadAction<Banner[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.fetchedOnce = true;
    },

    /* LOADING (hard refresh only) */
    setBannersLoading: (state) => {
      state.loading = true;
    },

    /* CLEAR (logout etc.) */
    clearBanners: (state) => {
      state.list = [];
      state.loading = false;
      state.fetchedOnce = false;
    },

    /* REMOVE SINGLE BANNER */
    removeBanner: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter(
        banner => banner._id !== action.payload
      );
    },

    /* UPDATE SINGLE BANNER (edit / status toggle) */
    updateBanner: (state, action: PayloadAction<Banner>) => {
      const index = state.list.findIndex(
        banner => banner._id === action.payload._id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },

    /* ADD BANNER (create) */
    addBanner: (state, action: PayloadAction<Banner>) => {
      state.list.unshift(action.payload); // latest on top
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
} = bannerSlice.actions;

export default bannerSlice.reducer;

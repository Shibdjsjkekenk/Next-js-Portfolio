"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "@/lib/axios";
import SummaryApi from "@/common/SummaryApi";
import { toast } from "react-toastify";

import {
  setBanners,
  setBannersLoading,
  updateBanner,
  removeBanner,
  addBanner,
  setActiveBanner,
} from "@/store/bannerSlice";
import type { RootState, AppDispatch } from "@/store/store";

export function useBanner() {
  const dispatch = useDispatch<AppDispatch>();
  const bannerState = useSelector((state: RootState) => state.banner);

  // Get All
  useEffect(() => {
    if (!bannerState.fetchedOnce) {
      dispatch(setBannersLoading());

      api(SummaryApi.get_all_banners)
        .then(res => {
          if (res.data?.success) {
            dispatch(setBanners(res.data.data));
          } else {
            dispatch(setBanners([]));
          }
        })
        .catch(() => {
          toast.error("Failed to fetch banners");
          dispatch(setBanners([]));
        });
    }
  }, [dispatch, bannerState.fetchedOnce]);

  // View
  const openBanner = (id: string) => {
    dispatch(setActiveBanner(id));
  };

  const closeBanner = () => {
    dispatch(setActiveBanner(null));
  };

  // Optional Refresh
  const refreshBannerById = async (id: string) => {
    try {
      const res = await api(SummaryApi.get_banner_by_id(id));
      if (res.data?.success) {
        dispatch(updateBanner(res.data.data));
      }
    } catch {
      toast.error("Failed to refresh banner");
    }
  };

  // Delete
  const deleteBannerById = async (id: string): Promise<boolean> => {
    try {
      const res = await api(SummaryApi.delete_banner(id));

      if (res.data?.success) {
        dispatch(removeBanner(id));
        return true;
      }

      return false;
    } catch {
      return false;
    }
  };


  // Update
  const updateBannerById = async (id: string, payload: any) => {
    try {
      const res = await api({
        ...SummaryApi.update_banner(id),
        data: payload,
      });
      if (res.data?.success) {
        dispatch(updateBanner(res.data.data));
        toast.success("Banner updated");
      }
    } catch {
      toast.error("Failed to update banner");
    }
  };

  // Create
  const createBanner = async (payload: any) => {
    try {
      const res = await api({
        ...SummaryApi.create_banner,
        data: payload,
      });
      if (res.data?.success) {
        dispatch(addBanner(res.data.data));
        toast.success("Banner created");
      }
    } catch {
      toast.error("Failed to create banner");
    }
  };

  return {
    ...bannerState,
    openBanner,
    closeBanner,
    refreshBannerById,
    deleteBannerById,
    updateBannerById,
    createBanner,
  };
}

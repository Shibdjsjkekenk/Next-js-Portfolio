"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "@/lib/axios";
import SummaryApi from "@/common/SummaryApi";

import { addAbout, setAbouts, setAboutsLoading } from "@/store/aboutSlice";

import type { RootState, AppDispatch } from "@/store/store";

/* ================= TYPES ================= */
type CreateAboutPayload = {
  content: string;
  image?: string | null;
  resume?: string | null;
  isActive: boolean;
};

export function useAbout() {
  const dispatch = useDispatch<AppDispatch>();
  const aboutState = useSelector((state: RootState) => state.about);

  /* ================= GET ALL ABOUT ================= */
  useEffect(() => {
    if (!aboutState.fetchedOnce) {
      dispatch(setAboutsLoading());

      api(SummaryApi.get_all_about)
        .then((res) => {
          if (res.data?.success) {
            dispatch(setAbouts(res.data.data));
          } else {
            dispatch(setAbouts([]));
          }
        })
        .catch(() => {
          toast.error("Failed to fetch About Us content");
          dispatch(setAbouts([]));
        });
    }
  }, [dispatch, aboutState.fetchedOnce]);

  /* ================= CREATE ABOUT ================= */
  const createAbout = async (payload: CreateAboutPayload) => {
    try {
      const res = await api({
        ...SummaryApi.create_about,
        data: payload,
      });

      if (res.data?.success) {
        dispatch(addAbout(res.data.data));
        toast.success("About Us created successfully");
        return true;
      }

      toast.error(res.data?.message || "Failed to create About Us");
      return false;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to create About Us"
      );
      return false;
    }
  };

  return {
    ...aboutState, // list, loading, fetchedOnce, activeAboutId
    createAbout,
  };
}

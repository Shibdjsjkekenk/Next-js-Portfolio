"use client";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SummaryApi from "@/common/SummaryApi";
import type { RootState } from "@/store/store";
import {
  setExperiences,
  setExperiencesLoading,
  addExperience,
  updateExperience,
  removeExperience,
  setActiveExperience,
} from "@/store/experienceSlice";

export function useExperienceContent() {
  const dispatch = useDispatch();

  const { list, loading, fetchedOnce, activeExperienceId } = useSelector(
    (state: RootState) => state.experience
  );

  //  Get all
  const getAllExperienceContents = async () => {
    if (fetchedOnce) return;

    dispatch(setExperiencesLoading());

    try {
      const res = await fetch(SummaryApi.get_all_experience.url);
      const json = await res.json();

      console.log("EXPERIENCE API RESPONSE 👉", json);

      // STRICT NORMALIZATION (Timeline style)
      if (Array.isArray(json)) {
        dispatch(setExperiences(json));
      } else if (json?.success && Array.isArray(json.data)) {
        dispatch(setExperiences(json.data));
      } else {
        dispatch(setExperiences([]));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load experience content");
    }
  };

  //  create 
  const createExperienceContent = async (payload: {
    content: string;
    isActive?: boolean;
  }) => {
    try {
      if (!payload.content?.trim()) {
        toast.error("Content is required");
        return false;
      }

      const res = await fetch(SummaryApi.create_experience.url, {
        method: SummaryApi.create_experience.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success || !json.data) {
        throw new Error(json.message || "Invalid response");
      }

      //  NEVER push undefined
      dispatch(addExperience(json.data));

      toast.success("Experience content created");
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Create failed");
      return false;
    }
  };

  //  Update
  const updateExperienceContentById = async (
    id: string,
    payload: { content: string; isActive?: boolean }
  ) => {
    try {
      const res = await fetch(
        SummaryApi.update_experience(id).url,
        {
          method: SummaryApi.update_experience(id).method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      dispatch(updateExperience(json.data));
      dispatch(setActiveExperience(null));

      toast.success("Experience content updated");
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Update failed");
      return false;
    }
  };

  // Delete
  const deleteExperienceContentById = async (id: string) => {
    try {
      const res = await fetch(
        SummaryApi.delete_experience(id).url,
        {
          method: SummaryApi.delete_experience(id).method,
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      // instant remove from UI
      dispatch(removeExperience(id));

      toast.success("Experience content deleted");
      return true;
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Delete failed");
      return false;
    }
  };

  return {
    list,
    loading,
    activeExperienceId,

    getAllExperienceContents,
    createExperienceContent,
    updateExperienceContentById,
    deleteExperienceContentById,

    setActiveExperienceId: (id: string | null) =>
      dispatch(setActiveExperience(id)),
  };
}

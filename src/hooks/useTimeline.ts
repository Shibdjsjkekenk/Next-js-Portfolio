"use client";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SummaryApi from "@/common/SummaryApi";
import type { RootState } from "@/store/store";
import {
  setTimelines,
  setTimelinesLoading,
  addTimeline,
  updateTimeline,
  removeTimeline,
  setActiveTimeline,
} from "@/store/timelineSlice";

export function useTimeline() {
  const dispatch = useDispatch();
  const { list, loading, fetchedOnce, activeTimelineId } = useSelector(
    (state: RootState) => state.timeline
  );

  /* ================= GET ALL ================= */
  const getAllTimelines = async () => {
    if (fetchedOnce) return;

    dispatch(setTimelinesLoading());

    try {
      const res = await fetch(SummaryApi.get_all_timeline.url);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to fetch timeline");
      }

      dispatch(setTimelines(json.data));
    } catch (err: any) {
      toast.error(err.message || "Timeline fetch failed");
    }
  };

  /* ================= CREATE ================= */
  const createTimeline = async (payload: {
    category: string;
    content: string;
    isActive?: boolean;
  }) => {
    try {
      if (!payload.category.trim()) {
        toast.error("Category is required");
        return false;
      }

      if (!payload.content.trim()) {
        toast.error("Timeline content is required");
        return false;
      }

      const res = await fetch(SummaryApi.create_timeline.url, {
        method: SummaryApi.create_timeline.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      dispatch(addTimeline(json.data));
      toast.success("Timeline created successfully");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Timeline create failed");
      return false;
    }
  };

  /* ================= GET BY ID (EDIT PREFILL) ================= */
  const getTimelineById = async (id: string) => {
    try {
      const res = await fetch(
        SummaryApi.get_timeline_by_id(id).url
      );
      const json = await res.json();

      if (!json.success) throw new Error(json.message);
      return json.data;
    } catch (err: any) {
      toast.error("Failed to load timeline");
      return null;
    }
  };

  /* ================= UPDATE ================= */
  const updateTimelineById = async (
    id: string,
    payload: { category: string; content: string; isActive?: boolean }
  ) => {
    try {
      const res = await fetch(
        SummaryApi.update_timeline(id).url,
        {
          method: SummaryApi.update_timeline(id).method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      dispatch(updateTimeline(json.data));
      dispatch(setActiveTimeline(null));
      toast.success("Timeline updated successfully");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Update failed");
      return false;
    }
  };

  /* ================= DELETE ================= */
  const deleteTimelineById = async (id: string) => {
    try {
      const res = await fetch(
        SummaryApi.delete_timeline(id).url,
        { method: SummaryApi.delete_timeline(id).method }
      );

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Delete failed");
      }

      // update redux instantly
      dispatch(removeTimeline(id));

      toast.success("Timeline deleted successfully");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
      return false;
    }
  };


  /* ================= REORDER (DRAG & DROP) ================= */
  const reorderTimeline = async (
    activeId: string,
    overId: string
  ) => {
    try {
      const oldIndex = list.findIndex(i => i._id === activeId);
      const newIndex = list.findIndex(i => i._id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      //  reorder locally
      const newList = [...list];
      const [movedItem] = newList.splice(oldIndex, 1);
      newList.splice(newIndex, 0, movedItem);

      //  instant UI update
      dispatch(setTimelines(newList));

      //  backend order save
      const items = newList.map((item, index) => ({
        id: item._id,
        order: index,
      }));

      await fetch(SummaryApi.update_timeline_order.url, {
        method: SummaryApi.update_timeline_order.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }), // ✅ MATCH BACKEND
      });

      toast.success("Timeline order updated");
    } catch (err) {
      toast.error("Order update failed");
    }
  };


  return {
    list,
    loading,
    activeTimelineId,

    getAllTimelines,
    createTimeline,
    getTimelineById,
    updateTimelineById,
    deleteTimelineById,
    reorderTimeline,
    setActiveTimeline: (id: string | null) =>
      dispatch(setActiveTimeline(id)),
  };
}
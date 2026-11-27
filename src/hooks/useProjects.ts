"use client";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import SummaryApi from "@/common/SummaryApi";
import type { RootState } from "@/store/store";
import {
  setProjects,
  setProjectsLoading,
  addProject,
  updateProject,
  removeProject,
  updateProjectStatus,
  setActiveProject,
  setViewProject,
} from "@/store/projectSlice";

export function useProjects() {
  const dispatch = useDispatch();

  const {
    list,
    loading,
    fetchedOnce,
    activeProjectId,
    viewProjectId,
  } = useSelector((state: RootState) => state.projects);

  /* ================= GET ALL ================= */
  const getAllProjects = async () => {
    if (fetchedOnce) return;

    dispatch(setProjectsLoading());

    try {
      const res = await fetch(SummaryApi.get_all_projects.url);
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Failed to fetch projects");
      }

      dispatch(setProjects(json.data));
    } catch (err: any) {
      toast.error(err.message || "Project fetch failed");
    }
  };

  /* ================= CREATE ================= */
  const createProject = async (payload: {
    content: string;
    projectLink: string;
    projectImage: string;
    isActive?: boolean;
  }) => {
    try {
      if (!payload.content.trim()) {
        toast.error("Project content is required");
        return false;
      }

      if (!payload.projectLink.trim()) {
        toast.error("Project link is required");
        return false;
      }

      if (!payload.projectImage) {
        toast.error("Project image is required");
        return false;
      }

      const res = await fetch(SummaryApi.create_project.url, {
        method: SummaryApi.create_project.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      dispatch(addProject(json.data));
      toast.success("Project created successfully 🚀");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Project create failed");
      return false;
    }
  };

  /* ================= UPDATE ================= */
  const updateProjectById = async (payload: {
    id: string;
    content: string;
    projectLink: string;
    projectImage?: string;
    isActive?: boolean;
  }) => {
    try {
      const res = await fetch(SummaryApi.update_project.url, {
        method: SummaryApi.update_project.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      dispatch(updateProject(json.data));
      dispatch(setActiveProject(null)); // ✏️ edit close
      toast.success("Project updated successfully");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Update failed");
      return false;
    }
  };

  /* ================= DELETE ================= */
  const deleteProjectById = async (id: string) => {
    try {
      const res = await fetch(SummaryApi.delete_project.url, {
        method: SummaryApi.delete_project.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      dispatch(removeProject(id));
      toast.success("Project deleted successfully");
      return true;
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
      return false;
    }
  };


  /* ================= STATUS UPDATE ================= */
const toggleProjectStatus = async (id: string, isActive: boolean) => {
  try {
    const api = SummaryApi.update_project_status(id);

    console.log("API DEBUG:", api); // 👈 must log object

    const res = await fetch(api.url as string, {
      method: api.method as string,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
    });

    const json = await res.json();

    if (!json.success) throw new Error(json.message);

    dispatch(updateProjectStatus({ id, isActive }));
    toast.success("Project status updated");
  } catch (err) {
    console.error("STATUS ERROR:", err);
    toast.error("Status update failed");
  }
};
  /* ================= REORDER ================= */
  const reorderProjects = async (activeId: string, overId: string) => {
    try {
      const oldIndex = list.findIndex(p => p._id === activeId);
      const newIndex = list.findIndex(p => p._id === overId);

      if (oldIndex === -1 || newIndex === -1) return;

      // FULL LIST reorder
      const reordered = [...list];
      const [moved] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, moved);

      // NORMALIZE ORDER
      const normalized = reordered.map((p, index) => ({
        ...p,
        order: index,
      }));

      // Update redux immediately (optimistic UI)
      dispatch(setProjects(normalized));

      // ✅ ONLY SEND id + order to backend
      const items = normalized.map(p => ({
        id: p._id,
        order: p.order,
      }));

      const res = await fetch(SummaryApi.update_project_order.url, {
        method: SummaryApi.update_project_order.method, // PUT
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();

      if (!json?.success) {
        throw new Error(json?.message || "Order update failed");
      }

      toast.success("Project order updated");
    } catch {
      toast.error("Order update failed");
    }
  };

  return {
    list,
    loading,

    /*  EDIT */
    activeProjectId,
    setActiveProject: (id: string | null) =>
      dispatch(setActiveProject(id)),

    /*  VIEW */
    viewProjectId,
    setViewProject: (id: string | null) =>
      dispatch(setViewProject(id)),

    /* ACTIONS */
    getAllProjects,
    createProject,
    updateProjectById,
    deleteProjectById,
    toggleProjectStatus,
    reorderProjects,
  };
}

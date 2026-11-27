"use client";

import { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Table from "@/common/Table";
import Pagination from "@/components/admin-view/Pagination";
import ProjectCardView from "@/components/admin-view/ProjectCardView";
import { useProjects } from "@/hooks/useProjects";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

/* ================= DND ================= */
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  defaultAnimateLayoutChanges,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

/* ================= CONSTANT ================= */
const ITEMS_PER_PAGE = 5;

/* ================= SORTABLE ROW ================= */
function SortableRow({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    animateLayoutChanges: (args) =>
      defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? "transform 250ms cubic-bezier(0.22,1,0.36,1)",
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab active:cursor-grabbing"
    >
      {children}
    </tr>
  );
}

/* ================= MAIN ================= */
export default function ProjectCardPreview({ search = "" }: { search?: string }) {
  const {
    list: projects,
    loading,
    getAllProjects,
    deleteProjectById,
    setActiveProject,
    setViewProject,
    toggleProjectStatus,
    reorderProjects,
  } = useProjects();

  /* PAGINATION */
  const [currentPage, setCurrentPage] = useState(1);

  /* VIEW MODAL */
  const viewProject = useSelector((state: RootState) =>
    state.projects.list.find(
      (p) => p._id === state.projects.viewProjectId
    )
  );

  /* FETCH ONCE */
  useEffect(() => {
    getAllProjects();
  }, []);

  /* RESET PAGE WHEN DATA CHANGES */
  useEffect(() => {
    setCurrentPage(1);
  }, [projects.length, search]);

  /* ================= SEARCH FILTER ================= */
  const filteredProjects = projects.filter((p) => {
    if (!search) return true;

    const key = search.toLowerCase();
    return (
      p.projectLink?.toLowerCase().includes(key) ||
      p.content?.toLowerCase().includes(key)
    );
  });

  /* PAGINATION LOGIC */
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  /* DND SENSORS */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 5 } })
  );

  /* DELETE */
  const handleDelete = (id: string) => {
    toast.warn(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Are you sure you want to delete this project?
          </p>

          <div className="flex justify-end gap-2">
            <button onClick={closeToast} className="px-3 py-1 border rounded">
              Cancel
            </button>

            <button
              onClick={async () => {
                await deleteProjectById(id);
                closeToast();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  /* DRAG END */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    reorderProjects(active.id.toString(), over.id.toString());
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading && projects.length === 0 ? (
          <Table headers={["No", "Image", "Link", "Status", "Action"]}>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="animate-pulse">
                <td className="p-2 border"><div className="h-4 w-6 bg-gray-200 rounded" /></td>
                <td className="p-2 border"><div className="w-16 h-10 bg-gray-200 rounded" /></td>
                <td className="p-2 border"><div className="h-4 w-40 bg-gray-200 rounded" /></td>
                <td className="p-2 border"><div className="h-6 w-16 bg-gray-200 rounded-full" /></td>
                <td className="p-2 border"><div className="h-8 w-8 bg-gray-200 rounded-full" /></td>
              </tr>
            ))}
          </Table>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            {/* 🔥 FULL LIST HERE */}
            <SortableContext
              items={projects.map((p) => p._id)}
              strategy={verticalListSortingStrategy}
            >
              <Table headers={["No", "Image", "Link", "Status", "Action"]}>
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <span className="text-lg font-semibold text-gray-600">
                          🔍 No projects found
                        </span>
                        <span className="text-sm text-gray-400">
                          Try a different search keyword
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((project, index) => (
                    <SortableRow key={project._id} id={project._id}>
                      <td className="p-2 border">{startIndex + index + 1}</td>

                      <td className="p-2 border">
                        {project.projectImage ? (
                          <img
                            src={project.projectImage}
                            className="w-16 h-10 object-cover rounded"
                          />
                        ) : (
                          "—"
                        )}
                      </td>

                      <td className="p-2 border truncate max-w-[250px]">
                        <a
                          href={project.projectLink}
                          target="_blank"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {project.projectLink}
                        </a>
                      </td>

                      <td className="p-2 border">
                        <span
                          onClick={() =>
                            toggleProjectStatus(project._id, !project.isActive)
                          }
                          className={`cursor-pointer px-2 py-1 rounded-full text-xs ${project.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {project.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="p-2 border">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => setViewProject(project._id)}
                            className="p-1 rounded-full bg-blue-100 text-blue-700"
                          >
                            <FaEye size={14} />
                          </button>

                          <button
                            onClick={() => setActiveProject(project._id)}
                            className="p-1 rounded-full bg-green-100 text-green-700"
                          >
                            <FaEdit size={13} />
                          </button>

                          <button
                            onClick={() => handleDelete(project._id)}
                            className="p-1 rounded-full bg-red-100 text-red-700"
                          >
                            <FaTrash size={13} />
                          </button>
                        </div>
                      </td>
                    </SortableRow>
                  ))
                )}
              </Table>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {viewProject && (
        <ProjectCardView
          project={viewProject}
          onClose={() => setViewProject(null)}
        />
      )}
    </div>
  );
}
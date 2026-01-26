"use client";

import { useEffect, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Table from "@/common/Table";
import Pagination from "@/components/admin-view/Pagination";
import { useProjects } from "@/hooks/useProjects";
import ProjectCardView from "@/components/admin-view/ProjectCardView";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const ITEMS_PER_PAGE = 5;

export default function ProjectCardPreview() {
  const {
    list: projects,
    loading,
    getAllProjects,
    deleteProjectById,
    setActiveProject,
    setViewProject,
    toggleProjectStatus,
  } = useProjects();

  /* PAGINATION STATE */
  const [currentPage, setCurrentPage] = useState(1);
  const viewProject = useSelector((state: RootState) =>
    state.projects.list.find((p) => p._id === state.projects.viewProjectId),
  );

  /* FETCH ONCE */
  useEffect(() => {
    getAllProjects();
  }, []);

  /* RESET PAGE WHEN DATA CHANGES */
  useEffect(() => {
    setCurrentPage(1);
  }, [projects.length]);

  /* PAGINATION LOGIC */
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = projects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  /* DELETE CONFIRM */
  const handleDelete = (id: string) => {
    toast.warn(
      ({ closeToast }) => (
        <div className="space-y-2">
          <p className="text-sm font-medium">
            Are you sure you want to delete this project?
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1 text-sm rounded border"
            >
              Cancel
            </button>

            <button
              onClick={async () => {
                await deleteProjectById(id);
                closeToast();
              }}
              className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false },
    );
  };

  return (
    <div className="space-y-4">
      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {/* SKELETON */}
        {loading && projects.length === 0 ? (
          <Table headers={["No", "Image", "Link", "Status", "Action"]}>
            {[1, 2, 3].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="p-2 border">
                  <div className="h-4 w-6 bg-gray-200 rounded" />
                </td>
                <td className="p-2 border">
                  <div className="w-16 h-10 bg-gray-200 rounded" />
                </td>
                <td className="p-2 border">
                  <div className="h-4 w-40 bg-gray-200 rounded" />
                </td>
                <td className="p-2 border">
                  <div className="h-6 w-16 bg-gray-200 rounded-full" />
                </td>
                <td className="p-2 border">
                  <div className="flex gap-2 justify-center">
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        ) : (
          <Table headers={["No", "Image", "Link", "Status", "Action"]}>
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No projects found
                </td>
              </tr>
            ) : (
              paginatedProjects.map((project, index) => (
                <tr key={project._id} className="whitespace-nowrap">
                  {/* SR NO (GLOBAL INDEX) */}
                  <td className="p-2 border">{startIndex + index + 1}</td>

                  {/* IMAGE */}
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

                  {/* LINK */}
                  <td className="p-2 border max-w-[250px] truncate">
                    <a
                      href={project.projectLink}
                      target="_blank"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {project.projectLink}
                    </a>
                  </td>

                  {/* STATUS */}
                  <td className="p-2 border">
                    <span
                      onClick={() =>
                        toggleProjectStatus(project._id, !project.isActive)
                      }
                      className={`cursor-pointer px-2 py-1 rounded-full text-xs
                        ${
                          project.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {project.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-2 border">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setViewProject(project._id)}
                        className="p-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
                      >
                        <FaEye size={14} />
                      </button>

                      <button
                        onClick={() => setActiveProject(project._id)}
                        className="p-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200"
                      >
                        <FaEdit size={13} />
                      </button>

                      <button
                        onClick={() => handleDelete(project._id)}
                        className="p-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </Table>
        )}
      </div>

      {/* PAGINATION */}
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

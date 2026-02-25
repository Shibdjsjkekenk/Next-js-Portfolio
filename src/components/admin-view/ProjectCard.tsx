"use client";

import React from "react";
import ProjectCardCreate from "./ProjectCardCreate";
import ProjectCardPreview from "./ProjectCardPreview";

const ProjectCard = ({
  sortOrder,
  search,
}: {
  sortOrder: "latest" | "oldest";
  search: string;
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ProjectCardCreate />
      {/* <ProjectCardPreview sortOrder={sortOrder} search={search} /> */}
      <ProjectCardPreview search={search} />

    </div>
  );
};

export default ProjectCard;
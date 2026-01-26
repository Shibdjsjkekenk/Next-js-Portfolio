"use client";

import React from "react";
import ProjectCardCreate from "./ProjectCardCreate";
import ProjectCardPreview from "./ProjectCardPreview";

const ProjectCard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectCardCreate />
        <ProjectCardPreview />
      </div>
    </div>
  );
};

export default ProjectCard;

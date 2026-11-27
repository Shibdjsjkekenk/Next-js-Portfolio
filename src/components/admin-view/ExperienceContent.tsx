"use client";

import React from "react";
import ExperienceContentCreate from "./ExperienceContentCreate";
import ExperienceContentPreview from "./ExperienceContentPreview";


const ExperienceContent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ExperienceContentCreate />
      <ExperienceContentPreview/>
    </div>
  );
};

export default ExperienceContent;

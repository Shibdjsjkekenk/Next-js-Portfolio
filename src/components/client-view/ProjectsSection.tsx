"use client";

import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import ProjectsSlider from "./ProjectsSlider";

type Props = {
  list: any[];
};

const ProjectsSection = ({ list }: Props) => {
  if (!list?.length) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <h1 className="text-4xl font-bold text-center pb-5">
        Experience <span className="text-[#6A38C2]">&</span> Projects
      </h1>

      <div className="flex flex-col md:flex-row gap-6 w-full md:min-h-[80vh]">

        {/* LEFT (DESKTOP AS-IT-IS) */}
        <div
          className="
            w-full md:w-1/2
            md:sticky md:top-24 md:self-start
            flex items-start md:items-center
            md:min-h-[80vh]
          "
        >
          <div className="flex flex-col gap-5 justify-start md:justify-center">
            <h1 className="text-3xl font-bold leading-[56px]">
              Professional <span className="text-[#6A38C2]">Experience</span>
            </h1>

            <p className="text-justify">
              <span className="text-[#F16B50] font-bold">W</span>
              orked as a Web Developer at <b>Itarsia India Limited</b> for
              the past <b>2 years</b>, specializing in:
            </p>

            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-justify">
                <FaCheckCircle className="text-[#6CB6D5] mt-1 flex-shrink-0" />
                Developing responsive interfaces using React, Redux,
                Tailwind, HTML, CSS, and JavaScript.
              </li>

              <li className="flex items-start gap-2 text-justify">
                <FaCheckCircle className="text-[#6CB6D5] mt-1 flex-shrink-0" />
                API integration for dynamic, user-friendly applications.
              </li>
            </ul>

            <p className="text-justify">
              Positive client feedback drives continuous innovation and
              quality delivery.
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2">
          <ProjectsSlider list={list} />
        </div>

      </div>
    </div>
  );
};

export default ProjectsSection;

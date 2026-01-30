"use client";

import ProjectsSlider from "./ProjectsSlider";

type Experience = {
  _id: string;
  content: string;
  isActive: boolean;
};

type Props = {
  list: any[];
  experience: Experience[];
};

const ProjectsSection = ({ list, experience }: Props) => {
  if (!list?.length) return null;

  const activeExperience = experience.find(e => e.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-15 md:pb-0 lg:px-8">

      <h1 className="text-3xl lg:text-4xl font-bold text-center pb-5">
        Experience <span className="text-[#6A38C2]">&</span> Projects
      </h1>

      <div className="flex flex-col md:flex-row gap-6 w-full md:min-h-[80vh]">

        {/* left */}
        <div
          className="
            w-full md:w-1/2
            md:sticky md:top-24 md:self-start
            flex items-start md:items-center
            md:min-h-[80vh]
          "
        >
          <div className="flex flex-col gap-5 justify-start md:justify-center">

            {activeExperience ? (
              <div
                className="tiptap-editor text-justify"
                dangerouslySetInnerHTML={{
                  __html: activeExperience.content,
                }}
              />
            ) : (
              <p className="text-gray-400 text-sm">
                No experience content available
              </p>
            )}

          </div>
        </div>

        {/* right */}
        <div className="w-full md:w-1/2">
          <ProjectsSlider list={list} />
        </div>

      </div>
    </div>
  );
};

export default ProjectsSection;

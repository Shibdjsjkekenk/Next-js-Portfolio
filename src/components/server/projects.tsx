import ProjectsClient from "@/components/client-view/ProjectsSection";
import { getActiveProjects } from "@/lib/server/projects";
import { getActiveExperienceContent } from "@/lib/server/experience";

export default async function Projects() {
  const projects = await getActiveProjects();
  const experience = await getActiveExperienceContent();

  // JSON safe
  const safeProjects = projects
    ? JSON.parse(JSON.stringify(projects))
    : [];

  const safeExperience = experience
    ? JSON.parse(JSON.stringify(experience))
    : [];

  if (!safeProjects.length) return null;

  return (
    <ProjectsClient
      list={safeProjects}
      experience={safeExperience}
    />
  );
}

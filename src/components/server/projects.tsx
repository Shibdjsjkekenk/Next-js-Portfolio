import ProjectsClient from "@/components/client-view/ProjectsSection";
import { getActiveProjects } from "@/lib/server/projects";

export default async function ProjectsPage() {
  const projects = await getActiveProjects();

  const safeProjects = projects
    ? JSON.parse(JSON.stringify(projects))
    : [];

  if (!safeProjects.length) return null;

  return <ProjectsClient list={safeProjects} />;
}

import { projects } from "@/content/portfolio";
import { ProjectCard } from "../ProjectCard";

/** The Projects as cards inside the Chat, for phones. */
export const ProjectsCard = () => (
  <ul aria-label="Projects" className="cc-card-list">
    {projects.map((project) => (
      <ProjectCard key={project.name} project={project} frame="chat" />
    ))}
  </ul>
);

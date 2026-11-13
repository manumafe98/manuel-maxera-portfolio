import { projects, skillAreas, type AppId } from "@/content/portfolio";
import { GithubIcon, WebLinkIcon } from "@/icons";
import type { MouseEvent } from "react";
import { initials } from "../initials";
import { skillIcons } from "../skillIcons";
import { ContactCard } from "./ContactCard";

/** Links inside a reply must not also trigger skip-to-end. */
const stopPropagation = (event: MouseEvent) => event.stopPropagation();

const ProjectsCard = () => (
  <ul aria-label="Projects" className="cc-card-list">
    {projects.map((project) => (
      <li key={project.name} className="cc-card cc-project">
        {project.logo ? (
          <img
            src={project.logo.src}
            alt={project.logo.alt}
            className="cc-project-logo"
            loading="lazy"
          />
        ) : (
          <span aria-hidden="true" className="cc-project-logo is-initials">
            {initials(project.name)}
          </span>
        )}
        <div className="cc-project-text">
          <h3>{project.name}</h3>
          <p className="cc-muted">{project.description}</p>
          <div className="cc-project-links">
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} on GitHub`}
              className="cc-card-link"
              onClick={stopPropagation}
            >
              <GithubIcon aria-hidden="true" />
              Code
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name} website`}
                className="cc-card-link"
                onClick={stopPropagation}
              >
                <WebLinkIcon aria-hidden="true" />
                Website
              </a>
            )}
          </div>
        </div>
      </li>
    ))}
  </ul>
);

const SkillsCard = () => (
  <div className="cc-card cc-skills">
    {skillAreas.map(({ area, skills }) => {
      const headingId = `cc-skills-${area.replace(/\W+/g, "-")}`;
      return (
        <section key={area} aria-labelledby={headingId}>
          <h3 id={headingId}>{area}</h3>
          <ul aria-labelledby={headingId} className="cc-tags">
            {skills.map((skill) => {
              const Icon = skillIcons[skill];
              return (
                <li key={skill} className="cc-tag">
                  {Icon && <Icon aria-hidden="true" />}
                  {skill}
                </li>
              );
            })}
          </ul>
        </section>
      );
    })}
  </div>
);

/** A Skill's content shown inside the Chat, in place of its App window. */
export const SkillCard = ({ app }: { app: AppId }) => {
  switch (app) {
    case "ubuntu-software":
      return <ProjectsCard />;
    case "files":
      return <SkillsCard />;
    case "gmail":
      return <ContactCard />;
  }
};

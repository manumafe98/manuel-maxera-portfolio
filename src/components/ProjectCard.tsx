import type { Project } from "@/content/portfolio";
import { GithubIcon } from "@/icons/GithubIcon";
import { WebLinkIcon } from "@/icons/WebLinkIcon";
import type { MouseEvent } from "react";
import { initials } from "./initials";

/** Where the card sits: the Software window, or a Chat on phones. */
export type ProjectCardFrame = "window" | "chat";

const styles = {
  window: {
    card: "flex items-center gap-3 bg-ubuntu-top-bar border border-solid border-black shadow-md rounded-xl p-4",
    logo: "w-20 mt-2.5",
    initials:
      "flex items-center justify-center shrink-0 w-20 h-20 rounded-2xl bg-gray-50/20 text-white text-2xl font-bold",
    text: "flex flex-col",
    name: "text-white font-bold",
    description: "text-white text-sm",
    links: "flex mt-2 gap-2",
    link: undefined,
    repoIcon: "project-icon",
    liveIcon: "project-icon mt-0.5",
    linkLabels: false,
  },
  chat: {
    card: "cc-card cc-project-card",
    logo: "cc-project-logo",
    initials: "cc-project-logo is-initials",
    text: "cc-project-text",
    name: undefined,
    description: "cc-muted",
    links: "cc-project-links",
    link: "cc-card-link",
    repoIcon: undefined,
    liveIcon: undefined,
    linkLabels: true,
  },
} as const;

/** Links inside a Chat reply must not also trigger skip-to-end. */
const stopPropagation = (event: MouseEvent) => event.stopPropagation();

/** One Project: its logo, name, description and links. A list item. */
export const ProjectCard = ({
  project,
  frame,
}: {
  project: Project;
  frame: ProjectCardFrame;
}) => {
  const style = styles[frame];
  return (
    <li className={style.card}>
      {project.logo ? (
        <img
          src={project.logo.src}
          alt={project.logo.alt}
          className={style.logo}
          loading="lazy"
        />
      ) : (
        <span aria-hidden="true" className={style.initials}>
          {initials(project.name)}
        </span>
      )}
      <div className={style.text}>
        <h3 className={style.name}>{project.name}</h3>
        <p className={style.description}>{project.description}</p>
        <div className={style.links}>
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${project.name} on GitHub`}
            className={style.link}
            onClick={stopPropagation}
          >
            <GithubIcon aria-hidden="true" className={style.repoIcon} />
            {style.linkLabels && "Code"}
          </a>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} website`}
              className={style.link}
              onClick={stopPropagation}
            >
              <WebLinkIcon aria-hidden="true" className={style.liveIcon} />
              {style.linkLabels && "Website"}
            </a>
          )}
        </div>
      </div>
    </li>
  );
};

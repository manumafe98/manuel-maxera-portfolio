import { chatHref } from "@/components/claude-code/chatLink";
import { claudeProjects } from "@/content/portfolio";
import { StaticPage } from "./StaticPage";

/** The 404 page, worded like a Chat answering a Command it doesn't know. */
export const MissingPage = () => (
  <StaticPage eyebrow="404 · Page not found" heading="Unknown command">
    <p>
      I don't recognize this page. It may have moved, or the link may be
      mistyped.
    </p>
    <nav aria-label="Chats" className="space-y-3">
      <p>Pick up one of the Chats instead:</p>
      <ul className="flex flex-wrap gap-2">
        {claudeProjects.map((project) => (
          <li key={project.id}>
            <a
              href={chatHref(project.id)}
              className="inline-flex min-h-11 items-center rounded-full border border-(--cc-border) px-4 font-mono text-sm text-(--cc-text) hover:border-(--cc-accent) focus-visible:outline-2 focus-visible:outline-(--cc-accent)"
            >
              {project.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </StaticPage>
);

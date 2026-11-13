import { claudeProjects, type ClaudeProjectId } from "@/content/portfolio";
import { useEffect } from "react";

/** A link to / that opens the given Chat, as the 404 page uses. */
export const chatHref = (id: ClaudeProjectId) => `/?chat=${id}`;

/**
 * Opens the Chat a /?chat=<Claude project id> link names, once the page has
 * hydrated. The pre-rendered HTML always shows the Welcome Chat, so reading
 * the URL during the first render would make hydration mismatch; an unknown
 * id leaves Welcome open.
 */
export const useChatFromUrl = (openChat: (id: ClaudeProjectId) => void) => {
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("chat");
    const project = claudeProjects.find((p) => p.id === id);
    if (project) openChat(project.id);
  }, [openChat]);
};

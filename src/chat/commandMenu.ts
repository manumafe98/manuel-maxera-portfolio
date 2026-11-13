import type { ClaudeProject, Command } from "@/content/portfolio";
import { normalize } from "./replyScript";

/**
 * The Commands the `/` list shows for the input typed so far: none unless the
 * input starts with `/`, otherwise the Chat's Commands whose name contains
 * what follows it, ignoring case and surrounding spaces.
 */
export const matchingCommands = (
  project: ClaudeProject,
  input: string,
): Command[] => {
  const typed = normalize(input);
  if (!typed.startsWith("/")) return [];
  return project.commands.filter((c) => c.name.includes(typed.slice(1)));
};

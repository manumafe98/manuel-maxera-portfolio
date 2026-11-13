import type { ComponentType } from "react";
import { HomePage } from "./HomePage";
import { MissingPage } from "./MissingPage";
import { PrivacyPage } from "./PrivacyPage";

/**
 * The site's three pages (ADR-0001). The pre-rendered HTML names its page in
 * the root element's data-page attribute, so no router is needed.
 */
export const pages = {
  home: HomePage,
  privacy: PrivacyPage,
  "not-found": MissingPage,
} satisfies Record<string, ComponentType>;

export type PageId = keyof typeof pages;

/** The page for a URL path, used by the dev server, which doesn't pre-render. */
export const pageForPath = (pathname: string): PageId => {
  if (pathname === "/") return "home";
  if (pathname === "/privacy") return "privacy";
  return "not-found";
};

/**
 * The server entry for pre-rendering (ADR-0001). scripts/prerender.js calls
 * render() for each page and writes the result into the built HTML.
 */
import type { ReactNode } from "react";
import { prerender } from "react-dom/static";
import { pages, type PageId } from "./pages/pages";
import { headFor, type HeadOptions } from "./seo/head";
import { NoscriptContent, noscriptStyles } from "./seo/NoscriptContent";

export { agentFiles } from "./seo/agentFiles";

const toHtml = async (node: ReactNode) => {
  const { prelude } = await prerender(node);
  return new Response(prelude).text();
};

export interface RenderedPage {
  /** Tags for <head>. */
  head: string;
  /** The page's markup, which the client hydrates. */
  html: string;
  /** A <noscript> block with the full content, or "" on other pages. */
  noscript: string;
}

export const render = async (
  page: PageId,
  options: HeadOptions = {},
): Promise<RenderedPage> => {
  const Page = pages[page];
  return {
    head: headFor(page, options),
    html: await toHtml(<Page />),
    noscript:
      page === "home"
        ? `<noscript><style>${noscriptStyles}</style>${await toHtml(<NoscriptContent />)}</noscript>`
        : "",
  };
};

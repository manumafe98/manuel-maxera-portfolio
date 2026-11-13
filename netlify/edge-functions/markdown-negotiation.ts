// Serves Markdown to agents that ask for it (ADR-0003). All the logic is in
// src/seo/markdownNegotiation.ts, which Vitest tests; this file only wires it
// to Netlify's Edge Functions runtime (Deno).
import { markdownNegotiation } from "../../src/seo/markdownNegotiation.ts";

/** The part of Netlify's Context this function uses. */
interface Context {
  next: () => Promise<Response>;
}

export default (request: Request, context: Context) =>
  markdownNegotiation(request, {
    next: () => context.next(),
    // Netlify's documented way to return another path's content: fetch it.
    fetchFile: (path) => fetch(new URL(path, request.url)),
  });

export const config = {
  path: "/*",
  // Hashed assets and the other static files are never pages, so they skip
  // the function. Excluding *.md also keeps fetchFile from re-entering it.
  excludedPath: [
    "/assets/*",
    "/files/*",
    "/*.md",
    "/*.txt",
    "/*.xml",
    "/*.webmanifest",
    "/*.ico",
    "/*.png",
    "/*.svg",
    "/*.webp",
    "/*.js",
    "/*.css",
  ],
};

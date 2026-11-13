// Writes the pre-rendered HTML for each page (ADR-0001), following Vite's
// pre-rendering pattern: the client build's index.html is the template, and
// the server build in dist-ssr renders each page into it.
import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const dist = path.join(root, "dist");
const serverBuild = path.join(root, "dist-ssr");

// Netlify serves /privacy from privacy.html, and unknown paths from 404.html
// with a 404 status.
const outputFiles = {
  home: "index.html",
  privacy: "privacy.html",
  "not-found": "404.html",
};

const { render } = await import(
  pathToFileURL(path.join(serverBuild, "entry-server.js")).href
);
const template = await readFile(path.join(dist, "index.html"), "utf8");

const fill = (html, placeholder, value) => {
  if (!html.includes(placeholder)) {
    throw new Error(`The built index.html is missing ${placeholder}`);
  }
  return html.replace(placeholder, () => value);
};

for (const [page, file] of Object.entries(outputFiles)) {
  const { head, html, noscript } = await render(page);
  let output = fill(template, "<!--app-head-->", head);
  output = fill(output, "<!--app-noscript-->", noscript);
  output = fill(
    output,
    '<div id="root"></div>',
    `<div id="root" data-page="${page}">${html}</div>`,
  );
  await writeFile(path.join(dist, file), output);
  console.log(`pre-rendered ${page} -> dist/${file}`);
}

await rm(serverBuild, { recursive: true, force: true });

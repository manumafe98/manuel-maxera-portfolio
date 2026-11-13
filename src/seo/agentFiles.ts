import {
  cv,
  education,
  experience,
  profile,
  projects,
  site,
  skillAreas,
  socialLinks,
  spokenLanguages,
} from "@/content/portfolio";

const absolute = (path: string) => new URL(path, site.url).href;

/** The whole portfolio as markdown, in the llms.txt format (llmstxt.org). */
const llmsTxt = () =>
  [
    `# ${profile.name}`,
    "",
    `> ${profile.shortSummary}`,
    "",
    `${profile.title} based in ${profile.location}. This file holds the full content of ${profile.name}'s portfolio site (${site.url}).`,
    "",
    "## Links",
    "",
    `- [Portfolio](${site.url}): the interactive portfolio, a simulated Claude Code session`,
    `- [CV](${absolute(cv.path)}): the current CV as a PDF`,
    ...socialLinks.map(
      (link) =>
        `- [${link.name}](${link.url}): ${profile.name} on ${link.name}`,
    ),
    `- [Email](mailto:${profile.email}): ${profile.email}`,
    `- [Privacy](${absolute("/privacy")}): how the site handles analytics and contact form data`,
    "",
    "## About",
    "",
    profile.summary,
    "",
    "## Experience",
    "",
    ...experience.flatMap((role) => [
      `### ${role.title} at ${role.company}`,
      "",
      `${role.start} to ${role.end}, ${role.location}`,
      "",
      ...role.achievements.map((achievement) => `- ${achievement}`),
      "",
    ]),
    "## Projects",
    "",
    ...projects.flatMap((project) => [
      `### ${project.name}`,
      "",
      project.description,
      "",
      ...(project.details ?? []).flatMap((detail) => [detail, ""]),
      `- [Code](${project.repoUrl})`,
      ...(project.liveUrl ? [`- [Website](${project.liveUrl})`] : []),
      "",
    ]),
    "## Skills",
    "",
    ...skillAreas.map(({ area, skills }) => `- ${area}: ${skills.join(", ")}`),
    "",
    "## Education",
    "",
    ...education.map(
      (entry) =>
        `- ${entry.degree}, ${entry.institution}, ${entry.location} (from ${entry.start})`,
    ),
    "",
    "## Languages",
    "",
    ...spokenLanguages.map((entry) => `- ${entry.language}: ${entry.level}`),
    "",
  ].join("\n");

/** The pages crawlers should index, in sitemap order. */
const indexedPaths = ["/", "/privacy"];

const robotsTxt = () =>
  [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${absolute("/sitemap.xml")}`,
    "",
  ].join("\n");

const sitemapXml = () =>
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...indexedPaths.map((path) => `  <url><loc>${absolute(path)}</loc></url>`),
    "</urlset>",
    "",
  ].join("\n");

/** The Claude Code palette's background (claude-code.css). */
const darkBackground = "#1f1e1d";

const webManifest = () =>
  JSON.stringify(
    {
      name: `${profile.name} | ${profile.title}`,
      short_name: profile.name,
      description: profile.shortSummary,
      start_url: "/",
      display: "standalone",
      background_color: darkBackground,
      theme_color: darkBackground,
      icons: [
        { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
        { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      ],
    },
    null,
    2,
  );

/**
 * The files for crawlers and agents, keyed by the path the site serves them
 * at, generated from the content module. scripts/prerender.js writes them
 * into dist.
 */
export const agentFiles = (): Record<string, string> => ({
  "llms.txt": llmsTxt(),
  "robots.txt": robotsTxt(),
  "sitemap.xml": sitemapXml(),
  "site.webmanifest": webManifest(),
});

import { describe, expect, test } from "vitest";
import { agentFiles } from "./agentFiles";

describe("the Markdown the Edge Function serves to agents", () => {
  test("index.md, the Markdown for /, names Manuel, his current role and every Project", () => {
    const markdown = agentFiles()["index.md"];

    expect(markdown.split("\n")[0]).toBe("# Manuel Maxera");
    expect(markdown).toMatch(/^### AI Engineer at Avature$/m);
    for (const project of [
      "Trading Strategy Tester",
      "HoytsX",
      "Pokemon Voting",
      "Exercism",
      "Vbnb",
    ]) {
      expect(markdown).toMatch(new RegExp(`^### ${project}$`, "m"));
    }
  });

  for (const file of ["llms.txt", "index.md"]) {
    test(`${file} opens with a When to use this section, after the summary and before the Links, that gives the email, the CV link, the Accept: text/markdown request, where to read the LangGraph experience, and says the site has no API, MCP server or booking`, () => {
      const markdown = agentFiles()[file];
      const headings = markdown.match(/^## .+$/gm);
      const section = markdown
        .split("## When to use this\n")[1]
        ?.split("\n## ")[0];

      expect(headings?.slice(0, 2)).toEqual([
        "## When to use this",
        "## Links",
      ]);
      expect(markdown.indexOf("## When to use this")).toBeGreaterThan(
        markdown.indexOf("This file holds the full content"),
      );
      expect(section).toContain(
        "[manumaxerapro@gmail.com](mailto:manumaxerapro@gmail.com)",
      );
      expect(section).toContain(
        "(https://manuelmaxera.com/files/Manuel_Maxera_Resume.pdf)",
      );
      expect(section).toContain("`Accept: text/markdown`");
      expect(section).toMatch(/LangGraph/);
      expect(section).toMatch(/Experience and Projects sections/);
      expect(section).toContain(
        "It has no API, no MCP server and no booking or scheduling.",
      );
    });
  }

  test("404.md explains the page wasn't found in at least 20 characters and links llms.txt and the sitemap", () => {
    const markdown = agentFiles()["404.md"];

    expect(markdown.length).toBeGreaterThanOrEqual(20);
    expect(markdown).toMatch(/not found/i);
    expect(markdown).toContain("(https://manuelmaxera.com/llms.txt)");
    expect(markdown).toContain("(https://manuelmaxera.com/sitemap.xml)");
  });
});

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

  test("404.md explains the page wasn't found in at least 20 characters and links llms.txt and the sitemap", () => {
    const markdown = agentFiles()["404.md"];

    expect(markdown.length).toBeGreaterThanOrEqual(20);
    expect(markdown).toMatch(/not found/i);
    expect(markdown).toContain("(https://manuel-maxera.netlify.app/llms.txt)");
    expect(markdown).toContain(
      "(https://manuel-maxera.netlify.app/sitemap.xml)",
    );
  });
});

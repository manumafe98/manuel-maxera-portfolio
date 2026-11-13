import { claudeProjects } from "@/content/portfolio";
import { describe, expect, test } from "vitest";
import { matchingCommands } from "./commandMenu";

const aboutMe = claudeProjects.find((p) => p.id === "about-me")!;
const names = (input: string) =>
  matchingCommands(aboutMe, input).map((c) => c.name);

describe("matchingCommands", () => {
  test("a lone / lists every About Me Command plus /socials, in order", () => {
    expect(names("/")).toEqual([
      "/about-me",
      "/tldr",
      "/download-cv",
      "/socials",
    ]);
  });

  test("text after / keeps only the Commands whose name contains it", () => {
    expect(names("/tl")).toEqual(["/tldr"]);
    expect(names("/cv")).toEqual(["/download-cv"]);
  });

  test("filtering ignores letter case and surrounding spaces", () => {
    expect(names("  /TL ")).toEqual(["/tldr"]);
  });

  test("input that doesn't start with / lists nothing", () => {
    expect(names("")).toEqual([]);
    expect(names("tldr")).toEqual([]);
  });

  test("text that matches no Command lists nothing", () => {
    expect(names("/show-latest")).toEqual([]);
  });
});

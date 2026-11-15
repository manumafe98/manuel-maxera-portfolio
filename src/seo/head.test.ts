import { describe, expect, test } from "vitest";
import { headFor } from "./head";

const jsonLdScripts = (head: string) =>
  [
    ...head.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((match) => match[1]);

/** Every key anywhere in a parsed JSON value. */
const keysIn = (value: unknown): string[] =>
  value && typeof value === "object"
    ? Object.entries(value).flatMap(([key, child]) => [key, ...keysIn(child)])
    : [];

describe("the home page's JSON-LD", () => {
  test("is a single script that parses as a schema.org ProfilePage of the home URL", () => {
    const scripts = jsonLdScripts(headFor("home"));

    expect(scripts).toHaveLength(1);
    expect(JSON.parse(scripts[0])).toMatchObject({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: "https://manuelmaxera.com/",
      name: "Manuel Maxera | AI Engineer",
    });
  });

  test("has Manuel as the mainEntity Person, with a professional-inquiries ContactPoint email and Avature as only a named employer", () => {
    const data = JSON.parse(jsonLdScripts(headFor("home"))[0]);

    expect(data.mainEntity).toMatchObject({
      "@type": "Person",
      name: "Manuel Maxera",
      jobTitle: "AI Engineer",
      contactPoint: {
        "@type": "ContactPoint",
        email: "manumaxerapro@gmail.com",
        contactType: "professional inquiries",
      },
    });
    expect(data.mainEntity.worksFor).toEqual({
      "@type": "Organization",
      name: "Avature",
    });
  });

  test("has no image anywhere, since Manuel doesn't publish a photo", () => {
    const data = JSON.parse(jsonLdScripts(headFor("home"))[0]);

    expect(keysIn(data)).not.toContain("image");
  });
});

describe("the other pages' heads", () => {
  for (const page of ["privacy", "not-found"] as const) {
    test(`${page} has no JSON-LD`, () => {
      expect(jsonLdScripts(headFor(page))).toEqual([]);
    });
  }
});

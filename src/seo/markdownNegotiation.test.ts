import { describe, expect, test } from "vitest";
import { markdownNegotiation, prefersMarkdown } from "./markdownNegotiation";

describe("prefersMarkdown reads the Accept header", () => {
  test("Accept: text/markdown prefers Markdown", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
  });

  test("Accept: text/html does not prefer Markdown", () => {
    expect(prefersMarkdown("text/html")).toBe(false);
  });

  test("Accept: */* does not prefer Markdown, since Markdown wasn't asked for", () => {
    expect(prefersMarkdown("*/*")).toBe(false);
  });

  test("a missing or empty Accept header does not prefer Markdown", () => {
    expect(prefersMarkdown(null)).toBe(false);
    expect(prefersMarkdown("")).toBe(false);
  });

  test("a browser's Accept header does not prefer Markdown", () => {
    expect(
      prefersMarkdown(
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      ),
    ).toBe(false);
  });

  test("text/markdown with a higher q-value than text/html prefers Markdown", () => {
    expect(prefersMarkdown("text/html;q=0.5, text/markdown;q=0.9")).toBe(true);
  });

  test("text/html with a higher q-value than text/markdown does not prefer Markdown", () => {
    expect(prefersMarkdown("text/markdown;q=0.4, text/html")).toBe(false);
  });

  test("text/markdown;q=0 refuses Markdown even when nothing else is listed", () => {
    expect(prefersMarkdown("text/markdown;q=0")).toBe(false);
  });

  test("text/markdown beats a wildcard of the same q-value, since it is named explicitly", () => {
    expect(prefersMarkdown("*/*, text/markdown")).toBe(true);
    expect(prefersMarkdown("text/*, text/markdown")).toBe(true);
  });

  test("text/markdown listed before text/html at the same q-value prefers Markdown", () => {
    expect(prefersMarkdown("text/markdown, text/html, */*")).toBe(true);
  });

  test("text/html listed before text/markdown at the same q-value does not prefer Markdown", () => {
    expect(prefersMarkdown("text/html, text/markdown")).toBe(false);
  });

  test("media types and parameters are matched case-insensitively and with spaces around them", () => {
    expect(prefersMarkdown(" Text/Markdown ; Q=0.9 , text/html ; q=0.1")).toBe(
      true,
    );
  });

  test("text/markdown with a charset parameter still counts as Markdown", () => {
    expect(prefersMarkdown("text/markdown; charset=utf-8")).toBe(true);
  });
});

const INDEX_MD = "# Manuel Maxera\n\n> AI Engineer\n";
const NOT_FOUND_MD = "# Page not found\n\nSee /llms.txt and /sitemap.xml.\n";
const HTML_PAGE = "<!doctype html><title>Manuel Maxera</title>";
const HTML_404 = "<!doctype html><title>Page not found</title>";

/** A fake static site: the built Markdown files and an HTML page per path. */
const site = (pathname: string, accept?: string) => {
  const files: Record<string, string> = {
    "/index.md": INDEX_MD,
    "/404.md": NOT_FOUND_MD,
  };
  const htmlPages = ["/", "/index.html", "/privacy", "/llms.txt"];
  const request = new Request(`https://example.test${pathname}`, {
    headers: accept === undefined ? {} : { accept },
  });
  return markdownNegotiation(request, {
    next: async () =>
      htmlPages.includes(pathname)
        ? new Response(HTML_PAGE, {
            headers: { "content-type": "text/html; charset=UTF-8" },
          })
        : new Response(HTML_404, {
            status: 404,
            headers: { "content-type": "text/html; charset=UTF-8" },
          }),
    fetchFile: async (path) =>
      path in files
        ? new Response(files[path])
        : new Response("missing", { status: 404 }),
  });
};

describe("markdownNegotiation answers a request for a page", () => {
  test("/ with Accept: text/markdown returns the built index.md as text/markdown, varying on Accept", async () => {
    const response = await site("/", "text/markdown");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(response.headers.get("vary")).toBe("Accept");
    expect(await response.text()).toBe(INDEX_MD);
  });

  test("/index.html with Accept: text/markdown returns the same Markdown as /", async () => {
    const response = await site("/index.html", "text/markdown");

    expect(await response.text()).toBe(INDEX_MD);
  });

  test("/ with Accept: text/html returns the HTML page, varying on Accept", async () => {
    const response = await site("/", "text/html");

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "text/html; charset=UTF-8",
    );
    expect(response.headers.get("vary")).toBe("Accept");
    expect(await response.text()).toBe(HTML_PAGE);
  });

  test("/ without an Accept header returns the HTML page", async () => {
    const response = await site("/");

    expect(await response.text()).toBe(HTML_PAGE);
  });

  test("an unknown path with Accept: text/markdown keeps its 404 status and returns the built 404.md as text/markdown", async () => {
    const response = await site("/no/such/page", "text/markdown");

    expect(response.status).toBe(404);
    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8",
    );
    expect(response.headers.get("vary")).toBe("Accept");
    expect(await response.text()).toBe(NOT_FOUND_MD);
  });

  test("an unknown path with Accept: text/html returns the HTML 404 page with its 404 status", async () => {
    const response = await site("/no/such/page", "text/html");

    expect(response.status).toBe(404);
    expect(await response.text()).toBe(HTML_404);
  });

  test("an existing page without Markdown passes through unchanged even when Markdown is preferred", async () => {
    const response = await site("/privacy", "text/markdown");

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(HTML_PAGE);
  });

  test("a Vary header the static response already has keeps its value and gains Accept", async () => {
    const request = new Request("https://example.test/", {
      headers: { accept: "text/html" },
    });
    const response = await markdownNegotiation(request, {
      next: async () =>
        new Response(HTML_PAGE, { headers: { vary: "Accept-Encoding" } }),
      fetchFile: async () => new Response("unused"),
    });

    expect(response.headers.get("vary")).toBe("Accept-Encoding, Accept");
  });
});

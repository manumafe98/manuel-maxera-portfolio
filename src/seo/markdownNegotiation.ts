/**
 * Markdown content negotiation for agents (ADR-0003). The Netlify Edge
 * Function in netlify/edge-functions/ is a thin wrapper around this module,
 * so it must stay free of build aliases and browser or Deno globals beyond
 * the standard Request and Response.
 */

interface MediaRange {
  type: string;
  subtype: string;
  q: number;
  /** Position in the header, for ties between equal q-values. */
  index: number;
}

const parseAccept = (accept: string): MediaRange[] =>
  accept
    .split(",")
    .map((part, index) => {
      const [range, ...parameters] = part
        .split(";")
        .map((piece) => piece.trim());
      const [type = "", subtype = ""] = range.toLowerCase().split("/");
      const qParameter = parameters
        .map((parameter) => parameter.split("=").map((piece) => piece.trim()))
        .find(([name]) => name.toLowerCase() === "q");
      const q = qParameter ? Number(qParameter[1]) : 1;
      return { type, subtype, q: Number.isFinite(q) ? q : 0, index };
    })
    .filter((range) => range.type && range.subtype);

/** 2 for an exact match, 1 for type/*, 0 for *\/*, -1 for no match. */
const specificity = (range: MediaRange, type: string, subtype: string) => {
  if (range.type === type && range.subtype === subtype) return 2;
  if (range.type === type && range.subtype === "*") return 1;
  if (range.type === "*" && range.subtype === "*") return 0;
  return -1;
};

/** The most specific range that matches the media type (RFC 9110, 12.5.1). */
const bestMatch = (ranges: MediaRange[], mediaType: string) => {
  const [type, subtype] = mediaType.split("/");
  return ranges
    .map((range) => ({ range, rank: specificity(range, type, subtype) }))
    .filter(({ rank }) => rank >= 0)
    .sort((a, b) => b.rank - a.rank || a.range.index - b.range.index)[0];
};

/**
 * Whether the request asks for Markdown over HTML. Markdown must be named
 * explicitly (a wildcard never selects it) and must not lose to HTML on
 * q-value. On equal q-values, an explicit text/html listed first wins.
 */
export const prefersMarkdown = (accept: string | null): boolean => {
  const ranges = parseAccept(accept ?? "");
  const markdown = bestMatch(ranges, "text/markdown");
  if (!markdown || markdown.rank < 2 || markdown.range.q <= 0) return false;
  const html = bestMatch(ranges, "text/html");
  if (!html || markdown.range.q > html.range.q) return true;
  if (markdown.range.q < html.range.q) return false;
  return html.rank < 2 || markdown.range.index < html.range.index;
};

/** The build-generated Markdown for each page that has one (agentFiles). */
const markdownFiles: Record<string, string> = {
  "/": "/index.md",
  "/index.html": "/index.md",
};

/** The build-generated Markdown body for unknown paths. */
const notFoundMarkdownFile = "/404.md";

const MARKDOWN_TYPE = "text/markdown; charset=utf-8";

/** A copy of the response with Accept added to Vary, since it depends on it. */
const varyOnAccept = (response: Response, overrides: HeadersInit = {}) => {
  const headers = new Headers(response.headers);
  for (const [name, value] of new Headers(overrides)) headers.set(name, value);
  const vary = headers.get("vary");
  if (
    !vary?.split(",").some((name) => name.trim().toLowerCase() === "accept")
  ) {
    headers.set("vary", vary ? `${vary}, Accept` : "Accept");
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export interface StaticSite {
  /** The response the static site gives the request (Netlify's context.next). */
  next: () => Promise<Response>;
  /** Fetches a built file by its path on this site. */
  fetchFile: (path: string) => Promise<Response>;
}

/**
 * Answers a page request: Markdown when the request prefers it and the page
 * has a built Markdown file, a Markdown 404 for unknown paths, and otherwise
 * the static response. Every answer varies on Accept.
 */
export const markdownNegotiation = async (
  request: Request,
  site: StaticSite,
): Promise<Response> => {
  if (!prefersMarkdown(request.headers.get("accept"))) {
    return varyOnAccept(await site.next());
  }
  const markdownFile = markdownFiles[new URL(request.url).pathname];
  if (markdownFile) {
    const markdown = await site.fetchFile(markdownFile);
    if (markdown.ok) {
      return varyOnAccept(new Response(markdown.body), {
        "content-type": MARKDOWN_TYPE,
      });
    }
  }
  const response = await site.next();
  if (response.status !== 404) return varyOnAccept(response);
  const notFound = await site.fetchFile(notFoundMarkdownFile);
  if (!notFound.ok) return varyOnAccept(response);
  return varyOnAccept(new Response(notFound.body, { status: 404 }), {
    "content-type": MARKDOWN_TYPE,
  });
};

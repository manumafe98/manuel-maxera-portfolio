import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { replyTo, type ReplyEvent } from "./replyScript";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const runToEnd = async (projectId: string, input: string) => {
  const events: ReplyEvent[] = [];
  const consumed = (async () => {
    for await (const event of replyTo(projectId, input)) events.push(event);
  })();
  await vi.runAllTimersAsync();
  await consumed;
  return events;
};

/** Event types in order, with consecutive repeats (streamed chunks) merged. */
const phases = (events: ReplyEvent[]) =>
  events
    .map((event) => event.type)
    .filter((type, index, types) => type !== types[index - 1]);

const answerText = (events: ReplyEvent[]) =>
  events
    .map((event) => (event.type === "answer-chunk" ? event.text : ""))
    .join("");

const toolCall = (events: ReplyEvent[]) =>
  events.find((event) => event.type === "tool-call");

describe("About Me", () => {
  test("/about-me thinks, calls mcp__portfolio__get_profile, then streams the CV summary, education and languages", async () => {
    const events = await runToEnd("about-me", "/about-me");

    expect(phases(events)).toEqual([
      "thinking",
      "thinking-done",
      "tool-call",
      "tool-result",
      "answer-chunk",
      "done",
    ]);
    expect(toolCall(events)).toMatchObject({
      name: "mcp__portfolio__get_profile",
      args: "",
    });
    const answer = answerText(events);
    expect(answer).toContain(
      "AI Engineer focused on production LLM agents and backend platforms for enterprise SaaS",
    );
    expect(answer).toContain("University of Buenos Aires");
    expect(answer).toContain("Spanish");
  });

  test('/tldr calls mcp__portfolio__get_profile({ format: "short" }) and streams the two-line summary', async () => {
    const events = await runToEnd("about-me", "/tldr");

    expect(phases(events)).toEqual([
      "thinking",
      "thinking-done",
      "tool-call",
      "tool-result",
      "answer-chunk",
      "done",
    ]);
    expect(toolCall(events)).toMatchObject({
      name: "mcp__portfolio__get_profile",
      args: '{ format: "short" }',
    });
    expect(answerText(events)).toBe(
      "AI Engineer at Avature building production LLM agents and MCP integrations with Python, FastAPI, LangGraph and AWS Bedrock. Background in full-stack product engineering and cloud infrastructure.",
    );
  });

  test("/download-cv calls mcp__portfolio__get_resume and ends with a download card for the CV PDF", async () => {
    const events = await runToEnd("about-me", "/download-cv");

    expect(phases(events)).toEqual([
      "thinking",
      "thinking-done",
      "tool-call",
      "tool-result",
      "answer-chunk",
      "answer-block",
      "done",
    ]);
    expect(toolCall(events)).toMatchObject({
      name: "mcp__portfolio__get_resume",
    });
    expect(events[events.length - 2]).toEqual({
      type: "answer-block",
      block: {
        kind: "download-card",
        fileName: "Manuel_Maxera_Resume.pdf",
        href: "/files/Manuel_Maxera_Resume.pdf",
      },
    });
  });
});

describe("Experience", () => {
  test('/show-latest-experience calls mcp__portfolio__fetch_experiences({ scope: "latest" }) and streams the current Avature AI Engineer role with its dates, location and achievements', async () => {
    const events = await runToEnd("experience", "/show-latest-experience");

    expect(phases(events)).toEqual([
      "thinking",
      "thinking-done",
      "tool-call",
      "tool-result",
      "answer-chunk",
      "done",
    ]);
    expect(toolCall(events)).toMatchObject({
      name: "mcp__portfolio__fetch_experiences",
      args: '{ scope: "latest" }',
    });
    const answer = answerText(events);
    expect(answer).toContain("AI Engineer");
    expect(answer).toContain("Avature");
    expect(answer).toContain("September 2025 – Present");
    expect(answer).toContain("Buenos Aires, Argentina");
    expect(answer).toContain(
      "Migrated seven agents to a shared prompt architecture",
    );
    expect(answer).not.toContain("Software Engineer");
  });

  test('/show-full-experience calls mcp__portfolio__fetch_experiences({ scope: "all" }) and ends with a timeline of all four roles, newest first, each with dates, location and achievements', async () => {
    const events = await runToEnd("experience", "/show-full-experience");

    expect(phases(events)).toEqual([
      "thinking",
      "thinking-done",
      "tool-call",
      "tool-result",
      "answer-chunk",
      "answer-block",
      "done",
    ]);
    expect(toolCall(events)).toMatchObject({
      name: "mcp__portfolio__fetch_experiences",
      args: '{ scope: "all" }',
    });
    const timeline = events.find((event) => event.type === "answer-block");
    expect(timeline).toMatchObject({
      block: {
        kind: "timeline",
        roles: [
          {
            title: "AI Engineer",
            company: "Avature",
            dates: "September 2025 – Present",
            location: "Buenos Aires, Argentina",
          },
          {
            title: "Software Engineer",
            company: "Avature",
            dates: "August 2024 – August 2025",
          },
          {
            title: "Cloud Engineer",
            company: "Avature",
            dates: "March 2022 – July 2024",
          },
          {
            title: "Sysadmin Unix",
            company: "IBM – Kyndryl",
            dates: "November 2019 – March 2022",
          },
        ],
      },
    });
    expect(
      timeline?.type === "answer-block" &&
        timeline.block.kind === "timeline" &&
        timeline.block.roles[3].achievements,
    ).toContain(
      "Led server and data migrations and implemented Ansible automation to reduce manual ticket-resolution work.",
    );
  });
});

describe("free text", () => {
  test("free text in About Me gets no tool call and an answer listing /about-me, /tldr and /download-cv", async () => {
    const events = await runToEnd("about-me", "who are you?");

    expect(phases(events)).toEqual([
      "thinking",
      "thinking-done",
      "answer-chunk",
      "done",
    ]);
    const answer = answerText(events);
    expect(answer).toContain("/about-me");
    expect(answer).toContain("/tldr");
    expect(answer).toContain("/download-cv");
  });

  test("free text in Welcome lists Welcome's Commands and not About Me's", async () => {
    const answer = answerText(
      await runToEnd("manuel-maxera-portfolio", "hello"),
    );

    expect(answer).toContain("/download-cv");
    expect(answer).not.toContain("/tldr");
  });

  test("a Command typed with different case and surrounding spaces runs that Command instead of the fallback", async () => {
    const events = await runToEnd("about-me", "  /TLDR ");

    expect(toolCall(events)).toMatchObject({
      name: "mcp__portfolio__get_profile",
    });
  });
});

describe("skip and stop", () => {
  /** Resolves the first `count` waits at once, then never resolves again. */
  const stallAfter = (count: number) => {
    let calls = 0;
    return () =>
      calls++ < count ? Promise.resolve() : new Promise<void>(() => {});
  };

  test("skip() during a stalled reply delivers every remaining event at once, ending with the full answer and done", async () => {
    vi.useRealTimers();
    const stream = replyTo("about-me", "/tldr", { delay: stallAfter(2) });
    const events: ReplyEvent[] = [];

    for await (const event of stream) {
      events.push(event);
      if (events.length === 2) stream.skip();
    }

    expect(events[events.length - 1]).toEqual({ type: "done" });
    expect(answerText(events)).toContain(
      "Background in full-stack product engineering and cloud infrastructure.",
    );
  });

  test("stop() during a stalled reply ends the sequence with no further events", async () => {
    vi.useRealTimers();
    const stream = replyTo("about-me", "/tldr", { delay: stallAfter(2) });
    const events: ReplyEvent[] = [];

    for await (const event of stream) {
      events.push(event);
      if (events.length === 2) stream.stop();
    }

    expect(events).toHaveLength(2);
  });
});

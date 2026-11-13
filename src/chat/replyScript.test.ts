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

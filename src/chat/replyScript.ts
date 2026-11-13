/**
 * The reply script (Seam 2): given a Claude project id and the raw input,
 * produce the async sequence of events a Chat renders as a scripted reply.
 *
 * Pure apart from timing. The delay source is injectable, and the returned
 * stream can be skipped (the remaining events arrive at once) or stopped.
 */
import {
  claudeProjects,
  cv,
  education,
  profile,
  spokenLanguages,
  type ClaudeProject,
} from "@/content/portfolio";

export type AnswerBlock = {
  kind: "download-card";
  fileName: string;
  href: string;
};

export type ReplyEvent =
  | { type: "thinking"; text: string }
  | { type: "thinking-done"; seconds: number }
  | { type: "tool-call"; name: string; args: string }
  | { type: "tool-result"; result: string }
  | { type: "answer-chunk"; text: string }
  | { type: "answer-block"; block: AnswerBlock }
  | { type: "done" };

export interface ReplyStream extends AsyncIterable<ReplyEvent> {
  /** Deliver every remaining event at once, without waiting. */
  skip(): void;
  /** End the sequence; no further events are delivered. */
  stop(): void;
}

export interface ReplyOptions {
  /** Waits `ms` milliseconds. Defaults to setTimeout. */
  delay?: (ms: number) => Promise<void>;
  /** Source of jitter in [0, 1). Defaults to Math.random. */
  random?: () => number;
}

interface Script {
  thinking: string;
  tool?: { name: string; args: string; result: string };
  answer: (string | AnswerBlock)[];
}

const json = (value: unknown) => JSON.stringify(value, null, 2);

const scripts: Record<string, () => Script> = {
  "/about-me": () => ({
    thinking:
      "The visitor wants Manuel's full background. I'll fetch his profile and walk through the summary, education and languages.",
    tool: {
      name: "mcp__portfolio__get_profile",
      args: "",
      result: json({
        name: profile.name,
        title: profile.title,
        location: profile.location,
      }),
    },
    answer: [
      `**${profile.name}** · ${profile.title}
*${profile.location}*

${profile.summary}

**Education**
${education.map((e) => `- ${e.degree}, ${e.institution} (since ${e.start})`).join("\n")}

**Languages**
${spokenLanguages.map((l) => `- ${l.language}: ${l.level}`).join("\n")}

Run \`/download-cv\` to keep a copy of the CV.`,
    ],
  }),
  "/tldr": () => ({
    thinking: "They're in a hurry. The short version of the profile will do.",
    tool: {
      name: "mcp__portfolio__get_profile",
      args: `{ format: "short" }`,
      result: json({ shortSummary: profile.shortSummary }),
    },
    answer: [profile.shortSummary],
  }),
  "/download-cv": () => ({
    thinking: "They want the CV. I'll fetch the current PDF.",
    tool: {
      name: "mcp__portfolio__get_resume",
      args: "",
      result: json({ fileName: cv.fileName, path: cv.path }),
    },
    answer: [
      "Here's Manuel's current CV:",
      { kind: "download-card", fileName: cv.fileName, href: cv.path },
    ],
  }),
};

const fallback = (project: ClaudeProject): Script => ({
  thinking: "That isn't a Command this Chat knows.",
  answer: [
    `Replies here are scripted, so I only understand these Commands:

${project.commands.map((c) => `- \`${c.name}\`: ${c.description}`).join("\n")}`,
  ],
});

const normalize = (input: string) => input.trim().toLowerCase();

/** Splits text into word-sized pieces, grouped so a long text streams in about `ticks` events. */
const chunk = (text: string, ticks: number) => {
  const words = text.split(/(?<=\s)/);
  const perTick = Math.max(1, Math.ceil(words.length / ticks));
  const chunks: string[] = [];
  for (let i = 0; i < words.length; i += perTick) {
    chunks.push(words.slice(i, i + perTick).join(""));
  }
  return chunks;
};

type Step = { ms: number; event: ReplyEvent };

const plan = (script: Script, random: () => number): Step[] => {
  const jitter = (ms: number) => Math.round(ms * (0.7 + random() * 0.6));
  const steps: Step[] = [];

  let thinkingMs = 0;
  chunk(script.thinking, 40).forEach((text, index) => {
    const ms = jitter(index === 0 ? 300 : 30);
    thinkingMs += ms;
    steps.push({ ms, event: { type: "thinking", text } });
  });
  const pause = jitter(400);
  thinkingMs += pause;
  steps.push({
    ms: pause,
    event: {
      type: "thinking-done",
      seconds: Math.max(1, Math.round(thinkingMs / 1000)),
    },
  });

  if (script.tool) {
    const { name, args, result } = script.tool;
    steps.push({ ms: jitter(200), event: { type: "tool-call", name, args } });
    steps.push({ ms: jitter(700), event: { type: "tool-result", result } });
  }

  script.answer.forEach((part, index) => {
    if (typeof part === "string") {
      const text = index > 0 ? `\n\n${part}` : part;
      chunk(text, 70).forEach((piece, i) =>
        steps.push({
          ms: jitter(i === 0 ? 250 : 25),
          event: { type: "answer-chunk", text: piece },
        }),
      );
    } else {
      steps.push({
        ms: jitter(200),
        event: { type: "answer-block", block: part },
      });
    }
  });

  steps.push({ ms: 0, event: { type: "done" } });
  return steps;
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const replyTo = (
  projectId: string,
  rawInput: string,
  { delay = sleep, random = Math.random }: ReplyOptions = {},
): ReplyStream => {
  const project = claudeProjects.find((p) => p.id === projectId);
  if (!project) throw new Error(`Unknown Claude project: ${projectId}`);

  const command = normalize(rawInput);
  const known = project.commands.some((c) => c.name === command);
  const steps = plan(known ? scripts[command]() : fallback(project), random);

  let skipped = false;
  let stopped = false;
  let interrupt = () => {};
  const interrupted = new Promise<void>((resolve) => (interrupt = resolve));
  const wait = (ms: number) =>
    skipped || ms === 0
      ? Promise.resolve()
      : Promise.race([delay(ms), interrupted]);

  async function* events() {
    for (const step of steps) {
      await wait(step.ms);
      if (stopped) return;
      yield step.event;
    }
  }

  return {
    [Symbol.asyncIterator]: events,
    skip() {
      skipped = true;
      interrupt();
    },
    stop() {
      stopped = true;
      interrupt();
    },
  };
};

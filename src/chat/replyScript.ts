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
  experience,
  profile,
  projects,
  skillAreas,
  spokenLanguages,
  type AppId,
  type ClaudeProject,
  type ExperienceEntry,
} from "@/content/portfolio";

export interface TimelineRole {
  company: string;
  title: string;
  /** "Start – End", for example "September 2025 – Present". */
  dates: string;
  location: string;
  achievements: string[];
}

export type AnswerBlock =
  | { kind: "download-card"; fileName: string; href: string }
  /** Roles newest first. */
  | { kind: "timeline"; roles: TimelineRole[] };

export type ReplyEvent =
  | { type: "thinking"; text: string }
  | { type: "thinking-done"; seconds: number }
  | { type: "tool-call"; name: string; args: string }
  | { type: "tool-result"; result: string }
  /** A Skill's trace line, such as Skill(open-projects). */
  | { type: "skill"; name: string }
  /** Open or focus an App window (on desktop). */
  | { type: "open-app"; app: AppId }
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
  /** Set for a Skill: its name and the App window it opens. */
  skill?: { name: string; app: AppId };
  tool?: { name: string; args: string; result: string };
  answer: (string | AnswerBlock)[];
}

const json = (value: unknown) => JSON.stringify(value, null, 2);

const dates = (role: ExperienceEntry) => `${role.start} – ${role.end}`;

const roleSummary = (role: ExperienceEntry) => ({
  company: role.company,
  title: role.title,
  dates: dates(role),
  location: role.location,
});

const skill = (
  name: string,
  app: AppId,
  thinking: string,
  result: unknown,
  summary: string,
): Script => ({
  thinking,
  skill: { name, app },
  tool: {
    name: "mcp__portfolio__launch_app",
    args: `"${app}"`,
    result: json(result),
  },
  answer: [summary],
});

const skillCount = skillAreas.reduce((n, area) => n + area.skills.length, 0);

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
  "/show-latest-experience": () => {
    const [latest] = experience;
    return {
      thinking:
        "They want to know what Manuel does now. I'll fetch his latest role and list its main achievements.",
      tool: {
        name: "mcp__portfolio__fetch_experiences",
        args: `{ scope: "latest" }`,
        result: json([roleSummary(latest)]),
      },
      answer: [
        `**${latest.title}** · ${latest.company}
*${dates(latest)} · ${latest.location}*

**Key achievements**
${latest.achievements.map((a) => `- ${a}`).join("\n")}

Run \`/show-full-experience\` to see his whole career.`,
      ],
    };
  },
  "/show-full-experience": () => ({
    thinking:
      "They want the whole career. I'll fetch every role and lay them out as a timeline, newest first.",
    tool: {
      name: "mcp__portfolio__fetch_experiences",
      args: `{ scope: "all" }`,
      result: json(experience.map(roleSummary)),
    },
    answer: [
      `Manuel has held **${experience.length} roles**, from Unix sysadmin to AI engineer:`,
      {
        kind: "timeline",
        roles: experience.map((role) => ({
          ...roleSummary(role),
          achievements: role.achievements,
        })),
      },
    ],
  }),
  "/open-projects": () =>
    skill(
      "open-projects",
      "ubuntu-software",
      "They want to see what Manuel built. I'll launch the Software window with his Projects.",
      { app: "ubuntu-software", projects: projects.map((p) => p.name) },
      `Opened **Software** with Manuel's ${projects.length} Projects, each linking to its code.`,
    ),
  "/open-skills": () =>
    skill(
      "open-skills",
      "files",
      "They want Manuel's tech stack. I'll launch the Files window with his skills grouped by area.",
      { app: "files", areas: skillAreas.map((a) => a.area) },
      `Opened **Files** with ${skillCount} skills in ${skillAreas.length} areas.`,
    ),
  "/open-contact": () =>
    skill(
      "open-contact",
      "gmail",
      "They want to get in touch. I'll launch Gmail with the contact form.",
      { app: "gmail", opened: "contact form" },
      "Opened **Gmail** with a contact form. Write your email and a message, and Manuel will reply.",
    ),
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

  if (script.skill) {
    steps.push({
      ms: jitter(200),
      event: { type: "skill", name: script.skill.name },
    });
  }

  if (script.tool) {
    const { name, args, result } = script.tool;
    steps.push({ ms: jitter(200), event: { type: "tool-call", name, args } });
    steps.push({ ms: jitter(700), event: { type: "tool-result", result } });
  }

  if (script.skill) {
    steps.push({ ms: 0, event: { type: "open-app", app: script.skill.app } });
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

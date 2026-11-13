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
  gridTechSkills,
  profile,
  projects,
  socialLinks,
  spokenLanguages,
  type AppWindowId,
  type ClaudeProject,
  type ClaudeProjectId,
  type ExperienceEntry,
  type SocialLink,
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
  | { kind: "timeline"; roles: TimelineRole[] }
  /** External links, opened in a new tab. */
  | { kind: "links"; links: SocialLink[] }
  /** A link that opens another Claude project's Chat. */
  | { kind: "claude-project-link"; id: ClaudeProjectId }
  /** A Skill's content shown inside the Chat, in place of its App window. */
  | { kind: "skill-card"; app: AppWindowId };

export type ReplyEvent =
  | { type: "thinking"; text: string }
  | { type: "thinking-done"; seconds: number }
  | { type: "tool-call"; name: string; args: string }
  | { type: "tool-result"; result: string }
  /** A Skill's trace line, such as Skill(open-projects). */
  | { type: "skill"; name: string }
  /** Open or focus an App window. Only sent when Skills open windows. */
  | { type: "open-app"; app: AppWindowId }
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
  /**
   * How Skills show their content: by opening App windows (desktop, the
   * default) or as cards inside the reply (phones).
   */
  skills?: SkillsShownAs;
}

export type SkillsShownAs = "windows" | "cards";

interface Script {
  thinking: string;
  /** Set for a Skill: its name and the App window it opens. */
  skill?: { name: string; app: AppWindowId };
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

/** What a Skill's reply says, for each way its content can be shown. */
type SkillWording = Record<
  SkillsShownAs,
  { thinking: string; summary: string }
>;

const skill =
  (name: string, app: AppWindowId, result: unknown, wording: SkillWording) =>
  (shownAs: SkillsShownAs): Script => ({
    thinking: wording[shownAs].thinking,
    skill: { name, app },
    tool: {
      name: "mcp__portfolio__launch_app",
      args: `"${app}"`,
      result: json(result),
    },
    answer:
      shownAs === "cards"
        ? [wording.cards.summary, { kind: "skill-card", app }]
        : [wording.windows.summary],
  });

const scripts: Record<string, (skills: SkillsShownAs) => Script> = {
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
  "/open-projects": skill(
    "open-projects",
    "ubuntu-software",
    { app: "ubuntu-software", projects: projects.map((p) => p.name) },
    {
      windows: {
        thinking:
          "They want to see what Manuel built. I'll launch the Software window with his Projects.",
        summary: `Opened **Software** with Manuel's ${projects.length} Projects, each linking to its code.`,
      },
      cards: {
        thinking:
          "They want to see what Manuel built. I'll show his Projects as cards.",
        summary: `Here are Manuel's ${projects.length} Projects, each linking to its code:`,
      },
    },
  ),
  "/open-skills": skill(
    "open-skills",
    "files",
    { app: "files", skills: gridTechSkills.length },
    {
      windows: {
        thinking:
          "They want Manuel's tech stack. I'll launch the Files window with his skills.",
        summary: `Opened **Files** with ${gridTechSkills.length} skills.`,
      },
      cards: {
        thinking: "They want Manuel's tech stack. I'll show his skills.",
        summary: `Here are Manuel's ${gridTechSkills.length} skills:`,
      },
    },
  ),
  "/open-contact": skill(
    "open-contact",
    "gmail",
    { app: "gmail", opened: "contact form" },
    {
      windows: {
        thinking:
          "They want to get in touch. I'll launch Gmail with the contact form.",
        summary:
          "Opened **Gmail** with a contact form. Write your email and a message, and Manuel will reply.",
      },
      cards: {
        thinking:
          "They want to get in touch. I'll show the contact form right here.",
        summary:
          "Here's a contact form. Write your email and a message, and Manuel will reply:",
      },
    },
  ),

  "/socials": () => ({
    thinking:
      "They want to follow Manuel elsewhere. I'll fetch his social links.",
    tool: {
      name: "mcp__portfolio__get_socials",
      args: "",
      result: json(socialLinks),
    },
    answer: [
      "Here's where to find Manuel:",
      { kind: "links", links: socialLinks },
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

const elsewhere = (command: string, owner: ClaudeProject): Script => ({
  thinking: `That Command isn't in this Chat. It belongs to another Claude project.`,
  answer: [
    `\`${command}\` lives in the **${owner.id}** Claude project. Open its Chat to run the Command there:`,
    { kind: "claude-project-link", id: owner.id },
  ],
});

/**
 * The Claude project that has `command`, other than `current`. Searched from
 * the end so a topic Claude project wins over Welcome, which repeats the
 * call-to-action Commands of About Me and Contact.
 */
const ownerOf = (command: string, current: ClaudeProject) =>
  [...claudeProjects]
    .reverse()
    .find((p) => p !== current && p.commands.some((c) => c.name === command));

/** How a typed Command is compared: trimmed and lower case. */
export const normalize = (input: string) => input.trim().toLowerCase();

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

const plan = (
  script: Script,
  random: () => number,
  skills: SkillsShownAs,
): Step[] => {
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

  if (script.skill && skills === "windows") {
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
  {
    delay = sleep,
    random = Math.random,
    skills = "windows",
  }: ReplyOptions = {},
): ReplyStream => {
  const project = claudeProjects.find((p) => p.id === projectId);
  if (!project) throw new Error(`Unknown Claude project: ${projectId}`);

  const command = normalize(rawInput);
  const known = project.commands.some((c) => c.name === command);
  const owner = known ? undefined : ownerOf(command, project);
  const script = known
    ? scripts[command](skills)
    : owner
      ? elsewhere(command, owner)
      : fallback(project);
  const steps = plan(script, random, skills);

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

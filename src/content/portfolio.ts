/**
 * The single source of truth for all portfolio content.
 *
 * Written by hand from the current CV (public/files/Manuel_Maxera_Resume.pdf).
 * When the CV changes, update this file: the App windows, the Top bar and
 * (later) the Chats all read from it.
 */
import exercismLogo from "@/assets/exercism_logo.webp";
import hoytsxLogo from "@/assets/hoytsx_logo.webp";
import pokemonVotingDappLogo from "@/assets/pokemon_voting_dapp_logo.webp";
import vbnbLogo from "@/assets/vbnb_logo.webp";

export interface Profile {
  name: string;
  title: string;
  location: string;
  email: string;
  /** Full professional summary, as on the CV. */
  summary: string;
  /** Two- or three-line version of the summary. */
  shortSummary: string;
}

export interface ExperienceEntry {
  company: string;
  title: string;
  location: string;
  start: string;
  /** "Present" for the current role. */
  end: string;
  achievements: string[];
}

export interface Project {
  name: string;
  /** One line, short enough for a Project card. */
  description: string;
  /** Longer description, when the CV has one. */
  details?: string[];
  logo?: { src: string; alt: string };
  repoUrl: string;
  liveUrl?: string;
}

export interface SkillArea {
  area: string;
  skills: string[];
}

export interface SocialLink {
  name: "LinkedIn" | "GitHub";
  url: string;
}

export interface Education {
  institution: string;
  degree: string;
  location: string;
  start: string;
}

export interface SpokenLanguage {
  language: string;
  level: string;
}

export const profile: Profile = {
  name: "Manuel Maxera",
  title: "AI Engineer",
  location: "Buenos Aires, Argentina",
  email: "manumaxerapro@gmail.com",
  summary:
    "AI Engineer focused on production LLM agents and backend platforms for enterprise SaaS, using Python, FastAPI, LangGraph, AWS Bedrock and the Model Context Protocol (MCP). Experience includes retrieval, multilingual search, LLM evaluation and observability, as well as AI-assisted code review and merge-request workflows in GitLab CI. Foundation in full-stack product engineering and cloud infrastructure.",
  shortSummary:
    "AI Engineer at Avature building production LLM agents and MCP integrations with Python, FastAPI, LangGraph and AWS Bedrock. Background in full-stack product engineering and cloud infrastructure.",
};

export const experience: ExperienceEntry[] = [
  {
    company: "Avature",
    title: "AI Engineer",
    location: "Buenos Aires, Argentina",
    start: "September 2025",
    end: "Present",
    achievements: [
      "Build and improve production AI agents for Avature Copilot, supporting candidate search and applications, scheduling, insights and knowledge-base Q&A using Python, FastAPI, LangGraph and AWS Bedrock.",
      "Migrated seven agents to a shared prompt architecture with reusable snippets and customer-editable instructions, and aligned agent configuration across product and orchestration services.",
      "Extended MCP integrations by organizing platform tools, adding configurable wildcard tool groups and validating requests before workflows are submitted.",
      "Delivered locale-aware knowledge retrieval across the platform, orchestration service, AI gateway and crawler, so answers can cite sources in the customer's language.",
      "Contributed to the internal AI gateway with asynchronous rate limiting, Bedrock latency and throttling metrics, dynamic OpenAI model support and CI reliability improvements.",
      "Built agent regression and calibration tests, and authored reusable GitLab CI jobs and agent skills for AI code review and merge-request overviews.",
    ],
  },
  {
    company: "Avature",
    title: "Software Engineer",
    location: "Buenos Aires, Argentina",
    start: "August 2024",
    end: "August 2025",
    achievements: [
      "Developed and maintained an integrated application suite spanning the PHP end-user platform, Java crawlers and API integrations, and a TypeScript browser extension.",
      "Designed and maintained the browser extension with a React frontend and Node.js backend.",
      "Built Java crawlers to scrape job boards or communicate with their APIs, parsing responses into user-specific datasets.",
      "Built and maintained the PHP application, integrating extension and crawler capabilities for end users; fixed defects and delivered features across the suite in collaboration with cross-functional teams.",
      "Also delivered sourcing features, retired legacy job-board integrations, modernized PHP with PSR-4 migrations and type hints, and contributed early Copilot and semantic-search integrations.",
    ],
  },
  {
    company: "Avature",
    title: "Cloud Engineer",
    location: "Buenos Aires, Argentina",
    start: "March 2022",
    end: "July 2024",
    achievements: [
      "Led server provisioning, lifecycle and configuration work across cloud platforms and Linux environments, including on-call response to critical incidents.",
      "Improved monitoring and incident response by refining alarm severity and routing, reducing false positives and aligning alerts with service ownership.",
      "Automated recurring operational workflows and partnered with teams to strengthen monitoring and infrastructure reliability.",
    ],
  },
  {
    company: "IBM – Kyndryl",
    title: "Sysadmin Unix",
    location: "Buenos Aires, Argentina",
    start: "November 2019",
    end: "March 2022",
    achievements: [
      "Administered Red Hat Linux, AIX and Solaris systems, covering capacity planning, maintenance, installation, upgrades, troubleshooting and on-call support.",
      "Led server and data migrations and implemented Ansible automation to reduce manual ticket-resolution work.",
    ],
  },
];

export const projects: Project[] = [
  {
    name: "Trading Strategy Tester",
    description: "CLI backtesting runner for trading strategies",
    details: [
      "Built a CLI backtesting runner to compare strategy variants across assets and timeframes, with configurable risk, exit modes, sessions and transaction costs.",
      "Implemented deterministic OHLC execution simulation and generated performance reports with trade charts.",
    ],
    repoUrl: "https://github.com/manumafe98/trading_strategy_tester",
  },
  {
    name: "HoytsX",
    description: "Your cinema in the blockchain",
    logo: { src: hoytsxLogo, alt: "HoytsX Logo" },
    repoUrl: "https://github.com/manumafe98/HoytsX",
  },
  {
    name: "Pokemon Voting",
    description: "Vote your favourite Pokemon on Ethereum",
    details: [
      "Built a Solidity/React voting DApp with wallet-based registration, one vote per user and admin-managed candidates; stored profile images on IPFS and deployed and verified the contract on Ethereum Sepolia.",
    ],
    logo: { src: pokemonVotingDappLogo, alt: "Pokemon Voting Dapp Logo" },
    repoUrl: "https://github.com/manumafe98/pokemon_voting_dapp",
  },
  {
    name: "Exercism",
    description: "Java Track Maintainer",
    logo: { src: exercismLogo, alt: "Exercism Logo" },
    repoUrl: "https://github.com/manumafe98/java",
  },
  {
    name: "Vbnb",
    description: "Listing App",
    logo: { src: vbnbLogo, alt: "Vbnb logo" },
    repoUrl: "https://github.com/manumafe98/Vbnb",
  },
];

export const skillAreas: SkillArea[] = [
  {
    area: "Languages",
    skills: ["Python", "PHP", "TypeScript", "Java", "Solidity", "JavaScript"],
  },
  {
    area: "Frameworks",
    skills: ["FastAPI", "Hardhat", "Foundry", "React", "Spring", "Tailwind"],
  },
  {
    area: "AI engineering",
    skills: [
      "LangGraph",
      "LangChain",
      "MCP",
      "AWS Bedrock",
      "OpenAI",
      "RAG",
      "Prompt engineering",
      "LLM evaluation",
    ],
  },
  {
    area: "Search and backend",
    skills: ["Elasticsearch", "Vector search", "Embeddings", "Redis", "Celery"],
  },
  {
    area: "Quality and observability",
    skills: [
      "GitLab CI",
      "Docker",
      "OpenTelemetry",
      "Phoenix",
      "Prometheus",
      "Grafana",
      "Linux",
      "AWS",
      "Git",
    ],
  },
  {
    area: "AI developer tooling",
    skills: ["Devin", "Windsurf", "Codex", "Opencode"],
  },
];

export const education: Education[] = [
  {
    institution: "University of Buenos Aires",
    degree: "Computer Science (incomplete)",
    location: "Buenos Aires, Argentina",
    start: "March 2017",
  },
];

export const spokenLanguages: SpokenLanguage[] = [
  { language: "Spanish", level: "Native" },
  { language: "English", level: "Intermediate (B1)" },
  { language: "Italian", level: "Elementary (A2)" },
];

export const socialLinks: SocialLink[] = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/manuel-maxera/" },
  { name: "GitHub", url: "https://github.com/manumafe98" },
];

/** The live site. Canonical URLs and structured data point here. */
export const site = {
  url: "https://manuel-maxera.netlify.app/",
};

export const cv = {
  path: "/files/Manuel_Maxera_Resume.pdf",
  fileName: "Manuel_Maxera_Resume.pdf",
};

export type ClaudeProjectId =
  | "manuel-maxera-portfolio"
  | "about-me"
  | "experience"
  | "projects"
  | "skills"
  | "contact";

/** The App windows a Skill can open. */
export type AppId = "ubuntu-software" | "files" | "gmail";

export interface Command {
  /** Slash-prefixed, lower case, as the visitor types it. */
  name: string;
  /** One line shown in the Chat's list of Commands. */
  description: string;
}

export interface ClaudeProject {
  id: ClaudeProjectId;
  /** The title of the project's one Chat, shown in the sidebar and header. */
  title: string;
  /** Opening message of the Chat. The Commands list is added after it. */
  intro: string;
  commands: Command[];
  /** Commands offered as clickable chips above the input. */
  chips: string[];
  /** Other Claude projects this Chat links to. */
  links?: ClaudeProjectId[];
}

const aboutMeCommand: Command = {
  name: "/about-me",
  description: "Manuel's full background",
};
const tldrCommand: Command = {
  name: "/tldr",
  description: "a two-line summary",
};
const showLatestExperienceCommand: Command = {
  name: "/show-latest-experience",
  description: "Manuel's current role and its main achievements",
};
const showFullExperienceCommand: Command = {
  name: "/show-full-experience",
  description: "his whole work history as a timeline",
};
const downloadCvCommand: Command = {
  name: "/download-cv",
  description: "download the current CV as a PDF",
};
const openProjectsCommand: Command = {
  name: "/open-projects",
  description: "open the Software window with the Projects Manuel built",
};
const openSkillsCommand: Command = {
  name: "/open-skills",
  description: "open the Files window with his skills grouped by area",
};
const openContactCommand: Command = {
  name: "/open-contact",
  description: "open the Gmail window to send Manuel a message",
};
/** Available in every Chat. */
const socialsCommand: Command = {
  name: "/socials",
  description: "Manuel's LinkedIn and GitHub links",
};

export const claudeProjects: ClaudeProject[] = [
  {
    id: "manuel-maxera-portfolio",
    title: "Getting started with Manuel's portfolio",
    intro: `Hi! This is **${profile.name}**'s portfolio, running as a Claude Code session. Manuel is an **${profile.title}** in ${profile.location}, building production LLM agents and MCP integrations.

Each Claude project in the sidebar covers one topic and holds one Chat. Open one from the sidebar (the ☰ menu on phones) or from the links below, run a Command from the chips, or type \`/\` to start.`,
    commands: [openContactCommand, downloadCvCommand, socialsCommand],
    chips: [openContactCommand.name, downloadCvCommand.name],
    links: ["about-me", "experience", "projects", "skills", "contact"],
  },
  {
    id: "about-me",
    title: "Who is Manuel Maxera?",
    intro: "I can tell you who Manuel is, in full or in short.",
    commands: [aboutMeCommand, tldrCommand, downloadCvCommand, socialsCommand],
    chips: [aboutMeCommand.name, tldrCommand.name, downloadCvCommand.name],
  },
  {
    id: "experience",
    title: "Manuel's career timeline",
    intro:
      "I can show you what Manuel does now, or his whole career as a timeline.",
    commands: [
      showLatestExperienceCommand,
      showFullExperienceCommand,
      socialsCommand,
    ],
    chips: [showLatestExperienceCommand.name, showFullExperienceCommand.name],
  },
  {
    id: "projects",
    title: "Side projects showcase",
    intro:
      "I can open the Software window with the Projects Manuel built, each with a link to its code.",
    commands: [openProjectsCommand, socialsCommand],
    chips: [openProjectsCommand.name],
  },
  {
    id: "skills",
    title: "Tech stack overview",
    intro:
      "I can open the Files window with Manuel's tech stack, grouped by area.",
    commands: [openSkillsCommand, socialsCommand],
    chips: [openSkillsCommand.name],
  },
  {
    id: "contact",
    title: "Reaching out to Manuel",
    intro: "I can open the Gmail window so you can send Manuel a message.",
    commands: [openContactCommand, socialsCommand],
    chips: [openContactCommand.name],
  },
];

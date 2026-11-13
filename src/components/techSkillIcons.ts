import type { ToolTechSkill } from "@/content/portfolio";
import { AmazonWebServicesIcon } from "@/icons/AmazonWebServicesIcon";
import { ClaudeCodeIcon } from "@/icons/ClaudeCodeIcon";
import { CodexIcon } from "@/icons/CodexIcon";
import { DockerIcon } from "@/icons/DockerIcon";
import { FastApiIcon } from "@/icons/FastApiIcon";
import { GitIcon } from "@/icons/GitIcon";
import { GitLabIcon } from "@/icons/GitLabIcon";
import { GrafanaIcon } from "@/icons/GrafanaIcon";
import { HardhatIcon } from "@/icons/HardhatIcon";
import { HerdrIcon } from "@/icons/HerdrIcon";
import { JavaIcon } from "@/icons/JavaIcon";
import { JavaScriptIcon } from "@/icons/JavaScriptIcon";
import { LangChainIcon } from "@/icons/LangChainIcon";
import { LinuxIcon } from "@/icons/LinuxIcon";
import { McpIcon } from "@/icons/McpIcon";
import {
  AwsBedrockIcon,
  CeleryIcon,
  DevinIcon,
  ElasticsearchIcon,
  FoundryIcon,
  LangGraphIcon,
  OpenTelemetryIcon,
  PhoenixIcon,
} from "@/icons/MonogramIcons";
import { OpenAiIcon } from "@/icons/OpenAiIcon";
import { OpenCodeIcon } from "@/icons/OpenCodeIcon";
import { PhpIcon } from "@/icons/PhpIcon";
import { PrometheusIcon } from "@/icons/PrometheusIcon";
import { PythonIcon } from "@/icons/PythonIcon";
import { ReactIcon } from "@/icons/ReactIcon";
import { RedisIcon } from "@/icons/RedisIcon";
import { SolidityIcon } from "@/icons/SolidityIcon";
import { SpringIcon } from "@/icons/SpringIcon";
import { TailwindCssIcon } from "@/icons/TailwindCssIcon";
import { TypeScriptIcon } from "@/icons/TypeScriptIcon";
import { WindsurfIcon } from "@/icons/WindsurfIcon";
import type { ComponentType, SVGProps } from "react";

/**
 * The logo of each Tech skill in the Tech skill grid, by name. Logos come from
 * svgl (dark-theme variants where it has two); herdr's comes from its own
 * repo; tools svgl lacks get a monogram tile. Keyed by every tool Tech skill,
 * so a tool added to the content without a logo fails type-checking.
 */
export const techSkillIcons: Record<
  ToolTechSkill,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  Python: PythonIcon,
  PHP: PhpIcon,
  TypeScript: TypeScriptIcon,
  Java: JavaIcon,
  Solidity: SolidityIcon,
  JavaScript: JavaScriptIcon,
  FastAPI: FastApiIcon,
  Hardhat: HardhatIcon,
  Foundry: FoundryIcon,
  React: ReactIcon,
  Spring: SpringIcon,
  Tailwind: TailwindCssIcon,
  LangGraph: LangGraphIcon,
  LangChain: LangChainIcon,
  MCP: McpIcon,
  "AWS Bedrock": AwsBedrockIcon,
  OpenAI: OpenAiIcon,
  Elasticsearch: ElasticsearchIcon,
  Redis: RedisIcon,
  Celery: CeleryIcon,
  "GitLab CI": GitLabIcon,
  Docker: DockerIcon,
  OpenTelemetry: OpenTelemetryIcon,
  Phoenix: PhoenixIcon,
  Prometheus: PrometheusIcon,
  Grafana: GrafanaIcon,
  Linux: LinuxIcon,
  AWS: AmazonWebServicesIcon,
  Git: GitIcon,
  Devin: DevinIcon,
  Windsurf: WindsurfIcon,
  Codex: CodexIcon,
  Opencode: OpenCodeIcon,
  "Claude Code": ClaudeCodeIcon,
  herdr: HerdrIcon,
};

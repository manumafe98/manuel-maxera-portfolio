import {
  AmazonWebServicesIcon,
  DockerIcon,
  GitIcon,
  GrafanaIcon,
  HardhatIcon,
  JavaIcon,
  JavaScriptIcon,
  LinuxIcon,
  PhpIcon,
  PrometheusIcon,
  PythonIcon,
  ReactIcon,
  SolidityIcon,
  SpringIcon,
  TailwindCssIcon,
  TypeScriptIcon,
} from "@/icons";
import type { ComponentType, SVGProps } from "react";

/** The logo of each skill that has one, by skill name. */
export const skillIcons: Record<
  string,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  Solidity: SolidityIcon,
  Hardhat: HardhatIcon,
  Java: JavaIcon,
  JavaScript: JavaScriptIcon,
  Python: PythonIcon,
  Spring: SpringIcon,
  React: ReactIcon,
  Tailwind: TailwindCssIcon,
  Grafana: GrafanaIcon,
  Docker: DockerIcon,
  Linux: LinuxIcon,
  AWS: AmazonWebServicesIcon,
  TypeScript: TypeScriptIcon,
  Git: GitIcon,
  Prometheus: PrometheusIcon,
  PHP: PhpIcon,
};

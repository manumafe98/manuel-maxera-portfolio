import { SVGProps } from "react";

interface MonogramProps extends SVGProps<SVGSVGElement> {
  letters: string;
  background: string;
  color: string;
}

/**
 * A rounded tile with a tool's initials in its brand colours, for the tools
 * svgl has no logo for.
 */
const Monogram = ({ letters, background, color, ...props }: MonogramProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
      <rect width="48" height="48" rx="11" fill={background} />
      <text
        x="24"
        y="25"
        dominantBaseline="middle"
        textAnchor="middle"
        fontFamily="Ubuntu, system-ui, sans-serif"
        fontSize="20"
        fontWeight="700"
        fill={color}
      >
        {letters}
      </text>
    </svg>
  );
};

export const FoundryIcon = (props: SVGProps<SVGSVGElement>) => (
  <Monogram letters="Fo" background="#e8b04a" color="#1f1f1f" {...props} />
);

export const LangGraphIcon = (props: SVGProps<SVGSVGElement>) => (
  <Monogram letters="LG" background="#1c3c3c" color="#7fc8ff" {...props} />
);

export const AwsBedrockIcon = (props: SVGProps<SVGSVGElement>) => (
  <Monogram letters="Br" background="#01a88d" color="#ffffff" {...props} />
);

export const ElasticsearchIcon = (props: SVGProps<SVGSVGElement>) => (
  <Monogram letters="Es" background="#00bfb3" color="#ffffff" {...props} />
);

export const CeleryIcon = (props: SVGProps<SVGSVGElement>) => (
  <Monogram letters="Ce" background="#37814a" color="#ffffff" {...props} />
);

export const OpenTelemetryIcon = (props: SVGProps<SVGSVGElement>) => (
  <Monogram letters="OT" background="#425cc7" color="#f5a800" {...props} />
);

export const PhoenixIcon = (props: SVGProps<SVGSVGElement>) => (
  <Monogram letters="Ph" background="#5b3fd1" color="#ffffff" {...props} />
);

export const DevinIcon = (props: SVGProps<SVGSVGElement>) => (
  <Monogram letters="Dv" background="#0f1c2e" color="#ffffff" {...props} />
);

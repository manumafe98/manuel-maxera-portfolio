import { Fragment, type ReactNode } from "react";

/**
 * Renders the small markdown subset the reply script writes: paragraphs,
 * "- " bullets, **bold**, *muted*, `code` and [links](url). An unclosed
 * **bold** still renders bold, so text can be shown while it streams.
 */
const inline = (text: string): ReactNode[] =>
  text
    .split(/(\*\*[^*]+\*\*|\*\*[^*]*$|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
    .map((part, index) => {
      if (!part) return null;
      if (part.startsWith("**"))
        return <strong key={index}>{part.replace(/\*\*/g, "")}</strong>;
      if (part.startsWith("*") && part.endsWith("*") && part.length > 1)
        return (
          <em key={index} className="cc-muted">
            {part.slice(1, -1)}
          </em>
        );
      if (part.startsWith("`") && part.endsWith("`"))
        return <code key={index}>{part.slice(1, -1)}</code>;
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link)
        return (
          <a key={index} href={link[2]} target="_blank" rel="noreferrer">
            {link[1]}
          </a>
        );
      return <Fragment key={index}>{part}</Fragment>;
    });

export const Markdown = ({ text }: { text: string }) => (
  <>
    {text.split(/\n\n+/).map((block, blockIndex) => {
      const out: ReactNode[] = [];
      let bullets: string[] = [];
      const flush = () => {
        if (bullets.length)
          out.push(
            <ul key={`list-${out.length}`}>
              {bullets.map((bullet, index) => (
                <li key={index}>{inline(bullet)}</li>
              ))}
            </ul>,
          );
        bullets = [];
      };
      block.split("\n").forEach((line, lineIndex) => {
        if (line.startsWith("- ")) bullets.push(line.slice(2));
        else {
          flush();
          out.push(<div key={`line-${lineIndex}`}>{inline(line)}</div>);
        }
      });
      flush();
      return (
        <div key={blockIndex} className="cc-block">
          {out}
        </div>
      );
    })}
  </>
);

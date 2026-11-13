import type { AnswerBlock } from "@/chat/replyScript";
import type { ReplyState } from "@/chat/replyState";
import type { ClaudeProjectId } from "@/content/portfolio";
import { useState, type MouseEvent } from "react";
import { LineIcon } from "./LineIcon";
import { Markdown } from "./Markdown";

const RESULT_PREVIEW_LINES = 6;

interface ReplyViewProps {
  reply: ReplyState;
  /** Called when the visitor clicks the reply while it's still streaming. */
  onSkip: () => void;
  onOpenClaudeProject: (id: ClaudeProjectId) => void;
}

/** Links inside a reply must not also trigger skip-to-end. */
const stopPropagation = (event: MouseEvent) => event.stopPropagation();

const AnswerBlockView = ({
  block,
  onOpenClaudeProject,
}: {
  block: AnswerBlock;
  onOpenClaudeProject: (id: ClaudeProjectId) => void;
}) => {
  switch (block.kind) {
    case "timeline":
      return (
        <ol className="cc-timeline" aria-label="Experience timeline">
          {block.roles.map((role) => (
            <li key={`${role.company}-${role.title}`}>
              <h3>
                {role.title} · {role.company}
              </h3>
              <div className="cc-muted">
                {role.dates} · {role.location}
              </div>
              <ul>
                {role.achievements.map((achievement) => (
                  <li key={achievement}>{achievement}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      );
    case "download-card":
      return (
        <a
          className="cc-download"
          href={block.href}
          download={block.fileName}
          onClick={stopPropagation}
        >
          <span className="cc-download-icon">
            <LineIcon name="file" />
          </span>
          <span className="cc-download-text">
            <span className="cc-download-name">{block.fileName}</span>
            <span className="cc-muted">PDF · Download</span>
          </span>
          <LineIcon name="download" />
        </a>
      );
    case "links":
      return (
        <ul className="cc-links">
          {block.links.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopPropagation}
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      );
    case "claude-project-link":
      return (
        <button
          className="cc-chip cc-project-link"
          onClick={(event) => {
            event.stopPropagation();
            onOpenClaudeProject(block.id);
          }}
        >
          Open {block.displayName}
        </button>
      );
  }
};

export const ReplyView = ({
  reply,
  onSkip,
  onOpenClaudeProject,
}: ReplyViewProps) => {
  const [thinkingOpen, setThinkingOpen] = useState(false);
  const [toolOpen, setToolOpen] = useState(true);
  const thinkingDone = reply.thinkingSeconds !== null;
  const resultLines = reply.tool?.result?.split("\n") ?? [];

  const toggle =
    (setOpen: (update: (open: boolean) => boolean) => void) =>
    (event: MouseEvent) => {
      event.stopPropagation();
      setOpen((open) => !open);
    };

  return (
    <article
      aria-label="Reply"
      aria-busy={!reply.done}
      className={`cc-reply ${reply.done ? "" : "is-running"}`}
      onClick={reply.done ? undefined : onSkip}
      title={reply.done ? undefined : "Click to skip to the end"}
    >
      {thinkingDone ? (
        <button
          className="cc-thought"
          aria-expanded={thinkingOpen}
          onClick={toggle(setThinkingOpen)}
        >
          Thought for {reply.thinkingSeconds}s
          <span className={`cc-chev ${thinkingOpen ? "is-open" : ""}`}>
            <LineIcon name="chevron" />
          </span>
        </button>
      ) : (
        <div className="cc-thinking-label cc-shimmer">Thinking…</div>
      )}
      {(!thinkingDone || thinkingOpen) && (
        <div className="cc-thinking-text">{reply.thinking}</div>
      )}

      {reply.skill && (
        <div className="cc-skill cc-mono">
          <span className="cc-dot is-done" />
          Skill({reply.skill})
          <span className="cc-muted">Successfully loaded skill</span>
        </div>
      )}

      {reply.tool && (
        <div className="cc-tool">
          <button
            className="cc-tool-head"
            aria-expanded={toolOpen}
            onClick={toggle(setToolOpen)}
          >
            <span
              className={`cc-dot ${reply.tool.result === null ? "is-running" : "is-done"}`}
            />
            <span className="cc-mono cc-tool-name">
              {reply.tool.name}({reply.tool.args})
            </span>
            <span className={`cc-chev ${toolOpen ? "is-open" : ""}`}>
              <LineIcon name="chevron" />
            </span>
          </button>
          {toolOpen && (
            <pre className="cc-tool-body cc-mono">
              {reply.tool.result === null ? (
                <span className="cc-shimmer">Running…</span>
              ) : (
                <>
                  {resultLines.slice(0, RESULT_PREVIEW_LINES).join("\n")}
                  {resultLines.length > RESULT_PREVIEW_LINES && (
                    <span className="cc-muted">
                      {"\n"}… +{resultLines.length - RESULT_PREVIEW_LINES} lines
                    </span>
                  )}
                </>
              )}
            </pre>
          )}
        </div>
      )}

      {reply.answer.length > 0 && (
        <div className="cc-answer">
          {reply.answer.map((part, index) =>
            part.type === "text" ? (
              <Markdown key={index} text={part.text} />
            ) : (
              <AnswerBlockView
                key={index}
                block={part.block}
                onOpenClaudeProject={onOpenClaudeProject}
              />
            ),
          )}
          {!reply.done && <span className="cc-caret" />}
        </div>
      )}
    </article>
  );
};

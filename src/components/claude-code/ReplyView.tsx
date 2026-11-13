import type { ReplyState } from "@/chat/replyState";
import { useState, type MouseEvent } from "react";
import { LineIcon } from "./LineIcon";
import { Markdown } from "./Markdown";

const RESULT_PREVIEW_LINES = 6;

interface ReplyViewProps {
  reply: ReplyState;
  /** Called when the visitor clicks the reply while it's still streaming. */
  onSkip: () => void;
}

export const ReplyView = ({ reply, onSkip }: ReplyViewProps) => {
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
              <a
                key={index}
                className="cc-download"
                href={part.block.href}
                download={part.block.fileName}
                onClick={(event) => event.stopPropagation()}
              >
                <span className="cc-download-icon">
                  <LineIcon name="file" />
                </span>
                <span className="cc-download-text">
                  <span className="cc-download-name">
                    {part.block.fileName}
                  </span>
                  <span className="cc-muted">PDF · Download</span>
                </span>
                <LineIcon name="download" />
              </a>
            ),
          )}
          {!reply.done && <span className="cc-caret" />}
        </div>
      )}
    </article>
  );
};

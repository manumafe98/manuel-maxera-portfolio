import { matchingCommands } from "@/chat/commandMenu";
import { replyTo, type ReplyStream } from "@/chat/replyScript";
import {
  applyReplyEvent,
  emptyReply,
  type ReplyState,
} from "@/chat/replyState";
import {
  claudeProjects,
  type AppWindowId,
  type ClaudeProject,
  type ClaudeProjectId,
} from "@/content/portfolio";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { LineIcon } from "./LineIcon";
import { Markdown } from "./Markdown";
import { ReplyView } from "./ReplyView";

type Message =
  | { id: number; kind: "user"; text: string }
  | { id: number; kind: "reply"; reply: ReplyState };

interface ChatProps {
  project: ClaudeProject;
  active: boolean;
  onOpenClaudeProject: (id: ClaudeProjectId) => void;
  /**
   * Opens the App window a Skill launches. Without it (phones), Skills show
   * their content as cards inside the reply instead.
   */
  onOpenApp?: (app: AppWindowId) => void;
}

/** The single scripted Chat of a Claude project. */
export const Chat = ({
  project,
  active,
  onOpenClaudeProject,
  onOpenApp,
}: ChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const streamRef = useRef<ReplyStream | null>(null);
  const nextId = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [menuDismissed, setMenuDismissed] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const menuId = useId();
  const optionId = (index: number) => `${menuId}-option-${index}`;

  const options =
    streaming || menuDismissed ? [] : matchingCommands(project, input);
  const menuOpen = options.length > 0;
  const activeOption = Math.min(highlighted, options.length - 1);

  useEffect(() => () => streamRef.current?.stop(), []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const run = async (text: string) => {
    if (streamRef.current || !text.trim()) return;
    const stream = replyTo(project.id, text, {
      skills: onOpenApp ? "windows" : "cards",
    });
    streamRef.current = stream;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      stream.skip();
    }
    const userId = nextId.current++;
    const replyId = nextId.current++;
    setStreaming(true);
    setInput("");
    setMessages((current) => [
      ...current,
      { id: userId, kind: "user", text: text.trim() },
      { id: replyId, kind: "reply", reply: emptyReply },
    ]);

    for await (const event of stream) {
      if (event.type === "open-app") onOpenApp?.(event.app);
      setMessages((current) =>
        current.map((message) =>
          message.id === replyId && message.kind === "reply"
            ? { ...message, reply: applyReplyEvent(message.reply, event) }
            : message,
        ),
      );
    }

    streamRef.current = null;
    setStreaming(false);
    setTimeout(() => inputRef.current?.focus());
  };

  const changeInput = (value: string) => {
    setInput(value);
    setHighlighted(0);
    setMenuDismissed(false);
  };

  const onMenuKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!menuOpen) return;
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (step) {
      event.preventDefault();
      setHighlighted((activeOption + step + options.length) % options.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(options[activeOption].name);
    } else if (event.key === "Tab") {
      event.preventDefault();
      changeInput(options[activeOption].name);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setMenuDismissed(true);
    }
  };

  const links = (project.links ?? []).flatMap(
    (id) => claudeProjects.find((p) => p.id === id) ?? [],
  );

  return (
    <section aria-label={project.title} hidden={!active} className="cc-chat">
      <header className="cc-chat-head">
        <h2>{project.title}</h2>
        <span className="cc-muted">· {project.id}</span>
      </header>
      <div className="cc-messages" ref={listRef}>
        <div className="cc-column">
          <div className="cc-answer">
            <Markdown text={project.intro} />
            <div className="cc-block">
              <div>Commands I understand:</div>
              <ul>
                {project.commands.map((command) => (
                  <li key={command.name}>
                    <code>{command.name}</code>: {command.description}
                  </li>
                ))}
              </ul>
            </div>
            {links.length > 0 && (
              <div className="cc-block">
                <div>Claude projects:</div>
                <ul>
                  {links.map((link) => (
                    <li key={link.id}>
                      <button
                        className="cc-link"
                        onClick={() => onOpenClaudeProject(link.id)}
                      >
                        {link.id}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="cc-block">
              Click a chip below or type a Command.
            </div>
          </div>
          {messages.map((message) =>
            message.kind === "user" ? (
              <div key={message.id} className="cc-user-msg">
                {message.text}
              </div>
            ) : (
              <ReplyView
                key={message.id}
                reply={message.reply}
                onSkip={() => streamRef.current?.skip()}
                onOpenClaudeProject={onOpenClaudeProject}
              />
            ),
          )}
        </div>
      </div>
      <div className="cc-bottom">
        <div className="cc-column">
          <div className="cc-chips">
            {project.chips.map((chip) => (
              <button
                key={chip}
                className="cc-chip"
                disabled={streaming}
                onClick={() => run(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
          <form
            className="cc-composer"
            onSubmit={(event) => {
              event.preventDefault();
              run(input);
            }}
          >
            {menuOpen && (
              <ul
                id={menuId}
                role="listbox"
                aria-label="Commands"
                className="cc-menu"
              >
                {options.map((command, index) => (
                  <li
                    key={command.name}
                    id={optionId(index)}
                    role="option"
                    aria-selected={index === activeOption}
                    className="cc-menu-option"
                    // Keep focus in the input so the keyboard keeps working.
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setHighlighted(index)}
                    onClick={() => run(command.name)}
                  >
                    <code>{command.name}</code>{" "}
                    <span className="cc-muted">{command.description}</span>
                  </li>
                ))}
              </ul>
            )}
            <input
              ref={inputRef}
              role="combobox"
              aria-label="Message"
              aria-autocomplete="list"
              aria-controls={menuId}
              aria-expanded={menuOpen}
              aria-activedescendant={
                menuOpen ? optionId(activeOption) : undefined
              }
              autoComplete="off"
              value={input}
              disabled={streaming}
              onChange={(event) => changeInput(event.target.value)}
              onKeyDown={onMenuKey}
              placeholder="Type / for commands. Replies are scripted, no live model."
            />
            <div className="cc-composer-row">
              <span className="cc-icon-btn" aria-hidden="true">
                <LineIcon name="plus" />
              </span>
              <button
                type="submit"
                className={`cc-send ${input.trim() && !streaming ? "is-ready" : ""}`}
                aria-label="Send"
                disabled={streaming}
              >
                <LineIcon name="up" />
              </button>
            </div>
          </form>
          <div className="cc-footer" aria-hidden="true">
            <span className="cc-foot-chip">
              <LineIcon name="folder" />
              {project.id}
            </span>
            <span className="cc-foot-chip">
              Opus 5.5 <LineIcon name="down" />
            </span>
            <span className="cc-foot-chip">
              Auto <LineIcon name="down" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

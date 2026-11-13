import {
  claudeProjects,
  type AppWindowId,
  type ClaudeProjectId,
} from "@/content/portfolio";
import { ClaudeCodeIcon } from "@/icons";
import type { WindowProps } from "@/types/window.types";
import { useState } from "react";
import { CloseWindowButton } from "../CloseWindowButton";
import { Chat } from "./Chat";
import "./claude-code.css";
import { LineIcon } from "./LineIcon";

interface ClaudeCodeWindowProps extends WindowProps {
  /** Opens or focuses the App window a Skill launches. */
  onOpenApp: (app: AppWindowId) => void;
}

/** The simulated Claude Code app: a sidebar of Claude projects and their Chats. */
export const ClaudeCodeWindow = ({
  open,
  zIndex,
  onClose,
  onFocus,
  onOpenApp,
}: ClaudeCodeWindowProps) => {
  const [activeId, setActiveId] = useState<ClaudeProjectId>(
    claudeProjects[0].id,
  );
  const [folded, setFolded] = useState<ReadonlySet<ClaudeProjectId>>(new Set());

  const toggleFolded = (id: ClaudeProjectId) =>
    setFolded((current) => {
      const next = new Set(current);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  return (
    <dialog
      open={open}
      style={{ zIndex }}
      onPointerDown={onFocus}
      aria-label="Claude Code"
      className="window-frame cc-window"
    >
      <header className="cc-titlebar">
        {/* The page's first heading in the raw HTML: the Chat titles below
            are H2s under it, so heading levels stay sequential. */}
        <h1 className="cc-title">
          <ClaudeCodeIcon width={16} height={16} aria-hidden="true" />
          Claude Code
        </h1>
        <CloseWindowButton
          onClose={onClose}
          className="bg-gray-50/10 hover:bg-gray-50/20"
          label="Close Claude Code"
        />
      </header>
      <div className="cc-body">
        <aside className="cc-sidebar">
          <div className="cc-nav" aria-hidden="true">
            <span className="cc-nav-item">
              <LineIcon name="plus" />
              New
            </span>
            <span className="cc-nav-item">
              <LineIcon name="search" />
              Search
            </span>
            <span className="cc-nav-item">
              <LineIcon name="artifacts" />
              Artifacts
            </span>
            <span className="cc-nav-item">
              <LineIcon name="customize" />
              Customize
            </span>
          </div>
          <nav aria-label="Claude projects" className="cc-projects">
            <ul>
              {claudeProjects.map((project) => {
                const open = !folded.has(project.id);
                const chatsId = `cc-chats-${project.id}`;
                return (
                  <li key={project.id}>
                    <button
                      className="cc-project"
                      aria-expanded={open}
                      aria-controls={chatsId}
                      onClick={() => toggleFolded(project.id)}
                    >
                      <span className={open ? "cc-chev is-open" : "cc-chev"}>
                        <LineIcon name="chevron" />
                      </span>
                      {project.id}
                    </button>
                    <div id={chatsId} hidden={!open}>
                      <button
                        className="cc-chat-link"
                        aria-current={
                          project.id === activeId ? "page" : undefined
                        }
                        onClick={() => setActiveId(project.id)}
                        title={project.title}
                      >
                        <span className="cc-chat-title">{project.title}</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="cc-user" aria-hidden="true">
            <span className="cc-avatar">M</span>
            <span>Manuel</span>
            <span className="cc-muted">· Pro</span>
          </div>
        </aside>
        <main className="cc-main">
          {claudeProjects.map((project) => (
            <Chat
              key={project.id}
              project={project}
              active={project.id === activeId}
              onOpenClaudeProject={setActiveId}
              onOpenApp={onOpenApp}
            />
          ))}
        </main>
      </div>
    </dialog>
  );
};

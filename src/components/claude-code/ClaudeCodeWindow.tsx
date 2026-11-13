import {
  claudeProjects,
  type AppId,
  type ClaudeProjectId,
} from "@/content/portfolio";
import { ClaudeCodeIcon } from "@/icons";
import type { DialogProps } from "@/types/dialog.types";
import { useState } from "react";
import { CloseDialog } from "../CloseDialog";
import { Chat } from "./Chat";
import "./claude-code.css";
import { LineIcon } from "./LineIcon";

interface ClaudeCodeWindowProps extends DialogProps {
  /** Opens or focuses the App window a Skill launches. */
  onOpenApp: (app: AppId) => void;
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

  return (
    <dialog
      open={open}
      style={{ zIndex }}
      onPointerDown={onFocus}
      aria-label="Claude Code"
      className="dialog-container cc-window"
    >
      <header className="cc-titlebar">
        <div className="cc-title">
          <ClaudeCodeIcon width={16} height={16} aria-hidden="true" />
          Claude Code
        </div>
        <CloseDialog
          closeDialog={() => onClose()}
          buttonExtraStyles="bg-gray-50/10 hover:bg-gray-50/20"
          svgCustomStyle={undefined}
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
              {claudeProjects.map((project) => (
                <li key={project.id}>
                  <div className="cc-project">
                    <span className="cc-chev is-open">
                      <LineIcon name="chevron" />
                    </span>
                    {project.id}
                  </div>
                  <button
                    className="cc-chat-link"
                    aria-current={project.id === activeId ? "page" : undefined}
                    onClick={() => setActiveId(project.id)}
                  >
                    {project.displayName}
                  </button>
                </li>
              ))}
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

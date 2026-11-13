import { claudeProjects, type ClaudeProjectId } from "@/content/portfolio";
import { ClaudeCodeIcon } from "@/icons";
import { useEffect, useRef, useState } from "react";
import { Chat } from "./Chat";
import "./claude-code.css";
import { LineIcon } from "./LineIcon";
import "./phone.css";

/**
 * Skills show their content as inline cards on phones (#16). Until then a
 * Skill leaves only its one-line summary and opens no App window.
 */
const ignoreOpenApp = () => {};

/** Claude Code on phones, modeled on the Claude mobile app. */
export const PhoneClaudeCode = () => {
  const [activeId, setActiveId] = useState<ClaudeProjectId>(
    claudeProjects[0].id,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const active = claudeProjects.find((project) => project.id === activeId)!;

  useEffect(() => {
    if (drawerOpen) {
      drawerRef.current
        ?.querySelector<HTMLElement>("[aria-current='page']")
        ?.focus();
    } else if (wasOpen.current) {
      menuButtonRef.current?.focus();
    }
    wasOpen.current = drawerOpen;
  }, [drawerOpen]);

  const openChat = (id: ClaudeProjectId) => {
    setActiveId(id);
    setDrawerOpen(false);
  };

  return (
    <div className="cc-theme ph-shell">
      <div className="ph-app" inert={drawerOpen}>
        <header className="ph-header">
          <button
            ref={menuButtonRef}
            className="ph-icon-btn"
            aria-label="Open Chats"
            aria-expanded={drawerOpen}
            aria-controls="ph-drawer"
            onClick={() => setDrawerOpen(true)}
          >
            <LineIcon name="menu" />
          </button>
          <h1 className="ph-title">{active.title}</h1>
          <span className="ph-icon-btn" aria-hidden="true" />
        </header>
        <main className="ph-main">
          {claudeProjects.map((project) => (
            <Chat
              key={project.id}
              project={project}
              active={project.id === activeId}
              onOpenClaudeProject={setActiveId}
              onOpenApp={ignoreOpenApp}
            />
          ))}
        </main>
      </div>
      <div
        className={`ph-overlay ${drawerOpen ? "is-open" : ""}`}
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
      />
      <div
        id="ph-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ph-drawer-heading"
        className={`ph-drawer ${drawerOpen ? "is-open" : ""}`}
        inert={!drawerOpen}
        onKeyDown={(event) => {
          if (event.key === "Escape") setDrawerOpen(false);
        }}
      >
        <h2 id="ph-drawer-heading" className="ph-drawer-heading">
          <ClaudeCodeIcon width={26} height={26} aria-hidden="true" />
          Claude Code
        </h2>
        <nav aria-labelledby="ph-recents" className="ph-recents">
          <h3 id="ph-recents" className="ph-section">
            Recents
          </h3>
          <ul>
            {claudeProjects.map((project) => (
              <li key={project.id}>
                <button
                  className="ph-recent"
                  aria-current={project.id === activeId ? "page" : undefined}
                  onClick={() => openChat(project.id)}
                >
                  <LineIcon name="chat" />
                  <span className="cc-chat-title">{project.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ph-user" aria-hidden="true">
          <span className="cc-avatar">M</span>
          <span>Manuel</span>
        </div>
      </div>
    </div>
  );
};

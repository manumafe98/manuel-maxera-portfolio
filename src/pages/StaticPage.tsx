import "@/components/claude-code/claude-code.css";
import type { ReactNode } from "react";

interface StaticPageProps {
  /** Small line shown above the heading, such as "404". */
  eyebrow?: string;
  heading: string;
  children: ReactNode;
}

/** A plain text page in the Claude Code palette, with a link home. */
export const StaticPage = ({ eyebrow, heading, children }: StaticPageProps) => (
  <div className="cc-theme min-h-screen bg-(--cc-bg) text-(--cc-text) font-sans flex items-center justify-center px-6 py-16">
    <main className="max-w-xl w-full">
      {eyebrow && (
        <p className="font-mono text-sm text-(--cc-accent) mb-3">{eyebrow}</p>
      )}
      <h1 className="text-3xl font-semibold mb-4">{heading}</h1>
      <div className="text-(--cc-muted) leading-relaxed space-y-4">
        {children}
      </div>
      <a
        href="/"
        className="inline-block mt-8 rounded-lg border border-(--cc-border) bg-(--cc-raised) px-4 py-2 text-sm hover:border-(--cc-accent) focus-visible:outline-2 focus-visible:outline-(--cc-accent)"
      >
        ← Back home
      </a>
    </main>
  </div>
);

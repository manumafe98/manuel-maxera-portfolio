import { Component, type ReactNode } from "react";

/** The message a failed lazy chunk leaves in place of its content. */
export const LoadError = () => (
  <p role="alert">
    Couldn't load this. <a href="">Reload the page</a>
  </p>
);

interface LoadErrorBoundaryProps {
  children: ReactNode;
  /** Shown instead of the children once they throw. */
  fallback: ReactNode;
}

/**
 * Keeps a failed lazy App window or Skill card (a weak network, or an old tab
 * after a new deploy) inside its own window or card, instead of blanking the
 * whole page.
 */
export class LoadErrorBoundary extends Component<
  LoadErrorBoundaryProps,
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

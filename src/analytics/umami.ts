/**
 * Custom events for Umami Cloud, which every page loads (see site.analytics
 * in the content module). The script defines window.umami once it loads; when
 * it hasn't, or it's blocked, events are dropped.
 */
declare global {
  interface Window {
    umami?: { track: (event: string) => void };
  }
}

/** The call-to-action Commands, the only ones that send an event. */
const callToActionCommands = ["/open-contact", "/download-cv", "/socials"];

/**
 * Records that a Chat ran `command` (already normalized), as an event named
 * after it, such as "command-open-contact". Other Commands send nothing.
 */
export const trackCommand = (command: string) => {
  if (!callToActionCommands.includes(command)) return;
  window.umami?.track(`command-${command.slice(1)}`);
};

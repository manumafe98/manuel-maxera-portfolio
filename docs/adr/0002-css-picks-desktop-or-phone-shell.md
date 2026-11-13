# CSS, not JavaScript, chooses the Desktop or phone shell

The pre-rendered HTML can't know the screen size, so it contains both outer frames: the Ubuntu Desktop and the phone Claude Code layout. A media query at 1024px shows one of them. The Chats are shared components, so only the frames are duplicated. Picking the layout in JavaScript after load would make phones flash the desktop first (layout shift). Server-side user-agent detection would need a server, would break static caching, and guesses wrong on resized windows.

## Consequences

- Never branch on `window.innerWidth` or `matchMedia` to decide what to render. Doing so causes hydration mismatches.
- Heavy assets that belong to one shell must not load in the other. The wallpaper is a CSS background inside the desktop media query. App windows and EmailJS load only when a Skill opens them.

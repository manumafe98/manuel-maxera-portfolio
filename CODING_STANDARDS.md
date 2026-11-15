# Coding standards

The judgement rules that `/code-review` and agents check. Lint and Prettier cover the mechanical ones.

## Tests

- No tautological tests. A test must be able to fail when the behaviour it covers breaks, so don't assert what the test itself just set up, or restate the implementation.
- Every test name states the behaviour it checks, such as "opens the Files App window when the Skill runs", not "works" or "renders".
- A feature gets broad coverage of its real behaviour: what a visitor does and sees, its edge cases, and both the Desktop and the phone layout when it appears in both.

## Names

Code, copy and test names use the terms in `GLOSSARY.md` (Desktop, Top bar, App window, Claude project, Chat, Command, Skill, Tech skill) and avoid the words each entry lists under _Avoid_.

## Shared markup

Markup used by both the Desktop and the phone layout lives in one shared component, as the Chats do. Only the frames around it differ.

## Layout choice

Never pick what to render from the window width (ADR-0002). CSS chooses the Desktop or phone layout. ESLint rejects `window.innerWidth` and `matchMedia`; a media query about something other than width, such as `prefers-reduced-motion`, needs an `eslint-disable-next-line` comment saying why.

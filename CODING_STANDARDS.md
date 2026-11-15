# Coding standards

The judgement rules that `/code-review` and agents check. Lint and Prettier cover the mechanical ones.

## Tests

- No tautological tests. A test must be able to fail when the behaviour it covers breaks, so don't assert what the test itself just set up, or restate the implementation.
- Every test name states the behaviour it checks, such as "opens the Files window when the Skill runs", not "works" or "renders".
- A feature gets broad coverage of its real behaviour: what a visitor does and sees, its edge cases, and both the Desktop and the Phone layout when it appears in both.

## Names

Code, copy and test names use the terms in `GLOSSARY.md` and avoid the words each entry lists under _Avoid_. When a concept has no glossary term yet, add one rather than inventing a name in code.

## Shared markup

Markup used by both the Desktop and the Phone layout lives in one shared component, as the Chats do. Only the frames around it differ.

## Layout choice

Follow [ADR-0002](docs/adr/0002-css-picks-desktop-or-phone-shell.md): never branch on `innerWidth` or `matchMedia` to decide what to render. CSS chooses the Desktop or the Phone layout. ESLint catches the common forms, but not every one (such as `screen.width`), so reviews still check for it. The only allowed `matchMedia` use is a user preference that changes motion, not markup, such as `prefers-reduced-motion`. It needs an `eslint-disable-next-line` comment saying why.

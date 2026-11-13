# One Edge Function serves Markdown to agents that ask for it

The site is pre-rendered static HTML (ADR-0001). is-agentic.com counts Markdown content negotiation as an essential check: a request to `/` with `Accept: text/markdown` must get a Markdown body with `Content-Type: text/markdown` and `Vary: Accept`, and an unknown path must return a Markdown 404 body under the same header. A static host can't vary its response by the `Accept` header, so we add one small Netlify Edge Function. It returns build-generated Markdown when the request prefers `text/markdown`, and otherwise passes the request through to the static files unchanged. The Markdown is generated from the content module at build time, so the function holds no content of its own.

## Considered Options

- **A separate `.md` URL or `llms.txt` only:** this doesn't satisfy the check, which tests `/` itself.
- **Moving to server rendering:** it gives the same result as one tiny function, at the cost of the whole static setup.

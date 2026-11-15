# The site is a personal portfolio, not an API product

is-agentic.com scores sites for agent readiness, and some of its checks assume a product that agents call: "developer resource discoverability" looks for API docs and SDKs, and "MCP server / manifest" looks for an MCP server to connect to. This site is Manuel's personal portfolio. An agent's jobs here are to read about him and to email him, and `llms.txt` (with the same Markdown at `/`, ADR-0003) already covers both. Its "When to use this" section says so, and says the site has no API, no MCP server and no booking. So we decline those two findings rather than publish empty docs or a server with nothing to serve.

The scan's "Organization schema completeness" finding is met on the Person: the JSON-LD is a `ProfilePage` whose `mainEntity` Person has a `contactPoint` with Manuel's email. We deliberately don't fill in the employer Organization (Avature) in `worksFor` with an address, logo or contactPoint. That would publish Avature's details under Manuel's name, as if he spoke for the company.

Revisit this only if a portfolio MCP server is built. Then the MCP manifest finding applies.

## Considered Options

- **A stub API or OpenAPI document:** there is no data to serve that `llms.txt` doesn't already hold, so it would exist only for the score.
- **A full Organization for Avature:** it would pass the check, but with details that aren't Manuel's to publish.

# Agents

## Verification

Run `npm run check` before opening a pull request. It runs lint, Prettier, unit tests and end-to-end tests, and CI runs the same command. Never commit on `main`: the pre-commit hook in `.githooks/` refuses it, so work on a branch.

## Agent skills

### Issue tracker

Issues and specs live in this repo's GitHub Issues, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

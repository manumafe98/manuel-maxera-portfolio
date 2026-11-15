# Agents

## Verification

Run `npm run check` before opening a pull request. It is the full verification, and CI runs the same command. Never commit on `main`: the pre-commit hook in `.githooks/` refuses it, so work on a branch.

## Coding standards

Follow [`CODING_STANDARDS.md`](CODING_STANDARDS.md). `/code-review` checks each pull request against it before Manuel reviews it.

## Agent skills

### Issue tracker

Issues and specs live in this repo's GitHub Issues, managed with the `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `GLOSSARY.md` and `docs/adr/` at the repo root. See `docs/agents/domain.md`.

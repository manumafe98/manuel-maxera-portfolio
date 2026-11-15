// Runs as the npm `prepare` script: points git at .githooks so the
// pre-commit hook refuses commits on main. Does nothing where there is no
// git or no repository (Netlify, `npm ci` from a tarball), so it never fails.
import { execFileSync } from "node:child_process";

try {
  execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
    stdio: "ignore",
  });
} catch {
  // No git, or not a repository: skip.
}

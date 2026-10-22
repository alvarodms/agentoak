#!/usr/bin/env bash
# Installs the human-only developer skills in dev-skills/ into the user skills dir.
# Runs only in Claude Code cloud sessions, never in the Agent Oak runner on GitHub Actions,
# so the autonomous agent never loads these skills.
set -euo pipefail

[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0
[ -z "${GITHUB_ACTIONS:-}" ] || exit 0

src="${CLAUDE_PROJECT_DIR:-$(pwd)}/dev-skills/mattpocock"
dest="$HOME/.claude/skills"
mkdir -p "$dest"

for dir in "$src"/*/; do
  name="$(basename "$dir")"
  rm -rf "${dest:?}/$name"
  cp -r "$dir" "$dest/$name"
done

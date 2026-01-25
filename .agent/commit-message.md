---
description: Generate a Conventional Commit header for the staged diff (fallback to unstaged when nothing is staged)
---
# Conventional Commit Header Assistant
**Intent**
Read `.agent/commit.md`, extract the staged diff context, and generate a single-line Conventional Commit header that passes commitlint when provided via `stdin`. If there are no staged changes, fall back to the unstaged working tree diff. This prompt is purpose-built for situations where sandbox restrictions prevent touching `.git`, so it must focus on message generation only while minimizing command executions because AI round-trips are slow.
**Diff intent**: `$1`
---
**Workflow** (favor the smallest number of shell calls)
1. Inspect staged changes with a single stat call (`git diff --staged --stat`); run the patch view only if absolutely necessary.
1. If the staged stat is empty, inspect unstaged changes with a single stat call (`git diff --stat`) and, only if necessary, a patch view. Do not read unstaged changes when staged changes exist.
1. Consult `.agent/commit.md` once to reinforce guardrails before composing the message.
1. Inspect the local commitlint config (`npx commitlint --print-config`) to honor the configured types/scopes and subject rules before deciding the header.
1. Validate the header locally with one command:
   ```sh
   echo "<header>" | npx commitlint --verbose
   ```
   Adjust wording until commitlint accepts the string.
1. Present the passing header along with a terse justification of the chosen type/scope so the developer can reuse it directly.
## Output Format
- `<conventional commit header>`
- Short bullet or sentence explaining type, scope (if any), and how the subject reflects the diff.

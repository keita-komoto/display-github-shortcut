#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

pnpm tsc
pnpm lint
pnpm test
pnpm --filter github-shortcut-badges run typecheck
pnpm --filter github-shortcut-badges run test
pnpm --filter github-shortcut-badges run build

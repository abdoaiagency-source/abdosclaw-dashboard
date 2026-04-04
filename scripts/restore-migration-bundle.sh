#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 /path/to/abdosclaw-dashboard-YYYYMMDD-HHMMSS.tar.gz"
  exit 1
fi

ARCHIVE="$1"
RESTORE_ROOT="${RESTORE_ROOT:-$PWD/restore-output}"
mkdir -p "$RESTORE_ROOT"

tar -xzf "$ARCHIVE" -C "$RESTORE_ROOT"
echo "Bundle extracted under: $RESTORE_ROOT"
echo "Next steps:"
echo "1. Clone the GitHub repo on the target VPS"
echo "2. Restore backend.env.snapshot into .env if appropriate"
echo "3. Run npm ci && npm run build"
echo "4. Start PM2 with ecosystem.config.cjs"
echo "5. Recreate nginx and SSL settings"

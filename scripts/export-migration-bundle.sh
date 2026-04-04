#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/data/.openclaw/apps/abdosclaw-dashboard}"
OUT_DIR="${OUT_DIR:-$PWD/migration-bundles}"
STAMP="$(date +%Y%m%d-%H%M%S)"
BUNDLE_DIR="$OUT_DIR/abdosclaw-dashboard-$STAMP"
mkdir -p "$BUNDLE_DIR"

cp "$APP_DIR/ecosystem.config.cjs" "$BUNDLE_DIR/" 2>/dev/null || true
cp "$APP_DIR/package.json" "$BUNDLE_DIR/" 2>/dev/null || true
cp "$APP_DIR/package-lock.json" "$BUNDLE_DIR/" 2>/dev/null || true
cp "$APP_DIR/.env" "$BUNDLE_DIR/backend.env.snapshot" 2>/dev/null || true

pm2 jlist > "$BUNDLE_DIR/pm2.processes.json" 2>/dev/null || true

git -C "$APP_DIR" rev-parse HEAD > "$BUNDLE_DIR/current_commit.txt" 2>/dev/null || true
git -C "$APP_DIR" remote -v > "$BUNDLE_DIR/git_remote.txt" 2>/dev/null || true

if [ -d /etc/nginx/sites-available ]; then
  cp -r /etc/nginx/sites-available "$BUNDLE_DIR/nginx-sites-available" 2>/dev/null || true
fi
if [ -d /etc/nginx/sites-enabled ]; then
  cp -r /etc/nginx/sites-enabled "$BUNDLE_DIR/nginx-sites-enabled" 2>/dev/null || true
fi

tar -czf "$OUT_DIR/abdosclaw-dashboard-$STAMP.tar.gz" -C "$OUT_DIR" "abdosclaw-dashboard-$STAMP"
echo "Created migration bundle: $OUT_DIR/abdosclaw-dashboard-$STAMP.tar.gz"

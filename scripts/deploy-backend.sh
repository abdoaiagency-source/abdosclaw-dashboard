#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/abdosclaw-dashboard}"
BRANCH="${BRANCH:-main}"
PM2_APP_NAME="${PM2_APP_NAME:-abdosclaw-dashboard-bridge}"

if [ ! -d "$APP_DIR/.git" ]; then
  echo "Missing git repo at $APP_DIR"
  exit 1
fi

cd "$APP_DIR"

echo "[deploy] Fetching latest code..."
git fetch origin

echo "[deploy] Checking out ${BRANCH}..."
git checkout "$BRANCH"
git reset --hard "origin/$BRANCH"

echo "[deploy] Installing dependencies..."
npm ci

echo "[deploy] Building frontend..."
npm run build

echo "[deploy] Restarting PM2 app..."
pm2 startOrReload ecosystem.config.cjs --only "$PM2_APP_NAME"
pm2 save

echo "[deploy] Done."

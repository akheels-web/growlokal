#!/usr/bin/env bash
# Nightly Postgres backup -> offsite (Backblaze B2 / Cloudflare R2 via rclone).
# Cron on the VPS itself (NOT the home lab — the VPS's Postgres is bound to
# 127.0.0.1 only, per infra/docker-compose.prod.yml, so nothing outside the
# VPS can reach it over the network; pulling from the home lab across the
# internet was never actually reachable with a LAN-style PG_HOST default like
# this script used to have — see docs/BUG.md 2026-08-18):
#   0 2 * * *  /opt/scripts/backup.sh
# An UNTESTED backup is not a backup — restore-test it once (see DEPLOYMENT.md).
set -euo pipefail

PG_HOST="${PG_HOST:-127.0.0.1}"
PG_USER="${PG_USER:-growlokal}"
REMOTE="${RCLONE_REMOTE:-b2:growlokal-backups}"   # configure rclone first
STAMP="$(date +%F_%H%M)"
TMP="/tmp/growlokal-db-${STAMP}.sql.gz"

echo "[backup] dumping…"
PGPASSWORD="${PG_PASSWORD:?set PG_PASSWORD}" pg_dumpall -h "$PG_HOST" -U "$PG_USER" | gzip > "$TMP"

echo "[backup] uploading to ${REMOTE}…"
rclone copy "$TMP" "$REMOTE/"

echo "[backup] pruning local dumps older than 3 days…"
find /tmp -name 'growlokal-db-*.sql.gz' -mtime +3 -delete

echo "[backup] done: ${TMP}"
# TODO: also set a lifecycle rule on the bucket to keep ~30 daily / 12 monthly.

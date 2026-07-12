#!/usr/bin/env bash
# Nightly Postgres backup -> offsite (Backblaze B2 / Cloudflare R2 via rclone).
# Cron on the Proxmox host: 0 2 * * *  /opt/scripts/backup.sh
# An UNTESTED backup is not a backup — restore-test it once (see §6 of the guide).
set -euo pipefail

PG_HOST="${PG_HOST:-10.0.0.10}"
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

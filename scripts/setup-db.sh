#!/bin/bash
set -e

# Always run from the kiasusaver app directory
cd "$(dirname "$0")/../src/apps/kiasusaver"

DB_NAME=${1:-kiasu-saver-local}
ENV=${2:-local} # pass 'prod', 'dev', or 'stg' for remote environments

# Determine if --remote flag is needed
REMOTE=""
if [[ "$ENV" == "dev" || "$ENV" == "stg" || "$ENV" == "prod" ]]; then
  REMOTE="--remote"
fi

# Create local D1 DB if it doesn't exist (skip for remote)
if [[ -z "$REMOTE" ]]; then
  npx wrangler d1 create $DB_NAME || true
fi

# Ensure the migrations table exists
npx wrangler d1 execute $DB_NAME $REMOTE --command "CREATE TABLE IF NOT EXISTS migrations (filename TEXT PRIMARY KEY, applied_at DATETIME DEFAULT CURRENT_TIMESTAMP);"

# Run migrations
for f in migrations/*.sql; do
  # Skip seed files in prod
  if [[ "$ENV" == "prod" && "$f" == *_seed.sql ]]; then
    echo "Skipping seed migration in prod: $f"
    continue
  fi

  # Check if migration already applied
  echo "Checking if migration already applied: $(basename $f)"
  APPLIED_JSON=$(npx wrangler d1 execute $DB_NAME $REMOTE --json --command "SELECT 1 FROM migrations WHERE filename = '$(basename $f)';")
  echo "$APPLIED_JSON"
  APPLIED=$(echo "$APPLIED_JSON" | jq '.[] | .results | length')
  echo "APPLIED value: $APPLIED for migration: $(basename $f)"
  if [[ "$APPLIED" -eq 0 ]]; then
    echo "Running migration: $f"
    npx wrangler d1 execute $DB_NAME $REMOTE --file="$f"
    npx wrangler d1 execute $DB_NAME $REMOTE --command "INSERT INTO migrations (filename) VALUES ('$(basename $f)');"
  else
    echo "Skipping already applied migration: $f"
  fi
 done

echo "Migrations complete for $DB_NAME ($ENV)"

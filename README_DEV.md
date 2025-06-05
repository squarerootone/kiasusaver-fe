# Local Development Setup

## 1. Install dependencies
```
pnpm install
```

## 2. Set up the local database
```
pnpm --filter ./src/apps/kiasusaver setup:db
```

## 3. Start the dev server
```
pnpm dev
```

## 4. Browse your local DB
- Open `.wrangler/state/v3/d1/<db-uuid>/db.sqlite3` in VS Code.
- Use the "SQLite" VS Code extension (pre-installed in the devcontainer).

---

# Environment Notes
- Local dev uses a local SQLite DB (not synced to remote).
- Remote dev/stg/prod use Cloudflare D1 (see `wrangler.toml` for bindings).
- No need to manually set DB pointers; Wrangler handles this per environment.

---

# Migration & Seed Data
- **Schema migrations** (e.g. `001_init.sql`) should run in all environments.
- **Seed/test data** (e.g. `002_seed.sql`) should **NOT** run in production.
- To prevent seed data in prod, use a naming convention or a migration runner script that skips seed files when `NODE_ENV=production` or similar.

---

# CI/CD & Migrations
- Use GitHub Actions or similar to run migrations on remote dev/stg/prod as part of your deployment pipeline.
- Only run schema migrations in prod.
- Example: `npx wrangler d1 execute <db-name> --file=migrations/001_init.sql --remote`

---

# Troubleshooting SQLite Extension
- If you see errors about missing SQLite command, ensure `sqlite3` is installed in the devcontainer (already handled in setup).
- If issues persist, try the alternative extension `ms-ossdata.vscode-sqlite` (also pre-installed).

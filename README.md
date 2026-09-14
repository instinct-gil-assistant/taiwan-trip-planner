# Taiwan Trip Planner

מתכנן טיול משותף, mobile-first ו-RTL עבור גיל ודנה.

## Live
https://instinct-gil-assistant.github.io/taiwan-trip-planner/

## Architecture
- Static UI: GitHub Pages, free, deployed from `main` / root.
- Datastore: Neon Free Postgres, project `taiwan-trip-planner` (`jolly-dawn-59684248`), production branch.
- API: Neon Function `tripplanner`; invocation URL is configured in `index.html`.
- Agent credentials are stored in Vault entries `Neon (agent)` and `Neon API (agent)`. The shared trip API secret is stored as `Taiwan planner shared secret`.
- The stable datastore is one `trip_state` row containing versioned JSON. UI structure can change without dropping data.
- The UI provides JSON export. Neon also provides Backup & Restore/history.

## Deploy UI changes
1. Edit `index.html` without replacing the current API URL/secret configuration.
2. Commit to `main`; GitHub Pages redeploys automatically.
3. Verify on a mobile viewport and test an edit from two separate browser sessions.

## Deploy backend changes
1. Install the Neon CLI: `npm i -g neon`.
2. Use the API key stored in Vault as `NEON_API_KEY`.
3. The function project files are in `backend/`.
4. Deploy with:
   `neon function deploy tripplanner --project-id jolly-dawn-59684248 --branch production --src backend/index.js --runtime nodejs24 --env TRIP_SECRET=<vault-secret> --env DATABASE_URL=<connection-string> --wait`

## Data-safe changes
- Do not drop `trip_state` or overwrite the stored JSON during a UI migration.
- Keep `data.version`; write a migration that transforms old versions and preserves unknown fields.
- Export JSON before structural changes.
- After every change, test read, edit, cross-client refresh, and export.

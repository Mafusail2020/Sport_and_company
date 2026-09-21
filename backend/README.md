# Sport&Company — backend

Minimal Express API with a single route, `POST /api/contact`, backing the
site's contact form. This is a **fully-stubbed local backend** (per user
decision — see `../CLAUDE.md`): it validates, sanitizes, and rate-limits
submissions, and logs them locally. It does not send real email and needs
no provider credentials to work.

## Running

```bash
npm install
npm start        # http://localhost:3001, defaults work out of the box
```

Defaults (`PORT=3001`, `FRONTEND_ORIGIN=http://localhost:5173`) match the
frontend's dev server, so no `.env` file is required for local development.
To override either, copy `.env.example` to `.env`, edit it, and run with
Node's built-in env-file loading:

```bash
cp .env.example .env
node --env-file=.env server.js
```

## What `POST /api/contact` does

1. Rate-limits the route (10 requests / 15 min per IP) via `express-rate-limit`.
2. Validates and sanitizes every field server-side in `validate.js` —
   independent of whatever the frontend already checked, since client-side
   validation is not a security boundary:
   - `name`, `contact`: required, non-empty after trimming, ≤120 chars.
   - `subject`: must be one of the fixed allowed options (whitelist, not
     free text).
   - `details`: optional, ≤2000 chars.
   - Control characters are stripped from every text field.
3. CORS is restricted to `FRONTEND_ORIGIN` — no wildcard origin.
4. On success, appends a JSON line to `backend/submissions.log` (gitignored
   — never committed) and returns `{ ok: true }`. On validation failure,
   returns `400` with the specific errors. Nothing is emailed; review
   submissions by reading `submissions.log`.

## If this later needs to send real email

Swap the `fs.appendFile` call in `server.js` for a call to your provider's
SDK (Resend, SendGrid, SMTP, etc.), and add the provider's credentials as
env vars documented in `.env.example` — never hardcode them in `server.js`
or commit real values in `.env`. The target inbox would most likely be
`hello@sportandcompany.ua` (per the contact section), but confirm before
wiring it up for real.

## Note on the subject-option whitelist

`validate.js` hardcodes the same `Тема звернення` options as
`frontend/src/content/content.js` (`SUBJECT_OPTIONS`). This is intentional
duplication, not drift — the backend must validate independently of
whatever the frontend sends, so it can't trust or import the frontend's
copy of the list. If the option list changes, update both files.

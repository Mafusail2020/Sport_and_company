# Sport&Company — backend

Express API backing the site's contact form and its password-gated
`/admin` area. `POST /api/contact` is a **fully-stubbed local backend** (per
user decision — see `../CLAUDE.md`): it validates, sanitizes, and
rate-limits submissions, and logs them (locally in dev, to Vercel Blob in
production). It does not send real email and needs no provider credentials
to work. The admin routes are real, though — they persist pricing/photo
overrides to Blob so admin edits actually show up for every visitor.

## Running

```bash
npm install
npm start        # http://localhost:3001, defaults work out of the box
```

Defaults (`PORT=3001`, `FRONTEND_ORIGIN=http://localhost:5173`) match the
frontend's dev server, so no `.env` file is required for the contact form
in local development. The admin routes need more — see "Admin area" below.
To override any of it, copy `.env.example` to `.env`, edit it, and run with
Node's built-in env-file loading:

```bash
cp .env.example .env
node --env-file=.env server.js
```

`server.js` exports the Express app (`module.exports = app`) rather than
always calling `.listen()` — it only listens when run directly
(`require.main === module`), so the same file also works as the Vercel
serverless function `../api/server.js` re-exports in production.

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
4. On success, logs the submission and returns `{ ok: true }`. Locally, that
   means appending a JSON line to `backend/submissions.log` (gitignored —
   never committed); in production (`process.env.VERCEL` is set), it means
   appending to a JSON document in Vercel Blob instead, since Vercel's
   production filesystem is read-only outside `/tmp` and a local file
   wouldn't persist there. On validation failure, returns `400` with the
   specific errors. Nothing is emailed either way.

## Admin area

Backs the frontend's `/admin` editor. Three route files, plus the shared
pieces they depend on:

- `routes/content.js` — public, unauthenticated: `GET /api/pricing`,
  `GET /api/photos`. Both fail open (return `null`/`{}`) on any read error,
  since the public page always falls back to its shipped static content in
  that case — these routes existing at all should never be able to break
  the marketing page.
- `routes/adminAuth.js` — `POST /api/admin/login` (rate-limited, ~5/15min;
  compares against `ADMIN_PASSWORD` with a timing-safe check; issues the
  signed session cookie), `POST /api/admin/logout`, `GET /api/admin/session`.
- `routes/adminContent.js` — everything behind `middleware/requireAdmin.js`:
  `PUT`/`DELETE /api/admin/pricing` (an empty array is how the admin removes
  the pricing section from the public page; `DELETE` reverts to the shipped
  defaults), `POST`/`DELETE /api/admin/photos/:slotKey` (multipart upload,
  JPEG/PNG/WebP only, ~4MB cap — Vercel Node functions hard-cap request
  bodies at 4.5MB).
- `lib/session.js` / `middleware/requireAdmin.js` — the HMAC session cookie
  (signed with Node's built-in `crypto`, no JWT dependency) and the
  middleware that verifies it on every admin route.
- `lib/blobStore.js` — wraps `@vercel/blob` for the two small JSON "control
  documents" (pricing override, photo-slot overrides) plus the production
  contact-submission log, with a short in-memory read cache so the two
  public routes above don't round-trip to Blob on every single page view.
- `photoSlots.js` / `adminValidate.js` — the fixed whitelist of the 14
  editable photo slots and hand-rolled payload validation, in the same
  no-schema-library style as `validate.js`.

Needs three env vars beyond the contact form's (`ADMIN_PASSWORD`,
`ADMIN_SESSION_SECRET`, `BLOB_READ_WRITE_TOKEN` — see `.env.example` for
what each does and how to get one). Without `BLOB_READ_WRITE_TOKEN` set
locally, the public routes still work fine (they fail open to no override),
but admin saves/uploads will fail with a clean error — connect a Blob store
to the Vercel project and pull the token down, or copy it from the
dashboard, to exercise the full admin flow locally.

## If this later needs to send real email

Swap the `fs.appendFile` call in `server.js` for a call to your provider's
SDK (Resend, SendGrid, SMTP, etc.), and add the provider's credentials as
env vars documented in `.env.example` — never hardcode them in `server.js`
or commit real values in `.env`. The target inbox would most likely be
`krutkev00@gmail.com` (per the contact section), but confirm before
wiring it up for real.

## Note on the subject-option whitelist

`validate.js` hardcodes the same `Тема звернення` options as
`frontend/src/content/content.js` (`SUBJECT_OPTIONS`). This is intentional
duplication, not drift — the backend must validate independently of
whatever the frontend sends, so it can't trust or import the frontend's
copy of the list. If the option list changes, update both files.

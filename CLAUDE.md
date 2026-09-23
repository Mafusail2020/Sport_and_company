# CLAUDE.md

## Project summary
"Sport&Company" — one-page marketing site for a youth sports-events community
in Kyiv, Ukraine. Presents the community, its event formats, pricing packages,
FAQ, photo gallery, partners and a contact form. No e-commerce checkout, no
user accounts. The only data collected is whatever a visitor voluntarily
submits through the contact form.

## Stack
- `frontend/`: React + Vite, plain CSS (custom properties + CSS Modules where
  useful). No CSS framework, no UI kit, no state-management library — the
  page is a single scrolling document with local component state only. A
  password-gated `/admin` area (see below) is the one exception: it's a
  second, code-split entry point rendered by a plain pathname check in
  `main.jsx`, not a router.
- `backend/`: Express API. `POST /api/contact` validates, sanitizes and
  rate-limits submissions, logs them, then sends a notification email via
  Resend's free tier (see "Resolved decisions" below and
  `backend/README.md` → "Email notifications") — plus an admin API
  (`/api/admin/*`) backing the `/admin` area, and public read routes
  (`GET /api/pricing`, `GET /api/photos`, `GET /api/contact-info`) the
  marketing page fetches at runtime.
- Persistence: Vercel Blob only, no separate database (see "Resolved
  decisions" below). Two small JSON documents hold admin *overrides* for
  pricing and photo slots — the public site always falls back to its
  shipped static content (`frontend/src/content/content.js` and the bundled
  photos) when no override exists or a fetch fails, so it can never end up
  blank/broken. Production contact-form submissions are appended to Blob
  too (local dev keeps writing to the gitignored `backend/submissions.log`).
- Deploy: a root `vercel.json` + `api/server.js` run the frontend as a
  static build and the backend as one Vercel serverless function in the
  same project — see "Deploying" below for the manual setup steps.
- Root `package.json`: not used as an npm workspace root. `frontend/` and
  `backend/` are independent npm projects with their own `package.json` /
  lockfile, run separately (`npm run dev` inside each). Simpler than wiring
  workspaces for two small, loosely-coupled apps.

## Admin area (`/admin`)
Lets an admin edit two things without touching code: the pricing packages
(add/remove/edit, or empty the list to remove the whole pricing section from
the public page) and any of the 14 photo slots (swap the file, or revert to
the shipped default). Single shared password (`ADMIN_PASSWORD`, backend env
var, never sent to the client), verified server-side with a timing-safe
comparison; on success the backend issues a short-lived HMAC-signed
`httpOnly`/`Secure`/`SameSite=Strict` session cookie (signed with Node's
built-in `crypto`, matching `backend/validate.js`'s existing no-schema-
library style — see `backend/lib/session.js`). Every admin route is gated by
`backend/middleware/requireAdmin.js`; the login route is rate-limited. See
`backend/README.md` and `frontend/README.md` for the full route list and
local-dev setup.

## Deploying
This project has never been pushed to a remote by Claude (see "Non-negotiable
constraints" below) — deployment is something the user does manually. Steps,
once the user pushes to their own GitHub remote and imports it on Vercel:
1. Import the repo on Vercel as-is — `vercel.json` at the repo root already
   configures the install/build commands, output directory, and the
   frontend+backend routing, so no dashboard build-settings overrides should
   be needed.
2. In the Vercel dashboard's Storage tab, connect a Blob store to the
   project. This auto-injects `BLOB_READ_WRITE_TOKEN` — nothing to type in
   manually.
3. In Project Settings → Environment Variables, set for Production (and
   Preview, if `/admin` should also work on preview deploys):
   `ADMIN_PASSWORD` (the login password), `ADMIN_SESSION_SECRET` (random,
   e.g. `openssl rand -hex 32`), and `FRONTEND_ORIGIN` (the production URL).
4. Redeploy, then re-test the contact form on the live site — this is the
   first time it will have actually run in production; local dev only
   proves the Vite-proxy path.

## Folder structure
```
/frontend        # the entire site
  /src
    /admin            # the /admin area's own components (login, pricing/photo editors)
    /assets          # copied-in, web-sized assets (never edit assets/ directly)
    /components       # one component per section + shared UI (Header, Hero, ...)
    /content          # copy pulled verbatim from assets/CONTENT_TRANSCRIPT.md
    /context          # PackageContext, PhotoOverridesContext
    /styles           # design tokens, global styles
    AdminApp.jsx       # alternate render root for /admin (main.jsx picks App vs AdminApp)
/backend         # Express API: contact form + admin auth + pricing/photo routes
  /lib               # session signing, Blob JSON store helper
  /middleware        # requireAdmin
  /routes            # public content routes, admin auth routes, admin content routes
  .env.example
  README.md
/api             # api/server.js: one-line wrapper so Vercel's zero-config
                 # Function detection finds backend/server.js
/assets          # READ-ONLY source assets (screenshots, transcript, brand files, photos)
/docs
  asset-inventory.md   # audit of everything in /assets
  design-spec.md       # confirmed design tokens + layout notes
CLAUDE.md
README.md
vercel.json      # frontend static build + backend serverless function, in one deploy
```

## Commit convention
Conventional Commits, one logical unit per commit (see task list in the
original brief for the expected sequence: scaffold → tokens → header → hero →
… → backend stub → docs). Never bundle unrelated changes. Never amend or
force-push existing history.

## Design tokens
```css
:root {
  /* Core palette */
  --navy-900: #1A4358;   /* headings, body-adjacent dark text, dark filled buttons, "why us" section bg, outline borders */
  --navy-950: #102E3D;   /* footer background (slightly darker than --navy-900) */
  --navy-800: #274E62;   /* "why us" card background (lighter than section bg) */
  --mint-400: #77F9AC;   /* primary buttons, badges, accent backgrounds (contact section, active pricing card) */
  --green-600: #53B182;  /* accent TEXT color — eyebrow labels, highlighted headline words (NOT the same as button green) */
  --slate-700: #255164;  /* body paragraph text on light backgrounds */
  --bg-light: #F3F7F8;   /* default page background */
  --white: #FFFFFF;      /* cards, pills, form background */
  --border-light: #DFE4E7; /* card/pill borders, dividers on light sections */
}
```
Two distinct greens — do not merge: `--mint-400` (#77F9AC) is fill-only
(buttons, badges, contact section bg). `--green-600` (#53B182) is text-only
(eyebrow labels, highlighted headline words). Mint text on light backgrounds
fails contrast — never do it.

Pixel-sampled against the reference screenshots and confirmed exact:
`--navy-900` (pricing button fill), `--navy-950` (footer bg), `--mint-400`
(active pricing card bg). See `docs/design-spec.md` for the full verification
log and typography/layout tokens.

Brand SVG assets (`assets/*.svg`) use their own separate palette
(`#00C2FF` cyan, `#20FCA5` mint, `#01445A` dark navy) for the logo mark itself
— distinct from the site's UI tokens above. Keep the logo colors as literal
values where the logo mark is reproduced (icon graphic), not tied to the
`--navy-900`/`--mint-400` tokens, since the logo is a fixed brand asset.

## Non-negotiable constraints (restated from the brief)
- Never push, fetch, or pull from any git remote, at any point, even at the
  end. All work stays as local commits until the user reviews and pushes
  manually.
- Never invent copy, prices, or claims. All real UI copy is in
  `assets/CONTENT_TRANSCRIPT.md` — use it verbatim. Only items marked
  `[PLACEHOLDER]` / `[ASSUMPTION]` there need a decision (see log below).
- `assets/` is read-only. Copy what's needed into `frontend/src/assets/`.
- Do not fabricate partner logos. The 5 "лого" placeholder slots in Партнери
  are the real design, not a gap to fill.
- If something is genuinely ambiguous beyond what's already resolved below —
  stop and ask, don't guess.

## Resolved decisions / assumptions log

1. **Backend scope (§9)** — user chose the fully-stubbed local backend:
   `POST /api/contact` validates + sanitizes + rate-limits + logs locally.
   Originally shipped sending no real email; later extended (see decision
   #7) to send a real notification email via Resend once `RESEND_API_KEY`
   is set, with no change to the logging behavior either way.
2. **Photo assets** — none of the 12 real photos in `assets/` are exact
   scene matches for the stock-style photos shown in the reference
   screenshots (no basketball photo exists at all; formats/gallery scenes
   are close-but-not-identical). User approved: map real Sport&Company
   photos to the closest-fitting slot everywhere a reasonable thematic fit
   exists (documented per-slot in `docs/asset-inventory.md`), placeholder
   only where nothing fits at all. Hero + gallery-large (both call for
   "basketball action") use `IMG_1453.JPG` (real futsal team celebration,
   arms raised) — approved substitute, mood shifts from moody outdoor
   streetball to bright indoor futsal.
3. **`IMG_3496.JPG`** — an unrelated digital illustration (portrait of a
   woman), not sports content, doesn't map to any section. User approved:
   ignore it, leave untouched in `assets/`, not copied into the frontend.
4. **Pricing → contact prefill** — implemented per brief's suggestion
   (clicking a package button scrolls to `#contact` and pre-selects the
   matching dropdown option). This is an inferred behavior, not confirmed
   from a screenshot — flagged to the user in the final summary, not
   pre-approved.
5. **Mobile/tablet layout** — no reference screenshots exist below desktop
   width. Responsive behavior (stacked columns, hamburger nav, breakpoints)
   is inferred from standard patterns, not measured — flagged as such.
6. **Admin area (`/admin`)** — user asked for a simple password-gated way to
   edit pricing and photos post-launch. A client-side-only password check
   was considered and rejected: it protects nothing once there's a write API
   behind it (anyone can call the API directly), so auth is server-verified
   instead (see "Admin area" above). Persistence is confirmed as Vercel
   Blob only, no separate database — verified against Vercel's docs that
   Blob is genuinely free on the Hobby plan at this site's scale (1GB
   storage, 10k/2k free ops, 10GB transfer per month). Building this
   surfaced that there was no production deployment wiring in the repo at
   all — `POST /api/contact` had only ever worked against the local Vite
   dev proxy — so setting up `vercel.json` (see "Deploying" above) was
   folded into the same effort, since the admin API needs to run somewhere
   in production regardless.
7. **Real email delivery** — user asked to turn on actual email notifications
   for contact-form submissions, free only. Chose Resend (free tier: 3,000
   emails/month, 100/day, no card) over Gmail SMTP for reliable serverless
   delivery without enabling app passwords on a personal account. Sends from
   the shared `onboarding@resend.dev` test address (no domain verification
   needed) to whatever's saved in `/admin` → Контакти, falling back to
   `krutkev00@gmail.com`. Caveat: `resend.dev` only delivers to the email
   that owns the Resend account — see `backend/README.md` → "Email
   notifications" for what happens if that admin-set address is changed to
   one outside the Resend account (delivery silently stops until a verified
   domain replaces the sender).

## Open questions still logged for the user (from CONTENT_TRANSCRIPT.md §10)
- Real phone number (currently the dummy `+380 00 000 00 00` from the design)
- Full "Тема звернення" dropdown option list (only "Пакет Start" is confirmed
  visible; shipping with an inferred set — see design-spec.md)
- Full consent fine-print under the contact submit button (truncated in the
  source screenshot; shipping with honest placeholder copy — see design-spec.md)

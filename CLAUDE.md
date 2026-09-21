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
  page is a single scrolling document with local component state only.
- `backend/`: minimal Express API, one route: `POST /api/contact`. Fully
  stubbed — validates, sanitizes and rate-limits submissions, logs them
  locally. Does not send real email (see "Resolved decisions" below).
- Root `package.json`: not used as an npm workspace root. `frontend/` and
  `backend/` are independent npm projects with their own `package.json` /
  lockfile, run separately (`npm run dev` inside each). Simpler than wiring
  workspaces for two small, loosely-coupled apps.

## Folder structure
```
/frontend        # the entire site
  /src
    /assets          # copied-in, web-sized assets (never edit assets/ directly)
    /components       # one component per section + shared UI (Header, Hero, ...)
    /content          # copy pulled verbatim from assets/CONTENT_TRANSCRIPT.md
    /styles           # design tokens, global styles
/backend         # POST /api/contact stub (Express)
  .env.example
  README.md
/assets          # READ-ONLY source assets (screenshots, transcript, brand files, photos)
/docs
  asset-inventory.md   # audit of everything in /assets
  design-spec.md       # confirmed design tokens + layout notes
CLAUDE.md
README.md
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
   `POST /api/contact` validates + sanitizes + rate-limits + logs locally,
   sends no real email. No provider credentials needed for this to work.
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

## Open questions still logged for the user (from CONTENT_TRANSCRIPT.md §10)
- Real phone number (currently the dummy `+380 00 000 00 00` from the design)
- Real Instagram / Telegram URLs (currently label-only links)
- Full "Тема звернення" dropdown option list (only "Пакет Start" is confirmed
  visible; shipping with an inferred set — see design-spec.md)
- Full consent fine-print under the contact submit button (truncated in the
  source screenshot; shipping with honest placeholder copy — see design-spec.md)

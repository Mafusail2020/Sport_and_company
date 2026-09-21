# Asset inventory

Audit of everything under `/assets` (read-only source). For each file: type,
dimensions, purpose, and — for photos — which site slot it's mapped to and
why. Decisions below on ambiguous mappings were confirmed with the user
(see `CLAUDE.md` → Resolved decisions log).

## Documents
| File | Type | Purpose |
|---|---|---|
| `CONTENT_TRANSCRIPT.md` | Markdown | Verbatim source copy for the whole site. Used as-is for all component text. |
| `Brand Guidlines_v1.pdf` | PDF | Brand guideline document (colors/type/logo usage rules). Referenced for context; not parsed programmatically — design tokens were instead pixel-verified directly against the reference screenshots (see `design-spec.md`), which reflect the actual shipped design more precisely than a general guideline doc. |
| `Brandbook_Sport&Company.pdf` | PDF | Fuller brand book (logo construction, extended palette). Same treatment as above — background reference only. |

## Screenshots (`/assets/screenshots/`)
16 files, `01-…` through `16-…`, PNG, ~2970–3010px wide (2x-density desktop
captures). Used as the visual reference for every section; not copied into
the frontend (reference-only). Full manifest already listed in the brief;
not repeated here.

## Logo / icon assets
The logo exists in many exported forms. Only the SVGs are usable on the web —
the PNG exports are print-resolution (15,000–32,769px on the long edge, 1.5–3MB
each) and were **not** copied into the frontend; they'd bloat the bundle for
no visual benefit over the vector versions.

| File | Type | Contents | Use |
|---|---|---|---|
| `icon_no bg.svg` | SVG, 3836×3709 | Icon mark only (swirl + orbit dot), transparent bg. Colors: `#00C2FF` cyan, `#20FCA5` mint, white. | Copied to `frontend/src/assets/`. Used as the header/footer logo icon (paired with live "SPORT&COMPANY" text, not a flattened logo image — see design-spec.md for why). |
| `icon_round_dark bg.svg` | SVG, 4054×4054 | Icon mark on a filled dark-navy (`#01445A`) circle. | Copied to `frontend/src/assets/`. Used as the favicon. |
| `logo_dark.svg` | SVG, 13079×4054 | Full horizontal lockup (icon + "SPORT&COMPANY" wordmark as outlined paths), navy text, cyan "&". | Reference only — not used directly (site renders the wordmark as live text for accessibility/color control per section; see design-spec.md). Not copied. |
| `logo_white.svg` / `logo_white&.svg` | SVG | Same lockup, white / white+colored-& variants for dark backgrounds. | Reference only, not copied — same reasoning. |
| `Logo Sport&Company.svg` | SVG, viewBox 375×375 | Icon-only variant, filter-based render. | Not used — `icon_no bg.svg` is the cleaner equivalent. |
| `Logo.svg` | SVG, 3652×1132 | Alternate wordmark-shape lockup. | Not used — superseded by `logo_dark.svg`/live text. |
| `icon_dark bg.png`, `icon_no bg.png`, `icon_round_dark bg.png`, `logo_dark.png`, `logo_white&.png`, `logo_white_no bg.png` | PNG, 15,000–32,769px long edge | Print-resolution raster exports of the above. | Not copied — SVG originals are used instead. |

## Real event photos (`/assets/*.JPG`, `*.JPEG`)
12 photos, real Sport&Company event photography (not stock). **None are
exact scene matches** for the stock-style photos shown in the reference
screenshots (e.g. no basketball photo exists anywhere in the asset set —
only futsal/indoor-soccer, beach volleyball, a road race, and posed/candid
event shots). Mapped to the closest-fitting slot per user approval; a couple
of slots (corporate tug-of-war, "події під запит" group-talking) have no
close real equivalent and use the nearest thematic fit rather than a
placeholder, per the same approval.

| File | Dimensions | Real content | Mapped to | Why |
|---|---|---|---|---|
| `IMG_1453.JPG` | 2600×1734 | Futsal team celebrating, arms raised, indoor sports hall | Hero photo + Gallery large photo | No basketball photo exists (both slots call for "basketball action"). Closest available: real, energetic, on-brand team celebration. Mood shifts from the mockup's moody outdoor streetball evening to a bright indoor futsal win — flagged in CLAUDE.md. |
| `IMG_6557.JPG` | 832×1280 | 4 people at a conference table with SPORT&Company-branded papers/water bottles | Про нас (About) team photo | Best real match for "team around a table in an office/lounge setting." |
| `IMG_9840.JPG` | 2618×3927 | Runners crossing under a start/finish inflatable arch, outdoor road race | Формати → Спортивні змагання card | Strong match for "marathon finish line" (this is a start-line shot, not finish, but same event type and crowd energy). |
| `IMG_6818.JPG` | 853×1280 | Two men mid-jump at the net, beach/sand volleyball court | Формати → Командні ігри card | Strong match for "volleyball" — sand court instead of the mockup's indoor gym, otherwise on-theme. |
| `IMG_8650.JPG` | 3115×4672 | Three people talking at an outdoor branded info booth | Формати → Лекції та розмови card | No literal lecture-with-audience photo exists; this is the closest "people engaged in conversation around Sport&Company content" shot. |
| `IMG_9691.JPEG` | 1365×2048 | Close-up of hands holding SPORT&Company-branded playing cards | Формати → Мафія та вечори card | Very strong match — literal card game, on-brand card design. |
| `IMG_1459.JPG` | 2600×1733 | Futsal duel for the ball, competitive 1v1 | Формати → Корпоративні активності card | No tug-of-war equivalent exists; used as the closest "competitive team activity" substitute. |
| `IMG_7931.JPEG` | 3979×5968 | Two men in conversation, indoor evening setting | Формати → Події під запит card | No outdoor group-talking photo exists; closest "let's discuss your idea" conversational mood. |
| `IMG_9691.JPEG` (reused) | — | (see above) | Атмосфера gallery small #2 (мафія) | Same card-game photo reused per transcript's own repeated slot (transcript lists "friends playing Mafia" in both Formats and Gallery). |
| `IMG_6818.JPG` (reused) | — | (see above) | Атмосфера gallery small #4 (volleyball) | Transcript lists "volleyball action" as both a Formats photo and a Gallery photo — reused intentionally, not a mistake. |
| `IMG_8650.JPG` (reused) | — | (see above) | Атмосфера gallery small #3 ("group talking outdoors") | Closest available "people talking" shot; reused from Формати for the same reason as above. |
| `IMG_1453.JPG` (reused) | — | (see above) | Атмосфера gallery small #1 ("team hands huddle") — **no real match** | No hands-huddle photo exists in the asset set. Reusing the celebration shot at a tighter crop as the least-bad option; genuinely weak match, worth a real photo later. |
| `IMG_0195.JPG` | 3936×2624 | Large group photo, SPORT&Company flag, outdoor evening (camping/trip setting) | Команда (Team/Join-us) photo | Best match for "large group of smiling friends, outdoor" — setting is a trip/campsite rather than a court, but it's the strongest real group-photo available. |
| `IMG_9699.JPEG` | 1365×2048 | SPORT&Company branded flag/banner hanging in front of a bookshelf | Not used | No section calls for a static banner/flag-on-shelf image; doesn't fit hero, formats, gallery, about, or team slots. |
| `IMG_3496.JPG` | 2156×1502 | Digital illustration/artwork, portrait of a woman — unrelated to sports or youth-community content | Not used | Out of scope for this project; confirmed with user to ignore. Left untouched in `assets/`, not copied to `frontend/src/assets/`. |

All mapped photos will be copied into `frontend/src/assets/photos/` and
served at web-appropriate sizes (resized/compressed on the way in, since the
originals are camera-resolution and would otherwise hurt page-load
performance) with explicit `width`/`height` to avoid layout shift.

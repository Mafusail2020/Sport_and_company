# Design spec

Combines the verified tokens from the brief with confirmations made by
viewing all 16 reference screenshots directly and pixel-sampling colors with
PIL. Source of truth for `frontend/src/styles/tokens.css`.

## Colors — verified by pixel sampling
Sampled directly from PNG screenshots (`PIL.Image.getpixel`):

| Token | Value | Sampled from | Result |
|---|---|---|---|
| `--navy-900` | `#1A4358` | `07-pricing-packages.png`, "Обрати Active" button fill | Exact match: `(26,67,88)` |
| `--navy-950` | `#102E3D` | `16-footer.png`, footer background | Exact match: `(16,46,61)` |
| `--mint-400` | `#77F9AC` | `07-pricing-packages.png`, Active card background | Exact match: `(119,249,172)` |

The remaining tokens (`--navy-800`, `--green-600`, `--slate-700`,
`--bg-light`, `--white`, `--border-light`) matched on visual inspection
across all screenshots and are used as given in the brief — no adjustment
needed. Full token set lives in `CLAUDE.md` and `frontend/src/styles/tokens.css`.

Two distinct greens, confirmed visually across every section: `--mint-400`
is fill-only (buttons, badges, Active pricing card, Контакти section bg).
`--green-600` is text-only (all eyebrow labels, the accent second line of
headings like "А НЕ ДЕКОРАЦІЯ" / "ПРИВІД ВИЙТИ З ДОМУ"). Never swapped.

Brand-mark-only colors (used solely inside the logo icon graphic, not as UI
tokens): `#00C2FF` cyan, `#20FCA5` mint, `#01445A` dark navy — taken directly
from `assets/icon_no bg.svg` fills.

## Typography
Confirmed against every heading/body sample across the 16 screenshots:
- Headings: bold, all-caps, rounded/blocky letterforms with distinctly
  squared counters (visible on У, О, Ф). **Nunito (800/900 weight,
  uppercase via CSS)** is used as the shipped choice — it has full Cyrillic
  coverage, is on Google Fonts (no self-hosting/licensing question), and its
  rounded terminals are the closest freely-available match to the
  reference. `e-Ukraine` (suggested in the brief) is not reliably available
  as a web font with a standard CDN/npm distribution; substituting per the
  brief's own documented fallback rather than vendoring an unverified font
  file.
- Body/UI text: plain geometric sans, less rounded than headings. **Inter**,
  loaded via Google Fonts (variable weight 400–700), full Cyrillic support.
- Both fonts confirmed to render Cyrillic correctly (Инter and Nunito both
  ship Cyrillic subsets on Google Fonts).

## Layout & spacing — confirmed from screenshots
- Max content width: ~1280px centered (measured against the 2988px-wide 2x
  screenshots — content block is ~1920px at 2x ⇒ ~960–1280px at 1x depending
  on section padding; using 1280px as the shipped max-width).
  Side padding: 24px at mobile width, scaling to ~80px+ at desktop
  (matches the wide gutters visible in every screenshot).
- Section vertical padding: ~96–120px top/bottom on desktop, confirmed by
  the visible whitespace between e.g. the stats bar and "Навіщо ми" section.
- Border radius: full pill on all buttons and tag chips (confirmed:
  `Замовити`, format tag pills, FAQ — visibly fully rounded ends).
  ~20–24px on cards and photo corners (pricing cards, format cards, hero
  photo, gallery photos — consistent rounded-rect radius throughout).
- Cards: white background on light sections, thin `--border-light` (1px)
  border, no visible drop shadow in any screenshot — flat design.
  `--navy-800` background + no border on dark "Навіщо ми" cards.
- Section rhythm confirmed top-to-bottom: light hero → white stats bar →
  dark "Навіщо ми" → light "Про нас" → light "Формати" → light "Послуги" +
  FAQ → light "Атмосфера" gallery → dark "Партнери" → light "Команда" →
  mint-green "Контакти" → dark footer. Matches the brief exactly.

## Interactions confirmed from screenshots
- Header: sticky, thin gradient progress bar directly under the nav bar
  (visible, mint→blue, partially filled, in screenshots 02–16). Current nav
  item bold + underlined (visible in every screenshot after the hero —
  e.g. "Навіщо ми" underlined in 03, "Про нас" in 04, "Формати" in 05/06,
  "Послуги" in 07/08, "Партнери" in 13/14, "Контакти" in 15).
- Scroll-to-top button: circular, dark-navy fill, bottom-right, visible from
  section 3 ("Навіщо ми") onward in every subsequent screenshot.
- FAQ accordion: `−` icon on the expanded item (screenshot 08, item 1),
  `+` icon on collapsed items (items 2–4). Expanded item shows a top divider
  line above its answer text (visible in 08/09/10).
- Pricing: Active card has a "НАЙПОПУЛЯРНІШИЙ" eyebrow badge in place of the
  "ПАКЕТ 0x" label the other two cards show (confirmed screenshot 07).

## Content decisions for [PLACEHOLDER] / [ASSUMPTION] items (§10)
These remain open for the user — shipped with the following defaults so the
site is complete and functional, called out again in the final summary:

- **Phone number**: kept as the literal dummy `+380 00 000 00 00` from the
  source design — rendered as plain text, not an active `tel:` link (an
  inactive dummy number shouldn't be clickable-dialable).
- **Instagram / Telegram**: rendered as real-looking link elements but
  pointing to `#` (no real handle exists yet) with a code comment marking
  them as needing the real URL before launch. Not left as dead unstyled text
  so the visual design is complete; not given a fabricated URL either.
- **"Тема звернення" dropdown**: ships with `Пакет Start` (confirmed
  default), `Пакет Active`, `Пакет Team`, `Партнерство`, `Інше` — the
  reasonable set the brief itself suggests. Flagged as an assumption.
- **Consent fine print**: ships with
  "…через вказаний контакт щодо вашого звернення. Ми не передаємо ваші дані
  третім особам." appended to the confirmed lead-in "Натискаючи кнопку, ви
  погоджуєтесь, що ми зв'яжемось із вами" — the honest standard-copy option
  the brief itself proposes. Flagged as an assumption.

## Responsive breakpoints (inferred, not measured)
No reference exists below desktop width. Shipped breakpoints:
- `≥1024px`: desktop layout as in the screenshots.
- `640–1023px`: tablet — grids collapse from 3/6-col to 2-col, nav stays
  inline if it fits, else collapses to a hamburger menu.
- `<640px`: mobile — single column throughout, hamburger nav, stacked
  pricing/format cards, contact section stacks copy above the form.
This is a standard-patterns inference, explicitly not confirmed against any
design reference — flagged to the user.

# AGENTS.md

Context for AI agents (Claude Code, Cursor, Copilot) working on **andersonlaverde.com**.

## What this is

Anderson Laverde's personal site. The CV is the main content; blog and videos are secondary
destinations. Replaces a Framer page (`second-pineapple-995158.framer.app`).

Repo: `andirsun/andersonlaverde.com`, branch `master`. Deployed on Vercel.

## Workflow — every change goes through a PR (mandatory)

Anderson reviews every change on its Vercel preview before it reaches production.

- **Never commit or push to `master` directly.** Every requested change, however small (copy,
  CSS, docs, this file), goes on its own branch off the latest `origin/master` and is opened as a
  pull request **against `master`**.
- **Never merge a PR yourself** unless Anderson explicitly asks to merge that specific PR. Opening
  the PR is the end of the task.
- Before opening the PR, run `npx tsc --noEmit`, `npm run lint`, `npm test` and `npm run build`,
  and list the results in the PR description.
- After pushing, wait for the Vercel check and hand back the **PR URL plus the preview URL**
  (`gh pr checks <n>` or the deployment status) so Anderson can verify it.
- Follow-up changes to an open PR go on that same branch; unrelated changes get a new PR.

## Stack

| | |
| --- | --- |
| Framework | Next.js 16.3.5, App Router |
| React | 19 |
| Styling | Tailwind CSS 4.3.3 + semantic CSS in `globals.css` |
| Language | TypeScript 5.9, strict |
| Host | Vercel |
| Lint | ESLint 10, flat config (`eslint.config.mjs`) |
| Tests | Vitest (`npm test`) |

## Linting

`eslint-config-next` is deliberately **not** used. It bundles `eslint-plugin-react`, which still
calls the `context.getFilename()` API that ESLint 10 removed, so it throws on startup. The
equivalent coverage is wired up directly in `eslint.config.mjs` from
`@next/eslint-plugin-next`, `typescript-eslint`, `eslint-plugin-react-hooks` and
`eslint-plugin-jsx-a11y`. The one rule set lost is `eslint-plugin-react` itself — reinstate it
(and `eslint-config-next`) once it supports ESLint 10.

`eslint-plugin-jsx-a11y` runs fine on ESLint 10 but its declared peer range stops at 9, so
`package.json` pins it with an `overrides` entry. Without that, `npm ci` fails outright and the
Vercel build breaks — don't remove it.

The repo previously held an empty `create-next-app` scaffold on Next 14 / Tailwind 3.
That was upgraded wholesale. **Files removed in the upgrade:** `tailwind.config.ts`,
`postcss.config.js`, `README copy.md`, `src/app/next.svg`, `public/vercel.svg`.

## Structure

```
src/app/layout.tsx        shell: fonts (next/font), pre-paint theme script, Header, CursorGlow
src/app/page.tsx          home hub — intro + cards to /cv, /blog, /noticias
src/app/cv/page.tsx       /cv — experience, education, stack (printable)
src/app/blog/page.tsx     /blog — local posts + Medium feed, newest first
src/app/blog/[slug]/      a post hosted here (transcript + handwritten pages as tabs)
src/app/blog/rss.xml/     RSS for /blog
content/posts/            posts written for this site, one .md per post
scripts/ink-mask.sh       handwritten page photos/exports → transparent ink masks
.claude/skills/           publish-handwritten-post: the end-to-end procedure for a new post
src/app/videos/page.tsx   /videos
src/app/globals.css       design tokens, all component CSS, print styles
src/components/           Header, CursorGlow, TypedRoles, Icons (Plump), PrintButton, VideoPicker, T (i18n)
src/data/                 experience.ts, posts.ts, videos.ts
```

**Content lives in `src/data/`.** Adding a job or a post means editing a typed array
there, not touching a component. Keep it that way.

**Videos are the exception — they are not hand-edited.** `src/data/videos.ts` fetches the
public YouTube RSS feed for channel `UC-GGZODarfLyjEOz3GhgKnw` (@andirsun) and `/videos`
revalidates hourly, so new uploads appear without a deploy. No API key is involved. The feed
carries title, id, publish date and thumbnail — but no duration, which is why the page shows
dates alone. Videos play on the page: `VideoPicker` embeds the newest one (youtube-nocookie, like
the /noticias intro) and the list beside it swaps any other into the player. `FALLBACK_VIDEOS` in that file is a committed snapshot used only when the fetch
fails; without it a failed build would ship an empty page. Parser lives in `src/lib/youtube.ts`
and is tested in `test/youtube.test.ts`.

**Blog posts hosted here** live in `content/posts/<slug>.md`: frontmatter (`title`, `date`
YYYY-MM-DD, `excerpt`, `pages`) then plain paragraphs separated by blank lines. No Markdown or
HTML is rendered. `pages: N` means there are handwritten pages at `public/blog/<slug>/01.png` …
The post page shows the transcript by default and the pages in a second tab. The pages are
**transparent PNG masks**, not photos: the page renders them as `mask-image` painted in
`--ink`, so the handwriting follows the theme. Convert pages with
`scripts/ink-mask.sh <slug> <images…>`: it accepts white- or dark-background exports and phone
photos of paper, and writes `public/blog/<slug>/01.png`, `02.png`, …
**To publish a new handwritten post, follow `.claude/skills/publish-handwritten-post/SKILL.md`**
(convert, transcribe, write the post, show it locally, then open the PR).
Transcripts are literal — spelling and accents fixed, wording left as written. Old posts stay on
Medium and are merged into /blog from its feed (`getBlogEntries` in `src/data/posts.ts`).
`next.config.ts` traces `content/` and `public/blog/` into the server bundle; keep that when
renaming them.

**`/noticias` is not hand-edited either.** It shows the daily digest of Colombian independent
media (national + Ibagué) that a Hermes cron job emails every morning. After sending, the job
publishes the day as JSON to gist `1b185fd5b80ff3361f5e4c1d749ea640` (`YYYY-MM-DD.json` plus
`index.json`); `src/data/noticias.ts` reads it with hourly revalidation, so no deploy is needed.
The JSON is treated as untrusted: `src/lib/noticias.ts` validates it, renders no HTML, and only
keeps http(s) links. The page is in Spanish with emojis on purpose — it mirrors the email's
structure — and the weather block is always Ibagué. `/noticias/[date]` renders past days on
demand; `DayPicker` jumps between them.

**Email subscriptions.** `/noticias` has a sign-up form (`SubscribeForm`). The list lives in the
private repo `andirsun/noticias-suscriptores` (`subscribers.json`), written by
`/api/noticias/subscribe` and `/api/noticias/unsubscribe` through the GitHub contents API with
optimistic concurrency (stale sha → retry). Requires the Vercel env var
`SUBSCRIBERS_GITHUB_TOKEN`: a fine-grained token with Contents read/write on that one repo only.
Each subscriber has a random token; `/noticias/baja?t=…` confirms removal with a POST (never GET,
so mail-client link scanners can't unsubscribe people), and the same endpoint serves RFC 8058
one-click unsubscribe. Removal deletes the entry. The list is capped at `MAX_SUBSCRIBERS`
because the Hermes cron sends one message per subscriber through Proton Bridge from
noticias@andersonlaverde.com.

The channel is personal vlogs in Spanish, not dev content. `/videos` copy and the home-page
card are written to match that — don't reintroduce "dev setups / build-alongs" framing.

## Design system

**Arcade, in café.** The same playful system as Lukitas (Anderson's personal-finance app,
lukitas.andersonlaverde.com), recolored. The default palette is **café**: an espresso night with
backlit beige neon lettering (taken from a café's lit menu board), a latte day, burnt-orange
buttons, honey and terracotta accents. **Mint** — the original green arcade look — stays as an
alternative visitors can pick (see Palettes under Theming). Chunky rounded type, big radii, and surfaces that sit on a solid bottom edge
and press down when tapped. Lukitas' brand book lives in its repo
(`docs/design/system/project/`); the values here are copied from it, not imported.

### Tokens

Defined as CSS custom properties on `:root` (café night, the default) and
`:root[data-theme="light"]` (café day) in `globals.css`; mint overrides them under
`[data-palette="mint"]`. The table below lists the **mint** values (the token names and their
uses are the same in café; café's values and ratios are under Palettes). They are re-exported to Tailwind under
`@theme inline` (so `bg-surface`, `text-link`, `text-ink-muted` etc. work). Fonts and radii are
plain `@theme` values (`font-display`, `rounded-xl`).

| Token | Night | Day | Use |
| --- | --- | --- | --- |
| `--bg` | `#07120c` | `#f0fbf4` | page background, the bottom of the screen glow |
| `--bg-glow` | `#0f3b24` | `#c6f4d8` | top of the screen glow — the page is never a flat fill |
| `--surface` | `#10241a` | `#ffffff` | featured cards, static boxes (contact, digest, stats) |
| `--surface-row` | `#0d1d15` | `#ffffff` | cards and rows you can open, chips, secondary buttons |
| `--surface-sunken` | `#06100a` | `#e0f4e8` | wells: tags, inputs, the segmented control, icon tiles |
| `--surface-edge` | `#020805` | `#b0dfc3` | the solid bottom edge under pressables |
| `--stroke` | `#1e3e2d` | `#cfeadb` | 2px borders on cards and rows |
| `--ink` | `#effff5` | `#0a2918` | body text |
| `--ink-muted` | `#a5c8b3` | `#3d5f4c` | secondary text |
| `--heading` | `#5cffad` | `#08703b` | page titles (`h1`); glows at night, flat by day |
| `--brand` | `#3cff9d` | `#1fd67a` | primary buttons only — a fill, never text |
| `--brand-glow` / `--brand-edge` | `#8dffc6` / `#0b7a44` | `#6df0ad` / `#0b8a4a` | top highlight and bottom edge of brand buttons |
| `--on-brand` | `#03160c` | `#03160c` | text on `--brand`: dark ink, never white |
| `--link` | `#5cffad` | `#08703b` | links, "Read more →", active nav, selected states |
| `--focus` | `#d9ff4d` | `#08703b` | the focus ring |
| `--lime` | `#d9ff4d` | `#4a7300` | accent 1: eyebrows, dates, icon tiles |
| `--cyan` | `#4cf0ff` | `#00727f` | accent 2: Ibagué in /noticias, the blog tile |
| `--good` / `--near` / `--over` | `#3cff9d` / `#ffc24d` / `#ff7a93` | `#08703b` / `#9a5300` / `#c2194a` | candy status colors: figures, "in progress" badge, form ok / error |

**Contrast.** Every text token passes WCAG AA (4.5:1) on every surface in both themes. Night:
ink 18.4 on bg, ink-muted 8.9 on surface, link 14.9 on bg, lime 14.2 and cyan 11.8 on surface,
on-brand 14.2 on brand, near 10.1 and over 6.6 on surface. Day: ink 14.7 on bg, ink-muted 7.1
on surface, link 5.8 on bg, heading 5.1 on bg-glow, lime 5.6 and cyan 5.7 on surface, on-brand
9.7 on brand, near 5.8 and over 5.9 on surface. The focus ring is 16.7 (night) and 5.8 (day)
against bg. The neon colors only pass as text at night; by day, anything green that has to be
read uses `--link`/`--heading`, and `--brand` stays a fill with dark `--on-brand` text. When
adding a color, check it against `--bg`, `--bg-glow`, `--surface` and `--surface-row` in both
themes before using it for text.

### Type

- **Fredoka** (`--font-display`, `font-display`) — headings, buttons, chips, card titles,
  figures, links that read as actions ("Read the CV →"). 600–700.
- **Nunito** (`--font-text`, `font-text`) — everything else, set heavy: 700 for UI text, 800–900
  for labels and eyebrows, 600 for long reading (`.prose`: transcripts, the digest, ledes).
  Never below 600.

Both are self-hosted through `next/font/google` in `layout.tsx` (variable fonts, one file
each); `globals.css` reads them from `--font-fredoka` / `--font-nunito`.

Styles, all in `globals.css`: `h1` page title (40–68px, `--heading`), section heading
`.sec-head h2` (24–32px, sentence case), card title (21px Fredoka 600), button (15px Fredoka 700,
uppercase, 0.05em), body (15–17px Nunito 700), eyebrow `.eyebrow` / `.kind` (12px Nunito 900,
uppercase, 0.08em, `--lime`). Numbers that line up use `.num` (tabular figures).

### Rules

- **Depth is a solid bottom edge, not a blur.** `--edge-sm` (3px) for chips, rows and secondary
  buttons, `--edge-md` (5px) for cards, `--edge-brand` (6px + a soft brand glow) for primary
  buttons. Pressing moves the element down by its edge and collapses it to 1px.
- **Every tappable thing presses; nothing static has an edge.** Static boxes (contact, CV jobs,
  stats, the digest, the subscribe box) get the 2px `--stroke` border and no edge.
- **Big radii:** `--radius-xl` 24px for cards and buttons, `--radius-lg` 18px for rows,
  `--radius-md` 14px for inputs and tiles, `--radius-sm` 10px for thumbnails, `--radius-pill` for
  chips, tags and badges.
- **Touch targets are at least 44px** (nav links, chips, buttons, the theme and language
  toggles, the manuscript arrows).
- **Focus ring:** 3px solid `--focus`, 2px offset, on every focusable thing (`:focus-visible`).
- **One glow per screen at the top** (`body` background) plus the `h1` glow at night. No other
  decorative gradients, except the featured card's corner halo and the digest header tint.
- The site is for a general audience. **Copy never uses command syntax** — no `$` prompts, `./`,
  `--flags`, `cat`, `ls`, `cd`, `~/` or URL paths as labels. Buttons and headings are plain
  words: "Write to me", "Save as PDF", "Experience". Sentence case everywhere; buttons, badges
  and eyebrows are uppercased by CSS, so write them in sentence case in the source.
- No emoji in the site's own copy. The exceptions are content that isn't Anderson's UI: video
  titles, and /noticias, which mirrors the daily email.
- **Icons are Streamline's Plump Line** (free set, CC BY 4.0 — the credit in the home footer
  must stay). They live in `src/components/Icons.tsx` as components with `stroke="currentColor"`
  on Plump's 48px grid, so they take the color of where they sit and follow palette and theme;
  section icons sit in an accent color inside a `--surface-sunken` tile. To add one, pick it from
  *Plump Line - Free* in Streamline, download the SVG and paste its path data — don't mix in
  other families or hand-drawn icons. No icon font.
- **The Lukitas card is the one place in Lukitas' own colors.** `.lukitas` re-points the site
  tokens to Lukitas' night purple / day lavender inside that card only: its gold → candy
  wordmark (night), a purple "See Lukitas" button with white text (4.8:1 night, 5.6:1 day), gold
  (night) or violet `#6a2fe0` (day) eyebrow. The purple glow sits behind the coin, not the text,
  because by day the violet and amber only pass AA on the plain lavender. It shows Lukitas' own
  mascot (`public/lukitas.webp`, a still frame from its sprite sheet). Never recolor the mascot
  or put it over text, and don't spread the purple to the rest of the site.

## Motion

Playful but small. Every press is 80ms (`--press`); hover changes are 200ms.

| Effect | Where | Notes |
| --- | --- | --- |
| Press | `.btn`, `.btn-ghost`, `.chip`, `.card`, `.post`, `.vid`, `.ms-page` | moves down onto its edge on `:active` |
| Card hover | `.card` | lifts 2px, edge grows to 7px, border tints toward brand |
| Title rise | `h1`, `.typeline` | fades up 14px once on load |
| Typed role line | `TypedRoles.tsx` | cycles 5 roles under the name, blinking lime caret |
| Cursor glow | `CursorGlow.tsx` | soft brand halo trailing the pointer, rAF-throttled |

All of it sits behind `@media (prefers-reduced-motion: reduce)`, which cuts every animation and
transition to ~0, hides the cursor glow, turns off smooth scrolling and straightens the tilted
portrait. The press still happens (it is feedback, not animation) but snaps instead of easing.
Keep any new animation inside that guard.

## Theming

`data-theme` on `<html>`, either `dark` (default) or `light`.

An inline script in `layout.tsx` sets it from `localStorage` **before first paint** — this is
what prevents a white flash on load. Do not move it into a component or a `useEffect`.
`Header.tsx` toggles it and writes back to `localStorage` under the key `al-theme`. The toggle
is an icon button — a sun at night, a moon by day, i.e. the theme it switches to — with the
label kept as screen-reader text.

**Palettes.** Independent of night/day, visitors pick the colors with the two-swatch button in
the header: **café** (the default, no attribute) or **mint** (`data-palette="mint"` on
`<html>`). The choice is stored under `al-palette` and applied by the same pre-paint script.
Café lives in `:root` / `:root[data-theme="light"]` (night: espresso board, backlit beige
lettering; day: latte paper), with burnt-orange `--brand` (`#e8834f`, dark `--on-brand` text)
for buttons in both. Mint re-points the same tokens in `:root[data-palette="mint"]` and
`:root[data-palette="mint"][data-theme="light"]`, so no component needs palette-specific code.
At night café's neon `--heading-glow` also lights `.sec-head h2`. Café passes AA like mint — night: ink 12.3, ink-muted 7.5, link
9.1, lime (honey) 9.0, cyan (terracotta) 6.6, on-brand 6.8; day: ink 12.0, ink-muted 6.5,
heading 6.6, link 5.7, lime 5.1, cyan 5.1, near 4.7, over 4.8, on-brand 6.8 (minimum across
`--bg`, `--bg-glow`, `--surface`, `--surface-row`). A new palette is one more pair of token
blocks plus a swatch; check every text token against those four surfaces in both modes.

The header reads the current theme with `useSyncExternalStore` + a `MutationObserver`, not
`useState` + `useEffect`. The DOM attribute is the source of truth; copying it into state in an
effect renders the wrong button label for a frame on a light-mode visit, and trips
`react-hooks/set-state-in-effect`. `toggle` only writes the attribute — the observer drives the
re-render. Don't "simplify" it back.

## Content

Experience data was transcribed from Anderson's LinkedIn export (Sept 2026). Current roles:

- **AI Advocate**, Streamline (Jun 2026 – now) — the current title, listed separately from the
  Growth role so the progression inside Streamline is visible.
- **Technical Lead, Growth**, Streamline (2024–2026)
- **Co-founder**, Slinqer (2020–2024)
- Agrosty, Tingo Colombia, Timugo, Gases de Occidente, freelance — 2018 onward.

Copy is in English, written in active voice, first person, understated. No superlatives, no
"passionate about", no metrics that aren't real. Blog posts and videos in `src/data/` are
**placeholder entries** with `#` URLs until real content exists.

## Gotchas

- `overflow: hidden` on any ancestor of `<header>` breaks the sticky nav. Use `overflow-x: clip`.
- Tailwind's utilities are global class names. A component class that matches one picks up its
  styles too — `.overline` once drew a line over the video date. Check before naming a class
  after a CSS word (`overline`, `underline`, `truncate`, `hidden`, `grid`, `border`…).
- Tailwind 4 has no JS config file. Theme changes go in the `@theme inline` block in
  `globals.css`.

## Open work

- **`public/portrait.jpg` is a generated stand-in, not a real photo.** The hero already renders
  it through `next/image` (square slot, `object-fit:cover`, `object-position:50% 22%`). Drop the
  real 3:4 portrait in at that exact path and no code changes are needed. Do not deploy until
  it is replaced.
- Real YouTube links and thumbnails in `src/data/videos.ts`.
- Blog email capture was removed (no blog newsletter yet). The only email list is /noticias.
- Point `andersonlaverde.com` DNS at Vercel and remove the domain from Framer.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

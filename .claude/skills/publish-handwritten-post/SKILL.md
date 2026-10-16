---
name: publish-handwritten-post
description: Publish a handwritten blog post on andersonlaverde.com from photos or exports of handwritten pages (S Pen / Samsung Notes, paper photos, white or dark background). Converts the pages to theme-aware ink masks, transcribes them, writes the post file, shows it locally and opens the PR. Use whenever Anderson shares images of handwritten pages for the blog, or asks to publish a new handwritten post.
---

# Publish a handwritten post

Anderson writes some posts by hand. Each post shows the transcript by default and the
handwritten pages in a second tab, side by side, with click-to-zoom. The format and the page
code are described in AGENTS.md ("Blog posts hosted here"); this is the procedure.

## 1. Collect what you need

- **The page images**, in reading order. Images pasted into the chat are saved under the
  session's `images/` folder; use those paths. Ask for the order if it isn't obvious.
- **The title.** Ask if he didn't give one. Don't invent a title.
- **The date**: today unless he says otherwise (YYYY-MM-DD).
- **The slug**: the title in lowercase ASCII, words joined by hyphens, accents removed
  (`Pensamientos en una panadería` → `pensamientos-en-una-panaderia`).

## 2. Branch

Every change goes through a PR (AGENTS.md). Start from the latest master:

```bash
git fetch origin && git checkout -b blog/<slug> origin/master
```

## 3. Convert the pages

```bash
scripts/ink-mask.sh <slug> <page1> <page2> ...
```

It writes `public/blog/<slug>/01.png`, `02.png`, … The script handles both a white and a
dark background (it detects which one and inverts when needed), flattens shadows and uneven
light from phone photos, and caps the width at 1080px. The output is a transparent mask: the
page paints the ink in `--ink`, so it reads on both themes.

**Check the result.** Look at each output flattened onto white
(`magick public/blog/<slug>/01.png -background white -alpha remove -resize 40% /tmp/check.png`)
and read it. Look for: missing faint strokes, grey blotches left from the paper, or the page
rotated. If a photo still shows paper texture, raise the first number of `-level` in the
script for that run; if strokes vanish, lower it. Crop photos that include the table around
the paper before converting.

## 4. Transcribe

Read the pages and transcribe them **literally**:

- Fix spelling and accents (`hacia` → `hacía` when it means "did", `pixeles` → `píxeles`),
  and add Spanish opening marks (`¿`, `¡`).
- Keep his wording and grammar exactly as written. Don't add missing words
  ("Observo una chica" stays), don't rephrase, don't merge or split sentences.
- Keep his paragraph breaks: a new paragraph where he left a gap or started a new block.
- Flag any word you can't read with certainty, and ask him instead of guessing.

## 5. Write the post

`content/posts/<slug>.md`:

```md
---
title: <title as given, with accents>
date: YYYY-MM-DD
excerpt: <first sentence of the transcript, or a short one he approves>
pages: <number of PNGs>
---

<paragraph>

<paragraph>
```

Plain paragraphs only: no Markdown or HTML is rendered. `/blog` and the RSS feed pick the post
up on their own; there's nothing else to register.

## 6. Check and show it locally — before pushing

```bash
npx tsc --noEmit && npm run lint && npm test && npm run build
```

`test/localPosts.test.ts` fails if a post doesn't parse or a page image is missing.

Then run it (`npx next start -p 3125`), open `/blog/<slug>` in the browser pane and show the
pane to Anderson. Check the transcript, the "Ver el manuscrito" tab in dark and light mode,
and click a page to zoom. **Wait for his OK before committing and pushing.** He reviews
locally first.

The zoom animation doesn't run while the browser pane is hidden; show the pane before
testing it.

## 7. Open the PR

Commit (no Claude co-author line), push, open a PR against `master` with the check results,
wait for the Vercel check, and hand back the PR URL and the preview URL. Don't merge unless
he asks for that PR to be merged.

The Vercel preview needs his login; local is what you can verify yourself.

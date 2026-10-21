#!/usr/bin/env bash
# Turns photos or exports of handwritten pages into the transparent ink masks the blog uses.
#
#   scripts/ink-mask.sh <slug> <page1> [page2 ...]
#
# Writes public/blog/<slug>/01.png, 02.png, … in the order given. Each output is a grayscale
# PNG whose alpha is the ink: transparent paper, opaque strokes. The post page paints that
# mask in --ink, so the handwriting reads on both the dark and the light theme.
#
# Works with either kind of source:
#   - dark ink on a light background (Samsung Notes export, photo of paper)
#   - light ink on a dark background (dark-mode export)
# The background is detected from the image's median brightness and inverted when needed.
# Uneven lighting in phone photos is flattened before the ink is extracted.
#
# Requires ImageMagick 7 (`magick`).
set -euo pipefail

if [ $# -lt 2 ]; then
  echo "usage: $0 <slug> <page1> [page2 ...]" >&2
  exit 1
fi

slug=$1
shift
if ! [[ $slug =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "slug must be lowercase words joined by hyphens: $slug" >&2
  exit 1
fi
command -v magick >/dev/null || { echo "ImageMagick 7 (magick) is required" >&2; exit 1; }

root=$(cd "$(dirname "$0")/.." && pwd)
out="$root/public/blog/$slug"
mkdir -p "$out"

n=0
for src in "$@"; do
  n=$((n + 1))
  dest="$out/$(printf '%02d' "$n").png"

  # Median brightness of a small grayscale copy: > 0.5 means a light background.
  median=$(magick "$src" -auto-orient -colorspace gray -resize 200x200 -format '%[fx:median]' info:)
  if awk "BEGIN { exit !($median > 0.5) }"; then bg=light; else bg=dark; fi

  # 1. upright, grayscale, at most 1080px wide (the page never shows larger)
  # 2. divide by a heavy blur: flattens shadows and uneven light, paper goes to pure white
  #    (on a dark background the image is inverted first so the same step applies)
  # 3. invert so ink is bright, stretch so faint strokes stay visible and paper noise drops out
  # 4. that brightness becomes the alpha channel; the color is black (the page paints it)
  magick "$src" -auto-orient -colorspace gray -resize '1080x>' \
    $( [ $bg = dark ] && echo -negate ) \
    \( +clone -blur 0x24 \) -compose divide_src -composite \
    -negate -level 12%,65% \
    -background black -alpha shape \
    -define png:color-type=4 -strip "$dest"

  size=$(magick identify -format '%wx%h' "$dest")
  echo "$dest  ($size, $bg background)"
done

echo "$n page(s). Set 'pages: $n' in content/posts/$slug.md."

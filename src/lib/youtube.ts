export type Video = {
  id: string;
  title: string;
  url: string;
  published: string;
  thumbnail: string;
};

const NAMED_ENTITIES: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
};

/** YouTube escapes `&`, quotes and angle brackets in feed titles. */
function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&(?:lt|gt|quot|apos);/g, (match) => NAMED_ENTITIES[match])
    // `&amp;` last, so a decoded `&` can't be read as the start of another entity
    .replace(/&amp;/g, "&");
}

function tagText(xml: string, name: string): string | null {
  const match = xml.match(new RegExp(`<${name}>([^<]*)</${name}>`));
  return match ? match[1].trim() : null;
}

export function thumbnailUrl(id: string, quality: "hq" | "max" = "hq"): string {
  const file = quality === "max" ? "maxresdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${id}/${file}.jpg`;
}

/** Parses a YouTube channel feed. Returns [] for anything that isn't one. */
export function parseFeed(xml: string): Video[] {
  const entries = xml.match(/<entry>[\s\S]*?<\/entry>/g) ?? [];

  return entries.flatMap((entry) => {
    const id = tagText(entry, "yt:videoId");
    if (!id) return [];

    return [
      {
        id,
        title: decodeEntities(tagText(entry, "title") ?? ""),
        url: `https://www.youtube.com/watch?v=${id}`,
        published: tagText(entry, "published") ?? "",
        thumbnail: thumbnailUrl(id),
      },
    ];
  });
}

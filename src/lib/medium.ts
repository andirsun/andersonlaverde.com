export type Post = {
  id: string;
  title: string;
  url: string;
  published: string;
  excerpt: string;
  image?: string;
};

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    // `&amp;` last, so a decoded `&` can't start another entity
    .replace(/&amp;/g, "&");
}

/** Text of a tag, with or without CDATA. */
function tag(xml: string, name: string): string | null {
  const m = xml.match(new RegExp(`<${name}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${name}>`));
  return m ? m[1].trim() : null;
}

function plain(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
}

function clip(text: string, max = 180): string {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max)).replace(/[,.;:]$/, "") + "…";
}

function safeHttps(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    return u.protocol === "https:" ? u.href : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Parses a Medium profile RSS feed. The excerpt is the post's subtitle (<h4>) or, without
 * one, its first paragraph — as plain text, never HTML. Returns [] for anything else.
 */
export function parseMediumFeed(xml: string): Post[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  return items.flatMap((item) => {
    const link = safeHttps(tag(item, "link") ?? undefined);
    const title = tag(item, "title");
    if (!link || !title) return [];

    const url = new URL(link);
    url.search = ""; // drop Medium's ?source=rss tracking
    const content = tag(item, "content:encoded") ?? "";
    const lead = content.match(/<h4>([\s\S]*?)<\/h4>/) ?? content.match(/<p>([\s\S]*?)<\/p>/);
    const pub = new Date(tag(item, "pubDate") ?? "");

    return [{
      id: (tag(item, "guid") ?? url.href).split("/").pop() ?? url.href,
      title: plain(title),
      url: url.href,
      published: Number.isNaN(pub.getTime()) ? "" : pub.toISOString(),
      excerpt: lead ? clip(plain(lead[1])) : "",
      image: safeHttps(content.match(/<img[^>]+src="([^"]+)"/)?.[1]),
    }];
  });
}

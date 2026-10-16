/**
 * A post written for this site rather than Medium. The source is a Markdown-ish file in
 * `content/posts/<slug>.md`: a `---` frontmatter block of `key: value` lines, then the
 * body as plain paragraphs separated by blank lines. No Markdown or HTML is rendered —
 * the body is a transcript, so paragraphs of text are all it needs.
 *
 * `pages` counts the handwritten pages in `public/blog/<slug>/01.png`, `02.png`, …
 */
export type LocalPost = {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  excerpt: string;
  paragraphs: string[];
  pages: number;
};

export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Returns null for anything malformed, so one bad file can't break /blog. */
export function parsePostFile(slug: string, source: string): LocalPost | null {
  if (!SLUG.test(slug)) return null;

  const m = source.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;

  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }

  const paragraphs = m[2]
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const pages = Number(meta.pages ?? 0);

  if (!meta.title || !DATE.test(meta.date ?? "") || paragraphs.length === 0) return null;
  if (!Number.isInteger(pages) || pages < 0) return null;

  return {
    slug,
    title: meta.title,
    date: meta.date,
    excerpt: meta.excerpt ?? "",
    paragraphs,
    pages,
  };
}

/** Width and height from a PNG's IHDR chunk, or null if it isn't a PNG. */
export function pngSize(bytes: Uint8Array): { width: number; height: number } | null {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (bytes.length < 24 || sig.some((b, i) => bytes[i] !== b)) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export type FeedItem = { title: string; url: string; published: string; excerpt: string };

/** RSS 2.0 for /blog/rss.xml. Every field is escaped; items are emitted in the order given. */
export function buildRss(site: string, items: FeedItem[]): string {
  const entries = items
    .map((i) => {
      const date = new Date(i.published);
      return [
        "    <item>",
        `      <title>${escapeXml(i.title)}</title>`,
        `      <link>${escapeXml(i.url)}</link>`,
        `      <guid>${escapeXml(i.url)}</guid>`,
        Number.isNaN(date.getTime()) ? "" : `      <pubDate>${date.toUTCString()}</pubDate>`,
        i.excerpt ? `      <description>${escapeXml(i.excerpt)}</description>` : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Anderson Laverde — blog</title>
    <link>${escapeXml(`${site}/blog`)}</link>
    <description>Lo que escribo: tecnología, medio ambiente e historias personales.</description>
    <language>es</language>
${entries}
  </channel>
</rss>
`;
}

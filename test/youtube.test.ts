import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { parseFeed, thumbnailUrl } from "@/lib/youtube";

const REAL_FEED = readFileSync(
  new URL("./fixtures/channel-feed.xml", import.meta.url),
  "utf8",
);

describe("parseFeed", () => {
  test("returns one video per feed entry", () => {
    expect(parseFeed(REAL_FEED)).toHaveLength(6);
  });

  test("extracts id, title, url and date from an entry", () => {
    expect(parseFeed(REAL_FEED)[0]).toEqual({
      id: "QMdSGNCJmqM",
      title: "Volley Tournament Oct 25 - First place",
      url: "https://www.youtube.com/watch?v=QMdSGNCJmqM",
      published: "2025-10-26T19:18:21+00:00",
      thumbnail: "https://i.ytimg.com/vi/QMdSGNCJmqM/hqdefault.jpg",
    });
  });

  test("keeps the feed's newest-first order", () => {
    const dates = parseFeed(REAL_FEED).map((v) => v.published);
    expect(dates.length).toBeGreaterThan(1);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  test("preserves accents and emoji in titles", () => {
    const titles = parseFeed(REAL_FEED).map((v) => v.title);
    expect(titles).toContain("¡Vi pingüinos por primera vez! - Oceanario de Lisboa 🦈 - Portugual 🇵🇹");
  });

  test("decodes XML entities in titles", () => {
    const xml = entryWithTitle("Rust &amp; Go: what&#39;s &quot;fast&quot; &lt;really&gt;?");
    expect(parseFeed(xml)[0].title).toBe('Rust & Go: what\'s "fast" <really>?');
  });

  test("returns no videos for malformed xml", () => {
    expect(parseFeed("<html>404 not found</html>")).toEqual([]);
  });

  test("skips entries that have no video id", () => {
    const xml = `<feed><entry><title>orphan</title></entry></feed>`;
    expect(parseFeed(xml)).toEqual([]);
  });
});

describe("thumbnailUrl", () => {
  test("builds an hqdefault url by default", () => {
    expect(thumbnailUrl("abc123")).toBe("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
  });

  test("builds a maxresdefault url when asked", () => {
    expect(thumbnailUrl("abc123", "max")).toBe("https://i.ytimg.com/vi/abc123/maxresdefault.jpg");
  });
});

function entryWithTitle(title: string) {
  return `<feed><entry>
    <yt:videoId>xyz789</yt:videoId>
    <title>${title}</title>
    <published>2026-01-01T00:00:00+00:00</published>
  </entry></feed>`;
}

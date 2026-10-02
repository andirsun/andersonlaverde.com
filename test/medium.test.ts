import { readFileSync } from "node:fs";
import { afterEach, describe, expect, test, vi } from "vitest";
import { FALLBACK_POSTS, getPosts } from "@/data/posts";
import { parseMediumFeed } from "@/lib/medium";

const REAL_FEED = readFileSync(new URL("./fixtures/medium-feed.xml", import.meta.url), "utf8");

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseMediumFeed", () => {
  test("reads the real feed", () => {
    const posts = parseMediumFeed(REAL_FEED);

    expect(posts).toHaveLength(3);
    expect(posts[0].title).toBe("Renuncie a mi sueño como programador");
    expect(posts[0].published).toBe("2021-08-04T17:29:57.000Z");
  });

  test("drops Medium's tracking query from links", () => {
    for (const p of parseMediumFeed(REAL_FEED)) {
      expect(p.url).toMatch(/^https:\/\/andirsun\.medium\.com\//);
      expect(p.url).not.toContain("?");
    }
  });

  test("uses the subtitle as plain-text excerpt", () => {
    const [first] = parseMediumFeed(REAL_FEED);
    expect(first.excerpt).toMatch(/^¿Qué haré ahora/);
    expect(first.excerpt).not.toMatch(/<|&/);
  });

  test("ignores non-https links and junk", () => {
    expect(parseMediumFeed("<html>nope</html>")).toEqual([]);
    expect(
      parseMediumFeed("<item><title>x</title><link>javascript:alert(1)</link></item>"),
    ).toEqual([]);
  });
});

describe("getPosts", () => {
  test("returns the feed's posts", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(REAL_FEED, { status: 200 })));
    expect(await getPosts()).toHaveLength(3);
  });

  test("falls back to the snapshot when medium is down or returns junk", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("ENOTFOUND"); }));
    expect(await getPosts()).toEqual(FALLBACK_POSTS);

    vi.stubGlobal("fetch", vi.fn(async () => new Response("<html/>", { status: 200 })));
    expect(await getPosts()).toEqual(FALLBACK_POSTS);
  });

  test("snapshot matches the live feed", () => {
    expect(FALLBACK_POSTS.map((p) => p.url)).toEqual(parseMediumFeed(REAL_FEED).map((p) => p.url));
  });
});

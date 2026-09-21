import { readFileSync } from "node:fs";
import { afterEach, describe, expect, test, vi } from "vitest";
import { FALLBACK_VIDEOS, bestThumbnail, getVideos } from "@/data/videos";

const REAL_FEED = readFileSync(
  new URL("./fixtures/channel-feed.xml", import.meta.url),
  "utf8",
);

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetch(impl: (url: string, init?: RequestInit) => Promise<Response> | Response) {
  vi.stubGlobal("fetch", vi.fn((url: string | URL, init?: RequestInit) => impl(String(url), init)));
}

describe("getVideos", () => {
  test("returns the videos the feed reports", async () => {
    stubFetch(() => new Response(REAL_FEED, { status: 200 }));

    const videos = await getVideos();

    expect(videos).toHaveLength(6);
    expect(videos[0].title).toBe("Volley Tournament Oct 25 - First place");
  });

  test("falls back to the snapshot when the network fails", async () => {
    stubFetch(() => Promise.reject(new Error("ENOTFOUND")));

    expect(await getVideos()).toEqual(FALLBACK_VIDEOS);
  });

  test("falls back to the snapshot when youtube returns an error status", async () => {
    stubFetch(() => new Response("nope", { status: 503 }));

    expect(await getVideos()).toEqual(FALLBACK_VIDEOS);
  });

  test("falls back rather than rendering an empty page", async () => {
    stubFetch(() => new Response("<html>not a feed</html>", { status: 200 }));

    expect(await getVideos()).toEqual(FALLBACK_VIDEOS);
  });

  test("ships a non-empty snapshot", () => {
    expect(FALLBACK_VIDEOS.length).toBeGreaterThan(0);
  });
});

describe("bestThumbnail", () => {
  test("prefers maxresdefault when youtube has one", async () => {
    stubFetch(() => new Response(null, { status: 200 }));

    expect(await bestThumbnail("abc123")).toBe("https://i.ytimg.com/vi/abc123/maxresdefault.jpg");
  });

  test("falls back to hqdefault when maxresdefault is missing", async () => {
    stubFetch(() => new Response(null, { status: 404 }));

    expect(await bestThumbnail("abc123")).toBe("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
  });

  test("falls back to hqdefault when the probe throws", async () => {
    stubFetch(() => Promise.reject(new Error("ECONNRESET")));

    expect(await bestThumbnail("abc123")).toBe("https://i.ytimg.com/vi/abc123/hqdefault.jpg");
  });
});

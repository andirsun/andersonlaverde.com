import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { getLocalPost, getLocalPosts, getPages } from "@/data/localPosts";
import { buildRss, parsePostFile, pngSize } from "@/lib/localPosts";

const FILE = `---
title: Un título
date: 2026-10-16
excerpt: Resumen corto.
pages: 1
---

Primer párrafo
en dos líneas.

Segundo párrafo.
`;

describe("parsePostFile", () => {
  test("reads frontmatter and splits paragraphs", () => {
    expect(parsePostFile("un-titulo", FILE)).toEqual({
      slug: "un-titulo",
      title: "Un título",
      date: "2026-10-16",
      excerpt: "Resumen corto.",
      paragraphs: ["Primer párrafo en dos líneas.", "Segundo párrafo."],
      pages: 1,
    });
  });

  test("accepts CRLF line endings", () => {
    expect(parsePostFile("un-titulo", FILE.replace(/\n/g, "\r\n"))?.paragraphs).toHaveLength(2);
  });

  test("rejects bad slugs, missing title, bad dates and empty bodies", () => {
    expect(parsePostFile("../etc", FILE)).toBeNull();
    expect(parsePostFile("ok", FILE.replace("title: Un título\n", ""))).toBeNull();
    expect(parsePostFile("ok", FILE.replace("2026-10-16", "ayer"))).toBeNull();
    expect(parsePostFile("ok", FILE.replace(/---\n\n[\s\S]*$/, "---\n"))).toBeNull();
    expect(parsePostFile("ok", FILE.replace("pages: 1", "pages: -1"))).toBeNull();
    expect(parsePostFile("ok", "no frontmatter")).toBeNull();
  });
});

describe("pngSize", () => {
  test("reads a PNG header and rejects anything else", () => {
    const png = readFileSync("public/blog/pensamientos-en-una-panaderia/01.png");
    expect(pngSize(png)).toEqual({ width: 1080, height: 1527 });
    expect(pngSize(new TextEncoder().encode("not a png at all, really"))).toBeNull();
  });
});

describe("buildRss", () => {
  test("escapes every field", () => {
    const xml = buildRss("https://x.test", [
      { title: "A & <B>", url: "https://x.test/blog/a?b=1&c=2", published: "2026-10-16T00:00:00.000Z", excerpt: '"q"' },
    ]);
    expect(xml).toContain("<title>A &amp; &lt;B&gt;</title>");
    expect(xml).toContain("<link>https://x.test/blog/a?b=1&amp;c=2</link>");
    expect(xml).toContain("<description>&quot;q&quot;</description>");
    expect(xml).toContain("<pubDate>Fri, 16 Oct 2026 00:00:00 GMT</pubDate>");
  });
});

describe("content/posts", () => {
  test("every committed post parses and has its handwritten pages", () => {
    const posts = getLocalPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(getPages(post)).toHaveLength(post.pages);
    }
  });

  test("pensamientos en una panadería", () => {
    const post = getLocalPost("pensamientos-en-una-panaderia");
    expect(post?.title).toBe("Pensamientos en una panadería");
    expect(post?.paragraphs).toHaveLength(4);
    expect(post?.pages).toBe(2);
  });
});

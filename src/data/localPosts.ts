import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { SLUG, parsePostFile, pngSize, type LocalPost } from "@/lib/localPosts";

export type { LocalPost };

export type Page = { src: string; width: number; height: number };

/** `content/` and `public/blog/` are traced into the server bundle in next.config.ts. */
const CONTENT_DIR = path.join(process.cwd(), "content", "posts");
const PUBLIC_DIR = path.join(process.cwd(), "public");

/** Every post in `content/posts/`, newest first. */
export function getLocalPosts(): LocalPost[] {
  let files: string[];
  try {
    files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  return files
    .flatMap((f) => {
      const post = parsePostFile(f.slice(0, -3), readFileSync(path.join(CONTENT_DIR, f), "utf8"));
      return post ? [post] : [];
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getLocalPost(slug: string): LocalPost | null {
  if (!SLUG.test(slug)) return null;
  return getLocalPosts().find((p) => p.slug === slug) ?? null;
}

/** The handwritten pages, with their pixel size so the layout doesn't jump. */
export function getPages(post: LocalPost): Page[] {
  return Array.from({ length: post.pages }, (_, i) => {
    const src = `/blog/${post.slug}/${String(i + 1).padStart(2, "0")}.png`;
    const size = pngSize(readFileSync(path.join(PUBLIC_DIR, src)));
    if (!size) throw new Error(`${src} is not a PNG`);
    return { src, ...size };
  });
}

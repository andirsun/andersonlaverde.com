import { getBlogEntries } from "@/data/posts";
import { buildRss } from "@/lib/localPosts";

/** Follows /blog: new Medium posts appear within the hour. */
export const revalidate = 3600;

const SITE = "https://andersonlaverde.com";

export async function GET() {
  const entries = await getBlogEntries();
  const xml = buildRss(
    SITE,
    entries.map((e) => ({ ...e, url: e.source === "local" ? `${SITE}${e.url}` : e.url })),
  );
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

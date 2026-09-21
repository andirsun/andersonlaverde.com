import { parseFeed, thumbnailUrl, type Video } from "@/lib/youtube";

export type { Video };

export const CHANNEL_ID = "UC-GGZODarfLyjEOz3GhgKnw";
export const CHANNEL_URL = "https://www.youtube.com/@andirsun";
export const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

/** Regenerate the page at most once an hour, so new uploads appear without a deploy. */
const REVALIDATE_SECONDS = 3600;

/**
 * Snapshot of the feed, used only when YouTube is unreachable. Without it a failed
 * fetch during a build would ship an empty page.
 */
export const FALLBACK_VIDEOS: Video[] = [
    {
      "id": "QMdSGNCJmqM",
      "title": "Volley Tournament Oct 25 - First place",
      "url": "https://www.youtube.com/watch?v=QMdSGNCJmqM",
      "published": "2025-10-26T19:18:21+00:00",
      "thumbnail": "https://i.ytimg.com/vi/QMdSGNCJmqM/hqdefault.jpg"
    },
    {
      "id": "eb5qn2yJ5m0",
      "title": "7 de setembro de 2025",
      "url": "https://www.youtube.com/watch?v=eb5qn2yJ5m0",
      "published": "2025-09-07T05:42:01+00:00",
      "thumbnail": "https://i.ytimg.com/vi/eb5qn2yJ5m0/hqdefault.jpg"
    },
    {
      "id": "9Brbrz1bWfc",
      "title": "La próxima semana cumplo 26",
      "url": "https://www.youtube.com/watch?v=9Brbrz1bWfc",
      "published": "2025-08-19T23:26:46+00:00",
      "thumbnail": "https://i.ytimg.com/vi/9Brbrz1bWfc/hqdefault.jpg"
    },
    {
      "id": "H_0OXBhlvdU",
      "title": "¿Los portugueses tienen cultura VIAL? 🤷🚗- Vlog 01 - Portugal 🇵🇹",
      "url": "https://www.youtube.com/watch?v=H_0OXBhlvdU",
      "published": "2023-08-17T15:30:59+00:00",
      "thumbnail": "https://i.ytimg.com/vi/H_0OXBhlvdU/hqdefault.jpg"
    },
    {
      "id": "OFspv7wmiK4",
      "title": "¡Vi pingüinos por primera vez! - Oceanario de Lisboa 🦈 - Portugual 🇵🇹",
      "url": "https://www.youtube.com/watch?v=OFspv7wmiK4",
      "published": "2023-08-14T08:36:50+00:00",
      "thumbnail": "https://i.ytimg.com/vi/OFspv7wmiK4/hqdefault.jpg"
    },
    {
      "id": "A5dd0sTfm0I",
      "title": "Verano en Lisboa - Portugal 🇵🇹",
      "url": "https://www.youtube.com/watch?v=A5dd0sTfm0I",
      "published": "2023-08-11T10:08:11+00:00",
      "thumbnail": "https://i.ytimg.com/vi/A5dd0sTfm0I/hqdefault.jpg"
    }
  ];

export async function getVideos(): Promise<Video[]> {
  try {
    const response = await fetch(FEED_URL, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) return FALLBACK_VIDEOS;

    const videos = parseFeed(await response.text());
    return videos.length > 0 ? videos : FALLBACK_VIDEOS;
  } catch {
    return FALLBACK_VIDEOS;
  }
}

/**
 * maxresdefault.jpg is sharper but missing on some uploads, so probe before
 * pointing the large featured slot at it.
 */
export async function bestThumbnail(id: string): Promise<string> {
  try {
    const response = await fetch(thumbnailUrl(id, "max"), {
      method: "HEAD",
      next: { revalidate: REVALIDATE_SECONDS },
    });
    return thumbnailUrl(id, response.ok ? "max" : "hq");
  } catch {
    return thumbnailUrl(id, "hq");
  }
}

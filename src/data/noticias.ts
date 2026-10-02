import { isDigestDate, parseDigest, parseIndex, type DayEntry, type Digest } from "@/lib/noticias";

export type { DayEntry, Digest };

/**
 * The daily digest is written by a Hermes cron job to this gist after the email goes
 * out: one `YYYY-MM-DD.json` per day plus an `index.json` listing every day. The site
 * only reads it, so a new day appears within the revalidate window without a deploy.
 */
export const GIST_ID = "1b185fd5b80ff3361f5e4c1d749ea640";
const RAW_BASE = `https://gist.githubusercontent.com/andirsun/${GIST_ID}/raw`;

const REVALIDATE_SECONDS = 3600;

async function fetchJson(file: string): Promise<unknown> {
  try {
    const response = await fetch(`${RAW_BASE}/${file}`, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/** Every published day, newest first. Empty when the gist is unreachable. */
export async function getDays(): Promise<DayEntry[]> {
  return parseIndex(await fetchJson("index.json"));
}

export async function getDigest(date: string): Promise<Digest | null> {
  if (!isDigestDate(date)) return null;
  return parseDigest(await fetchJson(`${date}.json`));
}

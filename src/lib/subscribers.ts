/**
 * Subscriber list for the daily /noticias email.
 *
 * The list is a JSON file in the private repo `andirsun/noticias-suscriptores`. The site
 * writes to it (subscribe / unsubscribe) through the GitHub contents API; the Hermes cron
 * reads it each morning and sends the digest from noticias@andersonlaverde.com.
 *
 * Each subscriber carries a random token. The unsubscribe link only contains the token, so
 * it never exposes the address and can't be guessed to remove someone else.
 */

export type Subscriber = { email: string; token: string; subscribedAt: string };
export type SubscriberList = { subscribers: Subscriber[] };

/** Proton's sending limits make this a small list on purpose. */
export const MAX_SUBSCRIBERS = 150;

const REPO = "andirsun/noticias-suscriptores";
const FILE = "subscribers.json";
const API = `https://api.github.com/repos/${REPO}/contents/${FILE}`;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const email = raw.trim().toLowerCase();
  if (email.length > 254) return null;
  // Deliberately simple: one @, a dot in the domain, no spaces or angle brackets.
  return /^[^\s@<>"',;]+@[^\s@<>"',;]+\.[a-z]{2,}$/.test(email) ? email : null;
}

export function isToken(raw: unknown): raw is string {
  return typeof raw === "string" && /^[A-Za-z0-9_-]{20,64}$/.test(raw);
}

export function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export type AddResult = "added" | "exists" | "full";

export function addSubscriber(
  list: SubscriberList,
  email: string,
  token: string,
  now: Date,
): { list: SubscriberList; result: AddResult } {
  if (list.subscribers.some((s) => s.email === email)) return { list, result: "exists" };
  if (list.subscribers.length >= MAX_SUBSCRIBERS) return { list, result: "full" };
  return {
    list: { subscribers: [...list.subscribers, { email, token, subscribedAt: now.toISOString() }] },
    result: "added",
  };
}

export function removeByToken(list: SubscriberList, token: string): { list: SubscriberList; removed: boolean } {
  const subscribers = list.subscribers.filter((s) => s.token !== token);
  return { list: { subscribers }, removed: subscribers.length !== list.subscribers.length };
}

function parseList(input: unknown): SubscriberList {
  const raw = input && typeof input === "object" ? (input as { subscribers?: unknown }).subscribers : null;
  if (!Array.isArray(raw)) return { subscribers: [] };
  return {
    subscribers: raw.filter(
      (s): s is Subscriber =>
        !!s && typeof s === "object" && typeof s.email === "string" && isToken(s.token),
    ),
  };
}

function headers(): HeadersInit {
  const token = process.env.SUBSCRIBERS_GITHUB_TOKEN;
  if (!token) throw new Error("SUBSCRIBERS_GITHUB_TOKEN is not set");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

const toBase64 = (s: string) => Buffer.from(s, "utf8").toString("base64");
const fromBase64 = (s: string) => Buffer.from(s, "base64").toString("utf8");

async function load(): Promise<{ list: SubscriberList; sha: string }> {
  const res = await fetch(API, { headers: headers(), cache: "no-store" });
  if (!res.ok) throw new Error(`load subscribers: ${res.status}`);
  const body = (await res.json()) as { content: string; sha: string };
  return { list: parseList(JSON.parse(fromBase64(body.content))), sha: body.sha };
}

async function save(list: SubscriberList, sha: string, message: string): Promise<boolean> {
  const res = await fetch(API, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ message, sha, content: toBase64(JSON.stringify(list, null, 1) + "\n") }),
  });
  if (res.status === 409 || res.status === 422) return false; // someone else wrote first
  if (!res.ok) throw new Error(`save subscribers: ${res.status}`);
  return true;
}

/**
 * Read-modify-write with optimistic concurrency: GitHub rejects a stale sha, so two
 * simultaneous sign-ups retry instead of overwriting each other.
 */
export async function updateSubscribers<T>(
  change: (list: SubscriberList) => { list: SubscriberList; result: T; message?: string },
): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const { list, sha } = await load();
    const next = change(list);
    if (!next.message) return next.result; // nothing to write
    if (await save(next.list, sha, next.message)) return next.result;
  }
  throw new Error("subscriber list kept changing; gave up");
}

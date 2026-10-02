/**
 * Shapes and validation for the daily independent-media digest.
 *
 * The digest is produced by a Hermes cron job and published as JSON to a gist. The
 * site treats that JSON as untrusted input: nothing is rendered as HTML, links must
 * be http(s), and anything malformed is dropped rather than crashing the page.
 */

/** A run of paragraph text; carries `href` when it is a link to an article. */
export type Segment = { text: string; href?: string; title?: string };

export type Section = { title: string; paragraphs: Segment[][] };

export type Region = { summary: string; sections: Section[]; notes: string[] };

export type Weather = { line: string; summary?: string };

export type Digest = {
  date: string;
  dateLabel: string;
  weather: Weather | null;
  national: Region;
  ibague: Region;
  footer: string;
};

export type DayEntry = { date: string; dateLabel: string; summary: string; ibagueSummary: string };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isDigestDate(value: string): boolean {
  return DATE_RE.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

function safeHref(v: unknown): string | undefined {
  const href = str(v);
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function toSegment(v: unknown): Segment | null {
  const o = obj(v);
  const text = str(o.text);
  if (!text) return null;
  const href = safeHref(o.href);
  if (!href) return { text };
  const title = str(o.title);
  return title ? { text, href, title } : { text, href };
}

function toRegion(v: unknown): Region {
  const o = obj(v);
  return {
    summary: str(o.summary),
    notes: arr(o.notes).map(str).filter(Boolean),
    sections: arr(o.sections)
      .map((s) => {
        const so = obj(s);
        return {
          title: str(so.title),
          paragraphs: arr(so.paragraphs)
            .map((p) => arr(p).map(toSegment).filter((x): x is Segment => x !== null))
            .filter((p) => p.length > 0),
        };
      })
      .filter((s) => s.title && s.paragraphs.length > 0),
  };
}

/** Returns null when the payload isn't a usable digest. */
export function parseDigest(input: unknown): Digest | null {
  const o = obj(input);
  const date = str(o.date);
  if (!isDigestDate(date)) return null;

  const national = toRegion(o.national);
  const ibague = toRegion(o.ibague);
  if (national.sections.length === 0 && ibague.sections.length === 0) return null;

  const w = obj(o.weather);
  const line = str(w.line);

  return {
    date,
    dateLabel: str(o.dateLabel) || date,
    weather: line ? { line, summary: str(w.summary) || undefined } : null,
    national,
    ibague,
    footer: str(o.footer),
  };
}

/** Archive index, newest first, deduplicated by date. */
export function parseIndex(input: unknown): DayEntry[] {
  const seen = new Set<string>();
  return arr(obj(input).days)
    .map((d) => {
      const o = obj(d);
      return {
        date: str(o.date),
        dateLabel: str(o.dateLabel) || str(o.date),
        summary: str(o.summary),
        ibagueSummary: str(o.ibagueSummary),
      };
    })
    .filter((d) => isDigestDate(d.date) && !seen.has(d.date) && seen.add(d.date))
    .sort((a, b) => b.date.localeCompare(a.date));
}

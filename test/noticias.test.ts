import { readFileSync } from "node:fs";
import { afterEach, describe, expect, test, vi } from "vitest";
import { getDays, getDigest } from "@/data/noticias";
import { isDigestDate, parseDigest, parseIndex } from "@/lib/noticias";

const REAL_DIGEST = JSON.parse(
  readFileSync(new URL("./fixtures/digest-2026-10-02.json", import.meta.url), "utf8"),
);

afterEach(() => {
  vi.unstubAllGlobals();
});

function stubFetch(impl: (url: string) => Promise<Response> | Response) {
  vi.stubGlobal("fetch", vi.fn((url: string | URL) => impl(String(url))));
}

describe("parseDigest", () => {
  test("reads a real digest produced by the cron job", () => {
    const d = parseDigest(REAL_DIGEST)!;

    expect(d.date).toBe("2026-10-02");
    expect(d.national.sections).toHaveLength(4);
    expect(d.ibague.sections).toHaveLength(3);
    expect(d.national.summary).toMatch(/Mac Master/);
    expect(d.weather?.line).toMatch(/Ibagué/);
  });

  test("keeps article links inline in paragraph order", () => {
    const first = parseDigest(REAL_DIGEST)!.national.sections[0].paragraphs[0];

    expect(first[1]).toMatchObject({ text: "La Silla Vacía", href: expect.stringMatching(/^https:\/\/www\.lasillavacia\.com\//) });
  });

  test("drops links that are not http(s) but keeps their text", () => {
    const d = parseDigest({
      date: "2026-10-02",
      national: { sections: [{ title: "T", paragraphs: [[{ text: "clic", href: "javascript:alert(1)" }]] }] },
    })!;

    expect(d.national.sections[0].paragraphs[0][0]).toEqual({ text: "clic" });
  });

  test("rejects payloads with no usable sections or a bad date", () => {
    expect(parseDigest(null)).toBeNull();
    expect(parseDigest({ date: "2026-10-02", national: { sections: [] } })).toBeNull();
    expect(parseDigest({ ...REAL_DIGEST, date: "../index" })).toBeNull();
  });
});

describe("parseIndex", () => {
  test("sorts newest first and drops duplicates and junk", () => {
    const days = parseIndex({
      days: [
        { date: "2026-09-30" },
        { date: "2026-10-02", dateLabel: "Viernes" },
        { date: "2026-10-02", dateLabel: "dup" },
        { date: "nope" },
      ],
    });

    expect(days.map((d) => d.date)).toEqual(["2026-10-02", "2026-09-30"]);
    expect(days[0].dateLabel).toBe("Viernes");
  });
});

describe("isDigestDate", () => {
  test("only accepts YYYY-MM-DD", () => {
    expect(isDigestDate("2026-10-02")).toBe(true);
    expect(isDigestDate("2026-13-40")).toBe(false);
    expect(isDigestDate("index")).toBe(false);
  });
});

describe("gist fetch", () => {
  test("getDigest never fetches for an invalid date", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    expect(await getDigest("../../etc")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("getDigest returns the day from the gist", async () => {
    stubFetch((url) => {
      expect(url).toMatch(/\/2026-10-02\.json$/);
      return new Response(JSON.stringify(REAL_DIGEST), { status: 200 });
    });

    expect((await getDigest("2026-10-02"))?.dateLabel).toBe("Viernes 2 de octubre de 2026");
  });

  test("getDays degrades to an empty archive when the gist is down", async () => {
    stubFetch(() => Promise.reject(new Error("ENOTFOUND")));
    expect(await getDays()).toEqual([]);

    stubFetch(() => new Response("nope", { status: 503 }));
    expect(await getDays()).toEqual([]);
  });
});

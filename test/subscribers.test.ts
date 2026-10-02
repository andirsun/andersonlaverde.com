import { afterEach, describe, expect, test, vi } from "vitest";
import {
  MAX_SUBSCRIBERS,
  addSubscriber,
  isToken,
  newToken,
  normalizeEmail,
  removeByToken,
  updateSubscribers,
  type SubscriberList,
} from "@/lib/subscribers";

const NOW = new Date("2026-10-02T09:00:00Z");
const me = { email: "hola@andersonlaverde.com", token: "a".repeat(32), subscribedAt: NOW.toISOString() };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("normalizeEmail", () => {
  test("trims and lowercases valid addresses", () => {
    expect(normalizeEmail("  Ana@Ejemplo.CO ")).toBe("ana@ejemplo.co");
  });

  test("rejects junk and header-injection attempts", () => {
    for (const bad of ["", "no-at", "a@b", "a b@c.com", "a@b.com\nBcc: x@y.com", "<a@b.com>", 42, null]) {
      expect(normalizeEmail(bad)).toBeNull();
    }
  });
});

describe("tokens", () => {
  test("new tokens are url-safe and unique", () => {
    const a = newToken();
    expect(isToken(a)).toBe(true);
    expect(a).not.toBe(newToken());
  });
});

describe("addSubscriber", () => {
  const list: SubscriberList = { subscribers: [me] };

  test("adds a new address", () => {
    const r = addSubscriber(list, "ana@ejemplo.co", "b".repeat(32), NOW);
    expect(r.result).toBe("added");
    expect(r.list.subscribers.map((s) => s.email)).toEqual([me.email, "ana@ejemplo.co"]);
  });

  test("does not duplicate an existing address", () => {
    const r = addSubscriber(list, me.email, "b".repeat(32), NOW);
    expect(r.result).toBe("exists");
    expect(r.list.subscribers).toHaveLength(1);
  });

  test("refuses once the list is full", () => {
    const full = {
      subscribers: Array.from({ length: MAX_SUBSCRIBERS }, (_, i) => ({ ...me, email: `u${i}@x.co` })),
    };
    expect(addSubscriber(full, "ana@ejemplo.co", "b".repeat(32), NOW).result).toBe("full");
  });
});

describe("removeByToken", () => {
  test("deletes the matching subscriber from the list", () => {
    const other = { ...me, email: "ana@ejemplo.co", token: "b".repeat(32) };
    const r = removeByToken({ subscribers: [me, other] }, other.token);
    expect(r.removed).toBe(true);
    expect(r.list.subscribers).toEqual([me]);
  });

  test("is a no-op for unknown tokens", () => {
    expect(removeByToken({ subscribers: [me] }, "z".repeat(32)).removed).toBe(false);
  });
});

describe("updateSubscribers", () => {
  function githubStub(conflicts: number) {
    let stored: SubscriberList = { subscribers: [me] };
    let sha = 1;
    let left = conflicts;
    const fetchMock = vi.fn(async (_url: string, init?: RequestInit) => {
      if (!init?.method) {
        const content = Buffer.from(JSON.stringify(stored)).toString("base64");
        return new Response(JSON.stringify({ content, sha: String(sha) }), { status: 200 });
      }
      if (left-- > 0) return new Response("conflict", { status: 409 });
      const body = JSON.parse(String(init.body));
      stored = JSON.parse(Buffer.from(body.content, "base64").toString("utf8"));
      sha++;
      return new Response("{}", { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubEnv("SUBSCRIBERS_GITHUB_TOKEN", "test-token");
    return { fetchMock, stored: () => stored };
  }

  test("writes the change", async () => {
    const gh = githubStub(0);
    await updateSubscribers((list) => ({ ...addSubscriber(list, "ana@ejemplo.co", "b".repeat(32), NOW), message: "add" }));
    expect(gh.stored().subscribers.map((s) => s.email)).toContain("ana@ejemplo.co");
  });

  test("retries when someone else wrote first", async () => {
    const gh = githubStub(1);
    await updateSubscribers((list) => ({ ...addSubscriber(list, "ana@ejemplo.co", "b".repeat(32), NOW), message: "add" }));
    expect(gh.stored().subscribers).toHaveLength(2);
    expect(gh.fetchMock).toHaveBeenCalledTimes(4);
  });

  test("skips the write when nothing changed", async () => {
    const gh = githubStub(0);
    await updateSubscribers((list) => ({ list, result: "exists" }));
    expect(gh.fetchMock).toHaveBeenCalledTimes(1);
  });
});

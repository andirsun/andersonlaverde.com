import { isToken, removeByToken, updateSubscribers } from "@/lib/subscribers";

/**
 * Removes the subscriber that owns the token. Also serves RFC 8058 one-click unsubscribe:
 * mail clients POST `List-Unsubscribe=One-Click` to the URL in the List-Unsubscribe header,
 * which carries the token as `?t=`.
 *
 * Only POST is accepted. A GET would let link scanners in mail clients unsubscribe people
 * just by previewing the email.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  let token: unknown = url.searchParams.get("t");
  if (!token && (request.headers.get("content-type") ?? "").includes("application/json")) {
    token = ((await request.json().catch(() => ({}))) as { t?: unknown }).t;
  }
  if (!isToken(token)) {
    return Response.json({ ok: false, error: "Enlace de baja inválido." }, { status: 400 });
  }

  try {
    await updateSubscribers((list) => {
      const next = removeByToken(list, token);
      return { list: next.list, result: next.removed, message: next.removed ? "Remove subscriber" : undefined };
    });
    // Already-removed tokens also answer ok: the outcome the visitor wants is the same.
    return Response.json({ ok: true });
  } catch (error) {
    console.error("unsubscribe failed", error);
    return Response.json({ ok: false, error: "No pude procesar la baja. Inténtalo más tarde." }, { status: 500 });
  }
}

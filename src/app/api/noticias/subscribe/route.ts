import { addSubscriber, newToken, normalizeEmail, updateSubscribers } from "@/lib/subscribers";

async function readBody(request: Request): Promise<Record<string, unknown>> {
  const type = request.headers.get("content-type") ?? "";
  try {
    if (type.includes("application/json")) return (await request.json()) as Record<string, unknown>;
    return Object.fromEntries((await request.formData()).entries());
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  const body = await readBody(request);

  // Honeypot: real visitors never see or fill this field. Pretend success so bots move on.
  if (typeof body.website === "string" && body.website !== "") {
    return Response.json({ ok: true });
  }

  const email = normalizeEmail(body.email);
  if (!email) {
    return Response.json({ ok: false, error: "Ese correo no parece válido." }, { status: 400 });
  }

  try {
    const result = await updateSubscribers((list) => {
      const next = addSubscriber(list, email, newToken(), new Date());
      return { ...next, message: next.result === "added" ? "Add subscriber" : undefined };
    });
    if (result === "full") {
      return Response.json(
        { ok: false, error: "La lista está llena por ahora. Vuelve a intentarlo más adelante." },
        { status: 409 },
      );
    }
    // "exists" answers the same as "added" so the form can't be used to probe who is on the list.
    return Response.json({ ok: true });
  } catch (error) {
    console.error("subscribe failed", error);
    return Response.json({ ok: false, error: "No pude guardar tu correo. Inténtalo más tarde." }, { status: 500 });
  }
}

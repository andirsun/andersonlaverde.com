"use client";

import { useState, type FormEvent } from "react";

type State = { kind: "idle" | "sending" | "done" } | { kind: "error"; message: string };

export function SubscribeForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "sending" });
    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/noticias/subscribe", { method: "POST", body: form });
      const body = (await res.json()) as { ok: boolean; error?: string };
      setState(body.ok ? { kind: "done" } : { kind: "error", message: body.error ?? "Algo falló." });
    } catch {
      setState({ kind: "error", message: "No hay conexión. Inténtalo de nuevo." });
    }
  }

  return (
    <section className="sub dg-sub" id="suscribirse" lang="es">
      <h2>📬 ¿Quieres recibir lo mismo que leo yo cada mañana?</h2>
      <p className="sans">
        Deja tu correo y te llega este mismo resumen todos los días, solo desde{" "}
        <strong>noticias@andersonlaverde.com</strong>. Nada más: sin publicidad y sin compartir tu
        correo con nadie. Cada correo trae un enlace para darte de baja, que te borra de la lista.
      </p>
      {state.kind === "done" ? (
        <p className="dg-sub-ok" role="status">
          ✅ Listo. Mañana te llega el primero.
        </p>
      ) : (
        <form className="subform" onSubmit={onSubmit}>
          <label className="sr-only" htmlFor="sub-email">
            Correo electrónico
          </label>
          <input id="sub-email" name="email" type="email" required placeholder="tu@correo.com" autoComplete="email" />
          {/* honeypot: hidden from people, filled by bots */}
          <input className="sr-only" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <button className="btn" type="submit" disabled={state.kind === "sending"}>
            {state.kind === "sending" ? "guardando…" : "suscribirme"}
          </button>
        </form>
      )}
      {state.kind === "error" && (
        <p className="dg-sub-err" role="alert">
          {state.message}
        </p>
      )}
    </section>
  );
}

export function UnsubscribeButton({ token }: { token: string }) {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function confirm() {
    setState({ kind: "sending" });
    try {
      const res = await fetch(`/api/noticias/unsubscribe?t=${encodeURIComponent(token)}`, { method: "POST" });
      const body = (await res.json()) as { ok: boolean; error?: string };
      setState(body.ok ? { kind: "done" } : { kind: "error", message: body.error ?? "Algo falló." });
    } catch {
      setState({ kind: "error", message: "No hay conexión. Inténtalo de nuevo." });
    }
  }

  if (state.kind === "done") {
    return (
      <p className="dg-sub-ok" role="status">
        ✅ Listo, tu correo fue eliminado de la lista. No recibirás más correos.
      </p>
    );
  }
  return (
    <>
      <div className="actions">
        <button className="btn" type="button" onClick={confirm} disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "procesando…" : "darme de baja"}
        </button>
      </div>
      {state.kind === "error" && (
        <p className="dg-sub-err" role="alert">
          {state.message}
        </p>
      )}
    </>
  );
}

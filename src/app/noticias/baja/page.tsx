import type { Metadata } from "next";
import Link from "next/link";
import { UnsubscribeButton } from "@/components/SubscribeForm";
import { isToken } from "@/lib/subscribers";

export const metadata: Metadata = {
  title: "Darse de baja",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ t?: string | string[] }> };

/** Landing page for the unsubscribe link in every email. Removal happens on the button's POST. */
export default async function BajaPage({ searchParams }: Props) {
  const { t } = await searchParams;
  const token = typeof t === "string" && isToken(t) ? t : null;

  return (
    <main lang="es">
      <section className="page-head">
        <span className="kind">
          <Link href="/noticias">/noticias</Link>/baja
        </span>
        <h1>Darse de baja</h1>
        {token ? (
          <>
            <p className="lede sans">
              Confirma y tu correo se elimina de la lista. No volverás a recibir el resumen diario.
            </p>
            <UnsubscribeButton token={token} />
          </>
        ) : (
          <p className="lede sans">
            Este enlace no es válido. Usa el enlace de baja que viene al final de cualquiera de los
            correos, o escríbeme a hola@andersonlaverde.com.
          </p>
        )}
      </section>
    </main>
  );
}

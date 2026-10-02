import type { Metadata } from "next";
import DayPicker from "@/components/DayPicker";
import { Archive, DigestView, IndependentNotice } from "@/components/Digest";
import { getDays, getDigest } from "@/data/noticias";

/** Pick up the new day from the gist without a redeploy. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Resumen diario de medios independientes colombianos — Colombia e Ibagué, con enlace a cada nota original.",
};

export default async function NoticiasPage() {
  const days = await getDays();
  const latest = days[0] ? await getDigest(days[0].date) : null;

  return (
    <main lang="es">
      <section className="page-head">
        <span className="kind">/noticias</span>
        <h1>Colombia, sin intermediarios</h1>
        <p className="lede sans">
          Cada mañana leo lo que publicaron los medios independientes de Colombia y de Ibagué, y lo
          dejo aquí como un resumen por temas, para leer con el café.
        </p>
      </section>

      <IndependentNotice />

      {latest && days.length > 1 && <DayPicker days={days} current={latest.date} />}

      {latest ? (
        <DigestView digest={latest} />
      ) : (
        <p className="dg-note">El resumen de hoy todavía no está disponible. Vuelve en un rato.</p>
      )}

      <Archive days={days.slice(1)} />

      <section className="vidfoot">
        <p className="fine">Resumen automático · fuentes: medios independientes colombianos</p>
      </section>
    </main>
  );
}

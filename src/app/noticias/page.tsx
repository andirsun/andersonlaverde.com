import type { Metadata } from "next";
import DayPicker from "@/components/DayPicker";
import { Archive, DigestView, IndependentNotice } from "@/components/Digest";
import { SubscribeForm } from "@/components/SubscribeForm";
import { VideoEmbed } from "@/components/VideoEmbed";
import { getDays, getDigest } from "@/data/noticias";

/** Unlisted, so it never shows up in the channel feed — the id has to live here. */
const INTRO_VIDEO = { id: "Vg-E-ITghK4", title: "Las noticias que leo día a día" };

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

      <section className="dg-intro">
        <div className="sec-head">
          <h2>
            <i>$</i> por-qué-existe-esto
          </h2>
        </div>
        <VideoEmbed id={INTRO_VIDEO.id} title={INTRO_VIDEO.title} />
      </section>

      {latest && days.length > 1 && <DayPicker days={days} current={latest.date} />}

      {latest ? (
        <DigestView digest={latest} />
      ) : (
        <p className="dg-note">El resumen de hoy todavía no está disponible. Vuelve en un rato.</p>
      )}

      <SubscribeForm />

      <Archive days={days.slice(1)} />

      <section className="vidfoot">
        <p className="fine">Resumen automático · fuentes: medios independientes colombianos</p>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import T from "@/components/T";
import VideoPicker, { type PickerVideo } from "@/components/VideoPicker";
import { CHANNEL_URL, getVideos } from "@/data/videos";

/** Pick up new uploads without a redeploy. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Videos",
  description: "Bits of my life on video — the personal channel, mostly in Spanish.",
};

const MONTH_YEAR = {
  en: new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }),
  es: new Intl.DateTimeFormat("es-CO", { month: "short", year: "numeric" }),
};

export default async function VideosPage() {
  const videos = await getVideos();
  const picks: PickerVideo[] = videos.map((v) => {
    const d = new Date(v.published);
    return {
      id: v.id,
      title: v.title,
      url: v.url,
      thumbnail: v.thumbnail,
      date: { en: MONTH_YEAR.en.format(d), es: MONTH_YEAR.es.format(d) },
    };
  });

  return (
    <main>
      <section className="page-head">
        <span className="kind">Videos</span>
        <h1><T en="Off the clock" es="Fuera del trabajo" /></h1>
        <p className="lede prose">
          <T
            en="I film bits of my life: moving countries, weekends, and whatever is going on around me. Mostly in Spanish."
            es="Grabo pedazos de mi vida: mudarme de país, fines de semana y lo que esté pasando a mi alrededor. Casi todo en español."
          />
        </p>
        <div className="actions">
          <a
            className="btn"
            href={CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
          >
            <T en="Subscribe on YouTube" es="Suscribirme en YouTube" />
          </a>
          <Link className="btn-ghost" href="/blog">
            <T en="Read instead" es="Mejor leer" />
          </Link>
        </div>
      </section>

      <VideoPicker videos={picks} />

      <section className="vidfoot">
        <p className="fine">© {new Date().getFullYear()} Anderson Laverde</p>
      </section>
    </main>
  );
}

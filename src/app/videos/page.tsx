import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import T from "@/components/T";
import { CHANNEL_URL, bestThumbnail, getVideos } from "@/data/videos";

/** Pick up new uploads without a redeploy. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Videos",
  description: "Bits of life in Lisbon, filmed around Portugal — the personal channel, mostly in Spanish.",
};

const MONTH_YEAR = {
  en: new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }),
  es: new Intl.DateTimeFormat("es-CO", { month: "short", year: "numeric" }),
};

function Date_({ iso }: { iso: string }) {
  const d = new Date(iso);
  return <T en={MONTH_YEAR.en.format(d)} es={MONTH_YEAR.es.format(d)} />;
}

export default async function VideosPage() {
  const videos = await getVideos();
  const [featured, ...rest] = videos;
  const featuredThumbnail = await bestThumbnail(featured.id);

  return (
    <main>
      <section className="page-head">
        <span className="kind">/videos</span>
        <h1><T en="Off the clock" es="Fuera del trabajo" /></h1>
        <p className="lede sans">
          <T
            en="I film bits of life here in Lisbon. Moving countries, weekends, and whatever the city is up to. Mostly in Spanish."
            es="Grabo pedazos de mi vida aquí en Lisboa: mudarme de país, fines de semana y lo que esté pasando en la ciudad. Casi todo en español."
          />
        </p>
        <div className="actions">
          <a
            className="btn"
            href={CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
          >
            <T en="subscribe on youtube" es="suscribirme en youtube" />
          </a>
          <Link className="btn-ghost" href="/blog">
            <T en="read instead" es="mejor leer" />
          </Link>
        </div>
      </section>

      <section className="vidtop">
        <div className="vidmain">
          <a
            className="shot"
            href={featured.url}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={featuredThumbnail}
              alt={featured.title}
              width={1280}
              height={720}
              priority
            />
          </a>
          <span style={{ fontSize: 11, color: "var(--amber)" }}>
            <T en="latest" es="último" /> · <Date_ iso={featured.published} />
          </span>
          <h2>{featured.title}</h2>
        </div>
        <div className="vidlist">
          {rest.map((video) => (
            <a
              className="vid"
              href={video.url}
              target="_blank"
              rel="noreferrer"
              key={video.id}
            >
              <span className="thumb">
                <Image src={video.thumbnail} alt="" width={480} height={360} />
              </span>
              <span>
                <span className="t">{video.title}</span>
                <span className="m"><Date_ iso={video.published} /></span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="vidfoot">
        <p className="fine">© {new Date().getFullYear()} Anderson Laverde</p>
      </section>
    </main>
  );
}

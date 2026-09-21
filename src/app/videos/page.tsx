import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CHANNEL_URL, bestThumbnail, getVideos } from "@/data/videos";

/** Pick up new uploads without a redeploy. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Videos",
  description: "Bits of life in Lisbon, filmed around Portugal — the personal channel, mostly in Spanish.",
};

const MONTH_YEAR = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
});

function formatDate(iso: string) {
  return MONTH_YEAR.format(new Date(iso));
}

export default async function VideosPage() {
  const videos = await getVideos();
  const [featured, ...rest] = videos;
  const featuredThumbnail = await bestThumbnail(featured.id);

  return (
    <main>
      <section className="page-head">
        <span className="kind">/videos</span>
        <h1>Off the clock</h1>
        <p className="lede sans">
          I film bits of life here in Lisbon. Moving countries, weekends, and
          whatever the city is up to. Mostly in Spanish.
        </p>
        <div className="actions">
          <a
            className="btn"
            href={CHANNEL_URL}
            target="_blank"
            rel="noreferrer"
          >
            subscribe on youtube
          </a>
          <Link className="btn-ghost" href="/blog">
            read instead
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
            latest · {formatDate(featured.published)}
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
                <span className="m">{formatDate(video.published)}</span>
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

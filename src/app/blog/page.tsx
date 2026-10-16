import type { Metadata } from "next";
import Link from "next/link";
import T from "@/components/T";
import { MEDIUM_URL, getBlogEntries } from "@/data/posts";

/** Pick up new Medium posts without a redeploy. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Writing",
  description: "What I write — technology, the environment and personal stories, in Spanish.",
  alternates: { types: { "application/rss+xml": "/blog/rss.xml" } },
};

const DATE = {
  en: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }),
  es: new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }),
};

export default async function BlogPage() {
  const posts = await getBlogEntries();

  return (
    <main>
      <section className="page-head">
        <span className="kind">/blog</span>
        <h1><T en="Writing" es="Lo que pienso" /></h1>
        <p className="lede sans">
          <T
            en="What I write — technology, the environment and personal stories. New posts live here, older ones on Medium. Mostly in Spanish."
            es="Lo que escribo: tecnología, medio ambiente e historias personales. Lo nuevo vive aquí; lo anterior, en Medium."
          />
        </p>
        <div className="actions">
          <a className="btn" href="/blog/rss.xml">
            <T en="subscribe --rss" es="suscribirme --rss" />
          </a>
          <a className="btn-ghost" href={MEDIUM_URL} target="_blank" rel="noreferrer">
            <T en="older posts on medium" es="lo anterior en medium" />
          </a>
        </div>
      </section>

      <section className="posts">
        {posts.map((p) => {
          const d = p.published ? new Date(p.published) : null;
          const inner = (
            <>
              <span className="date">
                {d && <T en={DATE.en.format(d)} es={DATE.es.format(d)} />}
              </span>
              <span className="body">
                <span className="t">{p.title}</span>
                {p.excerpt && <span className="x sans">{p.excerpt}</span>}
                <span className="m">
                  {p.source === "medium" ? "medium" : p.handwritten
                    ? <T en="handwritten + transcript" es="manuscrito + transcripción" />
                    : "andersonlaverde.com"}
                </span>
              </span>
              <span className="arrow">{p.source === "medium" ? "↗" : "→"}</span>
            </>
          );
          return p.source === "medium" ? (
            <a className="post" href={p.url} target="_blank" rel="noreferrer" key={p.id} lang="es">
              {inner}
            </a>
          ) : (
            <Link className="post" href={p.url} key={p.id} lang="es">
              {inner}
            </Link>
          );
        })}
      </section>

      <section className="vidfoot">
        <p className="fine">© {new Date().getFullYear()} Anderson Laverde</p>
      </section>
    </main>
  );
}

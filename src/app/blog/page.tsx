import type { Metadata } from "next";
import T from "@/components/T";
import { MEDIUM_URL, getPosts } from "@/data/posts";

/** Pick up new Medium posts without a redeploy. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Writing",
  description: "What I write on Medium — technology, the environment and personal stories, in Spanish.",
};

const DATE = {
  en: new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }),
  es: new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }),
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <section className="page-head">
        <span className="kind">/blog</span>
        <h1><T en="Writing" es="Lo que pienso" /></h1>
        <p className="lede sans">
          <T
            en="What I write on Medium — technology, the environment and personal stories. Mostly in Spanish."
            es="Lo que escribo en Medium: tecnología, medio ambiente e historias personales."
          />
        </p>
        <div className="actions">
          <a className="btn" href={MEDIUM_URL} target="_blank" rel="noreferrer">
            <T en="follow on medium" es="seguirme en medium" />
          </a>
        </div>
      </section>

      <section className="posts">
        {posts.map((p) => {
          const d = p.published ? new Date(p.published) : null;
          return (
            <a className="post" href={p.url} target="_blank" rel="noreferrer" key={p.id} lang="es">
              <span className="date">
                {d && <T en={DATE.en.format(d)} es={DATE.es.format(d)} />}
              </span>
              <span className="body">
                <span className="t">{p.title}</span>
                {p.excerpt && <span className="x sans">{p.excerpt}</span>}
                <span className="m">medium</span>
              </span>
              <span className="arrow">↗</span>
            </a>
          );
        })}
      </section>

      <section className="vidfoot">
        <p className="fine">© {new Date().getFullYear()} Anderson Laverde</p>
      </section>
    </main>
  );
}

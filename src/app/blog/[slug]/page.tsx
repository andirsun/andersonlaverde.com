import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostViews from "@/components/PostViews";
import { getLocalPost, getLocalPosts, getPages } from "@/data/localPosts";

/** Posts live in the repo, so every one is known at build time. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getLocalPosts().map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getLocalPost(slug);
  if (!post) return { title: "Blog" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
}

const DATE = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getLocalPost(slug);
  if (!post) notFound();

  const pages = getPages(post);
  const transcript = (
    <article className="transcript sans">
      {post.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </article>
  );

  return (
    <main lang="es">
      <section className="page-head">
        <span className="kind">
          <Link href="/blog">/blog</Link>/{post.slug}
        </span>
        <h1>{post.title}</h1>
        <p className="meta">
          <time dateTime={post.date}>{DATE.format(new Date(`${post.date}T00:00:00Z`))}</time>
          {pages.length > 0 && <> · escrito a mano, {pages.length} {pages.length === 1 ? "página" : "páginas"}</>}
        </p>
      </section>

      {pages.length > 0 ? (
        <PostViews
          transcript={transcript}
          manuscript={
            <div className="manuscript">
              {pages.map((p, i) => (
                <figure key={p.src}>
                  {/* Ink is a transparent mask painted in --ink, so it follows the theme. */}
                  <div
                    className="ink"
                    role="img"
                    aria-label={`Página ${i + 1} del manuscrito. El texto está en la transcripción.`}
                    style={{
                      aspectRatio: `${p.width} / ${p.height}`,
                      maskImage: `url(${p.src})`,
                      WebkitMaskImage: `url(${p.src})`,
                    }}
                  />
                  <figcaption>
                    {String(i + 1).padStart(2, "0")}.png · {i + 1}/{pages.length}
                  </figcaption>
                </figure>
              ))}
            </div>
          }
        />
      ) : (
        transcript
      )}

      <section className="vidfoot">
        <p className="fine">
          <Link href="/blog">← cd ../blog</Link> · <a href="/blog/rss.xml">rss</a>
        </p>
      </section>
    </main>
  );
}

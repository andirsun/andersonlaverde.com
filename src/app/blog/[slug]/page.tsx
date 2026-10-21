import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Manuscript from "@/components/Manuscript";
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
    <article className="transcript prose">
      {post.paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </article>
  );

  return (
    <main lang="es">
      <section className="page-head">
        <span className="kind">
          <Link href="/blog">Blog</Link>
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
          manuscript={<Manuscript pages={pages} />}
        />
      ) : (
        transcript
      )}

      <section className="vidfoot">
        <p className="fine">
          <Link href="/blog">← Volver al blog</Link> · <a href="/blog/rss.xml">Seguir por RSS</a>
        </p>
      </section>
    </main>
  );
}

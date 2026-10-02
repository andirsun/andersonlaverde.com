"use client";

import Link from "next/link";
import { useState } from "react";
import T from "@/components/T";
import { POSTS, TAGS, TAG_LABEL_ES } from "@/data/posts";

export default function PostList() {
  const [tag, setTag] = useState("all");
  const shown = tag === "all" ? POSTS : POSTS.filter((p) => p.tag === tag);

  return (
    <>
      <div className="filters">
        {TAGS.map((t) => (
          <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(t)}>
            <T en={t} es={TAG_LABEL_ES[t] ?? t} />
          </button>
        ))}
      </div>

      <section className="posts">
        {shown.map((p) => (
          <Link className="post" href={`/blog/${p.slug}`} key={p.slug}>
            <span className="date">{p.date}</span>
            <span className="body">
              <span className="t"><T en={p.title.en} es={p.title.es} /></span>
              <span className="x sans"><T en={p.excerpt.en} es={p.excerpt.es} /></span>
              <span className="m"><T en={p.tag} es={TAG_LABEL_ES[p.tag] ?? p.tag} /> · {p.read}</span>
            </span>
            <span className="arrow">→</span>
          </Link>
        ))}
      </section>
    </>
  );
}

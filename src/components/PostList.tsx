"use client";

import Link from "next/link";
import { useState } from "react";
import { POSTS, TAGS } from "@/data/posts";

export default function PostList() {
  const [tag, setTag] = useState("all");
  const shown = tag === "all" ? POSTS : POSTS.filter((p) => p.tag === tag);

  return (
    <>
      <div className="filters">
        {TAGS.map((t) => (
          <button key={t} type="button" aria-pressed={tag === t} onClick={() => setTag(t)}>
            {t}
          </button>
        ))}
      </div>

      <section className="posts">
        {shown.map((p) => (
          <Link className="post" href={`/blog/${p.slug}`} key={p.slug}>
            <span className="date">{p.date}</span>
            <span className="body">
              <span className="t">{p.title}</span>
              <span className="x sans">{p.excerpt}</span>
              <span className="m">{p.tag} · {p.read}</span>
            </span>
            <span className="arrow">→</span>
          </Link>
        ))}
      </section>
    </>
  );
}

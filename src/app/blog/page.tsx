import type { Metadata } from "next";
import PostList from "@/components/PostList";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on Linux, TypeScript, growth and AI engineering.",
};

export default function BlogPage() {
  return (
    <main>
      <section className="page-head">
        <span className="kind">/blog</span>
        <h1>Writing</h1>
        <p className="lede sans">
          Notes from daily work — Linux on a MacBook, TypeScript at scale, AI in real products, and
          small open source contributions. Mostly written on a Friday afternoon.
        </p>
      </section>

      <PostList />

      <section className="sub">
        <h2>Get new posts by email</h2>
        <p className="sans">No schedule, no spam — just when something is worth writing down.</p>
        <form className="subform" action="#" method="post">
          <input type="email" name="email" placeholder="you@domain.com" required />
          <button className="btn" type="submit">subscribe</button>
        </form>
        <p className="fine">© {new Date().getFullYear()} Anderson Laverde</p>
      </section>
    </main>
  );
}

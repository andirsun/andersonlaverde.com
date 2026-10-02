import type { Metadata } from "next";
import PostList from "@/components/PostList";
import T from "@/components/T";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on Linux, TypeScript, growth and AI engineering.",
};

export default function BlogPage() {
  return (
    <main>
      <section className="page-head">
        <span className="kind">/blog</span>
        <h1><T en="Writing" es="Escritos" /></h1>
        <p className="lede sans">
          <T
            en="Notes from daily work — Linux on a MacBook, TypeScript at scale, AI in real products, and small open source contributions. Mostly written on a Friday afternoon."
            es="Notas del trabajo diario: Linux en un MacBook, TypeScript a escala, IA en productos reales y pequeñas contribuciones open source. Casi siempre escritas un viernes por la tarde."
          />
        </p>
      </section>

      <PostList />

      <section className="vidfoot">
        <p className="fine">© {new Date().getFullYear()} Anderson Laverde</p>
      </section>
    </main>
  );
}

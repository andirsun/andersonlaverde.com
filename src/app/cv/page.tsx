import type { Metadata } from "next";
import PrintButton from "@/components/PrintButton";
import { JOBS, STATS, STACK } from "@/data/experience";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Experience, education and stack — software engineer at Streamline since 2021, now AI Advocate.",
};

export default function CvPage() {
  return (
    <main>
      <section className="page-head">
        <span className="kind">/cv</span>
        <h1>Curriculum vitae</h1>
        <p className="lede sans">
          Full-stack engineer turned Growth technical lead, now AI Advocate at Streamline. Before
          that, co-founder of Slinqer and a few years building products for Colombian startups.
        </p>
        <div className="actions">
          <a className="btn" href="mailto:hola@andersonlaverde.com">mail --to=hola@</a>
          <PrintButton />
        </div>
      </section>

      <section className="stats">
        {STATS.map((s) => (
          <div className="stat" key={s.label}>
            <b>{s.value}</b>
            <span>{s.label}</span>
          </div>
        ))}
      </section>

      <section id="experience" style={{ marginBottom: 88 }}>
        <div className="sec-head">
          <h2><i>$</i> experience</h2>
          <span className="right">2018 — present</span>
        </div>
        {JOBS.map((j) => (
          <article className="job" key={j.company + j.dates}>
            <div>
              <span className="when">{j.dates}</span>
              <span className="co">{j.company}</span>
            </div>
            <div>
              <h3>{j.role}</h3>
              <p className="sans">{j.text}</p>
              <div className="tags">
                {j.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
              {j.resource && (
                <a className="joblink" href={j.resource.url} target="_blank" rel="noreferrer">
                  {j.resource.label} →
                </a>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="two">
        <div>
          <div className="sec-head"><h2><i>$</i> education</h2></div>
          <span style={{ fontSize: 11, color: "var(--amber)" }}>2016 — 2020</span>
          <h3 style={{ fontSize: 16, margin: "6px 0 4px", fontWeight: 500 }}>Computer Science Engineering</h3>
          <span className="sans" style={{ fontSize: 13, color: "var(--dim)" }}>
            Pontificia Universidad Javeriana Cali — focus on machine learning
          </span>
        </div>
        <div>
          <div className="sec-head"><h2><i>$</i> stack</h2></div>
          <div className="chips">
            {STACK.map((s) => <span key={s}>{s}</span>)}
          </div>
        </div>
      </section>

      <section className="vidfoot">
        <p className="fine">© {new Date().getFullYear()} Anderson Laverde</p>
      </section>
    </main>
  );
}

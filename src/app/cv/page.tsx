import type { Metadata } from "next";
import PrintButton from "@/components/PrintButton";
import T from "@/components/T";
import { JOBS, STATS, STACK, TAG_ES } from "@/data/experience";

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
          <T
            en="Software engineer on Streamline's product team, then Growth technical lead, now AI Advocate. Before that, co-founder of Slinqer and a few years building products for Colombian startups."
            es="Ingeniero de software en el equipo de producto de Streamline, luego líder técnico de Growth y hoy AI Advocate. Antes, cofundador de Slinqer y unos años construyendo productos para startups colombianas."
          />
        </p>
        <div className="actions">
          <a className="btn" href="mailto:hola@andersonlaverde.com">mail --to=hola@</a>
          <PrintButton />
        </div>
      </section>

      <section className="stats">
        {STATS.map((s) => (
          <div className="stat" key={s.label.en}>
            <b>{s.value}</b>
            <span><T en={s.label.en} es={s.label.es} /></span>
          </div>
        ))}
      </section>

      <section id="experience" style={{ marginBottom: 88 }}>
        <div className="sec-head">
          <h2><i>$</i> <T en="experience" es="experiencia" /></h2>
          <span className="right"><T en="2018 — present" es="2018 — hoy" /></span>
        </div>
        {JOBS.map((j) => (
          <article className="job" key={j.company + j.dates.en}>
            <div>
              <span className="when"><T en={j.dates.en} es={j.dates.es} /></span>
              <span className="co">{j.company === "Self employed" ? <T en="Self employed" es="Independiente" /> : j.company}</span>
            </div>
            <div>
              <h3><T en={j.role.en} es={j.role.es} /></h3>
              <p className="sans"><T en={j.text.en} es={j.text.es} /></p>
              <div className="tags">
                {j.tags.map((t) => <span key={t}><T en={t} es={TAG_ES[t] ?? t} /></span>)}
              </div>
              {j.resource && (
                <a className="joblink" href={j.resource.url} target="_blank" rel="noreferrer">
                  <T en={j.resource.label.en} es={j.resource.label.es} /> →
                </a>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="two">
        <div>
          <div className="sec-head"><h2><i>$</i> <T en="education" es="educación" /></h2></div>
          <span style={{ fontSize: 11, color: "var(--amber)" }}>2016 — 2020</span>
          <h3 style={{ fontSize: 16, margin: "6px 0 4px", fontWeight: 500 }}>
            <T en="Computer Science Engineering" es="Ingeniería de Sistemas y Computación" />
          </h3>
          <span className="sans" style={{ fontSize: 13, color: "var(--dim)" }}>
            <T
              en="Pontificia Universidad Javeriana Cali — focus on machine learning"
              es="Pontificia Universidad Javeriana Cali — énfasis en machine learning"
            />
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

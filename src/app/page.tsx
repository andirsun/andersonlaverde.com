import Image from "next/image";
import Link from "next/link";
import LisbonClock from "@/components/LisbonClock";
import TypedRoles from "@/components/TypedRoles";
import PrintButton from "@/components/PrintButton";
import { JOBS, STATS, STACK, LINKS } from "@/data/experience";

export default function Home() {
  return (
    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <div className="meta">
            <span style={{ color: "var(--accent)" }}>●</span>
            <span>Lisbon, Portugal</span>
            <span className="sep">|</span>
            <LisbonClock />
            <span className="sep">|</span>
            <span style={{ color: "var(--amber)" }}>open to talk</span>
          </div>
          <h1>Anderson Laverde</h1>
          <TypedRoles />
          <p className="lede sans">
            Software engineer at Streamline since 2021 — full-stack, then technical lead of Growth,
            and today AI Advocate, working out where AI actually solves user problems. Startups and
            video games lover, casual open source contributor, Linux as my desktop since 2019.
          </p>
          <div className="actions">
            <a className="btn" href="#cv">./read-cv</a>
            <a className="btn-ghost" href="mailto:hola@andersonlaverde.com">mail --to=hola@</a>
            <PrintButton />
          </div>
        </div>
        <div className="portrait">
          <Image
            src="/portrait.jpg"
            alt="Anderson Laverde, with Porto behind him"
            width={1176}
            height={1568}
            sizes="(max-width: 820px) 100vw, 360px"
            priority
          />
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

      <section id="cv" style={{ marginBottom: 88 }}>
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

      <section className="cards">
        <Link className="card" href="/blog">
          <span className="kind">/blog</span>
          <span className="title">Notes on Linux, TS and shipping</span>
          <span className="text sans">
            Short writeups from daily work: open source contributions, Fedora setup, growth and AI engineering.
          </span>
          <span className="go">read the blog →</span>
        </Link>
        <Link className="card" href="/videos">
          <span className="kind">/videos</span>
          <span className="title">Life in Lisbon, on camera</span>
          <span className="text sans">
            Weekends, volleyball and the odd afternoon at the aquarium, filmed around Portugal.
            Mostly in Spanish.
          </span>
          <span className="go">watch →</span>
        </Link>
      </section>

      <section id="contact" className="contact">
        <h2>Let&apos;s make something great.</h2>
        <p className="sans">
          Remote-friendly, timezone Lisbon. Happy to talk about AI in real products, growth
          engineering, open source or a good mechanical keyboard.
        </p>
        <div className="links">
          {LINKS.map((l) => <a href={l.url} key={l.url}>{l.label}</a>)}
        </div>
        <p className="fine">© {new Date().getFullYear()} Anderson Laverde — built from Lisbon</p>
      </section>
    </main>
  );
}

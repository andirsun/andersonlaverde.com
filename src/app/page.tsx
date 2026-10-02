import Image from "next/image";
import Link from "next/link";
import LisbonClock from "@/components/LisbonClock";
import TypedRoles from "@/components/TypedRoles";
import { LINKS } from "@/data/experience";

/** Home is a hub: who I am, then pick a section. The CV lives at /cv. */
const SECTIONS = [
  {
    href: "/cv",
    kind: "/cv",
    title: "Experience, education and stack",
    text: "Streamline since 2021 — full-stack, Growth technical lead, now AI Advocate. Before that, Slinqer and Colombian startups.",
    go: "./read-cv →",
  },
  {
    href: "/blog",
    kind: "/blog",
    title: "Notes on Linux, TS and shipping",
    text: "Short writeups from daily work: open source contributions, Fedora setup, growth and AI engineering.",
    go: "read the blog →",
  },
  {
    href: "/noticias",
    kind: "/noticias",
    title: "Colombia, sin intermediarios",
    text: "Daily digest of Colombian and Ibagué independent media, in Spanish. Read it here or get it by email.",
    go: "leer las noticias →",
  },
];

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
            <a className="btn" href="#sections">./choose</a>
            <a className="btn-ghost" href="mailto:hola@andersonlaverde.com">mail --to=hola@</a>
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

      <section id="sections">
        <div className="sec-head">
          <h2><i>$</i> ls ~/</h2>
          <span className="right">pick one</span>
        </div>
        <div className="cards">
          {SECTIONS.map((s) => (
            <Link className="card" href={s.href} key={s.href}>
              <span className="kind">{s.kind}</span>
              <span className="title">{s.title}</span>
              <span className="text sans">{s.text}</span>
              <span className="go">{s.go}</span>
            </Link>
          ))}
        </div>
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

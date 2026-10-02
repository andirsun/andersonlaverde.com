import Image from "next/image";
import Link from "next/link";
import LisbonClock from "@/components/LisbonClock";
import T from "@/components/T";
import TypedRoles from "@/components/TypedRoles";
import { LINKS } from "@/data/experience";

/** Home is a hub: who I am, then pick a section. The CV lives at /cv. */
const SECTIONS = [
  {
    href: "/cv",
    title: { en: "Experience, education and stack", es: "Experiencia, educación y stack" },
    text: {
      en: "Streamline since 2021 — full-stack, Growth technical lead, now AI Advocate. Before that, Slinqer and Colombian startups.",
      es: "En Streamline desde 2021: full-stack, líder técnico de Growth y hoy AI Advocate. Antes, Slinqer y startups colombianas.",
    },
    go: { en: "./read-cv →", es: "./leer-cv →" },
  },
  {
    href: "/blog",
    title: { en: "Writing", es: "Lo que pienso" },
    text: {
      en: "What I write on Medium — technology, the environment and personal stories. Mostly in Spanish.",
      es: "Lo que escribo en Medium: tecnología, medio ambiente e historias personales.",
    },
    go: { en: "read the blog →", es: "leer el blog →" },
  },
  {
    href: "/noticias",
    title: { en: "Colombia, sin intermediarios", es: "Colombia, sin intermediarios" },
    text: {
      en: "Daily digest of Colombian and Ibagué independent media, in Spanish. Read it here or get it by email.",
      es: "Resumen diario de medios independientes de Colombia e Ibagué. Léelo aquí o recíbelo por correo.",
    },
    go: { en: "leer las noticias →", es: "leer las noticias →" },
  },
];

export default function Home() {
  return (
    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <div className="meta">
            <span style={{ color: "var(--accent)" }}>●</span>
            <span><T en="Lisbon, Portugal" es="Lisboa, Portugal" /></span>
            <span className="sep">|</span>
            <LisbonClock />
            <span className="sep">|</span>
            <span style={{ color: "var(--amber)" }}><T en="open to talk" es="abierto a conversar" /></span>
          </div>
          <h1>Anderson Laverde</h1>
          <TypedRoles />
          <p className="lede sans">
            <T
              en="Software engineer at Streamline since 2021 — full-stack, then technical lead of Growth, and today AI Advocate, working out where AI actually solves user problems. Startups and video games lover, casual open source contributor, Linux as my desktop since 2019."
              es="Ingeniero de software en Streamline desde 2021: full-stack, luego líder técnico de Growth y hoy AI Advocate, buscando dónde la IA de verdad resuelve problemas de los usuarios. Me encantan las startups y los videojuegos, contribuyo de vez en cuando a open source y uso Linux de escritorio desde 2019."
            />
          </p>
          <div className="actions">
            <a className="btn" href="#sections"><T en="./choose" es="./elegir" /></a>
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
          <span className="right"><T en="pick one" es="elige uno" /></span>
        </div>
        <div className="cards">
          {SECTIONS.map((s) => (
            <Link className="card" href={s.href} key={s.href}>
              <span className="kind">{s.href}</span>
              <span className="title"><T en={s.title.en} es={s.title.es} /></span>
              <span className="text sans"><T en={s.text.en} es={s.text.es} /></span>
              <span className="go"><T en={s.go.en} es={s.go.es} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className="contact">
        <h2><T en="Let's make something great." es="Hagamos algo grande." /></h2>
        <p className="sans">
          <T
            en="Remote-friendly, timezone Lisbon. Happy to talk about AI in real products, growth engineering, open source or a good mechanical keyboard."
            es="Trabajo en remoto, en horario de Lisboa. Encantado de hablar de IA en productos reales, growth engineering, open source o un buen teclado mecánico."
          />
        </p>
        <div className="links">
          {LINKS.map((l) => <a href={l.url} key={l.url}>{l.label}</a>)}
        </div>
        <p className="fine">
          © {new Date().getFullYear()} Anderson Laverde — <T en="built from Lisbon" es="hecho desde Lisboa" />
        </p>
      </section>
    </main>
  );
}

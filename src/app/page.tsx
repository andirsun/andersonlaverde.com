import Image from "next/image";
import Link from "next/link";
import { NewspaperIcon, PencilIcon, SuitcaseIcon } from "@/components/Icons";
import T from "@/components/T";
import TypedRoles from "@/components/TypedRoles";
import { LINKS } from "@/data/experience";

/** Section tile icons (Streamline Plump), drawn in each section's accent. */
const ICONS = {
  cv: <SuitcaseIcon style={{ color: "var(--link)" }} />,
  blog: <PencilIcon style={{ color: "var(--cyan)" }} />,
  noticias: <NewspaperIcon style={{ color: "var(--lime)" }} />,
};

/** Home is a hub: who I am, then pick a section. The CV lives at /cv. */
const SECTIONS = [
  {
    href: "/cv",
    icon: ICONS.cv,
    kind: "CV",
    title: { en: "Experience, education and stack", es: "Experiencia, educación y stack" },
    text: {
      en: "Streamline since 2021 — full-stack, Growth technical lead, now AI Advocate. Before that, Slinqer and Colombian startups.",
      es: "En Streamline desde 2021: full-stack, líder técnico de Growth y hoy AI Advocate. Antes, Slinqer y startups colombianas.",
    },
    go: { en: "Read the CV →", es: "Leer el CV →" },
  },
  {
    href: "/blog",
    icon: ICONS.blog,
    kind: "Blog",
    title: { en: "Writing", es: "Lo que pienso" },
    text: {
      en: "What I write — technology, the environment and personal stories, some of it by hand. Mostly in Spanish.",
      es: "Lo que escribo: tecnología, medio ambiente e historias personales, a veces a mano.",
    },
    go: { en: "Read the blog →", es: "Leer el blog →" },
  },
  {
    href: "/noticias",
    icon: ICONS.noticias,
    kind: "Noticias",
    title: { en: "Colombia, sin intermediarios", es: "Colombia, sin intermediarios" },
    text: {
      en: "Daily digest of Colombian and Ibagué independent media, in Spanish. Read it here or get it by email.",
      es: "Resumen diario de medios independientes de Colombia e Ibagué. Léelo aquí o recíbelo por correo.",
    },
    go: { en: "Leer las noticias →", es: "Leer las noticias →" },
  },
];

export default function Home() {
  return (
    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <h1>Anderson Laverde</h1>
          <TypedRoles />
          <p className="lede prose">
            <T
              en="Software engineer at Streamline since 2021 — full-stack, then technical lead of Growth, and today AI Advocate, working out where AI actually solves user problems. Startups and video games lover, casual open source contributor, Linux as my desktop since 2019."
              es="Ingeniero de software en Streamline desde 2021: full-stack, luego líder técnico de Growth y hoy AI Advocate, buscando dónde la IA de verdad resuelve problemas de los usuarios. Me encantan las startups y los videojuegos, contribuyo de vez en cuando a open source y uso Linux de escritorio desde 2019."
            />
          </p>
          <div className="actions">
            <a className="btn" href="#sections"><T en="Explore" es="Explorar" /></a>
            <a className="btn-ghost" href="mailto:hola@andersonlaverde.com"><T en="Write to me" es="Escríbeme" /></a>
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

      <section id="latest">
        <div className="sec-head">
          <h2><T en="Latest project" es="Mi proyecto más reciente" /></h2>
          <span className="right"><T en="in progress" es="en curso" /></span>
        </div>
        <div className="cards">
          <a className="card feature lukitas" href="https://lukitas.andersonlaverde.com" target="_blank" rel="noopener">
            <span className="feature-copy">
              <span className="kind"><T en="What I’m building now" es="Lo que estoy construyendo" /></span>
              <span className="title"><span className="wordmark">Lukitas</span> <span className="badge"><T en="In progress" es="En curso" /></span></span>
              <span className="text prose">
                <T
                  en="A free, open-source personal finance app: your budget, and you’ll actually enjoy looking after it. Log an expense in seconds and see where your money goes. Web first, then Android and iPhone."
                  es="Una app de finanzas personales gratis y de código abierto: tu presupuesto, y te va a dar gusto cuidarlo. Anota un gasto en segundos y mira en qué se va tu plata. Primero la web, luego Android e iPhone."
                />
              </span>
              <span className="go"><T en="See Lukitas →" es="Ver Lukitas →" /></span>
            </span>
            <Image src="/lukitas.webp" alt="Lukitas, a gold coin with a smiling face" width={440} height={440} sizes="230px" />
          </a>
        </div>
      </section>

      <section id="sections">
        <div className="sec-head">
          <h2><T en="What you’ll find here" es="Qué hay aquí" /></h2>
          <span className="right"><T en="pick one" es="elige uno" /></span>
        </div>
        <div className="cards">
          {SECTIONS.map((s) => (
            <Link className="card" href={s.href} key={s.href}>
              <span className="kind"><span className="tile">{s.icon}</span>{s.kind}</span>
              <span className="title"><T en={s.title.en} es={s.title.es} /></span>
              <span className="text prose"><T en={s.text.en} es={s.text.es} /></span>
              <span className="go"><T en={s.go.en} es={s.go.es} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="contact-box">
          <h2><T en="Contact me" es="Contáctame" /></h2>
          <p className="prose">
            <T
              en="I work remotely. Happy to talk about AI in real products, growth engineering, open source or a good mechanical keyboard."
              es="Trabajo en remoto. Encantado de hablar de IA en productos reales, growth engineering, open source o un buen teclado mecánico."
            />
          </p>
          <div className="links">
            {LINKS.map((l) => <a className="chip" href={l.url} key={l.url}>{l.label}</a>)}
          </div>
        </div>
        <p className="fine">
          © {new Date().getFullYear()} Anderson Laverde ·{" "}
          <T en="Icons" es="Íconos" />:{" "}
          <a href="https://www.streamlinehq.com/icons/plump-line-free" target="_blank" rel="noreferrer">Plump by Streamline</a>,{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>
        </p>
      </section>
    </main>
  );
}

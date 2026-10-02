import Link from "next/link";
import type { DayEntry, Digest, Region, Segment } from "@/lib/noticias";

export const OUTLETS = [
  { name: "La Silla Vacía", emoji: "🪑", url: "https://www.lasillavacia.com" },
  { name: "Vorágine", emoji: "🌪️", url: "https://voragine.co" },
  { name: "Cuestión Pública", emoji: "❓", url: "https://cuestionpublica.com" },
  { name: "Mutante", emoji: "🧬", url: "https://mutante.org" },
  { name: "Cerosetenta", emoji: "0️⃣7️⃣0️⃣", url: "https://cerosetenta.uniandes.edu.co" },
  { name: "CasaMacondo", emoji: "🦋", url: "https://casamacondo.co" },
  { name: "El Olfato", emoji: "👃", url: "https://elolfato.com", local: true },
  { name: "Con La Verdad", emoji: "📢", url: "https://conlaverdad.com", local: true },
];

function Paragraph({ segments }: { segments: Segment[] }) {
  return (
    <p className="sans">
      {segments.map((s, i) =>
        s.href ? (
          <a key={i} href={s.href} title={s.title} target="_blank" rel="noreferrer">
            {s.text}
          </a>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </p>
  );
}

function RegionBlock({ region, local }: { region: Region; local?: boolean }) {
  return (
    <>
      {region.summary && (
        <div className={local ? "dg-pocas dg-pocas-local" : "dg-pocas"}>
          <h2>🎯 En pocas palabras</h2>
          <p className="sans">{region.summary}</p>
        </div>
      )}
      {region.sections.map((section) => (
        <section className={local ? "dg-section dg-local" : "dg-section"} key={section.title}>
          <h3>{section.title}</h3>
          {section.paragraphs.map((p, i) => (
            <Paragraph segments={p} key={i} />
          ))}
        </section>
      ))}
      {region.notes.map((n) => (
        <p className="dg-note" key={n}>
          {n}
        </p>
      ))}
    </>
  );
}

/** One day's digest, laid out like the email: header, summary, national topics, Ibagué. */
export function DigestView({ digest }: { digest: Digest }) {
  const hasLocal = digest.ibague.summary || digest.ibague.sections.length > 0;

  return (
    <article className="digest" lang="es">
      <header className="dg-head">
        <span className="dg-kicker">🇨🇴 Medios Independientes</span>
        <h2>
          <time dateTime={digest.date}>{digest.dateLabel}</time>
        </h2>
        {digest.weather && (
          <div className="dg-weather">
            <span>{digest.weather.line}</span>
            {digest.weather.summary && <span className="sans">{digest.weather.summary}</span>}
          </div>
        )}
      </header>

      <RegionBlock region={digest.national} />

      <div className="dg-divider" role="separator">
        <span>🗞️ Ibagué Independiente</span>
      </div>
      {hasLocal ? (
        <RegionBlock region={digest.ibague} local />
      ) : (
        <p className="dg-note">Sin novedades relevantes en Ibagué este día.</p>
      )}
    </article>
  );
}

export function IndependentNotice() {
  return (
    <aside className="dg-notice" lang="es">
      <p className="sans">
        <strong>Solo medios independientes.</strong> Este resumen se arma cada mañana leyendo
        únicamente periodismo independiente colombiano — sin grandes conglomerados de medios. Cada
        frase enlaza a la nota original; el crédito y el trabajo son de cada medio. Si algo te
        sirve, apóyalos directamente.
      </p>
      <ul className="dg-outlets">
        {OUTLETS.map((o) => (
          <li key={o.name}>
            <a href={o.url} target="_blank" rel="noreferrer">
              {o.emoji} {o.name}
            </a>
            {o.local && <span className="dg-tag">ibagué</span>}
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function Archive({ days, current }: { days: DayEntry[]; current?: string }) {
  if (days.length === 0) return null;
  return (
    <section className="dg-archive" lang="es">
      <div className="sec-head">
        <h2>
          <i>$</i> días anteriores
        </h2>
        <span className="right">{days.length} días</span>
      </div>
      <div className="posts">
        {days.map((d) => (
          <Link
            className="post"
            href={`/noticias/${d.date}`}
            key={d.date}
            aria-current={d.date === current ? "page" : undefined}
          >
            <span className="date">{d.date}</span>
            <span className="body">
              <span className="t">{d.dateLabel}</span>
              {d.summary && <span className="x sans">{d.summary}</span>}
            </span>
            <span className="arrow">{d.date === current ? "leyendo" : "→"}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

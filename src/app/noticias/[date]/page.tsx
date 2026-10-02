import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DayPicker from "@/components/DayPicker";
import { Archive, DigestView, IndependentNotice } from "@/components/Digest";
import { getDays, getDigest } from "@/data/noticias";

export const revalidate = 3600;

/** Render each past day on first visit, then cache it; no day is known at build time. */
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ date: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  const digest = await getDigest(date);
  if (!digest) return { title: "Noticias" };
  return {
    title: `Noticias — ${digest.dateLabel}`,
    description: digest.national.summary || digest.ibague.summary,
  };
}

export default async function NoticiasDayPage({ params }: Props) {
  const { date } = await params;
  const [digest, days] = await Promise.all([getDigest(date), getDays()]);
  if (!digest) notFound();

  return (
    <main lang="es">
      <section className="page-head">
        <span className="kind">
          <Link href="/noticias">/noticias</Link>/{digest.date}
        </span>
        <h1>{digest.dateLabel}</h1>
      </section>

      <IndependentNotice />
      <DayPicker days={days} current={digest.date} />
      <DigestView digest={digest} />
      <Archive days={days} current={digest.date} />

      <section className="vidfoot">
        <p className="fine">Resumen automático · fuentes: medios independientes colombianos</p>
      </section>
    </main>
  );
}

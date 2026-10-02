"use client";

import { useRouter } from "next/navigation";
import type { DayEntry } from "@/lib/noticias";

const MONTH = new Intl.DateTimeFormat("es-CO", { month: "long", year: "numeric", timeZone: "UTC" });

function groupByMonth(days: DayEntry[]) {
  const groups = new Map<string, DayEntry[]>();
  for (const d of days) {
    const key = d.date.slice(0, 7);
    groups.set(key, [...(groups.get(key) ?? []), d]);
  }
  return [...groups.entries()].map(([key, items]) => ({
    label: MONTH.format(new Date(`${key}-01T00:00:00Z`)),
    items,
  }));
}

/** Jump to any published day. Only dates that exist in the archive are offered. */
export default function DayPicker({ days, current }: { days: DayEntry[]; current: string }) {
  const router = useRouter();
  const index = days.findIndex((d) => d.date === current);
  const newer = index > 0 ? days[index - 1] : undefined;
  const older = index >= 0 && index < days.length - 1 ? days[index + 1] : undefined;
  const go = (date: string) => router.push(date === days[0]?.date ? "/noticias" : `/noticias/${date}`);

  return (
    <nav className="dg-picker" aria-label="Elegir día" lang="es">
      <button type="button" disabled={!older} onClick={() => older && go(older.date)}>
        ← anterior
      </button>
      <label>
        <span>$ ver día</span>
        <select value={current} onChange={(e) => go(e.target.value)}>
          {groupByMonth(days).map((g) => (
            <optgroup label={g.label} key={g.label}>
              {g.items.map((d) => (
                <option value={d.date} key={d.date}>
                  {d.dateLabel}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <button type="button" disabled={!newer} onClick={() => newer && go(newer.date)}>
        siguiente →
      </button>
    </nav>
  );
}

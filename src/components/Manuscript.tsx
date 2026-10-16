"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Page } from "@/data/localPosts";

/** Ink is a transparent mask painted in --ink, so the handwriting follows the theme. */
function inkStyle(p: Page): CSSProperties {
  return {
    aspectRatio: `${p.width} / ${p.height}`,
    maskImage: `url(${p.src})`,
    WebkitMaskImage: `url(${p.src})`,
  };
}

/**
 * Handwritten pages. On desktop they sit side by side in a horizontal strip that scrolls
 * (trackpad, shift+wheel or the arrow buttons); on phones they stack. Clicking a page opens
 * it large in a dialog, where the arrow keys move between pages and Esc closes.
 */
export default function Manuscript({ pages }: { pages: Page[] }) {
  const strip = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [edges, setEdges] = useState({ start: true, end: pages.length < 2 });

  const updateEdges = () => {
    const el = strip.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 8 });
  };

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Arrow keys page through, a click on the backdrop closes. Wired here because jsx-a11y
  // doesn't allow handlers on <dialog> in JSX.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const dir = e.key === "ArrowRight" ? 1 : -1;
      setOpen((i) => (i === null ? i : Math.min(pages.length - 1, Math.max(0, i + dir))));
    };
    const onClick = (e: MouseEvent) => e.target === el && el.close();
    el.addEventListener("keydown", onKey);
    el.addEventListener("click", onClick);
    return () => {
      el.removeEventListener("keydown", onKey);
      el.removeEventListener("click", onClick);
    };
  }, [pages.length]);

  /** Scroll so the next (or previous) page starts at the left edge, or as far as it goes. */
  const scrollBy = (dir: 1 | -1) => {
    const el = strip.current;
    if (!el) return;
    const starts = [...el.querySelectorAll("figure")].map((f) => f.offsetLeft - el.offsetLeft);
    const target = dir === 1
      ? starts.find((x) => x > el.scrollLeft + 8)
      : starts.findLast((x) => x < el.scrollLeft - 8);
    el.scrollTo({ left: target ?? (dir === 1 ? el.scrollWidth : 0), behavior: "smooth" });
  };

  const show = (i: number) => {
    setOpen(i);
    if (!dialog.current?.open) dialog.current?.showModal();
  };
  const step = (dir: 1 | -1) => setOpen((i) => (i === null ? i : Math.min(pages.length - 1, Math.max(0, i + dir))));
  const current = open === null ? null : pages[open];

  return (
    <div className="manuscript">
      {pages.length > 1 && (
        <div className="ms-nav" aria-hidden="true">
          <button type="button" tabIndex={-1} disabled={edges.start} onClick={() => scrollBy(-1)}>←</button>
          <button type="button" tabIndex={-1} disabled={edges.end} onClick={() => scrollBy(1)}>→</button>
        </div>
      )}

      <div className="ms-strip" ref={strip} onScroll={updateEdges}>
        {pages.map((p, i) => (
          <figure key={p.src}>
            <button type="button" className="ms-page" onClick={() => show(i)} aria-label={`Ampliar la página ${i + 1}`}>
              <div className="ink" role="img" aria-label={`Página ${i + 1} del manuscrito. El texto está en la transcripción.`} style={inkStyle(p)} />
            </button>
            <figcaption>
              Página {i + 1} de {pages.length} · clic para ampliar
            </figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialog}
        className="ms-dialog"
        aria-label="Página ampliada"
        onClose={() => setOpen(null)}
      >
        {current && open !== null && (
          <>
            <div className="ms-bar">
              <span>
                Página {open + 1} de {pages.length}
              </span>
              {pages.length > 1 && (
                <>
                  <button type="button" disabled={open === 0} onClick={() => step(-1)}>← Anterior</button>
                  <button type="button" disabled={open === pages.length - 1} onClick={() => step(1)}>Siguiente →</button>
                </>
              )}
              <button type="button" className="ms-close" onClick={() => dialog.current?.close()}>
                Cerrar ✕
              </button>
            </div>
            <div className="ink" role="img" aria-label={`Página ${open + 1} del manuscrito`} style={inkStyle(current)} />
          </>
        )}
      </dialog>
    </div>
  );
}

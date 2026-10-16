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

const ZOOM_MS = 250;

/** Transform that puts the zoomed page (at `to`) exactly over the page in the strip (`from`). */
function flip(from: DOMRect, to: DOMRect): string {
  return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;
}

/**
 * Handwritten pages, laid out like a pair of photos in an article: side by side in a block a
 * little wider than the text. More than two pages scroll sideways, freely, with no snapping.
 * Clicking a page zooms it from where it sits; a click anywhere (or Esc) zooms it back.
 */
export default function Manuscript({ pages }: { pages: Page[] }) {
  const strip = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const zoomed = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  // "in": growing from the thumbnail, "open": settled, "out": shrinking back.
  const [phase, setPhase] = useState<"in" | "open" | "out">("in");
  const [edges, setEdges] = useState({ start: true, end: true });

  const updateEdges = () => {
    const el = strip.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth > el.scrollWidth - 4 });
  };

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scrollByPage = (dir: 1 | -1) => {
    const el = strip.current;
    const page = el?.querySelector<HTMLElement>(".ms-page");
    if (el && page) el.scrollBy({ left: dir * (page.offsetWidth + 24), behavior: "smooth" });
  };

  const thumb = (i: number) => strip.current?.querySelectorAll<HTMLElement>(".ms-page")[i];

  // Zoom in: the big page starts exactly over its thumbnail, then grows into place.
  useEffect(() => {
    const big = zoomed.current;
    const small = open === null ? undefined : thumb(open);
    if (!big || !small || phase !== "in") return;
    big.style.transition = "none";
    big.style.transform = flip(small.getBoundingClientRect(), big.getBoundingClientRect());
    void big.offsetWidth; // commit the starting transform before animating away from it
    big.style.transition = `transform ${ZOOM_MS}ms cubic-bezier(.2,.7,.3,1)`;
    big.style.transform = "none";
    setPhase("open");
  }, [open, phase]);

  const zoomIn = (i: number) => {
    setPhase("in");
    setOpen(i);
    if (!dialog.current?.open) dialog.current?.showModal();
  };

  // Zoom out: shrink back onto the thumbnail, then close.
  const zoomOut = () => {
    const big = zoomed.current;
    const small = open === null ? undefined : thumb(open);
    if (phase === "out") return;
    if (big && small) big.style.transform = flip(small.getBoundingClientRect(), big.getBoundingClientRect());
    setPhase("out");
    window.setTimeout(() => {
      dialog.current?.close();
      setOpen(null);
    }, ZOOM_MS);
  };
  const zoomOutRef = useRef(zoomOut);
  useEffect(() => {
    zoomOutRef.current = zoomOut;
  });

  // A click anywhere or Esc zooms out; arrow keys switch pages. Wired here because jsx-a11y
  // doesn't allow handlers on <dialog> in JSX.
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onCancel = (e: Event) => {
      e.preventDefault();
      zoomOutRef.current();
    };
    const onClick = () => zoomOutRef.current();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const dir = e.key === "ArrowRight" ? 1 : -1;
      setOpen((i) => (i === null ? i : Math.min(pages.length - 1, Math.max(0, i + dir))));
    };
    el.addEventListener("cancel", onCancel);
    el.addEventListener("click", onClick);
    el.addEventListener("keydown", onKey);
    return () => {
      el.removeEventListener("cancel", onCancel);
      el.removeEventListener("click", onClick);
      el.removeEventListener("keydown", onKey);
    };
  }, [pages.length]);

  const current = open === null ? null : pages[open];

  return (
    <figure className="manuscript">
      <div className="ms-strip" ref={strip} onScroll={updateEdges}>
        {pages.map((p, i) => (
          <button
            type="button"
            className="ms-page"
            key={p.src}
            onClick={() => zoomIn(i)}
            aria-label={`Ampliar la página ${i + 1} de ${pages.length}`}
            style={{ visibility: open === i ? "hidden" : undefined }}
          >
            <span className="ink" style={inkStyle(p)} />
          </button>
        ))}
      </div>

      <figcaption>
        {!(edges.start && edges.end) && (
          <span className="ms-nav">
            <button type="button" disabled={edges.start} onClick={() => scrollByPage(-1)} aria-label="Página anterior">←</button>
            <button type="button" disabled={edges.end} onClick={() => scrollByPage(1)} aria-label="Página siguiente">→</button>
          </span>
        )}
        Escrito a mano, {pages.length} {pages.length === 1 ? "página" : "páginas"}. Haz clic en una página para ampliarla.
      </figcaption>

      <dialog ref={dialog} className={phase === "open" ? "ms-zoom is-visible" : "ms-zoom"} aria-label="Página ampliada">
        {current && open !== null && (
          <div className="ms-zoom-page" ref={zoomed}>
            <div className="ink" role="img" aria-label={`Página ${open + 1} de ${pages.length} del manuscrito`} style={inkStyle(current)} />
            <p className="ms-zoom-hint">
              Página {open + 1} de {pages.length}. Clic o Esc para cerrar{pages.length > 1 ? ", ← → para cambiar de página" : ""}.
            </p>
          </div>
        )}
      </dialog>
    </figure>
  );
}

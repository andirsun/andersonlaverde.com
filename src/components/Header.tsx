"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/Icons";
import T from "@/components/T";
import { currentLang, setLang } from "@/lib/lang";

type Theme = "dark" | "light";
type Palette = "mint" | "cafe";

/**
 * The pre-paint script in the root layout owns `data-theme` on <html>, so the DOM
 * is the source of truth and this component just mirrors it. Reading it into state
 * via an effect would render the wrong label for a frame on a light-mode visit.
 */
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme", "data-palette"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/** The server can't know the visitor's theme; the layout script corrects it before paint. */
function getServerSnapshot(): Theme {
  return "dark";
}

/** Café is the default palette; mint is opt-in and the only one with an attribute. */
function getPalette(): Palette {
  return document.documentElement.getAttribute("data-palette") === "mint" ? "mint" : "cafe";
}

function getServerPalette(): Palette {
  return "cafe";
}

/** The toggle shows the theme it switches to: a sun at night, a moon by day. */
const SUN = <SunIcon />;
const MOON = <MoonIcon />;

export default function Header() {
  const path = usePathname();
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const palette = useSyncExternalStore(subscribe, getPalette, getServerPalette);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("al-theme", next);
  };

  // Same pattern as the theme: write the attribute, the observer re-renders.
  const togglePalette = () => {
    const next: Palette = palette === "cafe" ? "mint" : "cafe";
    if (next === "mint") document.documentElement.setAttribute("data-palette", "mint");
    else document.documentElement.removeAttribute("data-palette");
    try {
      localStorage.setItem("al-palette", next);
    } catch {}
  };

  // Language is read from the DOM at click time; labels switch through CSS (see <T>).
  const toggleLang = () => setLang(currentLang() === "es" ? "en" : "es");

  const cur = (href: string) =>
    path === href || path.startsWith(`${href}/`) ? "page" : undefined;

  return (
    <header>
      <nav>
        <Link className="brand" href="/">
          Anderson Laverde
        </Link>
        <div className="navlinks">
          <Link href="/cv" aria-current={cur("/cv")}>CV</Link>
          <Link href="/blog" aria-current={cur("/blog")}>Blog</Link>
          <Link href="/videos" aria-current={cur("/videos")}>Videos</Link>
          <Link href="/noticias" aria-current={cur("/noticias")}>Noticias</Link>
          <Link href="/#contact"><T en="Contact" es="Contacto" /></Link>
        </div>
        <div className="toggles">
          <button id="lang" className="chip" type="button" onClick={toggleLang}>
            <T en={<><b>EN</b> / ES</>} es={<>EN / <b>ES</b></>} />
          </button>
          <button id="palette" className="chip chip-icon" type="button" onClick={togglePalette}>
            <span className="swatches" aria-hidden="true">
              <i data-on={palette === "cafe" || undefined} className="sw-cafe" />
              <i data-on={palette === "mint" || undefined} className="sw-mint" />
            </span>
            <span className="sr-only">
              {palette === "cafe"
                ? <T en="Colors: coffee. Switch to mint" es="Colores: café. Cambiar a menta" />
                : <T en="Colors: mint. Switch to coffee" es="Colores: menta. Cambiar a café" />}
            </span>
          </button>
          <button id="theme" className="chip chip-icon" type="button" onClick={toggle}>
            {theme === "dark" ? SUN : MOON}
            <span className="sr-only">
              {theme === "dark" ? <T en="Light mode" es="Modo claro" /> : <T en="Dark mode" es="Modo oscuro" />}
            </span>
          </button>
        </div>
      </nav>
    </header>
  );
}

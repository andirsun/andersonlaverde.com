"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import T from "@/components/T";
import { currentLang, setLang } from "@/lib/lang";

type Theme = "dark" | "light";

/**
 * The pre-paint script in the root layout owns `data-theme` on <html>, so the DOM
 * is the source of truth and this component just mirrors it. Reading it into state
 * via an effect would render the wrong label for a frame on a light-mode visit.
 */
function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/** The server can't know the visitor's theme; the layout script corrects it before paint. */
function getServerSnapshot(): Theme {
  return "dark";
}

/** The toggle shows the theme it switches to: a sun at night, a moon by day. */
const SUN = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
  </svg>
);
const MOON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
);

export default function Header() {
  const path = usePathname();
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("al-theme", next);
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

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
          <span>~/</span>anderson
        </Link>
        <div className="navlinks">
          <Link href="/cv" aria-current={cur("/cv")}>cv</Link>
          <Link href="/blog" aria-current={cur("/blog")}>blog</Link>
          <Link href="/videos" aria-current={cur("/videos")}>videos</Link>
          <Link href="/noticias" aria-current={cur("/noticias")}>noticias</Link>
          <Link href="/#contact"><T en="contact" es="contacto" /></Link>
        </div>
        <button id="lang" type="button" onClick={toggleLang}>
          <T en={<><b>en</b> / es</>} es={<>en / <b>es</b></>} />
        </button>
        <button id="theme" type="button" onClick={toggle}>
          {theme === "dark" ? <T en="light mode" es="modo claro" /> : <T en="dark mode" es="modo oscuro" />}
        </button>
      </nav>
    </header>
  );
}

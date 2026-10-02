"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

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

  const cur = (href: string) =>
    path === href || path.startsWith(`${href}/`) ? "page" : undefined;

  return (
    <header>
      <nav>
        <Link className="brand" href="/">
          <span>~/</span>anderson
        </Link>
        <div className="navlinks">
          <Link href="/#cv">cv</Link>
          <Link href="/blog" aria-current={cur("/blog")}>blog</Link>
          <Link href="/videos" aria-current={cur("/videos")}>videos</Link>
          <Link href="/noticias" aria-current={cur("/noticias")}>noticias</Link>
          <Link href="/#contact">contact</Link>
        </div>
        <button id="theme" type="button" onClick={toggle}>
          {theme === "dark" ? "light mode" : "dark mode"}
        </button>
      </nav>
    </header>
  );
}

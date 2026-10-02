export type Lang = "en" | "es";
export type Text = { en: string; es: string };

export const LANG_KEY = "al-lang";

/**
 * Runs in <head> before first paint: saved choice wins, otherwise the browser language
 * (Spanish if it starts with "es", English for everything else).
 */
export const langScript = `(function(){var l=localStorage.getItem("${LANG_KEY}");if(l!=="en"&&l!=="es"){l=(navigator.language||"").toLowerCase().indexOf("es")===0?"es":"en";}var d=document.documentElement;d.setAttribute("data-lang",l);d.lang=l;})();`;

export function currentLang(): Lang {
  return document.documentElement.getAttribute("data-lang") === "es" ? "es" : "en";
}

export function setLang(lang: Lang) {
  const d = document.documentElement;
  d.setAttribute("data-lang", lang);
  d.lang = lang;
  localStorage.setItem(LANG_KEY, lang);
}

export function subscribeLang(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributeFilter: ["data-lang"] });
  return () => observer.disconnect();
}

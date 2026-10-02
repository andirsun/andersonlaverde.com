"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { currentLang, subscribeLang, type Lang } from "@/lib/lang";

const ROLES: Record<Lang, string[]> = {
  en: [
    "ai advocate @ streamline",
    "technical lead, growth",
    "full-stack engineer",
    "linux desktop since 2019",
    "casual open source contributor",
  ],
  es: [
    "ai advocate @ streamline",
    "líder técnico, growth",
    "ingeniero full-stack",
    "linux de escritorio desde 2019",
    "contribuidor casual de open source",
  ],
};

export default function TypedRoles() {
  const [text, setText] = useState("");
  const lang = useSyncExternalStore(subscribeLang, currentLang, () => "en" as Lang);

  // Restart the typing loop in the new language when the visitor switches.
  useEffect(() => {
    const roles = ROLES[lang];
    let ri = 0, ci = 0, erasing = false, timer: ReturnType<typeof setTimeout>;
    const step = () => {
      const w = roles[ri];
      let d: number;
      if (!erasing) {
        ci++;
        if (ci >= w.length) { erasing = true; d = 1900; } else { d = 52 + Math.random() * 45; }
      } else {
        ci -= 2;
        if (ci <= 0) { ci = 0; erasing = false; ri = (ri + 1) % roles.length; d = 320; } else { d = 22; }
      }
      setText(w.slice(0, Math.max(0, ci)));
      timer = setTimeout(step, d);
    };
    step();
    return () => clearTimeout(timer);
  }, [lang]);

  return (
    <div className="typeline">
      <span className="prompt">&gt;</span>
      <span>
        {text}
        <span className="caret">▊</span>
      </span>
    </div>
  );
}

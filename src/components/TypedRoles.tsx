"use client";

import { useEffect, useState } from "react";

const ROLES = [
  "ai advocate @ streamline",
  "technical lead, growth",
  "full-stack engineer",
  "linux desktop since 2019",
  "casual open source contributor",
];

export default function TypedRoles() {
  const [text, setText] = useState("");

  useEffect(() => {
    let ri = 0, ci = 0, erasing = false, timer: ReturnType<typeof setTimeout>;
    const step = () => {
      const w = ROLES[ri];
      let d: number;
      if (!erasing) {
        ci++;
        if (ci >= w.length) { erasing = true; d = 1900; } else { d = 52 + Math.random() * 45; }
      } else {
        ci -= 2;
        if (ci <= 0) { ci = 0; erasing = false; ri = (ri + 1) % ROLES.length; d = 320; } else { d = 22; }
      }
      setText(w.slice(0, Math.max(0, ci)));
      timer = setTimeout(step, d);
    };
    step();
    return () => clearTimeout(timer);
  }, []);

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

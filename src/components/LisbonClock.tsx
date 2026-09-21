"use client";

import { useEffect, useState } from "react";

export default function LisbonClock() {
  const [t, setT] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Lisbon", hour: "2-digit", minute: "2-digit", hour12: false,
    });
    const tick = () => setT(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return <span suppressHydrationWarning>{t} WET</span>;
}

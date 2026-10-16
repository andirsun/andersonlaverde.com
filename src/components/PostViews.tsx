"use client";

import { useState, type ReactNode } from "react";

type View = "transcript" | "manuscript";

/**
 * The two versions of a handwritten post, as tabs. Both panels are rendered on the
 * server, so the transcript is in the HTML for search engines and readers without JS;
 * the tabs only toggle which one is visible.
 */
export default function PostViews({ transcript, manuscript }: { transcript: ReactNode; manuscript: ReactNode }) {
  const [view, setView] = useState<View>("transcript");

  const tab = (id: View, label: string) => (
    <button
      type="button"
      role="tab"
      id={`tab-${id}`}
      aria-controls={`panel-${id}`}
      aria-selected={view === id}
      tabIndex={view === id ? 0 : -1}
      onClick={() => setView(id)}
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        const next: View = id === "transcript" ? "manuscript" : "transcript";
        setView(next);
        document.getElementById(`tab-${next}`)?.focus();
      }}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="views" role="tablist" aria-label="Versión del texto">
        {tab("transcript", "cat transcripcion.md")}
        {tab("manuscript", "open manuscrito/")}
      </div>
      <div id="panel-transcript" role="tabpanel" aria-labelledby="tab-transcript" hidden={view !== "transcript"}>
        {transcript}
      </div>
      <div id="panel-manuscript" role="tabpanel" aria-labelledby="tab-manuscript" hidden={view !== "manuscript"}>
        {manuscript}
      </div>
    </>
  );
}

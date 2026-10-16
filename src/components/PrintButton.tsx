"use client";

import T from "@/components/T";

export default function PrintButton() {
  return (
    <button className="btn-ghost" type="button" onClick={() => window.print()}>
      <T en="Save as PDF" es="Guardar en PDF" />
    </button>
  );
}

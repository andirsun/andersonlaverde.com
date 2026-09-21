"use client";

export default function PrintButton() {
  return (
    <button className="btn-ghost" type="button" onClick={() => window.print()}>
      export --pdf
    </button>
  );
}

import type { ReactNode } from "react";

/**
 * Bilingual text. Both languages are rendered; CSS hides the one that doesn't match
 * `data-lang` on <html> (set before paint by the root layout script). Pages stay static,
 * there's no hydration mismatch and no flash of the wrong language.
 */
export default function T({ en, es }: { en: ReactNode; es: ReactNode }) {
  return (
    <>
      <span data-l="en" lang="en">{en}</span>
      <span data-l="es" lang="es">{es}</span>
    </>
  );
}

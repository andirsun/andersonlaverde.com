import { defineConfig, globalIgnores } from "eslint/config";
import next from "@next/eslint-plugin-next";
import a11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

/**
 * Flat config on ESLint 10. This deliberately does NOT use `eslint-config-next`:
 * that config bundles eslint-plugin-react, which still calls `context.getFilename()`
 * and throws under ESLint 10. Everything else it would have given us is wired up
 * directly below. Revisit once eslint-plugin-react ships ESLint 10 support.
 */
export default defineConfig([
  globalIgnores([".next/**", "next-env.d.ts"]),
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  next.configs["core-web-vitals"],
  {
    files: ["**/*.{jsx,tsx}"],
    extends: [a11y.flatConfigs.recommended],
  },
]);

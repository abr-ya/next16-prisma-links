// Unified monorepo flat ESLint: eslint-config-next scoped to apps/next; your TS/React/Prettier stack for packages + telegram-mini.
// See: https://medium.com/@josprima.id/setup-reactjs-typescript-project-with-vite-eslint-and-prettier-2024-e714f7daca1a
import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import globals from "globals";
import tseslint from "typescript-eslint";

const NEXT_APP = "apps/next";

const sharedUiFiles = ["packages/**/*.{ts,tsx}", "apps/telegram-mini/**/*.{ts,tsx}"];
const nextAppFiles = [`${NEXT_APP}/**/*.{js,jsx,mjs,ts,tsx,mts,cts}`];

/** @param {unknown[]} configs */
function scopeNextAppConfigs(configs) {
  return configs.map((block) => {
    if (typeof block !== "object" || block === null) {
      return block;
    }
    const b = /** @type {Record<string, unknown>} */ (block);
    const keys = Object.keys(b);
    const ignores = b.ignores;
    const files = b.files;
    const isIgnoresOnly =
      keys.length > 0 &&
      keys.every((k) => ["ignores", "name"].includes(k)) &&
      Array.isArray(ignores) &&
      ignores.length > 0;

    if (isIgnoresOnly) {
      return {
        ...b,
        ignores: ignores.map((pattern) => {
          if (typeof pattern !== "string") {
            return pattern;
          }
          if (
            pattern === "next-env.d.ts" ||
            pattern === ".next/**" ||
            pattern === "out/**" ||
            pattern === "build/**"
          ) {
            return `${NEXT_APP}/${pattern}`;
          }
          return pattern;
        }),
      };
    }

    if (Array.isArray(files) && files.length > 0) {
      return {
        ...b,
        files: files.map((pattern) => `${NEXT_APP}/${String(pattern)}`),
      };
    }

    const shouldNarrowGlobally =
      b.plugins ||
      b.languageOptions ||
      (b.rules && typeof b.rules === "object" && Object.keys(b.rules).length > 0);

    if (shouldNarrowGlobally) {
      return {
        ...b,
        files: nextAppFiles,
      };
    }

    return b;
  });
}

const userUiStack = tseslint.config({
  files: sharedUiFiles,
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
  },
  plugins: {
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    semi: "off",
    "@typescript-eslint/semi": ["error"],
  },
});

const prettierRecommended = eslintPluginPrettierRecommended.default ?? eslintPluginPrettierRecommended;

export default [
  globalIgnores([
    "**/node_modules/**",
    "**/dist/**",
    "**/.turbo/**",
    "**/lib/generated/**",
    "next16-links-app/**",
  ]),
  {
    files: nextAppFiles,
    settings: {
      next: {
        rootDir: NEXT_APP,
      },
    },
  },
  ...scopeNextAppConfigs([...nextVitals, ...nextTs]),
  {
    files: nextAppFiles,
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      semi: "off",
      "@typescript-eslint/semi": ["error"],
    },
  },
  ...userUiStack,
  prettierRecommended,
];

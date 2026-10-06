// @ts-check
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import globals from "globals";

export default [
  {
    ignores: [
      "dist/",
      ".astro/",
      "legacy/",
      "public/",
      "node_modules/",
      "test-results/",
      "playwright-report/",
      "screenshots/",
      ".lighthouse/",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs["flat/recommended"],
  ...astro.configs["flat/jsx-a11y-recommended"],
  {
    // Node-side files: build scripts, configs and tests
    files: ["scripts/**/*.{js,mjs,ts}", "*.config.{js,mjs,ts}", "tests/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // Inline and bundled browser scripts in components
    files: ["src/**/*.{astro,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Safari/VoiceOver drop list semantics from <ul>/<ol> with list-style: none (Tailwind
      // preflight), so styled lists keep an explicit role="list".
      "astro/jsx-a11y/no-redundant-roles": ["error", { nav: ["navigation"], ul: ["list"], ol: ["list"] }],
    },
  },
];

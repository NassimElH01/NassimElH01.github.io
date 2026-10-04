// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://nassimelh01.github.io",
  base: "/",
  output: "static",
  trailingSlash: "always",
  build: {
    // /da/ -> dist/da/index.html; GitHub Pages redirects /da to /da/
    format: "directory",
  },

  i18n: {
    locales: ["en", "da"],
    defaultLocale: "en",
    routing: {
      // English at "/", Danish at "/da/"
      prefixDefaultLocale: false,
    },
    // No fallback on purpose: every page exists in both languages, and
    // missing Danish copy is an explicit "TODO:" rather than silent English.
  },

  vite: {
    plugins: [tailwindcss()],
  },
});

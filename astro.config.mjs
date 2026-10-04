// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// The old site had a detail page per CV entry at /cv/<id>. They are indexed,
// so they redirect to the matching section instead of returning 404.
const legacyCvIds = [
  "ruc-master-digital-transformation",
  "zealand-professionsbachelor",
  "royal-unibrew-pmo",
  "zealand-it-student-assistant",
  "ss-rengoringservice",
  "badr-fight-club",
  "taastrupgaard-kindergarten",
  "ab-catering-warehouse",
  "volunteer-fire-watch",
  "carecompagniet-contact",
];
const legacyRedirects = {
  ...Object.fromEntries(legacyCvIds.map((id) => [`/cv/${id}`, "/#experience"])),
  "/cv/royal-unibrew-bachelor-project": "/#projects",
};

// Self-hosted Fontsource files (OFL-1.1), read from node_modules at build time.
// Only the "latin" subset ships; it covers æ ø å.
const fontFile = (pkg, file) => `${pkg}/files/${file}`;

export default defineConfig({
  site: "https://nassimelh01.github.io",
  base: "/",
  output: "static",
  trailingSlash: "always",
  build: {
    // /da/ -> dist/da/index.html; GitHub Pages redirects /da to /da/
    format: "directory",
  },

  redirects: legacyRedirects,

  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: { en: "en", da: "da" },
      },
      // Redirect stubs are not pages.
      filter: (page) => !new URL(page).pathname.startsWith("/cv/"),
      namespaces: { news: false, image: false, video: false, xhtml: true },
    }),
  ],

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

  fonts: [
    {
      provider: fontProviders.local(),
      name: "Geist",
      cssVariable: "--font-geist",
      fallbacks: ["ui-sans-serif", "system-ui", "sans-serif"],
      display: "swap",
      options: {
        variants: [
          {
            src: [fontFile("@fontsource-variable/geist", "geist-latin-wght-normal.woff2")],
            weight: "100 900",
            style: "normal",
          },
          {
            src: [fontFile("@fontsource-variable/geist", "geist-latin-wght-italic.woff2")],
            weight: "100 900",
            style: "italic",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Geist Mono",
      cssVariable: "--font-geist-mono",
      fallbacks: ["ui-monospace", "monospace"],
      display: "swap",
      options: {
        variants: [
          {
            src: [fontFile("@fontsource-variable/geist-mono", "geist-mono-latin-wght-normal.woff2")],
            weight: "100 900",
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Instrument Serif",
      cssVariable: "--font-instrument-serif",
      fallbacks: ["ui-serif", "Georgia", "serif"],
      display: "swap",
      options: {
        variants: [
          {
            src: [fontFile("@fontsource/instrument-serif", "instrument-serif-latin-400-normal.woff2")],
            weight: "400",
            style: "normal",
          },
          {
            src: [fontFile("@fontsource/instrument-serif", "instrument-serif-latin-400-italic.woff2")],
            weight: "400",
            style: "italic",
          },
        ],
      },
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});

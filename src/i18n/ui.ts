// UI strings only. Facts about Nassim live in content/, never here.
// `da` is typed against `en`, so a missing key fails `astro check`.

export const en = {
  "meta.title": "Nassim Hassani",
  "meta.description":
    "TODO: owner approve — Nassim Hassani bridges business and technology: MSc student in Digital Transformation at RUC, with PMO experience from Royal Unibrew and PRINCE2 certification.",
  "nav.skip": "Skip to content",
  "nav.primary": "Main navigation",
  "section.about": "About",
  "section.skills": "Skills",
  "section.projects": "Projects",
  "section.experience": "Experience & education",
  "section.playground": "Playground",
  "section.contact": "Contact",
  "hero.now": "Now",
  "hero.bridge.business": "Business",
  "hero.bridge.tech": "Tech",
  "hero.bridge.label": "Translate between business and tech",
  "hero.bridge.value": "{business}% business, {tech}% tech",
  "hero.bridge.hint": "drag the bridge",
  "hero.cta.label": "Next steps",
  "hero.cta.contact": "Get in touch",
  "hero.cta.projects": "See projects",
  "hero.facts.experience": "Experience",
  "hero.facts.certified": "Certified",
  "hero.facts.languages": "Languages",
  "intro.skip": "Skip intro",
  "theme.dark": "Dark theme",
  "footer.elsewhere": "Contact and profiles",
  "notFound.title": "Page not found",
  "notFound.body": "The page you were looking for does not exist or has moved.",
  "notFound.home": "Go to the front page",
  "todo.badge": "TODO",
} as const;

export type UiKey = keyof typeof en;

export const da: Record<UiKey, string> = {
  "meta.title": "Nassim Hassani",
  "meta.description":
    "TODO: owner approve — Nassim Hassani er brobygger mellem forretning og teknologi: cand.it.-studerende i Digital Transformation på RUC med PMO-erfaring fra Royal Unibrew og PRINCE2-certificering.",
  "nav.skip": "Spring til indhold",
  "nav.primary": "Hovednavigation",
  "section.about": "Om mig",
  "section.skills": "Kompetencer",
  "section.projects": "Projekter",
  "section.experience": "Erfaring & uddannelse",
  "section.playground": "Flex-zonen",
  "section.contact": "Kontakt",
  "hero.now": "Nu",
  "hero.bridge.business": "Forretning",
  "hero.bridge.tech": "Teknologi",
  "hero.bridge.label": "Oversæt mellem forretning og teknologi",
  "hero.bridge.value": "{business} % forretning, {tech} % teknologi",
  "hero.bridge.hint": "træk i broen",
  "hero.cta.label": "Næste skridt",
  "hero.cta.contact": "Kontakt mig",
  "hero.cta.projects": "Se projekter",
  "hero.facts.experience": "Erfaring",
  "hero.facts.certified": "Certificeret",
  "hero.facts.languages": "Sprog",
  "intro.skip": "Spring intro over",
  "theme.dark": "Mørkt tema",
  "footer.elsewhere": "Kontakt og profiler",
  "notFound.title": "Siden findes ikke",
  "notFound.body": "Siden, du leder efter, findes ikke eller er flyttet.",
  "notFound.home": "Gå til forsiden",
  "todo.badge": "TODO",
};

export const ui = { en, da } as const;

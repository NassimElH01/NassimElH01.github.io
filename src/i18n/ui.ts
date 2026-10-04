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
  "hero.placeholder": "TODO: hero and decode intro (next step)",
  "theme.dark": "Dark theme",
  "footer.elsewhere": "Elsewhere",
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
  "hero.placeholder": "TODO: hero og dekode-intro (næste trin)",
  "theme.dark": "Mørkt tema",
  "footer.elsewhere": "Andre steder",
  "notFound.title": "Siden findes ikke",
  "notFound.body": "Siden, du leder efter, findes ikke eller er flyttet.",
  "notFound.home": "Gå til forsiden",
  "todo.badge": "TODO",
};

export const ui = { en, da } as const;

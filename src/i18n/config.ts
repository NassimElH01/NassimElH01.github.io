export const LOCALES = ["en", "da"] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = "en";

/** Open Graph locale per language. */
export const OG_LOCALE: Record<Lang, string> = {
  en: "en_GB",
  da: "da_DK",
};

/** Each language's own name, shown in the language switcher. */
export const LANG_NAME: Record<Lang, string> = {
  en: "English",
  da: "Dansk",
};

export function isLang(value: string | undefined): value is Lang {
  return (LOCALES as readonly string[]).includes(value ?? "");
}

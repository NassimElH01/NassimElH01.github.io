import { getAbsoluteLocaleUrl, getRelativeLocaleUrl } from "astro:i18n";
import { LOCALES, type Lang } from "./config";
import { ui, type UiKey } from "./ui";
import { isTodo } from "@/lib/todo";

/** Returns a translator for one language: `t(lang)("nav.skip")`. */
export function t(lang: Lang) {
  return (key: UiKey): string => ui[lang][key];
}

/** Root-relative URL for a locale-neutral path, e.g. localeUrl("da") -> "/da/". */
export function localeUrl(lang: Lang, path = ""): string {
  return getRelativeLocaleUrl(lang, path);
}

/** Absolute URLs of one page in every language, for canonical and hreflang. */
export function alternates(path = ""): { lang: Lang; href: string }[] {
  return LOCALES.map((lang) => ({ lang, href: getAbsoluteLocaleUrl(lang, path) }));
}

export function otherLang(lang: Lang): Lang {
  return lang === "en" ? "da" : "en";
}

export interface Picked<T> {
  value: T;
  /** The language the value is actually written in. */
  lang: Lang;
  /** True when the other language was used because this one is a TODO. */
  isFallback: boolean;
  /** True when both languages are still TODO. */
  isTodo: boolean;
}

/** Picks the field for `lang`, falling back to the other language when it is a TODO. */
export function pick<T>(field: Record<Lang, T>, lang: Lang): Picked<T> {
  const own = field[lang];
  if (!isTodo(own)) return { value: own, lang, isFallback: false, isTodo: false };
  const other = otherLang(lang);
  const fallback = field[other];
  if (!isTodo(fallback)) return { value: fallback, lang: other, isFallback: true, isTodo: false };
  return { value: own, lang, isFallback: false, isTodo: true };
}

/** A value that is either the same in both languages or given per language. */
export function localize(value: string | Record<Lang, string>, lang: Lang): string {
  return typeof value === "string" ? value : value[lang];
}

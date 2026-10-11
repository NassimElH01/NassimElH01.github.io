// Dates in content/ are "YYYY" or "YYYY-MM" (or "TODO: …"). These helpers turn
// them into display text, so every section formats periods the same way.
import type { Lang } from "@/i18n/config";
import { isTodo } from "@/lib/todo";

/** The year of a known date, or undefined for a missing or "TODO:" value. */
export function yearOf(value: string | undefined): string | undefined {
  return value && !isTodo(value) ? value.slice(0, 4) : undefined;
}

/** "2026-09" → "Sep 2026" / "sep. 2026"; a bare year stays as it is. */
export function formatDate(value: string, lang: Lang, { months = true } = {}): string {
  const [year, month] = value.split("-");
  if (!month || !months) return year;
  return new Intl.DateTimeFormat(lang === "da" ? "da-DK" : "en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(Number(year), Number(month) - 1, 1)));
}

interface PeriodOptions {
  /** Show months where the date has one (default true); false gives years only. */
  months?: boolean;
  /** Word before an expected end, e.g. "expected". */
  expectedLabel?: string;
  /** Text for an end of "present", e.g. "now"; without it the period is open-ended ("2023–"). */
  presentLabel?: string;
}

/** A start–end period, e.g. "2022–2026", "Sep 2026 – expected Jun 2028" or just "2017". */
export function formatPeriod(
  entry: { start?: string; end?: string; expected?: boolean },
  lang: Lang,
  { months = true, expectedLabel, presentLabel }: PeriodOptions = {},
): string | undefined {
  const known = (value?: string) => (value && !isTodo(value) ? value : undefined);
  const start = known(entry.start);
  if (!start) return undefined;
  const from = formatDate(start, lang, { months });
  if (entry.end === "present") return presentLabel ? `${from}–${presentLabel}` : `${from}–`;
  const end = known(entry.end);
  if (!end) return from;
  const to = formatDate(end, lang, { months });
  if (to === from) return from;
  // A spaced dash reads better when either side has a month or a word in it.
  const spaced = from.includes(" ") || to.includes(" ") || (entry.expected && expectedLabel);
  const until = entry.expected && expectedLabel ? `${expectedLabel} ${to}` : to;
  return spaced ? `${from} – ${until}` : `${from}–${until}`;
}
